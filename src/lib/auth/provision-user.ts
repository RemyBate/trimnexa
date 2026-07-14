import { Role, UserStatus } from '@prisma/client';

import { DEFAULT_SIGNUP_ROLES } from '@/lib/auth/roles';
import { prisma } from '@/lib/db';

/**
 * Assigns marketplace roles and customer profile after Better Auth creates a user.
 * Rolls back the user record if provisioning fails to avoid partial accounts.
 */
export async function provisionMarketplaceUser(userId: string): Promise<void> {
	try {
		await prisma.$transaction(async (tx) => {
			for (const role of DEFAULT_SIGNUP_ROLES) {
				await tx.userRoleAssignment.upsert({
					where: {
						userId_role: {
							userId,
							role,
						},
					},
					update: {},
					create: {
						userId,
						role,
					},
				});
			}

			await tx.customerProfile.upsert({
				where: { userId },
				update: {},
				create: { userId },
			});

			const profile = await tx.customerProfile.findUniqueOrThrow({
				where: { userId },
			});

			await tx.wishlist.upsert({
				where: { customerProfileId: profile.id },
				update: {},
				create: { customerProfileId: profile.id },
			});

			await tx.notification.create({
				data: {
					userId,
					type: 'ACCOUNT',
					title: 'Welcome to Trimnexa',
					body: 'Your customer account is ready. Complete your profile and save delivery addresses for faster checkout.',
				},
			});

			await tx.user.update({
				where: { id: userId },
				data: { status: UserStatus.ACTIVE },
			});
		});
	} catch (error) {
		await prisma.user.delete({ where: { id: userId } }).catch(() => undefined);

		if (import.meta.env.DEV) {
			console.error('[auth] Failed to provision marketplace user after sign-up', {
				userId,
				roles: DEFAULT_SIGNUP_ROLES,
				error,
			});
		}

		throw error;
	}
}

export function isCustomerRole(role: Role): boolean {
	return role === Role.CUSTOMER;
}
