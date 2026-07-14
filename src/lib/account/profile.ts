import { prisma } from '@/lib/db';
import type { ProfileUpdateInput } from '@/lib/account/validation';

export interface CustomerProfileView {
	id: string;
	email: string;
	firstName: string | null;
	lastName: string | null;
	name: string | null;
	phone: string | null;
	locale: string;
}

export async function getCustomerProfile(userId: string): Promise<CustomerProfileView | null> {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			email: true,
			firstName: true,
			lastName: true,
			name: true,
			phone: true,
			locale: true,
		},
	});

	return user;
}

export async function updateCustomerProfile(
	userId: string,
	input: ProfileUpdateInput,
): Promise<CustomerProfileView> {
	const fullName = [input.firstName, input.lastName?.trim()].filter(Boolean).join(' ');

	return prisma.user.update({
		where: { id: userId },
		data: {
			firstName: input.firstName,
			lastName: input.lastName?.trim() || null,
			name: fullName,
			phone: input.phone?.trim() || null,
			locale: input.locale,
		},
		select: {
			id: true,
			email: true,
			firstName: true,
			lastName: true,
			name: true,
			phone: true,
			locale: true,
		},
	});
}
