# Payments

[← Documentation index](./README.md)

Payment planning for Trimnexa. Integration begins in Phase 11.

**Currency:** XAF / FCFA · **Data model:** [DATABASE.md](./DATABASE.md) · **Security:** [SECURITY.md](./SECURITY.md)

---

## Payment overview

Payments must be designed around Cameroon market realities. The platform collects customer payments, records marketplace commission, and tracks seller earnings for payout.

---

## Payment flow

```
    → Create parent order + seller suborders (price snapshots)
    → Initiate payment with selected provider
    → Provider confirms via verified webhook (NOT browser redirect alone)
    → Order status → PAID
    → Seller earnings recorded as PENDING
    → Seller fulfils order
    → Delivery confirmed
    → Earnings move PENDING → AVAILABLE (minus commission)
    → Payout processed per platform policy
```

### Amounts tracked per order

- Gross product amount
- Delivery amount
- Discount amount
- Payment-processing fee
- Marketplace commission
- Taxes (where applicable)
- Refund amount
- Seller net amount

---

## Commission model

### Primary revenue

Marketplace commission on successfully completed sales.

### Commission flow

1. Customer purchases product(s)
2. Payment confirmed
3. Order fulfilled and delivery confirmed
4. Trimnexa calculates commission per order item
5. Commission recorded; seller net amount moves to available balance

### Commission configuration (planned)

| Level             | Description                           | Phase    |
| ----------------- | ------------------------------------- | -------- |
| Global            | Default marketplace rate              | 13       |
| Category-specific | Different rates per category          | Post-MVP |
| Seller-specific   | Negotiated rates for specific sellers | Post-MVP |
| Promotional       | Temporary reduced rates               | Post-MVP |

Commission must be configurable. Store rate used at time of purchase in order snapshot.

### Commission options

- Percentage-based fees
- Fixed fees (where required)
- Basis points or decimal representation — never floating-point

---

## Seller payouts

### Payout policy

Seller earnings are **not released immediately after checkout**.

| Stage     | Condition                                   |
| --------- | ------------------------------------------- |
| Pending   | Payment confirmed; order not yet delivered  |
| Available | Delivery confirmed; commission deducted     |
| Paid out  | Administrator or automated payout processed |

### MVP payout model

If the payment provider does not support automatic marketplace splits, use **administrator-reviewed payouts**:

1. Customer pays Trimnexa (platform merchant account)
2. Ledger records seller obligations accurately
3. Administrator reviews and processes payouts per platform policy
4. Payout records created with audit trail

Do not implement an unlicensed informal escrow system. Financial flows must follow the payment provider's supported model and applicable law.

### Payout requirements

- Sellers cannot manipulate earnings
- Payouts cannot exceed available balance
- All payout actions audited
- Payout history visible to sellers and administrators

See [DATABASE.md](./DATABASE.md) for ledger and balance entities.

---

## Payment providers (Cameroon)

Research and selection in Phase 11. Do not select without verifying:

- Cameroon availability
- Business onboarding requirements
- Webhook support
- Refund support
- Production API documentation
- Settlement rules
- Marketplace or split-payment support
- Seller-payout support
- Supported currencies
- Transaction fees
- Legal restrictions

### Candidates for evaluation

| Provider          | Notes                                                                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **CamPay**        | Aggregator for MTN and Orange Mobile Money in Cameroon; single API for both networks                                               |
| **MTN MoMo API**  | Direct integration via [momodeveloper.mtn.com](https://momodeveloper.mtn.com); available in Cameroon; requires business onboarding |
| **Orange WebPay** | Direct integration via Orange Developer; merchant KYA compliance required; available in Cameroon                                   |

### Mobile Money

MTN Mobile Money and Orange Money are the dominant payment methods in Cameroon. The MVP should support at least one integration path covering mobile money payments.

### Bank cards

Evaluate card payment support through chosen provider. May be secondary to mobile money for initial launch.

---

## Webhook handling

### Requirements

- Dedicated webhook endpoint: `/api/webhooks/payments`
- **Signature verification** on every webhook request
- **Idempotent processing** — duplicate events must not create duplicate payments or orders
- Store raw webhook events in `PaymentWebhookEvent` for audit
- Payment confirmation must not rely on browser redirects alone
- Failed webhook processing must be retryable and logged

### Webhook flow

```
Provider sends webhook
    → Verify signature
    → Check idempotency (event ID already processed?)
    → If duplicate: return 200, no action
    → If new: process in database transaction
        → Update payment status
        → Update order status
        → Record seller pending earnings
    → Return 200 to provider
```

---

## Refund strategy

### MVP foundation (Phase 11)

- Record refund intent and status
- Connect refunds to original payment transaction
- Create ledger reversal entries for seller earnings
- Administrator-initiated refunds if provider requires manual processing

### Full refund workflow (Phase 14)

- Customer return request → review → approval
- Refund processed through payment provider
- Ledger entries reversed
- Order status updated
- Notifications sent to customer and seller

---

## Financial safety

### Server-side rules

- All prices, totals, commissions calculated on the server
- Client-submitted prices are **ignored**
- Never trust payment status from browser alone
- Use database transactions for payment + order updates
- Keep provider transaction IDs for reconciliation

### Reconciliation

- Administrator payment view (Phase 11)
- Reports and reconciliation tools (Phase 13)
- Match provider records to internal ledger

### Secrets

- `PAYMENT_API_KEY` — provider API key
- `PAYMENT_WEBHOOK_SECRET` — webhook signature secret
- `PAYMENT_PROVIDER` — provider identifier

Never commit payment credentials. See [SECURITY.md](./SECURITY.md).

---

## Related documents

- [PRD.md](./PRD.md) — Business model and success metrics (commission revenue)
- [DATABASE.md](./DATABASE.md) — Financial entities, ledger, and order snapshots
- [ARCHITECTURE.md](./ARCHITECTURE.md) — High-level architecture and payment integration layer
- [SECURITY.md](./SECURITY.md) — Payment security and webhook verification
- [ROADMAP.md](./ROADMAP.md) — Phase 11 and Phase 13 tasks
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Production payment credentials
- [DECISIONS.md](./DECISIONS.md) — Payment provider selection (Phase 11)
