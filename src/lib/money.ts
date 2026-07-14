/**
 * Money utilities — all marketplace amounts use integer minor units (centimes).
 * Currency is stored explicitly alongside amounts (default XAF).
 * Never use floating-point arithmetic for money.
 */

export const DEFAULT_CURRENCY = 'XAF' as const;

export type CurrencyCode = typeof DEFAULT_CURRENCY;

export interface MoneyAmount {
	/** Amount in minor units (centimes for XAF). */
	amountMinor: bigint;
	currency: CurrencyCode;
}

export function xafFromMajor(majorUnits: number): bigint {
	if (!Number.isFinite(majorUnits)) {
		throw new Error('Invalid major unit amount');
	}

	return BigInt(Math.round(majorUnits));
}

export function xafFromMinor(minorUnits: bigint | number): MoneyAmount {
	return {
		amountMinor: typeof minorUnits === 'bigint' ? minorUnits : BigInt(minorUnits),
		currency: DEFAULT_CURRENCY,
	};
}

export function addMoney(a: MoneyAmount, b: MoneyAmount): MoneyAmount {
	assertSameCurrency(a, b);
	return { amountMinor: a.amountMinor + b.amountMinor, currency: a.currency };
}

export function subtractMoney(a: MoneyAmount, b: MoneyAmount): MoneyAmount {
	assertSameCurrency(a, b);
	return { amountMinor: a.amountMinor - b.amountMinor, currency: a.currency };
}

export function multiplyMoney(amount: MoneyAmount, factor: number): MoneyAmount {
	if (!Number.isFinite(factor) || factor < 0) {
		throw new Error('Invalid multiplication factor');
	}

	return {
		amountMinor: BigInt(Math.round(Number(amount.amountMinor) * factor)),
		currency: amount.currency,
	};
}

export function formatMoney(amount: MoneyAmount, locale = 'fr-CM'): string {
	const major = Number(amount.amountMinor);
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: amount.currency,
		maximumFractionDigits: 0,
	}).format(major);
}

function assertSameCurrency(a: MoneyAmount, b: MoneyAmount): void {
	if (a.currency !== b.currency) {
		throw new Error(`Currency mismatch: ${a.currency} vs ${b.currency}`);
	}
}
