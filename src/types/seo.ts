export interface OpenGraphMetadata {
	title: string;
	description: string;
	url: string;
	type: string;
	siteName: string;
	image?: string;
	locale?: string;
}

export interface TwitterMetadata {
	card: 'summary' | 'summary_large_image';
	title: string;
	description: string;
	image?: string;
}

export interface PageMetadata {
	title: string;
	description: string;
	canonicalUrl: string;
	robots?: string;
	openGraph: OpenGraphMetadata;
	twitter: TwitterMetadata;
}

export interface SeoOptions {
	title?: string;
	description?: string;
	/** Site path, e.g. `/about`. Combined with site URL when canonicalUrl is omitted. */
	path?: string;
	canonicalUrl?: string;
	ogImage?: string;
	ogType?: string;
	locale?: string;
	noindex?: boolean;
}
