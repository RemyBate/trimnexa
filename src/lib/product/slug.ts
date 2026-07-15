import { prisma } from '@/lib/db';

export function slugifyProductTitle(value: string): string {
	return value
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 80);
}

export async function generateUniqueProductSlug(
	title: string,
	excludeProductId?: string,
): Promise<string> {
	const base = slugifyProductTitle(title) || 'product';
	let candidate = base;
	let suffix = 1;

	while (true) {
		const existing = await prisma.product.findFirst({
			where: {
				slug: candidate,
				...(excludeProductId ? { NOT: { id: excludeProductId } } : {}),
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
