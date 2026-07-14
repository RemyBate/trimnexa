/// <reference types="astro/client" />

declare namespace App {
	interface Locals {
		user: import('better-auth').User | null;
		session: import('better-auth').Session | null;
	}
}

interface ImportMetaEnv {
	readonly APP_ENV?: 'development' | 'staging' | 'production';
	readonly APP_URL?: string;
	readonly DEFAULT_LOCALE?: 'en' | 'fr';
	readonly DATABASE_URL?: string;
	readonly AUTH_SECRET?: string;
	readonly AUTH_URL?: string;
	readonly BETTER_AUTH_SECRET?: string;
	readonly BETTER_AUTH_URL?: string;
	readonly STORAGE_PROVIDER?: string;
	readonly STORAGE_BUCKET?: string;
	readonly STORAGE_ACCESS_KEY?: string;
	readonly STORAGE_SECRET_KEY?: string;
	readonly STORAGE_PUBLIC_URL?: string;
	readonly PAYMENT_PROVIDER?: string;
	readonly PAYMENT_API_KEY?: string;
	readonly PAYMENT_WEBHOOK_SECRET?: string;
	readonly COMMISSION_RATE?: string;
	readonly EMAIL_PROVIDER?: string;
	readonly EMAIL_API_KEY?: string;
	readonly EMAIL_FROM?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
