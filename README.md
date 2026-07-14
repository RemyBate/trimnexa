# Trimnexa

A trusted multi-vendor e-commerce marketplace for Cameroon. Trimnexa connects verified local sellers with customers through an original platform design, secure payments in XAF/FCFA, and bilingual support in English and French.

**Website:** [https://trimnexa.com](https://trimnexa.com) (domain purchased; production connection planned in Phase 20)

**Current project phase:** Phase 0 complete — Phase 1 (Project foundation) next, pending approval

**Last roadmap update:** 2026-07-14

---

## Table of contents

1. [Project status](#project-status)
2. [Vision](#vision)
3. [Marketplace concept](#marketplace-concept)
4. [Target users](#target-users)
5. [MVP scope](#mvp-scope)
6. [Non-MVP scope](#non-mvp-scope)
7. [Technology stack](#technology-stack)
8. [Architecture principles](#architecture-principles)
9. [Proposed folder structure](#proposed-folder-structure)
10. [Route structure](#route-structure)
11. [Core database entities](#core-database-entities)
12. [Order and payment concepts](#order-and-payment-concepts)
13. [Security principles](#security-principles)
14. [Localization](#localization)
15. [Design principles](#design-principles)
16. [Development setup](#development-setup)
17. [Available commands](#available-commands)
18. [Environment variables](#environment-variables)
19. [Development roadmap](#development-roadmap)
20. [Definition of done](#definition-of-done)
21. [Current phase](#current-phase)
22. [Decision log](#decision-log)
23. [Known risks](#known-risks)
24. [Deployment plan](#deployment-plan)
25. [Future roadmap](#future-roadmap)
26. [AI-assisted development rules](#ai-assisted-development-rules)
27. [Licence and copyright](#licence-and-copyright)

---

## Project status

| Item | Status |
|------|--------|
| Framework | Astro `^7.0.9` |
| Language | TypeScript (strict) |
| Node.js | `>=22.12.0` |
| Output mode | Static (default; no deployment adapter installed) |
| Dependencies | `astro` only |
| Database | Not configured |
| Authentication | Not configured |
| Marketplace features | Not started |

The project was restarted from a prior Next.js/Prisma prototype. The repository currently contains the Astro basics starter template:

```
/
├── public/
│   ├── favicon.ico
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   └── Welcome.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

Phase 0 is documentation only. No marketplace pages, database models, authentication, or deployment adapter have been added.

---

## Vision

Trimnexa will be a trusted multi-vendor online marketplace designed initially for Cameroon.

The platform connects:

- **Customers** looking for reliable products
- **Verified local sellers** offering goods through their own shops
- **Delivery partners** (future expansion)
- **Trimnexa administrators and support staff** who maintain platform quality and safety

The platform makes it easier for customers to discover products, pay using locally suitable payment methods, and receive orders with confidence.

Trimnexa earns revenue primarily through commissions charged on successfully completed marketplace orders.

---

## Marketplace concept

Trimnexa operates as a marketplace similar in *business concept* to platforms like Amazon Marketplace — sellers list products, customers purchase through a unified checkout, and the platform retains a commission — but with **original design, branding, architecture, and user experience**. Amazon's visual identity, layout, or source code must not be copied.

### Initial market

| Setting | Value |
|---------|-------|
| Country | Cameroon |
| Currency | Central African CFA franc (XAF / FCFA) |
| Languages | English, French |
| Initial cities | Douala and/or Yaoundé (operational decision before launch) |

### Launch strategy

- Start with one or two major cities
- Begin with a controlled group of verified sellers
- Begin with a limited number of product categories
- Expand only after order, payment, support, and delivery processes are stable

The system architecture must allow other cities and countries to be added later.

### Business model

**Primary revenue:** Marketplace commission on successfully completed sales.

Example flow:

1. Customer purchases a product
2. Payment is confirmed via verified webhook
3. Order is fulfilled by the seller
4. Delivery is confirmed
5. Trimnexa calculates and records its commission
6. Seller earnings become available for payout according to platform policy

Commission must be configurable. Future options include global, category-specific, seller-specific, and promotional rates. Additional revenue sources (sponsored products, featured shops, subscriptions) are post-MVP.

---

## Target users

### A. Guest

A guest can:

- Visit the public website
- Browse product categories
- Search for products
- View product details
- View seller information
- Read help pages and policies
- Register or log in
- Begin a cart where technically appropriate

### B. Customer

A customer can:

- Create and manage an account
- Verify email or telephone number
- Manage profile information
- Save delivery addresses
- Search and filter products
- Add products to a cart
- Save products to a wishlist
- Place orders
- Select a payment method
- Track order status
- View order history
- Request cancellation where permitted
- Request returns or refunds
- Review delivered products
- Review sellers where permitted
- Contact customer support
- Receive email, in-app, and future SMS or WhatsApp notifications

### C. Seller

A seller can:

- Create a normal account
- Apply to become a seller
- Submit identity and business information
- Wait for administrator approval
- Create and manage a shop profile
- Upload a shop logo and banner
- Add products with images, prices, variants, and stock
- Manage orders and fulfilment status
- View sales, commission deductions, and earnings balances
- View payout history and request payout where supported
- View seller analytics
- Respond to customer questions or support cases
- Manage shop policies
- Receive notifications

### D. Administrator

An administrator can:

- Access a protected administrator dashboard
- Review and approve seller applications
- Suspend or reject sellers
- Moderate products and manage categories
- Manage customers, sellers, orders, payments, refunds, and returns
- Manage commissions, seller balances, and payouts
- Manage promotional banners, coupons, and featured products
- View audit logs and marketplace reports
- Manage prohibited products, static content, support tickets, and platform settings

### E. Support or operations staff (future)

Architecture should allow a restricted staff role with permissions such as viewing orders, handling support tickets, reviewing returns, and communicating with users — without full administrator power.

### F. Delivery partner (future)

Delivery-partner functionality is not required in the first release, but the architecture should allow it later.

---

## MVP scope

The first production-ready MVP must support:

- [ ] Public marketplace homepage
- [ ] Product categories
- [ ] Product search
- [ ] Product listing pages
- [ ] Product detail pages
- [ ] Customer registration and login
- [ ] Seller application
- [ ] Administrator seller approval
- [ ] Seller shop profile
- [ ] Seller product creation
- [ ] Product image upload
- [ ] Product stock management
- [ ] Shopping cart
- [ ] Checkout
- [ ] Delivery-address collection
- [ ] One supported payment integration or a controlled test payment flow
- [ ] Order creation
- [ ] Order status management
- [ ] Commission calculation
- [ ] Seller earnings records
- [ ] Administrator order management
- [ ] Basic notifications
- [ ] English and French support
- [ ] FCFA/XAF pricing
- [ ] Responsive design
- [ ] Basic legal and support pages
- [ ] Basic return and dispute request process
- [ ] Deployment and domain connection

---

## Non-MVP scope

The following must **not** block the first MVP:

- Native mobile application
- Advanced or AI-powered recommendations
- Multiple warehouses
- International expansion beyond initial Cameroon launch
- Fully automated seller payouts
- Complex loyalty programme
- Live delivery maps
- Advanced real-time chat
- Auction functionality
- Cryptocurrency payments
- Large-scale microservice architecture
- Seller subscriptions and sponsored products (post-MVP revenue)

---

## Technology stack

### Current (installed)

| Technology | Version / notes |
|------------|-----------------|
| Astro | `^7.0.9` |
| TypeScript | Strict mode via `astro/tsconfigs/strict` |
| Node.js | `>=22.12.0` |

### Planned (not installed until relevant phase)

| Layer | Planned choice | Rationale | Phase |
|-------|----------------|-----------|-------|
| Styling | Tailwind CSS | Official Astro integration; rapid design system | 1 |
| Interactivity | React islands (`@astrojs/react`) | Cart, filters, dashboards only where needed | 1 |
| Validation | Zod | Shared server/client schemas | 3 |
| Database | PostgreSQL | Relational data, ACID transactions | 3 |
| ORM | Prisma + `@prisma/adapter-pg` | Official Astro 7 guide; migrations; type safety | 3 |
| Authentication | Better Auth + Prisma adapter (preferred) | Self-hosted; role extension; no per-user SaaS fee | 4 |
| Auth alternative | Lucia v3 pattern | Full control; more implementation work | 4 |
| Image storage | Cloudinary or S3-compatible | Uploads, transforms, CDN | 7 |
| Email | Resend or Postmark | Transactional email | 16 |
| Payments | TBD after research | CamPay, MTN MoMo API, Orange WebPay — see Phase 11 | 11 |
| Testing | Vitest + Playwright | Astro/Vite ecosystem fit | 1 |
| Deployment adapter | TBD after Phase 20 comparison | Installed only after host selection | 20 |

### Hosting status

**The project is hosting-neutral until Phase 20.** No deployment adapter (`@astrojs/node`, Vercel, Netlify, Cloudflare) is installed. The domain `trimnexa.com` is managed through Hetzner DNS, but the application does not need to be hosted on Hetzner.

### Money handling rules

- Never use floating-point numbers for money
- Store amounts as integer minor units (centimes) or safe `Decimal` database types
- Always store currency explicitly (`XAF`)
- Preserve product title, price, commission, and seller information at time of purchase
- Record seller earnings through immutable ledger entries
- Never simply overwrite balances

---

## Architecture principles

- **Modular monolith** for the MVP — no premature microservices
- **Clear separation** of public, customer, seller, and administrator areas
- **Server-side rendering** for SEO-friendly public marketplace pages
- **Astro islands** and React only where interactivity is required
- **Minimal client-side JavaScript** on public pages
- **Strong TypeScript typing** throughout
- **Server-side validation** on all inputs; never trust browser-submitted prices or roles
- **Secure authorization checks** on every protected route and API endpoint
- **Transaction-safe** order and financial operations using database transactions
- **Auditability** of sensitive administrator and financial actions
- **Accessible semantic HTML** with mobile-first responsive design
- **Image optimization** and pagination for large lists
- **Database indexes** for important queries
- **Environment-based configuration** — no secrets in source code
- **Reversible database migrations** with review before applying
- **Error handling** with useful user-facing messages
- **Logging** without exposing sensitive information

---

## Proposed folder structure

Folders are created incrementally per phase. Do not create empty architecture for unimplemented features.

```
src/
  assets/                 # Images, icons, fonts
  components/
    common/               # Buttons, inputs, badges, alerts
    layout/               # Header, footer, navigation
    marketplace/          # Homepage sections, deals
    product/              # Product cards, galleries
    cart/                 # Cart components
    checkout/             # Checkout steps
    account/                # Customer account UI
    seller/                 # Seller dashboard UI
    admin/                  # Administrator dashboard UI
  layouts/                # Base, public, dashboard layouts
  pages/                  # File-based routing (mirrors route structure)
  styles/                 # Global styles, design tokens
  lib/
    auth/                 # Authentication configuration
    db/                   # Database client
    payments/             # Payment provider integration
    validation/           # Zod schemas
    permissions/          # Authorization helpers
    services/             # Business logic
    repositories/           # Data access (where useful)
    notifications/        # Email and in-app notifications
  middleware/             # Route protection, locale
  types/                  # Shared TypeScript types
  i18n/                   # Translation files and utilities
  content/                # Static policies (after legal review)
  tests/                  # Unit, integration, e2e tests
prisma/                   # Schema and migrations (Phase 3)
public/                   # Static assets served as-is
```

---

## Route structure

### Public routes

| Route | Purpose |
|-------|---------|
| `/` | Homepage |
| `/products` | Product listing |
| `/products/[slug]` | Product detail |
| `/categories` | Category index |
| `/categories/[slug]` | Category products |
| `/shops` | Shop directory |
| `/shops/[slug]` | Seller shop page |
| `/search` | Search results |
| `/deals` | Promotions and deals |
| `/about` | About Trimnexa |
| `/contact` | Contact form |
| `/help` | Help centre |
| `/become-a-seller` | Seller recruitment |
| `/privacy` | Privacy policy |
| `/terms` | Terms and conditions |
| `/returns` | Return policy |
| `/seller-policy` | Seller policy |
| `/prohibited-products` | Prohibited products list |

### Authentication routes

| Route | Purpose |
|-------|---------|
| `/auth/login` | Login |
| `/auth/register` | Registration |
| `/auth/forgot-password` | Password reset request |
| `/auth/reset-password` | Password reset |
| `/auth/verify` | Email/phone verification |
| `/auth/logout` | Logout |

### Customer routes

| Route | Purpose |
|-------|---------|
| `/account` | Account dashboard |
| `/account/profile` | Profile management |
| `/account/addresses` | Delivery addresses |
| `/account/orders` | Order history |
| `/account/orders/[id]` | Order detail |
| `/account/wishlist` | Saved products |
| `/account/reviews` | Customer reviews |
| `/account/notifications` | Notification centre |
| `/account/support` | Support tickets |

### Cart and checkout routes

| Route | Purpose |
|-------|---------|
| `/cart` | Shopping cart |
| `/checkout` | Checkout flow |
| `/checkout/success` | Order confirmation |
| `/checkout/failed` | Payment failure |

### Seller routes

| Route | Purpose |
|-------|---------|
| `/seller` | Seller dashboard |
| `/seller/application` | Seller application |
| `/seller/onboarding` | Post-approval onboarding |
| `/seller/shop` | Shop profile |
| `/seller/products` | Product list |
| `/seller/products/new` | Create product |
| `/seller/products/[id]` | Edit product |
| `/seller/orders` | Order list |
| `/seller/orders/[id]` | Order detail |
| `/seller/earnings` | Earnings overview |
| `/seller/payouts` | Payout history |
| `/seller/analytics` | Sales analytics |
| `/seller/settings` | Shop settings |
| `/seller/support` | Seller support |

### Administrator routes

| Route | Purpose |
|-------|---------|
| `/admin` | Admin dashboard |
| `/admin/sellers` | Seller management |
| `/admin/sellers/[id]` | Seller detail |
| `/admin/products` | Product moderation |
| `/admin/products/[id]` | Product detail |
| `/admin/categories` | Category management |
| `/admin/orders` | Order management |
| `/admin/orders/[id]` | Order detail |
| `/admin/customers` | Customer management |
| `/admin/payments` | Payment records |
| `/admin/commissions` | Commission configuration |
| `/admin/payouts` | Payout management |
| `/admin/refunds` | Refund management |
| `/admin/returns` | Return requests |
| `/admin/disputes` | Dispute management |
| `/admin/support` | Support tickets |
| `/admin/content` | Banners and static content |
| `/admin/settings` | Platform settings |
| `/admin/audit-logs` | Audit log viewer |

### API routes (planned)

API endpoints under `src/pages/api/` must perform authorization checks on every mutating request. Examples:

- `/api/auth/[...all]` — Authentication handler (Phase 4)
- `/api/webhooks/payments` — Payment webhooks; signature-verified and idempotent (Phase 11)

Private routes (account, seller, admin) receive `noindex` meta tags and server-side auth gates.

---

## Core database entities

A normalized database design will be created during Phase 3. Planned core entities:

**Users and access:** `User`, `UserSession`, `UserRole`, `CustomerProfile`, `SellerProfile`, `SellerApplication`, `SellerVerificationDocument`

**Shops and catalogue:** `Store`, `StoreAddress`, `Category`, `Product`, `ProductImage`, `ProductVariant`, `ProductAttribute`, `ProductAttributeValue`, `Inventory`, `InventoryAdjustment`

**Shopping:** `Cart`, `CartItem`, `Wishlist`, `WishlistItem`, `Address`

**Orders:** `Order`, `OrderItem`, `OrderStatusHistory`, `Shipment`, `DeliveryStatusHistory`

**Payments and finance:** `Payment`, `PaymentTransaction`, `PaymentWebhookEvent`, `Commission`, `SellerLedgerEntry`, `SellerBalance`, `SellerPayout`

**Engagement:** `Coupon`, `CouponUsage`, `Review`, `ReviewImage`, `ReturnRequest`, `Refund`, `Dispute`

**Platform:** `Notification`, `SupportTicket`, `SupportMessage`, `AuditLog`, `SiteSetting`, `Banner`, `FeaturedProduct`, `TranslationContent`

### Product statuses (planned)

`DRAFT`, `PENDING_REVIEW`, `APPROVED`, `REJECTED`, `ACTIVE`, `OUT_OF_STOCK`, `SUSPENDED`, `ARCHIVED`

### Financial data rules

- Never use floating-point for money
- Store currency explicitly on every monetary field
- Snapshot product and price data on order creation
- Do not recalculate historical orders using current product prices
- Seller ledger entries are immutable; balances are derived
- Keep payment-provider transaction identifiers
- Make webhook processing idempotent
- Prevent duplicate payment processing
- Use database transactions for critical order and financial operations

---

## Order and payment concepts

### Order structure

- **One customer checkout** creates one parent marketplace order
- **One seller suborder** (fulfilment group) per seller within that parent order
- Multi-seller carts are supported; each seller fulfils their portion independently

### Order statuses (planned)

`PENDING_PAYMENT`, `PAYMENT_PROCESSING`, `PAID`, `CONFIRMED`, `PREPARING`, `READY_FOR_PICKUP`, `SHIPPED`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`, `RETURN_REQUESTED`, `RETURNED`, `PARTIALLY_REFUNDED`, `REFUNDED`, `DISPUTED`

Status transitions are controlled and recorded in `OrderStatusHistory`.

### Payment flow

1. Customer completes checkout
2. Trimnexa creates parent order and seller suborders with price snapshots
3. Payment is initiated with the selected provider
4. Provider confirms payment via verified webhook (not browser redirect alone)
5. Order status moves to paid; seller earnings recorded as **pending**
6. Seller prepares and fulfils the order
7. Delivery is confirmed
8. Seller earnings move from pending to **available**, minus marketplace commission
9. Payout processed per platform policy (administrator-reviewed in MVP if automatic splits unavailable)

### Amounts tracked per order

- Gross product amount
- Delivery amount
- Discount amount
- Payment-processing fee
- Marketplace commission
- Taxes (where applicable)
- Refund amount
- Seller net amount

### Cameroon payment research (Phase 11)

Potential providers to evaluate before selection:

| Provider | Notes |
|----------|-------|
| CamPay | Aggregator for MTN and Orange Mobile Money in Cameroon |
| MTN MoMo API | Direct integration; requires business onboarding |
| Orange WebPay | Direct integration; merchant KYA compliance required |

Selection criteria: Cameroon availability, webhook support, refund support, marketplace/split-payment support, settlement rules, transaction fees, and legal restrictions. Do not implement an unlicensed informal escrow system.

### MVP payout model

If the payment provider does not support automatic marketplace splits, use **administrator-reviewed payouts**. The ledger tracks all obligations accurately regardless of payout automation level.

---

## Security principles

- Secure password handling (hashing with modern algorithms)
- Email or telephone verification
- Role-based authorization (guest, customer, seller, admin, future staff)
- Server-side authorization on every protected action and API endpoint
- CSRF protection where required
- Secure, HTTP-only cookies for sessions
- Rate limiting on sensitive endpoints (login, registration, password reset, webhooks)
- Input validation with Zod; output encoding
- File-upload validation: size limits, allowed MIME types, safe filenames
- Prevention of insecure direct-object references (users access only their own data)
- Audit logging for sensitive actions
- Payment-webhook signature verification and idempotent processing
- No sensitive information in logs
- Secret management through environment variables only
- Strong administrator route protection
- Account suspension and session revocation
- Protection against brute-force login attempts
- Dependency security review in CI
- Secure HTTP headers and Content Security Policy where practical
- Data minimization

**Never** trust a user role sent from the browser. **Never** allow the client to determine prices, commissions, or seller earnings.

---

## Localization

### Initial languages

- English (`en`)
- French (`fr`)

### Requirements

- Language switcher in the header
- Translated navigation, validation messages, and customer emails
- Translated static policies (after legal review)
- Product descriptions remain seller-provided unless separately translated
- Default locale defined clearly in configuration

### Routing strategy (pending decision — Phase 2/17)

Two approaches are under consideration:

| Approach | Pros | Cons |
|----------|------|------|
| **Locale path prefix** (`/en/products`, `/fr/products`) | SEO-friendly; shareable localized URLs | More routing complexity |
| **Cookie/session preference** (same URLs) | Simpler routing | Weaker SEO for localized content |

**Recommendation:** Locale path prefix for SEO. Final decision in Phase 2/17.

---

## Design principles

Trimnexa must have an **original marketplace identity** suitable for Cameroon and the wider African market.

### Design goals

- Professional, modern, trustworthy, and clean
- Mobile-first and accessible
- Easy for first-time online shoppers
- Fast and consistent across all pages

### Homepage sections (planned)

Announcement bar, header with logo/search/cart/account, category navigation, hero banner, featured categories, popular products, new products, deals, featured sellers, trust and buyer-protection information, become-a-seller section, newsletter, footer.

### Design system (Phase 1–2)

Create a unique Trimnexa design system containing:

- Brand colours (original — not Amazon's palette)
- Typography scale
- Spacing scale
- Border-radius rules
- Shadows
- Button, form, card, alert, badge, table styles
- Empty, loading, and error states

**Do not** copy Amazon's colours, header layout, spacing, typography, icons, or page structure.

### Accessibility targets

Semantic HTML, keyboard navigation, visible focus indicators, accessible labels and form errors, alt text for images, proper heading order, sufficient colour contrast, accessible modals, reduced-motion support, screen-reader-friendly status messages.

---

## Development setup

### Prerequisites

- Node.js `>=22.12.0`
- npm (included with Node.js)
- Git

### First-time setup

```sh
git clone <repository-url>
cd trimnexa
npm install
npm run dev
```

The development server starts at [http://localhost:4321](http://localhost:4321).

### Background dev server (optional)

```sh
astro dev --background
astro dev status
astro dev logs
astro dev stop
```

### Current project structure

```text
/
├── public/
│   ├── favicon.ico
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── components/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

## Available commands

| Command | Action | Available |
|---------|--------|-----------|
| `npm install` | Install dependencies | Now |
| `npm run dev` | Start dev server at `localhost:4321` | Now |
| `npm run build` | Build production site to `./dist/` | Now |
| `npm run preview` | Preview production build locally | Now |
| `npm run astro -- --help` | Astro CLI help | Now |
| `npm run lint` | Run ESLint | Phase 1 |
| `npm run format` | Run Prettier | Phase 1 |
| `npm run typecheck` | TypeScript check | Phase 1 |
| `npm run test` | Run unit tests | Phase 1 |
| `npm run test:e2e` | Run end-to-end tests | Phase 19 |
| `npx prisma migrate dev` | Run database migrations | Phase 3 |
| `npx prisma db seed` | Seed development data | Phase 3 |

---

## Environment variables

Never commit `.env` files containing secrets. Use separate values per environment (local, staging, production).

| Variable | Purpose | Phase |
|----------|---------|-------|
| `DATABASE_URL` | PostgreSQL connection string | 3 |
| `AUTH_SECRET` | Authentication signing secret | 4 |
| `AUTH_URL` | Public application URL for auth callbacks | 4 |
| `PAYMENT_PROVIDER` | Selected payment provider identifier | 11 |
| `PAYMENT_API_KEY` | Payment provider API key | 11 |
| `PAYMENT_WEBHOOK_SECRET` | Webhook signature verification secret | 11 |
| `STORAGE_PROVIDER` | Image storage provider identifier | 7 |
| `STORAGE_BUCKET` | Object storage bucket name | 7 |
| `STORAGE_ACCESS_KEY` | Object storage access key | 7 |
| `STORAGE_SECRET_KEY` | Object storage secret key | 7 |
| `STORAGE_PUBLIC_URL` | Public base URL for stored images | 7 |
| `EMAIL_PROVIDER` | Email service identifier | 16 |
| `EMAIL_API_KEY` | Email service API key | 16 |
| `EMAIL_FROM` | Default sender address | 16 |
| `APP_URL` | Public application URL | 4 |
| `APP_ENV` | Environment name (`development`, `staging`, `production`) | 1 |
| `DEFAULT_LOCALE` | Default language (`en` or `fr`) | 2 |
| `COMMISSION_RATE` | Default marketplace commission (basis points or decimal) | 13 |

Copy `.env.example` (to be created in Phase 1) and fill in values locally. Production credentials are configured only during deployment (Phase 20).

---

## Development roadmap

Progress is tracked with checkboxes. **Do not begin a new phase until the previous phase is stable.** Update checkboxes when work is verified complete. Never remove completed phases from this document.

### Phase 0 — Planning and repository review

- [x] Inspect the Astro repository
- [x] Document the current project structure
- [x] Confirm Node.js and package-manager requirements
- [x] Confirm Astro version
- [x] Review existing files
- [x] Confirm branch and Git status
- [x] Add the full Trimnexa plan to README.md
- [x] Add setup instructions
- [x] Add project vision
- [x] Add architecture decisions
- [x] Add roadmap checkboxes
- [x] Add contribution rules for AI-assisted development
- [x] Add hosting-neutral deployment comparison (selection deferred to Phase 20)
- [x] Do not implement application features yet

**Acceptance criteria:** README.md contains the complete approved plan; project still runs; no unnecessary files deleted; no application feature implemented.

---

### Phase 1 — Project foundation

- [ ] Configure Astro project structure
- [ ] Confirm strict TypeScript settings
- [ ] Add Tailwind CSS
- [ ] Add React integration only if required
- [ ] Establish folders for components, layouts, pages, utilities, types, and server code
- [ ] Create environment-variable validation
- [ ] Create base layout
- [ ] Create global styles
- [ ] Create error and not-found pages
- [ ] Add linting and formatting
- [ ] Add basic testing tools
- [ ] Create an original design-system foundation
- [ ] Add reusable components
- [ ] Add basic SEO utilities

**Acceptance criteria:** Project builds successfully; dev server runs; linting and type checking pass; base components documented; no marketplace business functionality added prematurely.

---

### Phase 2 — Public website and brand identity

- [ ] Create Trimnexa logo placement and brand styles
- [ ] Build responsive header
- [ ] Build search interface
- [ ] Build category navigation
- [ ] Build footer
- [ ] Build homepage
- [ ] Build About page
- [ ] Build Contact page
- [ ] Build Help page
- [ ] Build Become a Seller page
- [ ] Build initial policy-page placeholders
- [ ] Add responsive behaviour
- [ ] Add accessibility checks
- [ ] Add English and French foundation
- [ ] Decide localization routing strategy (prefix vs cookie)

**Acceptance criteria:** Public pages work on mobile, tablet, and desktop; header and footer are reusable; website has an original identity; no Amazon branding or copied design; SEO metadata present; language foundation works.

---

### Phase 3 — Database and server foundation

- [ ] Select PostgreSQL provider
- [ ] Select ORM after compatibility review
- [ ] Create the initial database schema
- [ ] Create migrations
- [ ] Create safe seed data
- [ ] Add database client management
- [ ] Add server-side validation
- [ ] Add repository or service patterns only where useful
- [ ] Add audit-log foundation
- [ ] Document financial data handling
- [ ] Add database tests
- [ ] Install deployment adapter if SSR is required for database routes

**Acceptance criteria:** Migrations work from a clean database; seed command works; money is represented safely; important relationships documented; no production credentials committed.

---

### Phase 4 — Authentication and authorization

- [ ] Choose an Astro-compatible authentication solution
- [ ] Create registration
- [ ] Create login
- [ ] Create logout
- [ ] Create session handling
- [ ] Create password reset
- [ ] Add email verification where supported
- [ ] Add customer, seller, administrator, and optional staff roles
- [ ] Add protected-route handling
- [ ] Add server-side authorization helpers
- [ ] Add account suspension
- [ ] Add rate limiting
- [ ] Test role isolation

**Acceptance criteria:** Guests cannot access protected pages; customers cannot access seller or admin pages; sellers cannot access admin pages; role checks occur on the server; authentication tests pass.

---

### Phase 5 — Customer account

- [ ] Build account dashboard
- [ ] Build profile management
- [ ] Build address management
- [ ] Build order-history foundation
- [ ] Build wishlist foundation
- [ ] Build notification centre
- [ ] Build support-ticket foundation

**Acceptance criteria:** Customers manage their own data only; forms have server-side validation; mobile layout works.

---

### Phase 6 — Seller application and shop management

- [ ] Build seller application form
- [ ] Add seller status workflow
- [ ] Add administrator seller review
- [ ] Build seller onboarding
- [ ] Build shop profile
- [ ] Add shop logo and banner uploads
- [ ] Add shop address
- [ ] Add seller policies
- [ ] Add seller dashboard shell
- [ ] Add seller suspension and rejection handling

**Acceptance criteria:** Customer can apply to become a seller; administrator can approve or reject; only approved sellers access seller tools; files validated and protected; status changes audited.

---

### Phase 7 — Categories and product management

- [ ] Build category management
- [ ] Build subcategories
- [ ] Build product attributes
- [ ] Build seller product creation
- [ ] Build product editing
- [ ] Build product images
- [ ] Build product variants
- [ ] Build stock management
- [ ] Build draft and moderation workflow
- [ ] Build administrator product approval
- [ ] Build prohibited-product controls
- [ ] Add inventory history

**Acceptance criteria:** Sellers manage only their own products; drafts and review workflow work; administrators can approve or reject; prices and stock validate correctly; images optimized and secured.

---

### Phase 8 — Marketplace catalogue and search

- [ ] Build product listing
- [ ] Build product detail page
- [ ] Build category pages
- [ ] Build seller shop pages
- [ ] Add search
- [ ] Add sorting
- [ ] Add filters
- [ ] Add pagination
- [ ] Add stock display
- [ ] Add product structured data
- [ ] Add breadcrumbs
- [ ] Add empty states

**Acceptance criteria:** Products discoverable; search and filters use server-safe queries; pages crawlable; private and draft products hidden; performance acceptable.

---

### Phase 9 — Cart and wishlist

- [ ] Build cart
- [ ] Add and remove cart items
- [ ] Change quantities
- [ ] Validate stock
- [ ] Recalculate prices on the server
- [ ] Handle products from multiple sellers
- [ ] Build wishlist
- [ ] Decide and implement guest-cart strategy
- [ ] Merge guest and authenticated carts where appropriate

**Acceptance criteria:** Client-submitted prices ignored; out-of-stock products cannot be ordered; quantities validated; cart totals calculated on server; cart persists per chosen strategy.

---

### Phase 10 — Checkout and order creation

- [ ] Create checkout flow
- [ ] Select delivery address
- [ ] Select delivery method
- [ ] Calculate delivery cost
- [ ] Review seller-grouped items
- [ ] Create order snapshot data
- [ ] Create parent order and seller suborders
- [ ] Add idempotent checkout creation
- [ ] Add order confirmation page
- [ ] Add order emails or notifications

**Acceptance criteria:** Duplicate submissions do not create duplicate orders; historical product information preserved; order totals recalculated on server; order statuses begin correctly; multi-seller orders represented clearly.

---

### Phase 11 — Payment integration

- [ ] Research verified Cameroon-supported providers
- [ ] Document provider comparison
- [ ] Select one provider
- [ ] Create sandbox integration
- [ ] Create payment initiation
- [ ] Create webhook processing
- [ ] Verify webhook signature
- [ ] Add idempotency
- [ ] Record payment transactions
- [ ] Handle successful, pending, and failed payments
- [ ] Add administrator payment view
- [ ] Add refund foundation

**Acceptance criteria:** Payment confirmation does not rely on browser redirects alone; webhook signatures verified; duplicate webhook events safe; failed payments do not create paid orders; secrets remain outside source control.

---

### Phase 12 — Order fulfilment and delivery

- [ ] Build seller order list
- [ ] Build seller order details
- [ ] Add controlled status transitions
- [ ] Add preparation status
- [ ] Add shipping and delivery status
- [ ] Add tracking information
- [ ] Add delivery-address handling suitable for Cameroon
- [ ] Add customer tracking
- [ ] Add administrator order controls
- [ ] Add status notifications

**Acceptance criteria:** Sellers update only their own fulfilment records; invalid status transitions blocked; customers can track orders; delivery confirmation recorded; status history preserved.

---

### Phase 13 — Commissions, seller ledger, and payouts

- [ ] Create commission rules
- [ ] Calculate commission per order item
- [ ] Create seller ledger
- [ ] Record pending earnings
- [ ] Release earnings after delivery or approved conditions
- [ ] Support adjustments
- [ ] Record refunds
- [ ] Create available seller balance
- [ ] Create payout request or administrator payout process
- [ ] Build seller earnings dashboard
- [ ] Build administrator payout dashboard
- [ ] Add reports and reconciliation tools

**Acceptance criteria:** Financial history auditable; ledger entries immutable; balance derives from ledger; refunds create proper reversals; sellers cannot manipulate earnings; payouts cannot exceed available balance.

---

### Phase 14 — Reviews, returns, refunds, and disputes

- [ ] Allow verified-purchase reviews
- [ ] Add review moderation
- [ ] Build return request
- [ ] Build seller or administrator review flow
- [ ] Build refund records
- [ ] Build dispute workflow
- [ ] Add evidence uploads where appropriate
- [ ] Add notifications
- [ ] Add audit records

**Acceptance criteria:** Only eligible customers can review; return deadlines enforced; refunds connect to payment and ledger records; decisions auditable; users cannot access other users' disputes.

---

### Phase 15 — Administrator dashboard

- [ ] Build dashboard metrics
- [ ] Build seller management
- [ ] Build customer management
- [ ] Build product moderation
- [ ] Build category management
- [ ] Build order management
- [ ] Build payment management
- [ ] Build commission configuration
- [ ] Build payout management
- [ ] Build return and dispute management
- [ ] Build banner and content management
- [ ] Build site settings
- [ ] Build audit-log viewer
- [ ] Add restricted staff permissions if approved

**Acceptance criteria:** Administrator actions protected; sensitive actions audited; tables support pagination; dangerous actions require confirmation; staff access follows least privilege.

---

### Phase 16 — Notifications and support

- [ ] Add in-app notifications
- [ ] Add transactional email
- [ ] Add seller notifications
- [ ] Add customer notifications
- [ ] Add administrator notifications
- [ ] Build support tickets
- [ ] Build support messages
- [ ] Add future SMS or WhatsApp integration points

**Acceptance criteria:** Important events create notifications; notification failures do not corrupt orders; support users access only their own tickets; emails avoid exposing sensitive information.

---

### Phase 17 — Internationalization completion

- [ ] Complete English interface
- [ ] Complete French interface
- [ ] Translate validation messages
- [ ] Translate emails
- [ ] Translate public policies after legal review
- [ ] Add locale-aware metadata
- [ ] Test navigation in both languages

**Acceptance criteria:** Main user flows work in both languages; missing translations have safe fallback; business logic not duplicated; URLs and metadata follow chosen localization strategy.

---

### Phase 18 — Security hardening

- [ ] Perform authorization review
- [ ] Perform file-upload review
- [ ] Perform payment-security review
- [ ] Add secure headers
- [ ] Review session security
- [ ] Add rate limits
- [ ] Review logs
- [ ] Review dependency vulnerabilities
- [ ] Review administrator protection
- [ ] Test insecure direct-object access
- [ ] Test role escalation
- [ ] Document security incident procedure

**Acceptance criteria:** Critical findings resolved; protected data not accessible across accounts; payment endpoints hardened; production secrets configured safely; security checklist documented.

---

### Phase 19 — Testing and quality assurance

- [ ] Expand unit tests
- [ ] Expand integration tests
- [ ] Add end-to-end tests
- [ ] Add accessibility tests
- [ ] Test responsive layouts
- [ ] Test payment flows
- [ ] Test commission calculations
- [ ] Test seller isolation
- [ ] Test refunds
- [ ] Test failed states
- [ ] Run user acceptance testing
- [ ] Fix critical defects

**Acceptance criteria:** Critical marketplace flows pass; production build succeeds; no unresolved critical defects; accessibility problems documented and addressed; testing commands documented.

---

### Phase 20 — Deployment and domain

- [ ] Compare managed deployment platform vs Node.js on Hetzner (see [Deployment plan](#deployment-plan))
- [ ] Select production hosting and document decision in decision log
- [ ] Install and configure Astro deployment adapter (only after host selection)
- [ ] Configure production database
- [ ] Configure production image storage
- [ ] Configure email service
- [ ] Configure payment production credentials
- [ ] Configure environment variables for production
- [ ] Configure preview/staging deployment
- [ ] Connect trimnexa.com through Hetzner DNS to chosen host
- [ ] Configure HTTPS
- [ ] Configure www redirect
- [ ] Configure backups
- [ ] Configure monitoring
- [ ] Configure sitemap and robots
- [ ] Test production checkout safely

**Acceptance criteria:** trimnexa.com loads over HTTPS; environment variables secure; database backups exist; monitoring active; production build reproducible; critical pages work; payment production launch follows provider approval.

---

### Phase 21 — Controlled MVP launch

- [ ] Onboard a small seller group
- [ ] Add initial products
- [ ] Confirm seller agreements
- [ ] Confirm delivery operations
- [ ] Confirm customer-support process
- [ ] Test real orders carefully
- [ ] Monitor payment success
- [ ] Monitor fulfilment
- [ ] Collect feedback
- [ ] Fix launch issues
- [ ] Document operational procedures

**Acceptance criteria:** Real orders completable; commission calculated correctly; seller earnings traceable; customers receive support; sellers can fulfil orders; launch metrics reviewed.

---

### Phase 22 — Post-MVP roadmap

Possible future work (do not implement until MVP is stable):

- [ ] Seller subscriptions
- [ ] Sponsored products
- [ ] Automated payouts
- [ ] Pickup stations
- [ ] Delivery-partner portal
- [ ] Mobile application
- [ ] Recommendation system
- [ ] Loyalty programme
- [ ] Advanced promotions
- [ ] Warehouse support
- [ ] Cross-border expansion
- [ ] Additional African currencies
- [ ] Additional languages
- [ ] Business-to-business marketplace
- [ ] Advanced analytics
- [ ] Fraud detection

---

## Definition of done

A task is complete only when:

- [ ] The feature meets the requirement
- [ ] Type checking passes
- [ ] Linting passes
- [ ] Relevant tests pass
- [ ] Production build passes where applicable
- [ ] Mobile and desktop behaviour are checked
- [ ] Accessibility is considered
- [ ] Authorization is verified
- [ ] Error handling is included
- [ ] Documentation is updated
- [ ] README roadmap is updated
- [ ] No secrets are committed
- [ ] No unrelated files are changed unnecessarily

---

## Current phase

**Phase 0 — Planning and repository review: complete**

Phase 1 (Project foundation) has not started. Do not begin Phase 1 until explicitly instructed.

### Phase 0 status: complete

All Phase 0 tasks and acceptance criteria have been verified.

### Phase 0 acceptance criteria

- [x] README.md contains the complete approved plan
- [x] Project still runs (`npm run build` succeeds)
- [x] No unnecessary files deleted
- [x] No application feature implemented

### Progress rules for future work

1. Read README.md first
2. Identify the current phase
3. Confirm the requested work belongs to that phase
4. Implement only the requested scope
5. Run relevant checks
6. Update completed checkboxes
7. Add important architectural decisions to the decision log
8. Add newly discovered risks to the risk section
9. Do not mark work complete when tests or builds fail
10. Summarize changed files and validation results

---

## Decision log

| Date | Decision | Reason | Consequences |
|------|----------|--------|--------------|
| 2026-07-14 | Project uses Astro as the main framework | SEO, performance, islands architecture, team familiarity | SSR adapter required when adding API routes and auth |
| 2026-07-14 | Project uses TypeScript | Type safety across marketplace logic | Strict config from project start |
| 2026-07-14 | React used only for interactive islands | Minimize client JS; Astro for static/SSR content | `@astrojs/react` added in Phase 1 if needed |
| 2026-07-14 | Modular monolith architecture | MVP maintainability and simplicity | No microservices until proven necessary |
| 2026-07-14 | Public content favours server rendering or static generation | SEO for product and category pages | Adapter needed for dynamic server routes |
| 2026-07-14 | Financial calculations happen on the server | Security and auditability | All price/commission logic in server code |
| 2026-07-14 | PostgreSQL preferred production database | ACID transactions, relational marketplace data | DATABASE_URL and Prisma in Phase 3 |
| 2026-07-14 | Prisma ORM planned | Official Astro 7 guide; migrations | Evaluate compatibility in Phase 3 |
| 2026-07-14 | Better Auth preferred over Clerk | Self-hosted roles; no per-user SaaS cost | More setup; evaluate in Phase 4 |
| 2026-07-14 | Marketplace launch begins with limited MVP | Reduce risk; validate operations before scaling | Feature scope strictly phased |
| 2026-07-14 | Seller payouts not released before fulfilment | Fraud and dispute risk reduction | Slower seller cash flow; ledger tracks pending vs available |
| 2026-07-14 | English and French required | Cameroon bilingual market | i18n routing strategy TBD Phase 2/17 |
| 2026-07-14 | Currency is XAF/FCFA | Initial market | All monetary fields use XAF |
| 2026-07-14 | trimnexa.com DNS managed in Hetzner | Domain already purchased | DNS pointed to chosen host in Phase 20 |
| 2026-07-14 | Hosting-neutral until Phase 20 | Domain on Hetzner ≠ app must be on Hetzner | No deployment adapter installed in Phase 0 |
| 2026-07-14 | Amazon may inspire marketplace concept only | Business model reference | Visual design and code must remain original |
| 2026-07-14 | Parent order + seller suborders | Multi-seller checkout with per-seller fulfilment | More complex order model; clearer commission tracking |

*Add new rows when architectural decisions are made. Include date, decision, reason, and consequences.*

---

## Known risks

| Risk | Mitigation |
|------|------------|
| Marketplace scope becoming too large | Phase-gated README roadmap; no new phase until prior is stable |
| Payment providers not supporting automatic seller splits | Administrator-reviewed payouts; immutable ledger tracks all obligations |
| Legal restrictions on holding seller funds | Follow payment provider's supported model; legal review before launch |
| Seller fraud | Seller verification, application review, audit logs, suspension tools |
| Customer fraud | Order verification, payment confirmation via webhook, dispute process |
| Fake products | Product moderation, prohibited-product policy, administrator approval |
| Delivery failures | Clear status tracking, support tickets, seller accountability metrics |
| Incomplete physical addresses | Cameroon-adapted address fields (landmark, quarter, phone, GPS) |
| Mobile-money payment failures | Retry guidance, clear error messages, admin payment visibility |
| Refund and dispute complexity | Phased workflow in Phase 14; connect refunds to ledger and payments |
| Multi-seller order complexity | Parent order + suborders; seller-grouped checkout review |
| Data-protection requirements | Data minimization, secure storage, privacy policy with legal review |
| Seller identity-document security | Encrypted storage, access controls, audit logging |
| Product-image storage cost | Object storage with size limits; image optimization |
| Insufficient customer support | Support ticket system in Phase 16; staffed before launch |
| Poor seller fulfilment | Order metrics, seller ratings, suspension for repeated failures |
| Premature launch across too many cities | Controlled launch in Phase 21; one or two cities initially |
| Overuse of client-side JavaScript | Astro-first; React islands only where needed |
| Weak server-side authorization | Auth checks on every route/API; dedicated security review in Phase 18 |
| Inaccurate commission calculations | Server-side calculation; unit tests; immutable order snapshots |
| AI-generated code introducing inconsistent architecture | AI dev rules below; code review; phase-scoped changes |

---

## Deployment plan

### Hosting-neutral policy (Phases 0–19)

- No deployment adapter is installed
- No production host is selected or configured
- Local development uses Astro's default static output until SSR is required (Phase 3+)
- The domain `trimnexa.com` is managed through **Hetzner DNS**, but the application may be hosted on any suitable platform

### Phase 20 hosting comparison

Final host selection happens in **Phase 20** by comparing:

| Criterion | Managed platform (e.g. Railway, Render, Fly.io) | Node.js on Hetzner (VPS/Cloud) |
|-----------|---------------------------------------------------|-------------------------------|
| Astro SSR compatibility | Platform Node support + adapter (`@astrojs/node` or platform-specific) | `@astrojs/node` on self-managed VM |
| Database access | Managed PostgreSQL add-on | Self-hosted or external PostgreSQL (Neon, Supabase, Hetzner DB) |
| Payment webhooks | Public HTTPS URL with platform-managed TLS | Reverse proxy (Caddy/Nginx) + TLS on VPS |
| File storage | External S3-compatible or Cloudinary (required either way) | Same external object storage |
| Deployment complexity | Lower operations; git-push deploy | Higher operations; CI/CD + server maintenance |
| Maintenance | Platform handles OS patching | Team manages updates, backups, monitoring |
| Scalability | Vertical or auto-scale per platform | Manual scaling; load balancer added later |
| Cost | Predictable SaaS pricing | Lower infrastructure cost at scale; higher ops time |
| DNS connection | Point Hetzner DNS A/CNAME record to platform | Point Hetzner DNS A record to Hetzner server IP |

### Deployment flow (Phase 20)

```
Evaluate criteria → Choose managed platform OR Hetzner Node.js → Install adapter → Configure production → Point Hetzner DNS → HTTPS → Monitor
```

### Environments

| Environment | Purpose | Database | Credentials |
|-------------|---------|----------|-------------|
| Local | Development | Local or dev PostgreSQL | `.env` (not committed) |
| Staging/Preview | Pre-production testing | Separate staging database | Platform env vars |
| Production | Live marketplace | Separate production database | Platform env vars only |

### DNS (Hetzner)

- `trimnexa.com` → A or CNAME record to chosen host
- `www.trimnexa.com` → redirect to apex or vice versa
- HTTPS enforced in production

---

## Future roadmap

See [Phase 22 — Post-MVP roadmap](#phase-22--post-mvp-roadmap) above for detailed future features.

High-level post-MVP directions:

- Geographic expansion beyond initial Cameroon cities
- Delivery-partner portal and pickup stations
- Automated seller payouts when provider support allows
- Mobile application
- Advanced analytics, recommendations, and fraud detection
- Additional revenue streams (sponsored products, subscriptions, advertising)
- Business-to-business marketplace features

Implement only when the MVP is stable and real business evidence supports each investment.

---

## AI-assisted development rules

When using AI tools (Cursor, Claude, etc.) on this project:

1. Read existing code before editing
2. Do not overwrite working code without justification
3. Do not generate the whole marketplace in one response
4. Work one phase or one feature at a time
5. Reuse existing components
6. Avoid duplicate utilities
7. Do not add a package without explaining why it is needed
8. Prefer official documentation
9. Do not use deprecated APIs
10. Do not change the stack without approval
11. Do not create fake production credentials
12. Do not claim tests passed unless they were run
13. Do not mark roadmap items completed without verification
14. Do not remove roadmap history
15. Keep commits focused
16. Explain database migrations before applying them
17. Protect financial operations with database transactions
18. Ask for clarification when a business rule is genuinely unresolved

---

## Licence and copyright

- Trimnexa source code, branding, and visual identity are original to this project
- Do not copy Amazon's source code, branding, visual identity, or copyrighted layout
- Legal pages (privacy policy, terms, seller agreement, etc.) are **placeholders** until reviewed by a qualified legal professional familiar with Cameroon and, where relevant, Germany or the European Union
- Do not present generated legal text as legally approved

---

## Pending business decisions

| Decision | Options | Target phase |
|----------|---------|--------------|
| Localization routing | Locale prefix (`/en`, `/fr`) vs cookie preference | Phase 2/17 |
| Payment provider | CamPay vs direct MTN MoMo vs Orange WebPay | Phase 11 |
| Guest cart strategy | Session-based guest cart vs auth-required cart | Phase 9 |
| Initial launch city | Douala, Yaoundé, or both | Phase 21 |
| Production hosting | Managed platform vs Hetzner Node.js | Phase 20 |

---

*This README is the permanent source of truth and project roadmap for Trimnexa. Update it whenever phases are completed or architectural decisions are made.*
