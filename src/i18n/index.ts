import type { AstroGlobal } from 'astro';

import { site, type SupportedLocale } from '@/config/site';
import en from '@/i18n/locales/en.json';
import fr from '@/i18n/locales/fr.json';
import type { TranslationDictionary } from '@/i18n/types';

const dictionaries: Record<SupportedLocale, TranslationDictionary> = {
	en,
	fr,
};

const openGraphLocales: Record<SupportedLocale, string> = {
	en: 'en_CM',
	fr: 'fr_CM',
};

export function isValidLocale(value: string | undefined): value is SupportedLocale {
	return value !== undefined && site.supportedLocales.includes(value as SupportedLocale);
}

export function getDictionary(locale: SupportedLocale): TranslationDictionary {
	return dictionaries[locale];
}

export function getOpenGraphLocale(locale: SupportedLocale): string {
	return openGraphLocales[locale];
}

/**
 * Resolves a dot-notation translation key from a dictionary.
 * Returns the key if missing (helps catch typos during development).
 */
export function translate(dictionary: TranslationDictionary, key: string): string {
	const segments = key.split('.');
	let current: unknown = dictionary;

	for (const segment of segments) {
		if (typeof current !== 'object' || current === null || !(segment in current)) {
			return key;
		}

		current = (current as Record<string, unknown>)[segment];
	}

	return typeof current === 'string' ? current : key;
}

export function localizedPath(locale: SupportedLocale, path = '/'): string {
	const normalized = path.startsWith('/') ? path : `/${path}`;

	if (normalized === '/') {
		return `/${locale}/`;
	}

	return `/${locale}${normalized}`;
}

export function replaceLocaleInPath(pathname: string, locale: SupportedLocale): string {
	const segments = pathname.split('/').filter(Boolean);

	if (segments.length === 0) {
		return localizedPath(locale);
	}

	if (isValidLocale(segments[0])) {
		segments[0] = locale;
		return `/${segments.join('/')}${pathname.endsWith('/') && segments.length > 0 ? '/' : ''}`;
	}

	return localizedPath(locale, pathname);
}

export function getStaticPathsForLocale() {
	return site.supportedLocales.map((locale) => ({
		params: { locale },
	}));
}

export interface PageContext {
	locale: SupportedLocale;
	dictionary: TranslationDictionary;
	t: (key: string) => string;
}

export function getPageContext(astro: Pick<AstroGlobal, 'params' | 'url'>): PageContext {
	const localeParam = astro.params.locale;

	if (!isValidLocale(localeParam)) {
		throw new Error(`Invalid locale: ${localeParam ?? 'undefined'}`);
	}

	const dictionary = getDictionary(localeParam);

	return {
		locale: localeParam,
		dictionary,
		t: (key: string) => translate(dictionary, key),
	};
}

export function getLocaleLabel(locale: SupportedLocale): string {
	return locale === 'en' ? 'English' : 'Français';
}

export function getLocaleShortLabel(locale: SupportedLocale): string {
	return locale.toUpperCase();
}
