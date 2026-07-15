export type EmailProviderName = 'console' | 'resend' | 'capture';

export interface EmailMessage {
	to: string;
	subject: string;
	text: string;
	html: string;
}

export interface SendEmailResult {
	provider: EmailProviderName;
	messageId?: string;
}
