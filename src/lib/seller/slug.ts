import { prisma } from '@/lib/db';

export function slugifyShopName(value: string): string {
	return value
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 60);
}

export async function generateUniqueShopSlug(
	shopName: string,
	excludeProfileId?: string,
): Promise<string> {
	const base = slugifyShopName(shopName) || 'shop';
	let candidate = base;
	let suffix = 1;

	while (true) {
		const existing = await prisma.sellerProfile.findFirst({
			where: {
				shopSlug: candidate,
				...(excludeProfileId ? { NOT: { id: excludeProfileId } } : {}),
			},
			select: { id: true },
		});

		if (!existing) {
			return candidate;
		}

		suffix += 1;
		candidate = `${base}-${suffix}`;
	}
}
