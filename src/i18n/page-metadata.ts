import type { SupportedLocale } from '@/config/site';
import { getOpenGraphLocale } from '@/i18n';
import { createPageMetadata } from '@/seo/metadata';
import type { PageMetadata } from '@/types/seo';

export function createLocalizedPageMetadata(
	locale: SupportedLocale,
	path: string,
	title: string,
	description: string,
	options?: { noindex?: boolean },
): PageMetadata {
	return createPageMetadata({
		title,
		description,
		path,
		locale: getOpenGraphLocale(locale),
		noindex: options?.noindex,
	});
}
