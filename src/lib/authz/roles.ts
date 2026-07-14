import type { Role } from '@prisma/client';

export function hasRole(roles: Role[], required: Role): boolean {
	return roles.includes(required);
}

export function hasAnyRole(roles: Role[], required: Role[]): boolean {
	return required.some((role) => roles.includes(role));
}

export function hasAllRoles(roles: Role[], required: Role[]): boolean {
	return required.every((role) => roles.includes(role));
}

export function canAccessSellerArea(roles: Role[]): boolean {
	return hasAnyRole(roles, ['SELLER', 'ADMINISTRATOR', 'STAFF']);
}

export function canAccessAdminArea(roles: Role[]): boolean {
	return hasAnyRole(roles, ['ADMINISTRATOR', 'STAFF']);
}
