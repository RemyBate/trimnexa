# Financial data handling (Phase 3)

[← Documentation index](./README.md)

Server-side rules for money in Trimnexa. See also [DATABASE.md](./DATABASE.md#money-handling).

## Implementation

| Rule                              | Location                                                       |
| --------------------------------- | -------------------------------------------------------------- |
| Integer minor units (centimes)    | `src/lib/money.ts`                                             |
| Default currency XAF              | `src/lib/money.ts` (`DEFAULT_CURRENCY`)                        |
| No floating-point money math      | `MoneyAmount.amountMinor` is `bigint`                          |
| Commission default (basis points) | `site_settings.default_commission_rate_bps` (seed: 1000 = 10%) |

## Server-only

- All price, commission, and payout calculations must run on the server (Phase 10+).
- Order snapshots will store amounts as integers when order tables are added (Phase 10).
- Ledger entries will be immutable when `SellerLedgerEntry` is added (Phase 13).

## Phase 3 scope

Phase 3 establishes utilities and settings — not live checkout or payment processing.
