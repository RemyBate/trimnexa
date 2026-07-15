import type { EmailMessage } from '@/lib/email/types';

/**
 * In-memory capture outbox for automated tests only.
 * Never enabled in production.
 */
const captureOutbox: EmailMessage[] = [];

export function isEmailCaptureEnabled(): boolean {
	const provider = import.meta.env.EMAIL_PROVIDER ?? process.env.EMAIL_PROVIDER;
	return provider === 'capture';
}

export function captureEmail(message: EmailMessage): void {
	captureOutbox.push({ ...message });
}

export function getCapturedEmails(): EmailMessage[] {
	return [...captureOutbox];
}

export function clearCapturedEmails(): void {
	captureOutbox.length = 0;
}

export function getLatestCapturedEmail(): EmailMessage | undefined {
	return captureOutbox.at(-1);
}
