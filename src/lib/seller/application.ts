import { ApplicationStatus, Role, SellerStatus } from '@prisma/client';

import { AuditActions, recordAuditLog } from '@/lib/audit/record-audit-log';
import { prisma } from '@/lib/db';
import { getLatestSellerApplication, type SellerApplicationView } from '@/lib/seller/profile';
import type { SellerApplicationInput } from '@/lib/seller/validation';

export type SellerAccessState =
	'none' | 'pending' | 'rejected' | 'approved' | 'suspended' | 'under_review';

export function resolveSellerAccessState(
	profileStatus: SellerStatus | null,
	applicationStatus: ApplicationStatus | null,
	hasSellerRole: boolean,
): SellerAccessState {
	if (!profileStatus) {
		return 'none';
	}

	if (profileStatus === 'SUSPENDED') {
		return 'suspended';
	}

	if (profileStatus === 'APPROVED' && hasSellerRole) {
		return 'approved';
	}

	if (profileStatus === 'REJECTED') {
		return 'rejected';
	}

	if (applicationStatus === 'UNDER_REVIEW') {
		return 'under_review';
	}

	return 'pending';
}

export async function submitSellerApplication(
	userId: string,
	input: SellerApplicationInput,
): Promise<{ application: SellerApplicationView }> {
	const existingProfile = await prisma.sellerProfile.findUnique({
		where: { userId },
		include: {
			applications: {
				orderBy: { submittedAt: 'desc' },
				take: 1,
			},
		},
	});

	if (existingProfile?.status === 'APPROVED') {
		throw new Error('already_approved_seller');
	}

	if (existingProfile?.status === 'SUSPENDED') {
		throw new Error('seller_suspended');
	}

	const latestApplication = existingProfile?.applications[0];

	if (
		latestApplication &&
		(latestApplication.status === 'SUBMITTED' || latestApplication.status === 'UNDER_REVIEW')
	) {
		throw new Error('application_pending');
	}

	return prisma.$transaction(async (tx) => {
		const profile =
			existingProfile ??
			(await tx.sellerProfile.create({
				data: {
					userId,
					status: SellerStatus.PENDING,
				},
			}));

		if (profile.status === 'REJECTED') {
			await tx.sellerProfile.update({
				where: { id: profile.id },
				data: { status: SellerStatus.PENDING },
			});
		}

		const application = await tx.sellerApplication.create({
			data: {
				sellerProfileId: profile.id,
				businessName: input.businessName,
				description: input.description?.trim() || null,
				contactPhone: input.contactPhone,
				contactEmail: input.contactEmail,
				businessCity: input.businessCity,
				businessRegion: input.businessRegion,
				status: ApplicationStatus.SUBMITTED,
			},
		});

		await tx.notification.create({
			data: {
				userId,
				type: 'ACCOUNT',
				title: 'Seller application received',
				body: 'We received your seller application. Our team will review it and notify you by email and in your account.',
			},
		});

		return {
			application: {
				id: application.id,
				businessName: application.businessName,
				description: application.description,
				contactPhone: application.contactPhone,
				contactEmail: application.contactEmail,
				businessCity: application.businessCity,
				businessRegion: application.businessRegion,
				status: application.status,
				submittedAt: application.submittedAt,
				reviewedAt: application.reviewedAt,
				reviewNotes: application.reviewNotes,
			},
		};
	});
}

export async function getSellerApplicationState(userId: string): Promise<{
	accessState: SellerAccessState;
	application: SellerApplicationView | null;
}> {
	const profile = await prisma.sellerProfile.findUnique({
		where: { userId },
		select: { id: true, status: true },
	});

	const marketplaceUser = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			roles: { select: { role: true } },
		},
	});

	const hasSellerRole =
		marketplaceUser?.roles.some((assignment) => assignment.role === Role.SELLER) ?? false;

	if (!profile) {
		return { accessState: 'none', application: null };
	}

	const application = await getLatestSellerApplication(profile.id);

	return {
		accessState: resolveSellerAccessState(
			profile.status,
			application?.status ?? null,
			hasSellerRole,
		),
		application,
	};
}

export async function markApplicationUnderReview(
	applicationId: string,
	adminId: string,
): Promise<void> {
	await prisma.sellerApplication.update({
		where: { id: applicationId },
		data: {
			status: ApplicationStatus.UNDER_REVIEW,
			reviewedById: adminId,
		},
	});

	await recordAuditLog({
		action: AuditActions.SELLER_APPLICATION_REVIEW_STARTED,
		entityType: 'seller_application',
		entityId: applicationId,
		actorId: adminId,
	});
}
