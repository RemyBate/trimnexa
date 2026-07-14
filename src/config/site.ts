/**
 * Site-wide constants. Generic values only — no marketplace business logic.
 */
export const site = {
	name: 'Trimnexa',
	url: 'https://trimnexa.com',
	defaultLocale: 'en',
	supportedLocales: ['en', 'fr'] as const,
	currency: {
		code: 'XAF',
		label: 'FCFA',
	},
	defaultMetadata: {
		title: 'Trimnexa',
		description:
			'A trusted multi-vendor e-commerce marketplace for Cameroon. Secure payments in XAF/FCFA with English and French support.',
	},
} as const;

export type SupportedLocale = (typeof site.supportedLocales)[number];
