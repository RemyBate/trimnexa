import { PrismaClient, Role, UserStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { hashPassword } from 'better-auth/crypto';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error('DATABASE_URL is required to run seed. See .env.example.');
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const categorySeeds = [
	{ slug: 'electronics', en: 'Electronics', fr: 'Électronique' },
	{ slug: 'fashion', en: 'Fashion', fr: 'Mode' },
	{ slug: 'home', en: 'Home & living', fr: 'Maison & décoration' },
	{ slug: 'beauty', en: 'Beauty & health', fr: 'Beauté & santé' },
	{ slug: 'groceries', en: 'Groceries', fr: 'Épicerie' },
	{ slug: 'sports', en: 'Sports & outdoors', fr: 'Sport & plein air' },
];

async function ensureAdminCredentialAccount(userId: string, password: string): Promise<void> {
	const passwordHash = await hashPassword(password);
	const existingAccount = await prisma.account.findFirst({
		where: {
			userId,
			providerId: 'credential',
		},
	});

	if (existingAccount) {
		await prisma.account.update({
			where: { id: existingAccount.id },
			data: { password: passwordHash },
		});
		return;
	}

	await prisma.account.create({
		data: {
			accountId: userId,
			providerId: 'credential',
			userId,
			password: passwordHash,
		},
	});
}

async function main() {
	console.log('Seeding Trimnexa database...');

	await prisma.siteSetting.upsert({
		where: { key: 'default_commission_rate_bps' },
		update: { value: 1000 },
		create: {
			key: 'default_commission_rate_bps',
			value: 1000,
		},
	});

	await prisma.siteSetting.upsert({
		where: { key: 'default_currency' },
		update: { value: 'XAF' },
		create: {
			key: 'default_currency',
			value: 'XAF',
		},
	});

	for (const [index, category] of categorySeeds.entries()) {
		await prisma.category.upsert({
			where: { slug: category.slug },
			update: { sortOrder: index, isActive: true },
			create: {
				slug: category.slug,
				sortOrder: index,
				isActive: true,
				translations: {
					create: [
						{ locale: 'en', name: category.en },
						{ locale: 'fr', name: category.fr },
					],
				},
			},
		});
	}

	const adminEmail = 'admin@trimnexa.local';
	const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!';

	const adminUser = await prisma.user.upsert({
		where: { email: adminEmail },
		update: {
			name: 'Platform Administrator',
			firstName: 'Platform',
			lastName: 'Administrator',
			status: UserStatus.ACTIVE,
			emailVerified: true,
		},
		create: {
			email: adminEmail,
			name: 'Platform Administrator',
			firstName: 'Platform',
			lastName: 'Administrator',
			status: UserStatus.ACTIVE,
			emailVerified: true,
			locale: 'en',
			roles: {
				create: [{ role: Role.ADMINISTRATOR }],
			},
		},
	});

	await ensureAdminCredentialAccount(adminUser.id, adminPassword);

	await prisma.auditLog.create({
		data: {
			action: 'seed.executed',
			entityType: 'seed',
			entityId: 'phase-4',
			actorId: adminUser.id,
			metadata: {
				categories: categorySeeds.length,
				note: 'Development seed data only — change admin credentials before production.',
			},
		},
	});

	console.log('Seed complete.');
	console.log(`Admin login: ${adminEmail} / ${adminPassword} (override with SEED_ADMIN_PASSWORD)`);
}

main()
	.catch((error) => {
		console.error(error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
		await pool.end();
	});
