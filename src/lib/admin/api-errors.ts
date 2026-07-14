import type { SellerAdminActionErrorCode } from '@/lib/admin/sellers';

const ERROR_STATUS: Record<SellerAdminActionErrorCode, number> = {
	not_found: 404,
	already_reviewed: 409,
	invalid_transition: 409,
	profile_suspended: 409,
};

export function sellerActionErrorResponse(code: SellerAdminActionErrorCode): Response {
	return new Response(JSON.stringify({ error: code }), {
		status: ERROR_STATUS[code],
		headers: { 'Content-Type': 'application/json' },
	});
}
