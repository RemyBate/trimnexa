# Application Routes

[← Documentation index](./README.md)

Complete route structure for the Trimnexa marketplace. Routes are implemented incrementally per [ROADMAP.md](./ROADMAP.md).

**Architecture:** [ARCHITECTURE.md](./ARCHITECTURE.md) · **Auth evaluation:** [ARCHITECTURE.md#authentication-evaluation-phase-4](./ARCHITECTURE.md#authentication-evaluation-phase-4)

## Route conventions

- File-based routing under `src/pages/` (Astro)
- Private routes (account, seller, admin) receive `noindex` meta tags and server-side auth gates (Phase 4)
- API routes under `src/pages/api/` perform authorization checks on every mutating request
- Locale prefix (`/en`, `/fr`) may be added depending on i18n decision — see [ARCHITECTURE.md](./ARCHITECTURE.md#localization)

---

## Public routes

| Route                  | Purpose                  |
| ---------------------- | ------------------------ |
| `/`                    | Homepage                 |
| `/products`            | Product listing          |
| `/products/[slug]`     | Product detail           |
| `/categories`          | Category index           |
| `/categories/[slug]`   | Category products        |
| `/shops`               | Shop directory           |
| `/shops/[slug]`        | Seller shop page         |
| `/search`              | Search results           |
| `/deals`               | Promotions and deals     |
| `/about`               | About Trimnexa           |
| `/contact`             | Contact form             |
| `/help`                | Help centre              |
| `/become-a-seller`     | Seller recruitment       |
| `/privacy`             | Privacy policy           |
| `/terms`               | Terms and conditions     |
| `/returns`             | Return policy            |
| `/seller-policy`       | Seller policy            |
| `/prohibited-products` | Prohibited products list |

---

## Authentication routes

| Route                   | Purpose                  |
| ----------------------- | ------------------------ |
| `/auth/login`           | Login                    |
| `/auth/register`        | Registration             |
| `/auth/forgot-password` | Password reset request   |
| `/auth/reset-password`  | Password reset           |
| `/auth/verify`          | Email/phone verification |
| `/auth/logout`          | Logout                   |

---

## Customer routes

| Route                    | Purpose             |
| ------------------------ | ------------------- |
| `/account`               | Account dashboard   |
| `/account/profile`       | Profile management  |
| `/account/addresses`     | Delivery addresses  |
| `/account/orders`        | Order history       |
| `/account/orders/[id]`   | Order detail        |
| `/account/wishlist`      | Saved products      |
| `/account/reviews`       | Customer reviews    |
| `/account/notifications` | Notification centre |
| `/account/support`       | Support tickets     |

---

## Cart and checkout routes

| Route               | Purpose            |
| ------------------- | ------------------ |
| `/cart`             | Shopping cart      |
| `/checkout`         | Checkout flow      |
| `/checkout/success` | Order confirmation |
| `/checkout/failed`  | Payment failure    |

---

## Seller routes

| Route                   | Purpose                  |
| ----------------------- | ------------------------ |
| `/seller`               | Seller dashboard         |
| `/seller/application`   | Seller application       |
| `/seller/onboarding`    | Post-approval onboarding |
| `/seller/shop`          | Shop profile             |
| `/seller/products`      | Product list             |
| `/seller/products/new`  | Create product           |
| `/seller/products/[id]` | Edit product             |
| `/seller/orders`        | Order list               |
| `/seller/orders/[id]`   | Order detail             |
| `/seller/earnings`      | Earnings overview        |
| `/seller/payouts`       | Payout history           |
| `/seller/analytics`     | Sales analytics          |
| `/seller/settings`      | Shop settings            |
| `/seller/support`       | Seller support           |

---

## Administrator routes

| Route                  | Purpose                    |
| ---------------------- | -------------------------- |
| `/admin`               | Admin dashboard            |
| `/admin/sellers`       | Seller management          |
| `/admin/sellers/[id]`  | Seller detail              |
| `/admin/products`      | Product moderation         |
| `/admin/products/[id]` | Product detail             |
| `/admin/categories`    | Category management        |
| `/admin/orders`        | Order management           |
| `/admin/orders/[id]`   | Order detail               |
| `/admin/customers`     | Customer management        |
| `/admin/payments`      | Payment records            |
| `/admin/commissions`   | Commission configuration   |
| `/admin/payouts`       | Payout management          |
| `/admin/refunds`       | Refund management          |
| `/admin/returns`       | Return requests            |
| `/admin/disputes`      | Dispute management         |
| `/admin/support`       | Support tickets            |
| `/admin/content`       | Banners and static content |
| `/admin/settings`      | Platform settings          |
| `/admin/audit-logs`    | Audit log viewer           |

---

## API routes (planned)

API endpoints under `src/pages/api/` must perform authorization checks on every mutating request.

| Route                       | Purpose                                             | Phase |
| --------------------------- | --------------------------------------------------- | ----- |
| `/api/auth/*`               | Better Auth handler (via middleware)                | 4     |
| `/api/auth/redirect-target` | Post-login redirect helper                          | 4     |
| `/api/webhooks/payments`    | Payment webhooks; signature-verified and idempotent | 11    |
| `/api/cart/*`               | Cart operations (if not handled in page actions)    | 9     |
| `/api/checkout/*`           | Checkout and order creation                         | 10    |
| `/api/uploads/*`            | File upload handling with validation                | 7     |

Additional API routes will be added as needed. All must:

- Validate input server-side
- Check authorization before mutating data
- Never trust client-submitted prices, roles, or commission amounts
- Return appropriate HTTP status codes and error messages

---

## Route protection summary

| Area            | Auth required | Role                  |
| --------------- | ------------- | --------------------- |
| Public routes   | No            | Guest                 |
| Auth routes     | Varies        | Guest / authenticated |
| Customer routes | Yes           | Customer              |
| Seller routes   | Yes           | Approved seller       |
| Admin routes    | Yes           | Administrator         |
| API (mutating)  | Yes           | Matching role         |

See [SECURITY.md](./SECURITY.md) for authorization requirements.

---

## Related documents

- [PRD.md](./PRD.md) — User roles and route capabilities
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Middleware, auth layer, and folder structure
- [SECURITY.md](./SECURITY.md) — Route protection and authorization
- [UI-DESIGN.md](./UI-DESIGN.md) — Navigation and layout planning
- [ROADMAP.md](./ROADMAP.md) — Implementation phases
