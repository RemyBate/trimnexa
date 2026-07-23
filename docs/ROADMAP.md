# Development Roadmap

[← Documentation index](./README.md)

Progress is tracked with checkboxes. **Do not begin a new phase until the previous phase is stable.** Update checkboxes when work is verified complete. Never remove completed phases from this document.

**Current project phase:** Milestone 9 — Phase 9 implemented on MySQL; pending owner review

**Last roadmap update:** 2026-07-23

---

## Roadmap rules

1. Read the [root README](../README.md) and this document before starting work
2. Identify the current phase
3. Confirm the requested work belongs to that phase
4. Implement only the requested scope
5. Run relevant checks (build, lint, typecheck, tests)
6. Update completed checkboxes in this file
7. Add important architectural decisions to [DECISIONS.md](./DECISIONS.md)
8. Add newly discovered risks to [RISKS.md](./RISKS.md)
9. Do not mark work complete when tests or builds fail
10. Summarize changed files and validation results

See [CONTRIBUTING.md](./CONTRIBUTING.md) for full contribution and AI development rules.

---

## Project progress

High-level phase status. Detailed tasks and acceptance criteria are listed under each phase below.

- [x] **Phase 0** — Planning and repository review
- [x] **Phase 1** — Project foundation (1A, 1B, 1C complete)
- [x] **Phase 2** — Public website and brand identity
- [x] **Phase 3** — Database and server foundation
- [x] **Phase 4** — Authentication and authorization
- [x] **Phase 5** — Customer account (pending owner review)
- [x] **Phase 6** — Seller application and shop management (pending owner review)
- [x] **Phase 7** — Categories and product management (pending owner review)
- [x] **Phase 8** — Marketplace catalogue and search (pending owner review)
- [x] **Phase 9** — Cart and wishlist (pending owner review)
- [ ] **Phase 10** — Checkout and order creation
- [ ] **Phase 11** — Payment integration
- [ ] **Phase 12** — Order fulfilment and delivery
- [ ] **Phase 13** — Commissions, seller ledger, and payouts
- [ ] **Phase 14** — Reviews, returns, refunds, and disputes
- [ ] **Phase 15** — Administrator dashboard
- [ ] **Phase 16** — Notifications and support
- [ ] **Phase 17** — Internationalization completion
- [ ] **Phase 18** — Security hardening
- [ ] **Phase 19** — Testing and quality assurance
- [ ] **Phase 20** — Deployment and domain
- [ ] **Phase 21** — Controlled MVP launch
- [ ] **Phase 22** — Post-MVP expansion

**Product requirements:** [PRD.md](./PRD.md) · **Architecture:** [ARCHITECTURE.md](./ARCHITECTURE.md) · **Deployment:** [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## Phase 0 — Planning and repository review

- [x] Inspect the Astro repository
- [x] Document the current project structure
- [x] Confirm Node.js and package-manager requirements
- [x] Confirm Astro version
- [x] Review existing files
- [x] Confirm branch and Git status
- [x] Add the full Trimnexa plan to project documentation
- [x] Add setup instructions
- [x] Add project vision
- [x] Add architecture decisions
- [x] Add roadmap checkboxes
- [x] Add contribution rules for AI-assisted development
- [x] Add hosting-neutral deployment comparison (selection deferred to Phase 20)
- [x] Reorganize documentation into professional `docs/` structure
- [x] Strengthen enterprise documentation (vision, principles, NFRs, design system planning)
- [x] Do not implement application features yet

**Acceptance criteria:** Complete project plan in `docs/`; project still runs; no unnecessary files deleted; no application feature implemented.

---

## Phase 1 — Project foundation

### Phase 1A — Technical foundation

- [x] Configure Astro project structure (path aliases, folder layout)
- [x] Confirm strict TypeScript settings
- [x] Add Tailwind CSS (`@tailwindcss/vite` + Tailwind 4)
- [x] Add React integration (`@astrojs/react` — prepared for future islands)
- [x] Establish foundation folders (`config/`, `seo/`, `styles/`, `types/`)
- [x] Create environment-variable validation (`src/config/env.ts` + `.env.example`)
- [x] Import global styles in layout (Tailwind entry only — no marketplace UI)
- [x] Create global styles entry (`src/styles/global.css`)
- [x] Add ESLint and Prettier
- [x] Create SEO utility (`src/seo/metadata.ts`)
- [x] Create site constants (`src/config/site.ts`)
- [x] Verify production build, typecheck, and lint pass
- [x] Do not add marketplace business logic

**Phase 1A acceptance criteria:** Project builds successfully; Tailwind and React integrations configured; strict TypeScript unchanged; lint and typecheck pass; foundation utilities are generic and reusable; no marketplace pages or business logic.

### Phase 1B — Base layouts and pages

- [x] Create base layout with SEO metadata integration (`BaseLayout.astro`, `SeoHead.astro`)
- [x] Create error and not-found pages (`404.astro`, `500.astro`)
- [x] Add basic testing tools (Vitest + `metadata.test.ts`)
- [x] Add reusable base components (`Button`, `Card`, `Alert`, `Container`)

**Phase 1B acceptance criteria:** Base layout renders SEO tags; error pages work; tests pass; generic components reusable.

### Phase 1C — Design system foundation

- [x] Create original design-system foundation (`src/styles/tokens.css`)
- [x] Document base components ([DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md))

**Phase 1C acceptance criteria:** Original token palette defined; base components documented; no marketplace-specific UI.

### Phase 1 — Remaining checklist (full phase)

- [x] Configure Astro project structure
- [x] Confirm strict TypeScript settings
- [x] Add Tailwind CSS
- [x] Add React integration only if required
- [x] Establish folders for components, layouts, pages, utilities, types, and server code
- [x] Create environment-variable validation
- [x] Create base layout
- [x] Create global styles
- [x] Create error and not-found pages
- [x] Add linting and formatting
- [x] Add basic testing tools
- [x] Create an original design-system foundation
- [x] Add reusable components
- [x] Add basic SEO utilities

**Acceptance criteria (full Phase 1):** Project builds successfully; dev server runs; linting and type checking pass; base components documented; no marketplace business functionality added prematurely. **Status: complete.**

---

## Phase 2 — Public website and brand identity

- [x] Create Trimnexa logo placement and brand styles
- [x] Build responsive header
- [x] Build search interface
- [x] Build category navigation
- [x] Build footer
- [x] Build homepage
- [x] Build About page
- [x] Build Contact page
- [x] Build Help page
- [x] Build Become a Seller page
- [x] Build initial policy-page placeholders
- [x] Add responsive behaviour
- [x] Add accessibility checks
- [x] Add English and French foundation
- [x] Decide localization routing strategy (prefix vs cookie)

**Acceptance criteria:** Public pages work on mobile, tablet, and desktop; header and footer are reusable; website has an original identity; no Amazon branding or copied design; SEO metadata present; language foundation works. **Status: complete — pending owner review.**

---

## Phase 3 — Database and server foundation

- [x] Select MySQL provider (owner decision 2026-07-23; local/Docker MySQL for development; production host deferred to Phase 20)
- [x] Select ORM after compatibility review (Prisma 7 + `@prisma/adapter-mariadb`)
- [x] Archive PostgreSQL migration history and create MySQL baseline
- [x] Create the initial database schema
- [x] Create migrations
- [x] Create safe seed data
- [x] Add database client management
- [x] Add server-side validation
- [x] Add repository or service patterns only where useful
- [x] Add audit-log foundation
- [x] Document financial data handling
- [x] Add database tests
- [ ] Install deployment adapter if SSR is required for database routes (done in Phase 4 — `@astrojs/node`)

**Acceptance criteria:** Migrations work from a clean database; seed command works; money is represented safely; important relationships documented; no production credentials committed. **Status: complete.**

---

## Phase 4 — Authentication and authorization

**Status: complete — pending owner review.**

- [x] Choose an Astro-compatible authentication solution — **Better Auth** (see [DECISIONS.md](./DECISIONS.md))
- [x] Create registration
- [x] Create login
- [x] Create logout
- [x] Create session handling
- [x] Create password reset (UI + API; email delivery deferred to Phase 16)
- [x] Add email verification where supported (placeholder route; transactional email in Phase 16)
- [x] Add customer, seller, administrator, and optional staff roles (`UserRoleAssignment` + marketplace RBAC helpers)
- [x] Add protected-route handling (middleware + server-side page guards)
- [x] Add server-side authorization helpers (`src/lib/authz/`)
- [x] Add account suspension (session block + login rejection)
- [x] Add rate limiting (in-memory for `/api/auth/*`; production hardening in Phase 18)
- [x] Test role isolation (`src/lib/authz/authz.test.ts`)

**Acceptance criteria:** Guests cannot access protected pages; customers cannot access seller or admin pages; sellers cannot access admin pages; role checks occur on the server; authentication tests pass. **Status: complete — pending owner review.**

**Setup:** Run `npm run db:migrate:dev` after pulling, then `npm run db:seed`. Set `AUTH_SECRET` (or `BETTER_AUTH_SECRET`) in `.env` before using auth in production.

---

## Phase 5 — Customer account

**Status: complete — pending owner review.**

- [x] Build account dashboard
- [x] Build profile management
- [x] Build address management
- [x] Build order-history foundation
- [x] Build wishlist foundation
- [x] Build notification centre
- [x] Build support-ticket foundation

**Acceptance criteria:** Customers manage their own data only; forms have server-side validation; mobile layout works. **Status: complete — pending owner review.**

---

## Phase 6 — Seller application and shop management

**Status: complete — pending owner review.**

- [x] Build seller application form
- [x] Add seller status workflow
- [x] Add administrator seller review
- [x] Build seller onboarding
- [x] Build shop profile
- [x] Add shop logo and banner uploads
- [x] Add shop address
- [x] Add seller policies
- [x] Add seller dashboard shell
- [x] Add seller suspension and rejection handling

**Acceptance criteria:** Customer can apply to become a seller; administrator can approve or reject; only approved sellers access seller tools; files validated and protected; status changes audited. **Status: complete — pending owner review.**

---

## Phase 7 — Categories and product management

- [x] Build category management
- [x] Build subcategories
- [ ] Build product attributes _(deferred — single-SKU MVP; attributes in follow-up)_
- [x] Build seller product creation
- [x] Build product editing
- [x] Build product images
- [ ] Build product variants _(deferred — single-SKU MVP)_
- [x] Build stock management
- [x] Build draft and moderation workflow
- [x] Build administrator product approval
- [x] Build prohibited-product controls
- [x] Add inventory history

**Acceptance criteria:** Sellers manage only their own products; drafts and review workflow work; administrators can approve or reject; prices and stock validate correctly; images optimized and secured. **Status: complete — pending owner review.**

---

## Phase 8 — Marketplace catalogue and search

- [x] Build product listing
- [x] Build product detail page
- [x] Build category pages
- [x] Build seller shop pages
- [x] Add search
- [x] Add sorting
- [x] Add filters
- [x] Add pagination
- [x] Add stock display
- [x] Add product structured data
- [x] Add breadcrumbs
- [x] Add empty states

**Acceptance criteria:** Products discoverable; search and filters use server-safe queries; pages crawlable; private and draft products hidden; performance acceptable. **Status: complete — pending owner review.**

---

## Phase 9 — Cart and wishlist

- [x] Build cart
- [x] Add and remove cart items
- [x] Change quantities
- [x] Validate stock
- [x] Recalculate prices on the server
- [x] Handle products from multiple sellers
- [x] Build wishlist
- [x] Decide and implement guest-cart strategy
- [x] Merge guest and authenticated carts where appropriate

**Acceptance criteria:** Client-submitted prices ignored; out-of-stock products cannot be ordered; quantities validated; cart totals calculated on server; cart persists per chosen strategy. **Status: complete — pending owner review.**

**Guest-cart decision:** Session guest cart via httpOnly `trimnexa_guest_cart` cookie token; merge into authenticated cart on login (see DECISIONS.md).

**Deferred to Phase 10:** Delivery-cost calculation and checkout.

---

## Phase 10 — Checkout and order creation

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

## Phase 11 — Payment integration

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

## Phase 12 — Order fulfilment and delivery

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

## Phase 13 — Commissions, seller ledger, and payouts

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

## Phase 14 — Reviews, returns, refunds, and disputes

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

## Phase 15 — Administrator dashboard

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

## Phase 16 — Notifications and support

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

## Phase 17 — Internationalization completion

- [ ] Complete English interface
- [ ] Complete French interface
- [ ] Translate validation messages
- [ ] Translate emails
- [ ] Translate public policies after legal review
- [ ] Add locale-aware metadata
- [ ] Test navigation in both languages

**Acceptance criteria:** Main user flows work in both languages; missing translations have safe fallback; business logic not duplicated; URLs and metadata follow chosen localization strategy.

---

## Phase 18 — Security hardening

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

## Phase 19 — Testing and quality assurance

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

## Phase 20 — Deployment and domain

- [ ] Compare managed deployment platform vs Node.js on Hetzner (see [DEPLOYMENT.md](./DEPLOYMENT.md))
- [ ] Select production hosting and document decision in [DECISIONS.md](./DECISIONS.md)
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

## Phase 21 — Controlled MVP launch

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

## Phase 22 — Post-MVP roadmap

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
- [ ] Roadmap checkboxes in this file are updated
- [ ] No secrets are committed
- [ ] No unrelated files are changed unnecessarily

---

## Current phase

**Milestone 6 — Phase 6 complete; pending owner review**

- Seller application form with status workflow (pending, approved, rejected, suspended)
- Administrator seller review at `/admin/sellers`
- Seller dashboard shell with shop profile, onboarding, logo/banner uploads
- Prisma migration `20260714160001_seller_shop_management`
- Audit logging for seller status changes
- Bilingual seller and admin UI (EN/FR)
- Quality checks: build, typecheck, lint, test, format — run before owner review

Do not commit until owner review and explicit approval.

**Milestone 4 — Phase 4 complete (pushed)**

- Prisma 7 + MySQL schema, migration, seed, money utilities, audit log foundation
- Quality checks: build (25 pages), typecheck, lint, test (18/18), format:check — all pass

**Milestone 2 complete — Phase 2 (Public website and brand identity)**

- Bilingual public site with locale path prefix (`/en/`, `/fr/`)
- Responsive header, footer, search UI, category navigation, homepage sections
- Public pages and policy placeholders with legal-review notices
- Original provisional logo mark; teal-and-gold palette unchanged (provisional)
- Quality checks: build (25 pages), typecheck, lint, test (10/10), format:check — all pass

Do not commit until owner review and explicit approval.

**Milestone 1 complete — Phase 1 (1A, 1B, 1C) finished and cleanup verified**

### Phase 0 acceptance criteria

- [x] Complete project plan in `docs/`
- [x] Project still runs (`npm run build` succeeds)
- [x] No unnecessary files deleted
- [x] No application feature implemented

---

## Pending business decisions

| Decision             | Options                                                                   | Target phase |
| -------------------- | ------------------------------------------------------------------------- | ------------ |
| Localization routing | Locale prefix (`/en`, `/fr`) vs cookie preference                         | Phase 2/17   |
| Payment provider     | CamPay vs direct MTN MoMo vs Orange WebPay                                | Phase 11     |
| Guest cart strategy  | ~~Session vs auth-required~~ **Session guest cart** (Accepted 2026-07-23) | Phase 9      |
| Initial launch city  | Douala, Yaoundé, or both                                                  | Phase 21     |
| Production hosting   | Managed platform vs Hetzner Node.js                                       | Phase 20     |

Document final choices in [DECISIONS.md](./DECISIONS.md) when made.

---

## Related documents

- [PRD.md](./PRD.md) — Product requirements, MVP scope, and vision
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Technical stack and high-level architecture
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Hosting comparison and Phase 20 deployment
- [CONTRIBUTING.md](./CONTRIBUTING.md) — Development workflow and definition of done
- [DECISIONS.md](./DECISIONS.md) — Pending business decisions
