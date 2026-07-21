import { AuditActions, recordAuditLog } from '@/lib/audit/record-audit-log';
import {
	listCategoriesForAdmin,
	setCategoryActive,
	type AdminCategoryView,
} from '@/lib/product/categories';

export async function updateCategoryActiveStatus(
	categoryId: string,
	isActive: boolean,
	adminUserId: string,
): Promise<AdminCategoryView | null> {
	const updated = await setCategoryActive(categoryId, isActive);

	if (!updated) {
		return null;
	}

	await recordAuditLog({
		action: AuditActions.CATEGORY_UPDATED,
		entityType: 'category',
		entityId: categoryId,
		actorId: adminUserId,
		metadata: { isActive },
	});

	return updated;
}

export { listCategoriesForAdmin };
