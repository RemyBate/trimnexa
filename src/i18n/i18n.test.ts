import { describe, expect, it } from 'vitest';

import { site } from '@/config/site';
import { isValidLocale, localizedPath, replaceLocaleInPath, translate } from '@/i18n';
import en from '@/i18n/locales/en.json';

describe('i18n', () => {
	it('validates supported locales', () => {
		expect(isValidLocale('en')).toBe(true);
		expect(isValidLocale('fr')).toBe(true);
		expect(isValidLocale('de')).toBe(false);
		expect(isValidLocale(undefined)).toBe(false);
	});

	it('translates dot-notation keys', () => {
		expect(translate(en, 'nav.home')).toBe('Home');
		expect(translate(en, 'missing.key')).toBe('missing.key');
	});

	it('builds localized paths', () => {
		expect(localizedPath('en')).toBe('/en/');
		expect(localizedPath('fr', '/about')).toBe('/fr/about');
		expect(localizedPath('en', '/contact')).toBe('/en/contact');
	});

	it('replaces locale segment in current path', () => {
		expect(replaceLocaleInPath('/en/about', 'fr')).toBe('/fr/about');
		expect(replaceLocaleInPath('/fr/help', 'en')).toBe('/en/help');
		expect(replaceLocaleInPath('/', 'fr')).toBe('/fr/');
	});

	it('covers all configured locales in static paths', () => {
		expect(site.supportedLocales).toEqual(['en', 'fr']);
	});
});
