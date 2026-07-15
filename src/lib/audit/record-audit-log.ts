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
	SELLER_APPLICATION_REVIEW_STARTED: 'seller.application.review_started',
	SELLER_APPLICATION_APPROVED: 'seller.application.approved',
	SELLER_APPLICATION_REJECTED: 'seller.application.rejected',
	SELLER_SUSPENDED: 'seller.suspended',
	SELLER_REACTIVATED: 'seller.reactivated',
	PRODUCT_APPROVED: 'product.approved',
	PRODUCT_REJECTED: 'product.rejected',
	PRODUCT_SUSPENDED: 'product.suspended',
	CATEGORY_UPDATED: 'category.updated',
	PASSWORD_RESET_REQUESTED: 'password.reset.requested',
	PASSWORD_RESET_COMPLETED: 'password.reset.completed',
} as const;
