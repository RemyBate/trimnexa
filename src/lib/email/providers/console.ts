import type { EmailMessage, SendEmailResult } from '@/lib/email/types';

/**
 * Development-only provider. Logs metadata to the server console without exposing
 * message content in HTTP responses. Reset URLs are logged only when APP_ENV is
 * not production.
 */
export async function sendViaConsole(message: EmailMessage): Promise<SendEmailResult> {
	const isProduction = import.meta.env.APP_ENV === 'production' || import.meta.env.PROD;

	if (isProduction) {
		console.warn('[email:console] Console provider is disabled in production.');
		return { provider: 'console' };
	}

	console.info('[email:console] Transactional email preview');
	console.info(`  to: ${message.to}`);
	console.info(`  subject: ${message.subject}`);

	const urlMatch = message.text.match(/https?:\/\/[^\s]+/);
	if (urlMatch) {
		console.info(`  resetUrl: ${urlMatch[0]}`);
	}

	return { provider: 'console' };
}
