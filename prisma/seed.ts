import { ApplicationStatus, PrismaClient, Role, SellerStatus, UserStatus } from '@prisma/client';
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

	const fashionCategory = await prisma.category.findUniqueOrThrow({ where: { slug: 'fashion' } });
	const homeCategory = await prisma.category.findUniqueOrThrow({ where: { slug: 'home' } });

	const subcategorySeeds = [
		{
			slug: 'mens-clothing',
			parentId: fashionCategory.id,
			sortOrder: 0,
			en: "Men's clothing",
			fr: 'Vêtements homme',
		},
		{
			slug: 'womens-clothing',
			parentId: fashionCategory.id,
			sortOrder: 1,
			en: "Women's clothing",
			fr: 'Vêtements femme',
		},
		{
			slug: 'kitchen',
			parentId: homeCategory.id,
			sortOrder: 0,
			en: 'Kitchen',
			fr: 'Cuisine',
		},
	];

	for (const subcategory of subcategorySeeds) {
		await prisma.category.upsert({
			where: { slug: subcategory.slug },
			update: {
				parentId: subcategory.parentId,
				sortOrder: subcategory.sortOrder,
				isActive: true,
			},
			create: {
				slug: subcategory.slug,
				parentId: subcategory.parentId,
				sortOrder: subcategory.sortOrder,
				isActive: true,
				translations: {
					create: [
						{ locale: 'en', name: subcategory.en },
						{ locale: 'fr', name: subcategory.fr },
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

	const adminProfile = await prisma.customerProfile.upsert({
		where: { userId: adminUser.id },
		update: {},
		create: { userId: adminUser.id },
	});

	await prisma.wishlist.upsert({
		where: { customerProfileId: adminProfile.id },
		update: {},
		create: { customerProfileId: adminProfile.id },
	});

	const profilesWithoutWishlist = await prisma.customerProfile.findMany({
		where: { wishlist: null },
		select: { id: true },
	});

	for (const profile of profilesWithoutWishlist) {
		await prisma.wishlist.upsert({
			where: { customerProfileId: profile.id },
			update: {},
			create: { customerProfileId: profile.id },
		});
	}

	const pendingSellerEmail = 'pending-seller@trimnexa.local';
	const pendingSeller = await prisma.user.upsert({
		where: { email: pendingSellerEmail },
		update: {
			name: 'Pending Seller',
			firstName: 'Pending',
			lastName: 'Seller',
			status: UserStatus.ACTIVE,
			emailVerified: true,
		},
		create: {
			email: pendingSellerEmail,
			name: 'Pending Seller',
			firstName: 'Pending',
			lastName: 'Seller',
			status: UserStatus.ACTIVE,
			emailVerified: true,
			locale: 'en',
			roles: {
				create: [{ role: Role.CUSTOMER }],
			},
		},
	});

	await ensureAdminCredentialAccount(pendingSeller.id, 'ChangeMe123!');
	await prisma.customerProfile.upsert({
		where: { userId: pendingSeller.id },
		update: {},
		create: { userId: pendingSeller.id },
	});

	const pendingSellerProfile = await prisma.sellerProfile.upsert({
		where: { userId: pendingSeller.id },
		update: { status: SellerStatus.PENDING },
		create: {
			userId: pendingSeller.id,
			status: SellerStatus.PENDING,
		},
	});

	await prisma.sellerApplication.deleteMany({
		where: { sellerProfileId: pendingSellerProfile.id },
	});

	await prisma.sellerApplication.create({
		data: {
			sellerProfileId: pendingSellerProfile.id,
			businessName: 'Pending Crafts Douala',
			description: 'Awaiting administrator review.',
			contactPhone: '+237699000001',
			contactEmail: pendingSellerEmail,
			businessCity: 'Douala',
			businessRegion: 'Littoral',
			status: ApplicationStatus.SUBMITTED,
		},
	});

	const approvedSellerEmail = 'seller@trimnexa.local';
	const approvedSeller = await prisma.user.upsert({
		where: { email: approvedSellerEmail },
		update: {
			name: 'Approved Seller',
			firstName: 'Approved',
			lastName: 'Seller',
			status: UserStatus.ACTIVE,
			emailVerified: true,
		},
		create: {
			email: approvedSellerEmail,
			name: 'Approved Seller',
			firstName: 'Approved',
			lastName: 'Seller',
			status: UserStatus.ACTIVE,
			emailVerified: true,
			locale: 'en',
			roles: {
				create: [{ role: Role.CUSTOMER }, { role: Role.SELLER }],
			},
		},
	});

	await ensureAdminCredentialAccount(approvedSeller.id, 'ChangeMe123!');
	await prisma.customerProfile.upsert({
		where: { userId: approvedSeller.id },
		update: {},
		create: { userId: approvedSeller.id },
	});

	await prisma.userRoleAssignment.upsert({
		where: {
			userId_role: {
				userId: approvedSeller.id,
				role: Role.SELLER,
			},
		},
		update: {},
		create: {
			userId: approvedSeller.id,
			role: Role.SELLER,
		},
	});

	const approvedSellerProfile = await prisma.sellerProfile.upsert({
		where: { userId: approvedSeller.id },
		update: {
			status: SellerStatus.APPROVED,
			shopName: 'Yaoundé Home Goods',
			shopSlug: 'yaounde-home-goods',
			description: 'Household essentials for families in Yaoundé.',
			shopPhone: '+237699000002',
			addressLine1: '12 Avenue Kennedy',
			city: 'Yaoundé',
			region: 'Centre',
			country: 'CM',
			onboardingCompletedAt: new Date(),
		},
		create: {
			userId: approvedSeller.id,
			status: SellerStatus.APPROVED,
			shopName: 'Yaoundé Home Goods',
			shopSlug: 'yaounde-home-goods',
			description: 'Household essentials for families in Yaoundé.',
			shopPhone: '+237699000002',
			addressLine1: '12 Avenue Kennedy',
			city: 'Yaoundé',
			region: 'Centre',
			country: 'CM',
			onboardingCompletedAt: new Date(),
		},
	});

	await prisma.sellerApplication.deleteMany({
		where: { sellerProfileId: approvedSellerProfile.id },
	});

	await prisma.sellerApplication.create({
		data: {
			sellerProfileId: approvedSellerProfile.id,
			businessName: 'Yaoundé Home Goods',
			description: 'Approved seed seller for development testing.',
			contactPhone: '+237699000002',
			contactEmail: approvedSellerEmail,
			businessCity: 'Yaoundé',
			businessRegion: 'Centre',
			status: ApplicationStatus.APPROVED,
			reviewedAt: new Date(),
			reviewedById: adminUser.id,
		},
	});

	const kitchenCategory = await prisma.category.findUniqueOrThrow({ where: { slug: 'kitchen' } });

	await prisma.product.upsert({
		where: { slug: 'bamboo-cutting-board' },
		update: {
			sellerProfileId: approvedSellerProfile.id,
			categoryId: kitchenCategory.id,
			title: 'Bamboo Cutting Board',
			description: 'Durable bamboo cutting board for everyday kitchen use.',
			priceMinor: 8500n,
			stockQty: 12,
			status: 'ACTIVE',
			reviewedAt: new Date(),
			reviewedById: adminUser.id,
		},
		create: {
			sellerProfileId: approvedSellerProfile.id,
			categoryId: kitchenCategory.id,
			title: 'Bamboo Cutting Board',
			slug: 'bamboo-cutting-board',
			description: 'Durable bamboo cutting board for everyday kitchen use.',
			priceMinor: 8500n,
			stockQty: 12,
			status: 'ACTIVE',
			submittedAt: new Date(),
			reviewedAt: new Date(),
			reviewedById: adminUser.id,
		},
	});

	await prisma.product.upsert({
		where: { slug: 'ceramic-mixing-bowl-draft' },
		update: {
			sellerProfileId: approvedSellerProfile.id,
			categoryId: kitchenCategory.id,
			title: 'Ceramic Mixing Bowl',
			description: 'Draft product awaiting seller images and submission.',
			priceMinor: 4500n,
			stockQty: 5,
			status: 'DRAFT',
		},
		create: {
			sellerProfileId: approvedSellerProfile.id,
			categoryId: kitchenCategory.id,
			title: 'Ceramic Mixing Bowl',
			slug: 'ceramic-mixing-bowl-draft',
			description: 'Draft product awaiting seller images and submission.',
			priceMinor: 4500n,
			stockQty: 5,
			status: 'DRAFT',
		},
	});

	await prisma.auditLog.create({
		data: {
			action: 'seed.executed',
			entityType: 'seed',
			entityId: 'phase-7',
			actorId: adminUser.id,
			metadata: {
				categories: categorySeeds.length + subcategorySeeds.length,
				sellerSeeds: 2,
				productSeeds: 2,
				note: 'Development seed data only — change admin credentials before production.',
			},
		},
	});

	console.log('Seed complete.');
	console.log(`Admin login: ${adminEmail} / ${adminPassword} (override with SEED_ADMIN_PASSWORD)`);
	console.log(`Pending seller: ${pendingSellerEmail} / ChangeMe123!`);
	console.log(`Approved seller: ${approvedSellerEmail} / ChangeMe123!`);
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
