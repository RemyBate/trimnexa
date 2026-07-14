import type { NotificationType } from '@prisma/client';

import { prisma } from '@/lib/db';

export interface NotificationView {
	id: string;
	type: NotificationType;
	title: string;
	body: string;
	readAt: Date | null;
	createdAt: Date;
}

export async function listNotifications(userId: string): Promise<NotificationView[]> {
	return prisma.notification.findMany({
		where: { userId },
		orderBy: { createdAt: 'desc' },
		select: {
			id: true,
			type: true,
			title: true,
			body: true,
			readAt: true,
			createdAt: true,
		},
	});
}

export async function countUnreadNotifications(userId: string): Promise<number> {
	return prisma.notification.count({
		where: { userId, readAt: null },
	});
}

export async function markNotificationRead(
	userId: string,
	notificationId: string,
): Promise<NotificationView | null> {
	const notification = await prisma.notification.findFirst({
		where: { id: notificationId, userId },
	});

	if (!notification) {
		return null;
	}

	return prisma.notification.update({
		where: { id: notificationId },
		data: { readAt: new Date() },
		select: {
			id: true,
			type: true,
			title: true,
			body: true,
			readAt: true,
			createdAt: true,
		},
	});
}

export async function createWelcomeNotification(userId: string): Promise<void> {
	await prisma.notification.create({
		data: {
			userId,
			type: 'ACCOUNT',
			title: 'Welcome to Trimnexa',
			body: 'Your customer account is ready. Browse sellers and save your delivery addresses for faster checkout.',
		},
	});
}
