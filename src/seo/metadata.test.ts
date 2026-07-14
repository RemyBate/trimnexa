import { describe, expect, it } from 'vitest';

import { site } from '@/config/site';
import { createPageMetadata } from '@/seo/metadata';

describe('createPageMetadata', () => {
	it('returns default site metadata when no options are provided', () => {
		const metadata = createPageMetadata();

		expect(metadata.title).toBe(site.defaultMetadata.title);
		expect(metadata.description).toBe(site.defaultMetadata.description);
		expect(metadata.canonicalUrl).toBe(site.url);
		expect(metadata.robots).toBeUndefined();
	});

	it('appends site name to custom page titles', () => {
		const metadata = createPageMetadata({ title: 'About', path: '/about' });

		expect(metadata.title).toBe('About | Trimnexa');
		expect(metadata.canonicalUrl).toBe(`${site.url}/about`);
	});

	it('sets noindex robots when requested', () => {
		const metadata = createPageMetadata({ noindex: true, path: '/account' });

		expect(metadata.robots).toBe('noindex, nofollow');
	});

	it('includes Open Graph and Twitter fields', () => {
		const metadata = createPageMetadata({
			title: 'Contact',
			description: 'Contact Trimnexa support.',
			path: '/contact',
			ogImage: 'https://trimnexa.com/og.png',
		});

		expect(metadata.openGraph.title).toBe('Contact | Trimnexa');
		expect(metadata.openGraph.image).toBe('https://trimnexa.com/og.png');
		expect(metadata.twitter.card).toBe('summary_large_image');
		expect(metadata.twitter.image).toBe('https://trimnexa.com/og.png');
	});

	it('does not duplicate site name when already present', () => {
		const metadata = createPageMetadata({ title: 'Shop | Trimnexa' });

		expect(metadata.title).toBe('Shop | Trimnexa');
	});
});
