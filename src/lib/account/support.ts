import type { SupportTicketStatus } from '@prisma/client';

import { prisma } from '@/lib/db';
import type { SupportTicketInput } from '@/lib/account/validation';

export interface SupportTicketView {
	id: string;
	subject: string;
	status: SupportTicketStatus;
	createdAt: Date;
	updatedAt: Date;
	lastMessagePreview: string | null;
}

export interface SupportTicketDetailView extends SupportTicketView {
	messages: Array<{
		id: string;
		body: string;
		createdAt: Date;
		isMine: boolean;
	}>;
}

export async function listSupportTickets(userId: string): Promise<SupportTicketView[]> {
	const tickets = await prisma.supportTicket.findMany({
		where: { userId },
		orderBy: { updatedAt: 'desc' },
		include: {
			messages: {
				orderBy: { createdAt: 'desc' },
				take: 1,
			},
		},
	});

	return tickets.map((ticket) => ({
		id: ticket.id,
		subject: ticket.subject,
		status: ticket.status,
		createdAt: ticket.createdAt,
		updatedAt: ticket.updatedAt,
		lastMessagePreview: ticket.messages[0]?.body ?? null,
	}));
}

export async function getSupportTicket(
	userId: string,
	ticketId: string,
): Promise<SupportTicketDetailView | null> {
	const ticket = await prisma.supportTicket.findFirst({
		where: { id: ticketId, userId },
		include: {
			messages: {
				orderBy: { createdAt: 'asc' },
			},
		},
	});

	if (!ticket) {
		return null;
	}

	const lastMessage = ticket.messages.at(-1);

	return {
		id: ticket.id,
		subject: ticket.subject,
		status: ticket.status,
		createdAt: ticket.createdAt,
		updatedAt: ticket.updatedAt,
		lastMessagePreview: lastMessage?.body ?? null,
		messages: ticket.messages.map((message) => ({
			id: message.id,
			body: message.body,
			createdAt: message.createdAt,
			isMine: message.authorUserId === userId,
		})),
	};
}

export async function createSupportTicket(
	userId: string,
	input: SupportTicketInput,
): Promise<SupportTicketDetailView> {
	const ticket = await prisma.$transaction(async (tx) => {
		const created = await tx.supportTicket.create({
			data: {
				userId,
				subject: input.subject,
				messages: {
					create: {
						authorUserId: userId,
						body: input.message,
					},
				},
			},
			include: {
				messages: {
					orderBy: { createdAt: 'asc' },
				},
			},
		});

		await tx.notification.create({
			data: {
				userId,
				type: 'SUPPORT',
				title: 'Support request received',
				body: `We received your request "${input.subject}". Our team will respond soon.`,
			},
		});

		return created;
	});

	return {
		id: ticket.id,
		subject: ticket.subject,
		status: ticket.status,
		createdAt: ticket.createdAt,
		updatedAt: ticket.updatedAt,
		lastMessagePreview: ticket.messages.at(-1)?.body ?? null,
		messages: ticket.messages.map((message) => ({
			id: message.id,
			body: message.body,
			createdAt: message.createdAt,
			isMine: message.authorUserId === userId,
		})),
	};
}

export async function countOpenSupportTickets(userId: string): Promise<number> {
	return prisma.supportTicket.count({
		where: {
			userId,
			status: { in: ['OPEN', 'IN_PROGRESS'] },
		},
	});
}
