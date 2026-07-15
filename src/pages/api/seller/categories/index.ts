import type { APIRoute } from 'astro';

import { listActiveCategoriesForLocale } from '@/lib/product/categories';
import { jsonResponse, requireApprovedSellerApiUser } from '@/lib/seller/api-auth';

export const prerender = false;

export const GET: APIRoute = async (context) => {
	const authResult = await requireApprovedSellerApiUser(context);
	if (authResult instanceof Response) {
		return authResult;
	}

	const locale = context.url.searchParams.get('locale') ?? 'en';
	const categories = await listActiveCategoriesForLocale(locale);
	return jsonResponse({ categories });
};
