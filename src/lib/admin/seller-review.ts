import { ApplicationStatus, SellerStatus } from '@prisma/client';

export type SellerReviewErrorCode =
	'not_found' | 'already_reviewed' | 'invalid_transition' | 'profile_suspended';

export function getApprovalBlockReason(input: {
	profileStatus: SellerStatus;
	applicationStatus: ApplicationStatus | null;
}): SellerReviewErrorCode | null {
	if (!input.applicationStatus) {
		return 'not_found';
	}

	if (
		input.applicationStatus === ApplicationStatus.APPROVED ||
		input.applicationStatus === ApplicationStatus.REJECTED
	) {
		return 'already_reviewed';
	}

	if (input.profileStatus === SellerStatus.SUSPENDED) {
		return 'invalid_transition';
	}

	if (
		input.applicationStatus !== ApplicationStatus.SUBMITTED &&
		input.applicationStatus !== ApplicationStatus.UNDER_REVIEW
	) {
		return 'invalid_transition';
	}

	return null;
}

export function getRejectionBlockReason(input: {
	profileStatus: SellerStatus;
	applicationStatus: ApplicationStatus | null;
}): SellerReviewErrorCode | null {
	return getApprovalBlockReason(input);
}
