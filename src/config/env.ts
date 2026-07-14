import { z } from 'zod';

import { site } from '@/config/site';

const optionalNonEmptyString = z.string().min(1).optional();

/**
 * Environment variable schema. Validates at module load during build/dev.
 * Secrets belong in .env only — never commit real values.
 */
const envSchema = z.object({
	APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
	APP_URL: z.url().default('http://localhost:4321'),
	DEFAULT_LOCALE: z.enum(site.supportedLocales).default(site.defaultLocale),

	// Phase 3+
	DATABASE_URL: optionalNonEmptyString,

	// Phase 4+
	AUTH_SECRET: optionalNonEmptyString,
	AUTH_URL: z.url().optional(),

	// Phase 7+
	STORAGE_PROVIDER: optionalNonEmptyString,
	STORAGE_BUCKET: optionalNonEmptyString,
	STORAGE_ACCESS_KEY: optionalNonEmptyString,
	STORAGE_SECRET_KEY: optionalNonEmptyString,
	STORAGE_PUBLIC_URL: z.url().optional(),

	// Phase 11+
	PAYMENT_PROVIDER: optionalNonEmptyString,
	PAYMENT_API_KEY: optionalNonEmptyString,
	PAYMENT_WEBHOOK_SECRET: optionalNonEmptyString,

	// Phase 13+
	COMMISSION_RATE: optionalNonEmptyString,

	// Phase 16+
	EMAIL_PROVIDER: optionalNonEmptyString,
	EMAIL_API_KEY: optionalNonEmptyString,
	EMAIL_FROM: z.email().optional(),
});

export type Env = z.infer<typeof envSchema>;

function readEnv(): Env {
	return envSchema.parse({
		APP_ENV: import.meta.env.APP_ENV,
		APP_URL: import.meta.env.APP_URL,
		DEFAULT_LOCALE: import.meta.env.DEFAULT_LOCALE,
		DATABASE_URL: import.meta.env.DATABASE_URL,
		AUTH_SECRET: import.meta.env.AUTH_SECRET,
		AUTH_URL: import.meta.env.AUTH_URL,
		STORAGE_PROVIDER: import.meta.env.STORAGE_PROVIDER,
		STORAGE_BUCKET: import.meta.env.STORAGE_BUCKET,
		STORAGE_ACCESS_KEY: import.meta.env.STORAGE_ACCESS_KEY,
		STORAGE_SECRET_KEY: import.meta.env.STORAGE_SECRET_KEY,
		STORAGE_PUBLIC_URL: import.meta.env.STORAGE_PUBLIC_URL,
		PAYMENT_PROVIDER: import.meta.env.PAYMENT_PROVIDER,
		PAYMENT_API_KEY: import.meta.env.PAYMENT_API_KEY,
		PAYMENT_WEBHOOK_SECRET: import.meta.env.PAYMENT_WEBHOOK_SECRET,
		COMMISSION_RATE: import.meta.env.COMMISSION_RATE,
		EMAIL_PROVIDER: import.meta.env.EMAIL_PROVIDER,
		EMAIL_API_KEY: import.meta.env.EMAIL_API_KEY,
		EMAIL_FROM: import.meta.env.EMAIL_FROM,
	});
}

/** Validated environment variables for server/build usage. */
export const env = readEnv();
