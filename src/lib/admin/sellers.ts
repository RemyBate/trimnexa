import { ApplicationStatus, Role, SellerStatus } from '@prisma/client';

import { getApprovalBlockReason, getRejectionBlockReason } from '@/lib/admin/seller-review';
import { AuditActions, recordAuditLog } from '@/lib/audit/record-audit-log';
import { prisma } from '@/lib/db';
import { generateUniqueShopSlug } from '@/lib/seller/slug';
import type {
	SellerRejectionInput,
	SellerReviewInput,
	SellerSuspensionInput,
} from '@/lib/seller/validation';

export type SellerAdminActionErrorCode =
	'not_found' | 'already_reviewed' | 'invalid_transition' | 'profile_suspended';

export type SellerAdminActionResult<T> =
	{ ok: true; data: T } | { ok: false; code: SellerAdminActionErrorCode };

export interface AdminSellerListItem {
	id: string;
	userId: string;
	email: string;
	shopName: string | null;
	status: SellerStatus;
	applicationStatus: ApplicationStatus | null;
	submittedAt: Date | null;
	createdAt: Date;
}

export interface AdminSellerDetail {
	id: string;
	userId: string;
	email: string;
	firstName: string | null;
	lastName: string | null;
	shopName: string | null;
	shopSlug: string | null;
	status: SellerStatus;
	suspendedAt: Date | null;
	suspensionReason: string | null;
	onboardingCompletedAt: Date | null;
	application: {
		id: string;
		businessName: string;
		description: string | null;
		contactPhone: string;
		contactEmail: string;
		businessCity: string;
		businessRegion: string;
		status: ApplicationStatus;
		submittedAt: Date;
		reviewedAt: Date | null;
		reviewNotes: string | null;
	} | null;
}

export async function listSellersForReview(): Promise<AdminSellerListItem[]> {
	const profiles = await prisma.sellerProfile.findMany({
		orderBy: { createdAt: 'desc' },
		include: {
			user: { select: { email: true } },
			applications: {
				orderBy: { submittedAt: 'desc' },
				take: 1,
			},
		},
	});

	return profiles.map((profile) => {
		const latestApplication = profile.applications[0];

		return {
			id: profile.id,
			userId: profile.userId,
			email: profile.user.email,
			shopName: profile.shopName ?? latestApplication?.businessName ?? null,
			status: profile.status,
			applicationStatus: latestApplication?.status ?? null,
			submittedAt: latestApplication?.submittedAt ?? null,
			createdAt: profile.createdAt,
		};
	});
}

export async function getSellerDetailForAdmin(
	sellerProfileId: string,
): Promise<AdminSellerDetail | null> {
	const profile = await prisma.sellerProfile.findUnique({
		where: { id: sellerProfileId },
		include: {
			user: {
				select: {
					email: true,
					firstName: true,
					lastName: true,
				},
			},
			applications: {
				orderBy: { submittedAt: 'desc' },
				take: 1,
			},
		},
	});

	if (!profile) {
		return null;
	}

	const application = profile.applications[0];

	return {
		id: profile.id,
		userId: profile.userId,
		email: profile.user.email,
		firstName: profile.user.firstName,
		lastName: profile.user.lastName,
		shopName: profile.shopName,
		shopSlug: profile.shopSlug,
		status: profile.status,
		suspendedAt: profile.suspendedAt,
		suspensionReason: profile.suspensionReason,
		onboardingCompletedAt: profile.onboardingCompletedAt,
		application: application
			? {
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
				}
			: null,
	};
}

export async function approveSeller(
	adminId: string,
	sellerProfileId: string,
	input: SellerReviewInput,
): Promise<SellerAdminActionResult<AdminSellerDetail>> {
	const profile = await prisma.sellerProfile.findUnique({
		where: { id: sellerProfileId },
		include: {
			applications: {
				orderBy: { submittedAt: 'desc' },
				take: 1,
			},
		},
	});

	if (!profile) {
		return { ok: false, code: 'not_found' };
	}

	const application = profile.applications[0];
	const blockReason = getApprovalBlockReason({
		profileStatus: profile.status,
		applicationStatus: application?.status ?? null,
	});

	if (blockReason) {
		return { ok: false, code: blockReason };
	}

	if (!application) {
		return { ok: false, code: 'not_found' };
	}

	const shopSlug = await generateUniqueShopSlug(application.businessName, profile.id);

	await prisma.$transaction(async (tx) => {
		await tx.sellerApplication.update({
			where: { id: application.id },
			data: {
				status: ApplicationStatus.APPROVED,
				reviewedAt: new Date(),
				reviewedById: adminId,
				reviewNotes: input.reviewNotes?.trim() || null,
			},
		});

		await tx.sellerProfile.update({
			where: { id: profile.id },
			data: {
				status: SellerStatus.APPROVED,
				shopName: application.businessName,
				shopSlug,
				suspendedAt: null,
				suspensionReason: null,
			},
		});

		await tx.userRoleAssignment.upsert({
			where: {
				userId_role: {
					userId: profile.userId,
					role: Role.SELLER,
				},
			},
			update: {},
			create: {
				userId: profile.userId,
				role: Role.SELLER,
			},
		});

		await tx.notification.create({
			data: {
				userId: profile.userId,
				type: 'ACCOUNT',
				title: 'Seller application approved',
				body: 'Congratulations! Your seller application was approved. Complete shop onboarding to start preparing your catalogue.',
			},
		});
	});

	await recordAuditLog({
		action: AuditActions.SELLER_APPLICATION_APPROVED,
		entityType: 'seller_profile',
		entityId: sellerProfileId,
		actorId: adminId,
		metadata: {
			applicationId: application.id,
			reviewNotes: input.reviewNotes?.trim() || null,
		},
	});

	const seller = await getSellerDetailForAdmin(sellerProfileId);
	return seller ? { ok: true, data: seller } : { ok: false, code: 'not_found' };
}

export async function rejectSeller(
	adminId: string,
	sellerProfileId: string,
	input: SellerRejectionInput,
): Promise<SellerAdminActionResult<AdminSellerDetail>> {
	const profile = await prisma.sellerProfile.findUnique({
		where: { id: sellerProfileId },
		include: {
			applications: {
				orderBy: { submittedAt: 'desc' },
				take: 1,
			},
		},
	});

	if (!profile) {
		return { ok: false, code: 'not_found' };
	}

	const application = profile.applications[0];
	const blockReason = getRejectionBlockReason({
		profileStatus: profile.status,
		applicationStatus: application?.status ?? null,
	});

	if (blockReason) {
		return { ok: false, code: blockReason };
	}

	if (!application) {
		return { ok: false, code: 'not_found' };
	}

	await prisma.$transaction(async (tx) => {
		await tx.sellerApplication.update({
			where: { id: application.id },
			data: {
				status: ApplicationStatus.REJECTED,
				reviewedAt: new Date(),
				reviewedById: adminId,
				reviewNotes: input.reviewNotes.trim(),
			},
		});

		await tx.sellerProfile.update({
			where: { id: profile.id },
			data: { status: SellerStatus.REJECTED },
		});

		await tx.notification.create({
			data: {
				userId: profile.userId,
				type: 'ACCOUNT',
				title: 'Seller application update',
				body: input.reviewNotes.trim(),
			},
		});
	});

	await recordAuditLog({
		action: AuditActions.SELLER_APPLICATION_REJECTED,
		entityType: 'seller_profile',
		entityId: sellerProfileId,
		actorId: adminId,
		metadata: {
			applicationId: application.id,
			reviewNotes: input.reviewNotes.trim(),
		},
	});

	const seller = await getSellerDetailForAdmin(sellerProfileId);
	return seller ? { ok: true, data: seller } : { ok: false, code: 'not_found' };
}

export async function suspendSeller(
	adminId: string,
	sellerProfileId: string,
	input: SellerSuspensionInput,
): Promise<AdminSellerDetail | null> {
	const profile = await prisma.sellerProfile.findUnique({
		where: { id: sellerProfileId },
	});

	if (!profile || profile.status !== SellerStatus.APPROVED) {
		return null;
	}

	await prisma.$transaction(async (tx) => {
		await tx.sellerProfile.update({
			where: { id: sellerProfileId },
			data: {
				status: SellerStatus.SUSPENDED,
				suspendedAt: new Date(),
				suspensionReason: input.reason.trim(),
			},
		});

		await tx.notification.create({
			data: {
				userId: profile.userId,
				type: 'ACCOUNT',
				title: 'Seller account suspended',
				body: input.reason.trim(),
			},
		});
	});

	await recordAuditLog({
		action: AuditActions.SELLER_SUSPENDED,
		entityType: 'seller_profile',
		entityId: sellerProfileId,
		actorId: adminId,
		metadata: { reason: input.reason.trim() },
	});

	return getSellerDetailForAdmin(sellerProfileId);
}

export async function reactivateSeller(
	adminId: string,
	sellerProfileId: string,
): Promise<AdminSellerDetail | null> {
	const profile = await prisma.sellerProfile.findUnique({
		where: { id: sellerProfileId },
	});

	if (!profile || profile.status !== SellerStatus.SUSPENDED) {
		return null;
	}

	await prisma.$transaction(async (tx) => {
		await tx.sellerProfile.update({
			where: { id: sellerProfileId },
			data: {
				status: SellerStatus.APPROVED,
				suspendedAt: null,
				suspensionReason: null,
			},
		});

		await tx.notification.create({
			data: {
				userId: profile.userId,
				type: 'ACCOUNT',
				title: 'Seller account reactivated',
				body: 'Your seller account has been reactivated. You can access your seller dashboard again.',
			},
		});
	});

	await recordAuditLog({
		action: AuditActions.SELLER_REACTIVATED,
		entityType: 'seller_profile',
		entityId: sellerProfileId,
		actorId: adminId,
	});

	return getSellerDetailForAdmin(sellerProfileId);
}
