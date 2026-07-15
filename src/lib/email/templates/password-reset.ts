import type { SupportedLocale } from '@/config/site';

interface PasswordResetTemplateInput {
	locale: SupportedLocale;
	resetUrl: string;
	expiresMinutes: number;
}

interface PasswordResetTemplate {
	subject: string;
	text: string;
	html: string;
}

const copy = {
	en: {
		subject: 'Reset your Trimnexa password',
		preview: 'Use this link to choose a new password for your Trimnexa account.',
		greeting: 'Hello,',
		body: 'We received a request to reset the password for your Trimnexa account.',
		action: 'Reset password',
		expires: (minutes: number) =>
			`This link expires in ${minutes} minutes and can only be used once.`,
		ignore: 'If you did not request a password reset, you can safely ignore this email.',
		footer: 'Trimnexa — marketplace for Cameroon',
	},
	fr: {
		subject: 'Réinitialisez votre mot de passe Trimnexa',
		preview: 'Utilisez ce lien pour choisir un nouveau mot de passe pour votre compte Trimnexa.',
		greeting: 'Bonjour,',
		body: 'Nous avons reçu une demande de réinitialisation du mot de passe de votre compte Trimnexa.',
		action: 'Réinitialiser le mot de passe',
		expires: (minutes: number) =>
			`Ce lien expire dans ${minutes} minutes et ne peut être utilisé qu'une seule fois.`,
		ignore: "Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet e-mail.",
		footer: 'Trimnexa — marketplace pour le Cameroun',
	},
} as const;

export function buildPasswordResetEmail(input: PasswordResetTemplateInput): PasswordResetTemplate {
	const locale = input.locale === 'fr' ? 'fr' : 'en';
	const strings = copy[locale];

	const text = [
		strings.greeting,
		'',
		strings.body,
		'',
		`${strings.action}: ${input.resetUrl}`,
		'',
		strings.expires(input.expiresMinutes),
		'',
		strings.ignore,
		'',
		strings.footer,
	].join('\n');

	const html = `<!DOCTYPE html>
<html lang="${locale}">
  <body style="font-family:system-ui,sans-serif;line-height:1.5;color:#171717;max-width:560px;margin:0 auto;padding:24px;">
    <p>${strings.greeting}</p>
    <p>${strings.body}</p>
    <p style="margin:24px 0;">
      <a href="${input.resetUrl}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:12px 20px;border-radius:6px;font-weight:600;">
        ${strings.action}
      </a>
    </p>
    <p style="font-size:14px;color:#525252;">${strings.expires(input.expiresMinutes)}</p>
    <p style="font-size:14px;color:#525252;">${strings.ignore}</p>
    <p style="font-size:12px;color:#737373;margin-top:32px;">${strings.footer}</p>
  </body>
</html>`;

	return {
		subject: strings.subject,
		text,
		html,
	};
}
