import type { ApplicationStatus, SellerStatus } from '@prisma/client';

import { prisma } from '@/lib/db';
import { generateUniqueShopSlug } from '@/lib/seller/slug';
import type { ShopProfileUpdateInput } from '@/lib/seller/validation';

export interface SellerProfileView {
	id: string;
	userId: string;
	shopName: string | null;
	shopSlug: string | null;
	description: string | null;
	logoUrl: string | null;
	bannerUrl: string | null;
	returnPolicy: string | null;
	shippingPolicy: string | null;
	shopPhone: string | null;
	shopEmail: string | null;
	addressLine1: string | null;
	addressLine2: string | null;
	city: string | null;
	region: string | null;
	country: string | null;
	status: SellerStatus;
	onboardingCompletedAt: Date | null;
	suspendedAt: Date | null;
	suspensionReason: string | null;
}

export interface SellerApplicationView {
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
}

function toPublicMediaUrl(path: string | null): string | null {
	return path ? `/${path.replace(/^\/+/, '')}` : null;
}

function mapProfile(profile: {
	id: string;
	userId: string;
	shopName: string | null;
	shopSlug: string | null;
	description: string | null;
	logoPath: string | null;
	bannerPath: string | null;
	returnPolicy: string | null;
	shippingPolicy: string | null;
	shopPhone: string | null;
	shopEmail: string | null;
	addressLine1: string | null;
	addressLine2: string | null;
	city: string | null;
	region: string | null;
	country: string | null;
	status: SellerStatus;
	onboardingCompletedAt: Date | null;
	suspendedAt: Date | null;
	suspensionReason: string | null;
}): SellerProfileView {
	return {
		id: profile.id,
		userId: profile.userId,
		shopName: profile.shopName,
		shopSlug: profile.shopSlug,
		description: profile.description,
		logoUrl: toPublicMediaUrl(profile.logoPath),
		bannerUrl: toPublicMediaUrl(profile.bannerPath),
		returnPolicy: profile.returnPolicy,
		shippingPolicy: profile.shippingPolicy,
		shopPhone: profile.shopPhone,
		shopEmail: profile.shopEmail,
		addressLine1: profile.addressLine1,
		addressLine2: profile.addressLine2,
		city: profile.city,
		region: profile.region,
		country: profile.country,
		status: profile.status,
		onboardingCompletedAt: profile.onboardingCompletedAt,
		suspendedAt: profile.suspendedAt,
		suspensionReason: profile.suspensionReason,
	};
}

export async function getSellerProfileByUserId(userId: string): Promise<SellerProfileView | null> {
	const profile = await prisma.sellerProfile.findUnique({
		where: { userId },
	});

	return profile ? mapProfile(profile) : null;
}

export async function getLatestSellerApplication(
	sellerProfileId: string,
): Promise<SellerApplicationView | null> {
	const application = await prisma.sellerApplication.findFirst({
		where: { sellerProfileId },
		orderBy: { submittedAt: 'desc' },
	});

	if (!application) {
		return null;
	}

	return {
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
	};
}

export async function updateSellerShopProfile(
	userId: string,
	input: ShopProfileUpdateInput,
): Promise<SellerProfileView | null> {
	const existing = await prisma.sellerProfile.findUnique({
		where: { userId },
	});

	if (!existing || existing.status !== 'APPROVED') {
		return null;
	}

	const shopSlug = await generateUniqueShopSlug(input.shopName, existing.id);

	const profile = await prisma.sellerProfile.update({
		where: { id: existing.id },
		data: {
			shopName: input.shopName,
			shopSlug,
			description: input.description?.trim() || null,
			shopPhone: input.shopPhone,
			shopEmail: input.shopEmail?.trim() || null,
			addressLine1: input.addressLine1,
			addressLine2: input.addressLine2?.trim() || null,
			city: input.city,
			region: input.region,
			country: input.country,
			returnPolicy: input.returnPolicy?.trim() || null,
			shippingPolicy: input.shippingPolicy?.trim() || null,
		},
	});

	return mapProfile(profile);
}

export async function updateSellerMediaPath(
	userId: string,
	field: 'logoPath' | 'bannerPath',
	path: string,
): Promise<SellerProfileView | null> {
	const existing = await prisma.sellerProfile.findUnique({
		where: { userId },
	});

	if (!existing || existing.status !== 'APPROVED') {
		return null;
	}

	const profile = await prisma.sellerProfile.update({
		where: { id: existing.id },
		data: { [field]: path },
	});

	return mapProfile(profile);
}

export async function completeSellerOnboarding(userId: string): Promise<SellerProfileView | null> {
	const profile = await prisma.sellerProfile.findUnique({
		where: { userId },
	});

	if (!profile || profile.status !== 'APPROVED') {
		return null;
	}

	const hasRequiredFields =
		Boolean(profile.shopName?.trim()) &&
		Boolean(profile.addressLine1?.trim()) &&
		Boolean(profile.city?.trim()) &&
		Boolean(profile.region?.trim()) &&
		Boolean(profile.shopPhone?.trim());

	if (!hasRequiredFields) {
		return null;
	}

	const updated = await prisma.sellerProfile.update({
		where: { id: profile.id },
		data: { onboardingCompletedAt: new Date() },
	});

	return mapProfile(updated);
}

export function isOnboardingComplete(profile: SellerProfileView): boolean {
	return Boolean(profile.onboardingCompletedAt);
}
