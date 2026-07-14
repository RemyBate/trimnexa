import { describe, expect, it } from 'vitest';

import { parsePagination } from '@/lib/validation';

describe('validation utilities', () => {
	it('parses pagination with defaults', () => {
		expect(parsePagination({})).toEqual({ page: 1, pageSize: 20 });
	});

	it('coerces pagination values', () => {
		expect(parsePagination({ page: '2', pageSize: '50' })).toEqual({
			page: 2,
			pageSize: 50,
		});
	});

	it('rejects invalid page size', () => {
		expect(() => parsePagination({ pageSize: 500 })).toThrow();
	});
});
