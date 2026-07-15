import { env } from '@/config/env';
import type { EmailProviderName } from '@/lib/email/types';

export function resolveEmailProvider(): EmailProviderName {
	const configured =
		import.meta.env.EMAIL_PROVIDER ?? process.env.EMAIL_PROVIDER ?? env.EMAIL_PROVIDER;

	if (configured === 'resend' || configured === 'capture' || configured === 'console') {
		return configured;
	}

	return env.APP_ENV === 'production' ? 'resend' : 'console';
}

export function resolveEmailFromAddress(): string {
	return import.meta.env.EMAIL_FROM ?? env.EMAIL_FROM ?? 'Trimnexa <noreply@trimnexa.com>';
}

export function resolveEmailApiKey(): string | undefined {
	return import.meta.env.EMAIL_API_KEY ?? env.EMAIL_API_KEY;
}

export function isEmailConfigured(): boolean {
	const provider = resolveEmailProvider();

	if (provider === 'console' || provider === 'capture') {
		return true;
	}

	return Boolean(resolveEmailApiKey() && resolveEmailFromAddress());
}
