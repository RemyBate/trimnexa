# Development Roadmap

[← Documentation index](./README.md)

Progress is tracked with checkboxes. **Do not begin a new phase until the previous phase is stable.** Update checkboxes when work is verified complete. Never remove completed phases from this document.

**Current project phase:** Milestone 2 complete (Phase 2) — pending owner review before commit

**Last roadmap update:** 2026-07-14

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
- [ ] **Phase 3** — Database and server foundation
- [ ] **Phase 4** — Authentication and authorization
- [ ] **Phase 5** — Customer account
- [ ] **Phase 6** — Seller application and shop management
- [ ] **Phase 7** — Categories and product management
- [ ] **Phase 8** — Marketplace catalogue and search
- [ ] **Phase 9** — Cart and wishlist
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

## Phase 4 — Authentication and authorization

- [ ] Choose an Astro-compatible authentication solution (evaluate candidates — see [ARCHITECTURE.md](./ARCHITECTURE.md#authentication-evaluation-phase-4))
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

## Phase 5 — Customer account

- [ ] Build account dashboard
- [ ] Build profile management
- [ ] Build address management
- [ ] Build order-history foundation
- [ ] Build wishlist foundation
- [ ] Build notification centre
- [ ] Build support-ticket foundation

**Acceptance criteria:** Customers manage their own data only; forms have server-side validation; mobile layout works.

---

## Phase 6 — Seller application and shop management

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

## Phase 7 — Categories and product management

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

## Phase 8 — Marketplace catalogue and search

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

## Phase 9 — Cart and wishlist

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

**Milestone 2 complete — Phase 2 (Public website and brand identity) pending owner review**

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

| Decision             | Options                                           | Target phase |
| -------------------- | ------------------------------------------------- | ------------ |
| Localization routing | Locale prefix (`/en`, `/fr`) vs cookie preference | Phase 2/17   |
| Payment provider     | CamPay vs direct MTN MoMo vs Orange WebPay        | Phase 11     |
| Guest cart strategy  | Session-based guest cart vs auth-required cart    | Phase 9      |
| Initial launch city  | Douala, Yaoundé, or both                          | Phase 21     |
| Production hosting   | Managed platform vs Hetzner Node.js               | Phase 20     |

Document final choices in [DECISIONS.md](./DECISIONS.md) when made.

---

## Related documents

- [PRD.md](./PRD.md) — Product requirements, MVP scope, and vision
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Technical stack and high-level architecture
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Hosting comparison and Phase 20 deployment
- [CONTRIBUTING.md](./CONTRIBUTING.md) — Development workflow and definition of done
- [DECISIONS.md](./DECISIONS.md) — Pending business decisions
