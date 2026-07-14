import { getSellerProfileByUserId, isOnboardingComplete } from '@/lib/seller/profile';

export interface SellerDashboardSummary {
	shopName: string | null;
	onboardingComplete: boolean;
	hasLogo: boolean;
	hasBanner: boolean;
	hasPolicies: boolean;
}

export async function getSellerDashboardSummary(
	userId: string,
): Promise<SellerDashboardSummary | null> {
	const profile = await getSellerProfileByUserId(userId);

	if (!profile) {
		return null;
	}

	return {
		shopName: profile.shopName,
		onboardingComplete: isOnboardingComplete(profile),
		hasLogo: Boolean(profile.logoUrl),
		hasBanner: Boolean(profile.bannerUrl),
		hasPolicies: Boolean(profile.returnPolicy || profile.shippingPolicy),
	};
}
