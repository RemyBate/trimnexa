import { Resend } from 'resend';

import { resolveEmailApiKey, resolveEmailFromAddress } from '@/lib/email/config';
import type { EmailMessage, SendEmailResult } from '@/lib/email/types';

export async function sendViaResend(message: EmailMessage): Promise<SendEmailResult> {
	const apiKey = resolveEmailApiKey();

	if (!apiKey) {
		throw new Error('EMAIL_API_KEY is required when EMAIL_PROVIDER=resend');
	}

	const resend = new Resend(apiKey);
	const from = resolveEmailFromAddress();

	const response = await resend.emails.send({
		from,
		to: message.to,
		subject: message.subject,
		text: message.text,
		html: message.html,
	});

	if (response.error) {
		throw new Error(response.error.message);
	}

	return {
		provider: 'resend',
		messageId: response.data?.id,
	};
}
