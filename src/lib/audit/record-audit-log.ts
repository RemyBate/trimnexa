import type { Prisma } from '@prisma/client';

import { prisma } from '@/lib/db';

export interface AuditLogInput {
	action: string;
	entityType?: string;
	entityId?: string;
	actorId?: string;
	metadata?: Prisma.InputJsonValue;
	ipAddress?: string;
	userAgent?: string;
}

/**
 * Records an immutable audit log entry for sensitive actions.
 */
export async function recordAuditLog(input: AuditLogInput) {
	return prisma.auditLog.create({
		data: {
			action: input.action,
			entityType: input.entityType,
			entityId: input.entityId,
			actorId: input.actorId,
			metadata: input.metadata,
			ipAddress: input.ipAddress,
			userAgent: input.userAgent,
		},
	});
}

export const AuditActions = {
	USER_SUSPENDED: 'user.suspended',
	USER_REACTIVATED: 'user.reactivated',
	SETTING_UPDATED: 'setting.updated',
	SEED_EXECUTED: 'seed.executed',
} as const;
