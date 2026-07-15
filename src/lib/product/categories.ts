import { prisma } from '@/lib/db';

export interface CategoryOption {
	id: string;
	slug: string;
	name: string;
	parentId: string | null;
	isActive: boolean;
	depth: number;
}

export interface AdminCategoryView {
	id: string;
	slug: string;
	nameEn: string;
	nameFr: string;
	parentId: string | null;
	parentNameEn: string | null;
	isActive: boolean;
	sortOrder: number;
	productCount: number;
}

async function getCategoryNameMap(): Promise<Map<string, { en: string; fr: string }>> {
	const translations = await prisma.categoryTranslation.findMany({
		select: { categoryId: true, locale: true, name: true },
	});

	const map = new Map<string, { en: string; fr: string }>();

	for (const translation of translations) {
		const existing = map.get(translation.categoryId) ?? { en: '', fr: '' };
		if (translation.locale === 'en') {
			existing.en = translation.name;
		}
		if (translation.locale === 'fr') {
			existing.fr = translation.name;
		}
		map.set(translation.categoryId, existing);
	}

	return map;
}

export async function listActiveCategoriesForLocale(locale: string): Promise<CategoryOption[]> {
	const categories = await prisma.category.findMany({
		where: { isActive: true },
		orderBy: [{ sortOrder: 'asc' }, { slug: 'asc' }],
		include: {
			translations: {
				where: { locale: { in: [locale, 'en'] } },
			},
		},
	});

	const byId = new Map(categories.map((category) => [category.id, category]));

	function getDepth(categoryId: string): number {
		let depth = 0;
		let current = byId.get(categoryId);

		while (current?.parentId) {
			depth += 1;
			current = byId.get(current.parentId);
		}

		return depth;
	}

	return categories.map((category) => {
		const translation =
			category.translations.find((item) => item.locale === locale) ??
			category.translations.find((item) => item.locale === 'en');

		return {
			id: category.id,
			slug: category.slug,
			name: translation?.name ?? category.slug,
			parentId: category.parentId,
			isActive: category.isActive,
			depth: getDepth(category.id),
		};
	});
}

export async function isCategoryAvailable(categoryId: string): Promise<boolean> {
	const category = await prisma.category.findUnique({
		where: { id: categoryId },
		select: { isActive: true },
	});

	return Boolean(category?.isActive);
}

export async function listCategoriesForAdmin(): Promise<AdminCategoryView[]> {
	const [categories, nameMap, productCounts] = await Promise.all([
		prisma.category.findMany({
			orderBy: [{ sortOrder: 'asc' }, { slug: 'asc' }],
		}),
		getCategoryNameMap(),
		prisma.product.groupBy({
			by: ['categoryId'],
			_count: { categoryId: true },
		}),
	]);

	const countMap = new Map(productCounts.map((row) => [row.categoryId, row._count.categoryId]));

	return categories.map((category) => {
		const names = nameMap.get(category.id) ?? { en: category.slug, fr: category.slug };
		const parentNames = category.parentId ? nameMap.get(category.parentId) : null;

		return {
			id: category.id,
			slug: category.slug,
			nameEn: names.en || category.slug,
			nameFr: names.fr || category.slug,
			parentId: category.parentId,
			parentNameEn: parentNames?.en ?? null,
			isActive: category.isActive,
			sortOrder: category.sortOrder,
			productCount: countMap.get(category.id) ?? 0,
		};
	});
}

export async function setCategoryActive(
	categoryId: string,
	isActive: boolean,
): Promise<AdminCategoryView | null> {
	const existing = await prisma.category.findUnique({ where: { id: categoryId } });

	if (!existing) {
		return null;
	}

	await prisma.category.update({
		where: { id: categoryId },
		data: { isActive },
	});

	const categories = await listCategoriesForAdmin();
	return categories.find((category) => category.id === categoryId) ?? null;
}
