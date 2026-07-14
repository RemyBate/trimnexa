import { site } from '@/config/site';
import type { PageMetadata, SeoOptions } from '@/types/seo';

const DEFAULT_OG_TYPE = 'website';
const DEFAULT_TWITTER_CARD = 'summary_large_image' as const;

function resolveCanonicalUrl(path?: string, override?: string): string {
	if (override) {
		return override;
	}

	const base = site.url.replace(/\/$/, '');
	if (!path || path === '/') {
		return base;
	}

	return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

function resolveTitle(title?: string): string {
	if (!title) {
		return site.defaultMetadata.title;
	}

	return title.includes(site.name) ? title : `${title} | ${site.name}`;
}

/**
 * Builds page metadata for Astro layouts. Returns structured data for
 * title, description, canonical URL, Open Graph, and Twitter tags.
 */
export function createPageMetadata(options: SeoOptions = {}): PageMetadata {
	const title = resolveTitle(options.title);
	const description = options.description ?? site.defaultMetadata.description;
	const canonicalUrl = resolveCanonicalUrl(options.path, options.canonicalUrl);
	const ogImage = options.ogImage;
	const locale = options.locale ?? site.defaultLocale;

	return {
		title,
		description,
		canonicalUrl,
		robots: options.noindex ? 'noindex, nofollow' : undefined,
		openGraph: {
			title,
			description,
			url: canonicalUrl,
			type: options.ogType ?? DEFAULT_OG_TYPE,
			siteName: site.name,
			image: ogImage,
			locale,
		},
		twitter: {
			card: ogImage ? DEFAULT_TWITTER_CARD : 'summary',
			title,
			description,
			image: ogImage,
		},
	};
}
