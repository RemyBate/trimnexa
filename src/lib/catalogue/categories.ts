import { localizedPath } from '@/i18n';
import type { SupportedLocale } from '@/config/site';
import { withCatalogueDb } from '@/lib/catalogue/runtime';
import { prisma } from '@/lib/db';
import type { CatalogueCategoryPage } from '@/lib/catalogue/types';

function pickName(
	translations: Array<{ locale: string; name: string }>,
	locale: string,
	slug: string,
): string {
	return (
		translations.find((item) => item.locale === locale)?.name ??
		translations.find((item) => item.locale === 'en')?.name ??
		slug
	);
}

export async function getPublicCategoryBySlug(
	slug: string,
	locale: SupportedLocale,
): Promise<CatalogueCategoryPage | null> {
	return withCatalogueDb('getPublicCategoryBySlug', null, async () => {
		const category = await prisma.category.findFirst({
			where: { slug, isActive: true },
			include: {
				translations: true,
				parent: { include: { translations: true } },
				children: {
					where: { isActive: true },
					orderBy: { sortOrder: 'asc' },
					include: { translations: true },
				},
			},
		});

		if (!category) {
			return null;
		}

		const name = pickName(category.translations, locale, category.slug);
		const description =
			category.translations.find((item) => item.locale === locale)?.description ??
			category.translations.find((item) => item.locale === 'en')?.description ??
			null;

		const parent = category.parent
			? {
					slug: category.parent.slug,
					name: pickName(category.parent.translations, locale, category.parent.slug),
				}
			: null;

		const breadcrumbs: CatalogueCategoryPage['breadcrumbs'] = [
			{ label: 'home', href: localizedPath(locale, '/') },
			{ label: 'catalogue', href: localizedPath(locale, '/products') },
		];

		if (parent) {
			breadcrumbs.push({
				label: parent.name,
				href: localizedPath(locale, `/categories/${parent.slug}`),
			});
		}

		breadcrumbs.push({
			label: name,
			href: localizedPath(locale, `/categories/${category.slug}`),
		});

		return {
			id: category.id,
			slug: category.slug,
			name,
			description,
			parent,
			children: category.children.map((child) => ({
				slug: child.slug,
				name: pickName(child.translations, locale, child.slug),
			})),
			breadcrumbs,
		};
	});
}

export async function listTopLevelCategories(locale: SupportedLocale) {
	return withCatalogueDb('listTopLevelCategories', [], async () => {
		const categories = await prisma.category.findMany({
			where: { isActive: true, parentId: null },
			orderBy: { sortOrder: 'asc' },
			include: { translations: true },
		});

		return categories.map((category) => ({
			slug: category.slug,
			name: pickName(category.translations, locale, category.slug),
		}));
	});
}
