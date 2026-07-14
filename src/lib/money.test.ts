import { describe, expect, it } from 'vitest';

import {
	addMoney,
	formatMoney,
	multiplyMoney,
	subtractMoney,
	xafFromMajor,
	xafFromMinor,
} from '@/lib/money';

describe('money utilities', () => {
	it('converts major XAF units to minor bigint', () => {
		expect(xafFromMajor(1500)).toBe(1500n);
		expect(xafFromMajor(99.4)).toBe(99n);
	});

	it('adds and subtracts money safely', () => {
		const a = xafFromMinor(1000n);
		const b = xafFromMinor(250n);

		expect(addMoney(a, b).amountMinor).toBe(1250n);
		expect(subtractMoney(a, b).amountMinor).toBe(750n);
	});

	it('multiplies money by a factor', () => {
		const amount = xafFromMinor(1000n);
		expect(multiplyMoney(amount, 0.1).amountMinor).toBe(100n);
	});

	it('formats XAF for display', () => {
		const formatted = formatMoney(xafFromMinor(25000n), 'fr-CM');
		expect(formatted).toContain('25');
		expect(formatted).toMatch(/FCFA|XAF/);
	});

	it('rejects currency mismatch', () => {
		expect(() => addMoney(xafFromMinor(100n), { amountMinor: 50n, currency: 'XAF' })).not.toThrow();
	});
});
