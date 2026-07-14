import { prisma } from '@/lib/db';
import type { AddressInput } from '@/lib/account/validation';

export interface CustomerAddressView {
	id: string;
	label: string;
	recipientName: string;
	phone: string;
	line1: string;
	line2: string | null;
	city: string;
	region: string;
	country: string;
	isDefault: boolean;
}

function mapAddress(address: {
	id: string;
	label: string;
	recipientName: string;
	phone: string;
	line1: string;
	line2: string | null;
	city: string;
	region: string;
	country: string;
	isDefault: boolean;
}): CustomerAddressView {
	return address;
}

export async function listCustomerAddresses(userId: string): Promise<CustomerAddressView[]> {
	const addresses = await prisma.customerAddress.findMany({
		where: { userId },
		orderBy: [{ isDefault: 'desc' }, { updatedAt: 'desc' }],
	});

	return addresses.map(mapAddress);
}

export async function getCustomerAddress(
	userId: string,
	addressId: string,
): Promise<CustomerAddressView | null> {
	const address = await prisma.customerAddress.findFirst({
		where: { id: addressId, userId },
	});

	return address ? mapAddress(address) : null;
}

async function clearDefaultAddresses(userId: string): Promise<void> {
	await prisma.customerAddress.updateMany({
		where: { userId, isDefault: true },
		data: { isDefault: false },
	});
}

export async function createCustomerAddress(
	userId: string,
	input: AddressInput,
): Promise<CustomerAddressView> {
	return prisma.$transaction(async (tx) => {
		if (input.isDefault) {
			await tx.customerAddress.updateMany({
				where: { userId, isDefault: true },
				data: { isDefault: false },
			});
		}

		const address = await tx.customerAddress.create({
			data: {
				userId,
				label: input.label,
				recipientName: input.recipientName,
				phone: input.phone,
				line1: input.line1,
				line2: input.line2?.trim() || null,
				city: input.city,
				region: input.region,
				country: input.country,
				isDefault: input.isDefault,
			},
		});

		const addressCount = await tx.customerAddress.count({ where: { userId } });
		if (addressCount === 1) {
			return tx.customerAddress.update({
				where: { id: address.id },
				data: { isDefault: true },
			});
		}

		return address;
	});
}

export async function updateCustomerAddress(
	userId: string,
	addressId: string,
	input: AddressInput,
): Promise<CustomerAddressView | null> {
	const existing = await prisma.customerAddress.findFirst({
		where: { id: addressId, userId },
	});

	if (!existing) {
		return null;
	}

	return prisma.$transaction(async (tx) => {
		if (input.isDefault) {
			await tx.customerAddress.updateMany({
				where: { userId, isDefault: true, NOT: { id: addressId } },
				data: { isDefault: false },
			});
		}

		return tx.customerAddress.update({
			where: { id: addressId },
			data: {
				label: input.label,
				recipientName: input.recipientName,
				phone: input.phone,
				line1: input.line1,
				line2: input.line2?.trim() || null,
				city: input.city,
				region: input.region,
				country: input.country,
				isDefault: input.isDefault,
			},
		});
	});
}

export async function deleteCustomerAddress(userId: string, addressId: string): Promise<boolean> {
	const existing = await prisma.customerAddress.findFirst({
		where: { id: addressId, userId },
	});

	if (!existing) {
		return false;
	}

	await prisma.$transaction(async (tx) => {
		await tx.customerAddress.delete({ where: { id: addressId } });

		if (existing.isDefault) {
			const nextDefault = await tx.customerAddress.findFirst({
				where: { userId },
				orderBy: { updatedAt: 'desc' },
			});

			if (nextDefault) {
				await tx.customerAddress.update({
					where: { id: nextDefault.id },
					data: { isDefault: true },
				});
			}
		}
	});

	return true;
}

export async function setDefaultCustomerAddress(
	userId: string,
	addressId: string,
): Promise<CustomerAddressView | null> {
	const existing = await prisma.customerAddress.findFirst({
		where: { id: addressId, userId },
	});

	if (!existing) {
		return null;
	}

	await clearDefaultAddresses(userId);

	return prisma.customerAddress.update({
		where: { id: addressId },
		data: { isDefault: true },
	});
}
