import { isEmailConfigured, resolveEmailProvider } from '@/lib/email/config';
import { captureEmail, isEmailCaptureEnabled } from '@/lib/email/outbox';
import { sendViaConsole } from '@/lib/email/providers/console';
import { sendViaResend } from '@/lib/email/providers/resend';
import type { EmailMessage, SendEmailResult } from '@/lib/email/types';

export async function sendTransactionalEmail(message: EmailMessage): Promise<SendEmailResult> {
	if (!isEmailConfigured()) {
		throw new Error('email_not_configured');
	}

	const provider = resolveEmailProvider();

	if (provider === 'capture' || isEmailCaptureEnabled()) {
		captureEmail(message);
		return { provider: 'capture' };
	}

	if (provider === 'console') {
		return sendViaConsole(message);
	}

	return sendViaResend(message);
}
