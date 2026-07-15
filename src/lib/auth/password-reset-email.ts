import type { SupportedLocale } from '@/config/site';
import { env } from '@/config/env';
import { AuditActions, recordAuditLog } from '@/lib/audit/record-audit-log';
import { sendTransactionalEmail } from '@/lib/email/send-email';
import { buildPasswordResetEmail } from '@/lib/email/templates/password-reset';
import { getClientIp } from '@/lib/rate-limit';

export const PASSWORD_RESET_TOKEN_EXPIRES_SECONDS = 45 * 60;

function resolveAuthBaseUrl(): string {
	return process.env.BETTER_AUTH_URL ?? env.AUTH_URL ?? env.APP_URL;
}

function resolveUserLocale(locale: string | null | undefined): SupportedLocale {
	return locale === 'fr' ? 'fr' : 'en';
}

export function buildLocalizedPasswordResetUrl(
	locale: string | null | undefined,
	token: string,
): string {
	const normalizedLocale = resolveUserLocale(locale);
	const baseUrl = resolveAuthBaseUrl().replace(/\/+$/, '');
	return `${baseUrl}/${normalizedLocale}/auth/reset-password?token=${encodeURIComponent(token)}`;
}

interface PasswordResetEmailInput {
	userId: string;
	email: string;
	locale: string | null | undefined;
	resetUrl: string;
	request?: Request;
}

/**
 * Sends a password reset email and records an audit entry.
 * Called only when Better Auth confirms the account exists.
 */
export async function deliverPasswordResetEmail(input: PasswordResetEmailInput): Promise<void> {
	const template = buildPasswordResetEmail({
		locale: resolveUserLocale(input.locale),
		resetUrl: input.resetUrl,
		expiresMinutes: PASSWORD_RESET_TOKEN_EXPIRES_SECONDS / 60,
	});

	await sendTransactionalEmail({
		to: input.email,
		subject: template.subject,
		text: template.text,
		html: template.html,
	});

	await recordAuditLog({
		action: AuditActions.PASSWORD_RESET_REQUESTED,
		entityType: 'user',
		entityId: input.userId,
		actorId: input.userId,
		ipAddress: input.request ? getClientIp(input.request) : undefined,
		userAgent: input.request?.headers.get('user-agent') ?? undefined,
		metadata: {
			emailDomain: input.email.split('@')[1] ?? 'unknown',
		},
	});
}

export async function recordPasswordResetCompleted(
	userId: string,
	request?: Request,
): Promise<void> {
	await recordAuditLog({
		action: AuditActions.PASSWORD_RESET_COMPLETED,
		entityType: 'user',
		entityId: userId,
		actorId: userId,
		ipAddress: request ? getClientIp(request) : undefined,
		userAgent: request?.headers.get('user-agent') ?? undefined,
	});
}
