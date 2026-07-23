import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

import { parseMysqlDatabaseUrl } from '../src/lib/db-url';

const email = process.argv[2] ?? 'remybatem@gmail.com';
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	console.error('DATABASE_URL is required');
	process.exit(1);
}

const prisma = new PrismaClient({
	adapter: new PrismaMariaDb(parseMysqlDatabaseUrl(connectionString)),
});

try {
	const user = await prisma.user.findUnique({
		where: { email },
		include: {
			accounts: true,
			sellerProfile: true,
			roles: true,
		},
	});

	if (!user) {
		console.log(`No user found for ${email}`);
		process.exit(0);
	}

	const credential = user.accounts.find((account) => account.providerId === 'credential');

	console.log(
		JSON.stringify(
			{
				userId: user.id,
				email: user.email,
				status: user.status,
				emailVerified: user.emailVerified,
				hasCredentialAccount: Boolean(credential),
				hasPasswordHash: Boolean(credential?.password),
				roles: user.roles.map((role) => role.role),
				sellerProfileId: user.sellerProfile?.id ?? null,
				sellerStatus: user.sellerProfile?.status ?? null,
				shopName: user.sellerProfile?.shopName ?? null,
				shopSlug: user.sellerProfile?.shopSlug ?? null,
			},
			null,
			2,
		),
	);
} finally {
	await prisma.$disconnect();
}
