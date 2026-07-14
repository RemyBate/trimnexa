import { prisma } from '@/lib/db';

export interface WishlistItemView {
	id: string;
	productSlug: string;
	productTitle: string;
	addedAt: Date;
}

export async function ensureCustomerWishlist(userId: string): Promise<string> {
	const profile = await prisma.customerProfile.findUnique({
		where: { userId },
		include: { wishlist: true },
	});

	if (!profile) {
		throw new Error('Customer profile not found');
	}

	if (profile.wishlist) {
		return profile.wishlist.id;
	}

	const wishlist = await prisma.wishlist.create({
		data: { customerProfileId: profile.id },
	});

	return wishlist.id;
}

export async function listWishlistItems(userId: string): Promise<WishlistItemView[]> {
	const profile = await prisma.customerProfile.findUnique({
		where: { userId },
		include: {
			wishlist: {
				include: {
					items: {
						orderBy: { addedAt: 'desc' },
					},
				},
			},
		},
	});

	return profile?.wishlist?.items ?? [];
}

export async function countWishlistItems(userId: string): Promise<number> {
	const profile = await prisma.customerProfile.findUnique({
		where: { userId },
		include: {
			wishlist: {
				select: {
					_count: { select: { items: true } },
				},
			},
		},
	});

	return profile?.wishlist?._count.items ?? 0;
}
