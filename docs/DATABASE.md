# Database Design

[← Documentation index](./README.md)

Database planning for Trimnexa. Schema implementation begins in Phase 3.

**Planned stack:** PostgreSQL + Prisma ORM — see [ARCHITECTURE.md](./ARCHITECTURE.md)

**Financial flows:** [PAYMENTS.md](./PAYMENTS.md) · **Product context:** [PRD.md](./PRD.md)

## Design principles

- Normalized relational schema
- ACID transactions for order and financial operations
- Immutable financial records (ledger entries, order snapshots)
- Reversible migrations with review before applying
- Database indexes on frequently queried columns
- No floating-point money types

---

## Core entities

A normalized database design will be created during Phase 3.

### Users and access

| Entity                       | Purpose                                           |
| ---------------------------- | ------------------------------------------------- |
| `User`                       | Base user account                                 |
| `UserSession`                | Active sessions                                   |
| `UserRole`                   | Role assignments (customer, seller, admin, staff) |
| `CustomerProfile`            | Customer-specific data                            |
| `SellerProfile`              | Seller-specific data                              |
| `SellerApplication`          | Seller application workflow                       |
| `SellerVerificationDocument` | Identity and business documents                   |

### Shops and catalogue

| Entity                  | Purpose                              |
| ----------------------- | ------------------------------------ |
| `Store`                 | Seller shop profile                  |
| `StoreAddress`          | Shop physical address                |
| `Category`              | Product categories and subcategories |
| `Product`               | Product listings                     |
| `ProductImage`          | Product images                       |
| `ProductVariant`        | Size, colour, etc.                   |
| `ProductAttribute`      | Attribute definitions                |
| `ProductAttributeValue` | Attribute values per product         |
| `Inventory`             | Stock levels                         |
| `InventoryAdjustment`   | Stock change history                 |

### Shopping

| Entity         | Purpose                     |
| -------------- | --------------------------- |
| `Cart`         | Shopping cart               |
| `CartItem`     | Items in cart               |
| `Wishlist`     | Customer wishlist           |
| `WishlistItem` | Items in wishlist           |
| `Address`      | Customer delivery addresses |

### Orders

| Entity                  | Purpose                           |
| ----------------------- | --------------------------------- |
| `Order`                 | Parent marketplace order          |
| `OrderItem`             | Line items (with price snapshots) |
| `OrderStatusHistory`    | Status transition audit trail     |
| `Shipment`              | Shipment records                  |
| `DeliveryStatusHistory` | Delivery status transitions       |

### Payments and finance

| Entity                | Purpose                                 |
| --------------------- | --------------------------------------- |
| `Payment`             | Payment records                         |
| `PaymentTransaction`  | Provider transaction details            |
| `PaymentWebhookEvent` | Webhook event log (idempotency)         |
| `Commission`          | Commission rules and calculated amounts |
| `SellerLedgerEntry`   | Immutable seller financial entries      |
| `SellerBalance`       | Derived balance (pending, available)    |
| `SellerPayout`        | Payout records                          |

### Engagement

| Entity          | Purpose                |
| --------------- | ---------------------- |
| `Coupon`        | Discount coupons       |
| `CouponUsage`   | Coupon usage tracking  |
| `Review`        | Product/seller reviews |
| `ReviewImage`   | Review images          |
| `ReturnRequest` | Return requests        |
| `Refund`        | Refund records         |
| `Dispute`       | Dispute cases          |

### Platform

| Entity               | Purpose                           |
| -------------------- | --------------------------------- |
| `Notification`       | In-app notifications              |
| `SupportTicket`      | Support tickets                   |
| `SupportMessage`     | Ticket messages                   |
| `AuditLog`           | Sensitive action audit trail      |
| `SiteSetting`        | Platform configuration            |
| `Banner`             | Promotional banners               |
| `FeaturedProduct`    | Featured product placements       |
| `TranslationContent` | Translatable content where needed |

---

## Key relationships

```
User ──1:1── CustomerProfile
User ──1:1── SellerProfile
User ──1:N── UserRole
User ──1:N── Address

SellerProfile ──1:1── Store
Store ──1:N── Product
Product ──1:N── ProductImage
Product ──1:N── ProductVariant
Product ──N:1── Category

CustomerProfile ──1:1── Cart ──1:N── CartItem ──N:1── Product
CustomerProfile ──1:N── Order ──1:N── OrderItem
Order ──1:N── Payment
OrderItem ──N:1── SellerProfile (via suborder grouping)

SellerProfile ──1:N── SellerLedgerEntry
SellerLedgerEntry ── derives ── SellerBalance
SellerProfile ──1:N── SellerPayout
```

### Order structure

- **One parent `Order`** per customer checkout
- **Seller suborders** (fulfilment groups) — one per seller within the parent order
- `OrderItem` records snapshot product title, price, commission rate, and seller at time of purchase

---

## Product statuses

`DRAFT`, `PENDING_REVIEW`, `APPROVED`, `REJECTED`, `ACTIVE`, `OUT_OF_STOCK`, `SUSPENDED`, `ARCHIVED`

---

## Order statuses

`PENDING_PAYMENT`, `PAYMENT_PROCESSING`, `PAID`, `CONFIRMED`, `PREPARING`, `READY_FOR_PICKUP`, `SHIPPED`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`, `RETURN_REQUESTED`, `RETURNED`, `PARTIALLY_REFUNDED`, `REFUNDED`, `DISPUTED`

Status transitions are controlled and recorded in `OrderStatusHistory`.

---

## Money handling

### Rules

- **Never** use floating-point numbers for money
- Store amounts as **integer minor units** (centimes) or safe `Decimal` database types
- Always store **currency explicitly** (`XAF` for initial launch)
- Preserve product title, price, commission, and seller information at time of purchase
- Do not recalculate historical orders using current product prices
- Record seller earnings through **immutable ledger entries**
- Do not simply overwrite balances — derive from ledger
- Keep payment-provider transaction identifiers
- Make payment webhook processing **idempotent**
- Prevent duplicate payment processing
- Use **database transactions** for critical order and financial operations

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

- Configurable marketplace commission (global rate first)
- Future: category-specific, seller-specific, promotional rates
- Commission calculated per order item at checkout
- Recorded in order snapshot and `Commission` / `SellerLedgerEntry`
- Trimnexa retains commission; seller receives net amount after fulfilment

See [PAYMENTS.md](./PAYMENTS.md) for payout flow.

---

## Seller balances

### Balance states

| State         | Description                                           |
| ------------- | ----------------------------------------------------- |
| **Pending**   | Earnings from paid orders not yet fulfilled/delivered |
| **Available** | Earnings released after delivery confirmation         |
| **Paid out**  | Amounts transferred to seller via payout              |

### Ledger rules

- `SellerLedgerEntry` records are **immutable**
- Each entry: type (sale, commission, refund, adjustment, payout), amount, order reference, timestamp
- `SellerBalance` is derived from ledger entries, never directly overwritten
- Refunds create reversal entries
- Payouts cannot exceed available balance

---

## Future migrations

- Schema changes via Prisma migrations
- Review every migration before applying
- Test migrations on clean database and with seed data
- Document breaking changes in [CHANGELOG.md](./CHANGELOG.md)
- Never delete migration history
- Plan for:
  - Multi-currency support (post-MVP)
  - Multi-country expansion
  - Delivery-partner entities
  - Staff role permissions
  - Warehouse/inventory locations

---

## Related documents

- [PRD.md](./PRD.md) — Product requirements and success metrics
- [ARCHITECTURE.md](./ARCHITECTURE.md) — ORM, high-level architecture, and database client setup
- [PAYMENTS.md](./PAYMENTS.md) — Payment flow, commission, and ledger integration
- [SECURITY.md](./SECURITY.md) — Data protection and audit logs
- [ROADMAP.md](./ROADMAP.md) — Phase 3 and Phase 13 implementation tasks
- [DECISIONS.md](./DECISIONS.md) — Database and ORM decisions
