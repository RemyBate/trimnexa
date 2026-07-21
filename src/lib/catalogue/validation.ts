import { z } from 'zod';

export const catalogueSortSchema = z.enum(['newest', 'price_asc', 'price_desc', 'title_asc']);

export const catalogueQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	pageSize: z.coerce.number().int().min(1).max(48).default(24),
	sort: catalogueSortSchema.default('newest'),
	q: z.string().trim().max(120).optional(),
	category: z.string().trim().max(80).optional(),
	shop: z.string().trim().max(80).optional(),
	minPrice: z.coerce.number().int().min(0).optional(),
	maxPrice: z.coerce.number().int().min(0).optional(),
	inStock: z
		.enum(['1', '0', 'true', 'false'])
		.optional()
		.transform((value) => value === '1' || value === 'true'),
});

export type ParsedCatalogueQuery = z.infer<typeof catalogueQuerySchema>;

const defaultCatalogueQuery: ParsedCatalogueQuery = {
	page: 1,
	pageSize: 24,
	sort: 'newest',
	inStock: false,
};

export function parseCatalogueSearchParams(searchParams: URLSearchParams): ParsedCatalogueQuery {
	const parsed = catalogueQuerySchema.safeParse({
		page: searchParams.get('page') ?? undefined,
		pageSize: searchParams.get('pageSize') ?? undefined,
		sort: searchParams.get('sort') ?? undefined,
		q: searchParams.get('q') ?? undefined,
		category: searchParams.get('category') ?? undefined,
		shop: searchParams.get('shop') ?? undefined,
		minPrice: searchParams.get('minPrice') ?? undefined,
		maxPrice: searchParams.get('maxPrice') ?? undefined,
		inStock: searchParams.get('inStock') ?? undefined,
	});

	if (!parsed.success) {
		if (import.meta.env.DEV) {
			console.warn('[catalogue] Ignoring invalid query parameters', parsed.error.flatten());
		}
		return { ...defaultCatalogueQuery };
	}

	return parsed.data;
}

export function buildCatalogueQueryString(
	params: Record<string, string | number | boolean | undefined | null>,
): string {
	const query = new URLSearchParams();

	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null || value === '' || value === false) {
			continue;
		}

		query.set(key, String(value));
	}

	const serialized = query.toString();
	return serialized ? `?${serialized}` : '';
}
