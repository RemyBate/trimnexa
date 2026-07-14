import type { CustomerOrderStatus } from '@prisma/client';

import { formatMoney, xafFromMinor } from '@/lib/money';
import { prisma } from '@/lib/db';

export interface CustomerOrderView {
	id: string;
	orderNumber: string;
	status: CustomerOrderStatus;
	totalFormatted: string;
	placedAt: Date | null;
}

export async function listCustomerOrders(userId: string): Promise<CustomerOrderView[]> {
	const orders = await prisma.customerOrder.findMany({
		where: { userId },
		orderBy: [{ placedAt: 'desc' }, { createdAt: 'desc' }],
	});

	return orders.map((order) => ({
		id: order.id,
		orderNumber: order.orderNumber,
		status: order.status,
		totalFormatted: formatMoney(xafFromMinor(order.totalMinor)),
		placedAt: order.placedAt,
	}));
}

export async function countCustomerOrders(userId: string): Promise<number> {
	return prisma.customerOrder.count({ where: { userId } });
}
