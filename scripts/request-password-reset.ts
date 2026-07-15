import 'dotenv/config';

import { auth } from '@/lib/auth';

const email = process.argv[2];
const locale = process.argv[3] ?? 'en';

if (!email) {
	console.error('Usage: npx tsx scripts/request-password-reset.ts <email> [locale]');
	process.exit(1);
}

const appUrl = process.env.APP_URL ?? process.env.AUTH_URL ?? 'http://localhost:4321';

await auth.api.requestPasswordReset({
	body: {
		email,
		redirectTo: `${appUrl}/${locale}/auth/reset-password`,
	},
});

console.info(`Password reset requested for ${email}.`);
console.info('If EMAIL_PROVIDER=console, check the server/dev console for the reset URL preview.');
console.info('If EMAIL_PROVIDER=resend, check the recipient inbox.');

process.exit(0);
