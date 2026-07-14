import { Role } from '@prisma/client';

/**
 * Roles granted automatically on self-service registration.
 * Browser-submitted role values are never trusted.
 */
export const DEFAULT_SIGNUP_ROLES = [Role.CUSTOMER] as const;

export function isDefaultSignupRole(role: Role): boolean {
	return DEFAULT_SIGNUP_ROLES.includes(role as (typeof DEFAULT_SIGNUP_ROLES)[number]);
}
