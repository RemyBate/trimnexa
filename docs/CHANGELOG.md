# Changelog

[← Documentation index](./README.md)

All notable changes to the Trimnexa project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

---

## [0.7.0] — 2026-07-14

Milestone 7 — Phase 7 categories and product management (pending owner review).

### Added

- Product catalogue models: `Product`, `ProductImage`, `InventoryAdjustment`, `ProductStatus`
- Migration `20260714180000_product_catalogue`
- Product services (`src/lib/product/`), admin moderation (`src/lib/admin/products.ts`, `src/lib/admin/categories.ts`)
- Local product image uploads (`src/lib/storage/product-media.ts`) with type/size validation
- Seller APIs: `/api/seller/products/*`, `/api/seller/categories`
- Admin APIs: `/api/admin/products/*`, `/api/admin/categories/*`
- Pages: `/seller/products`, `/admin/products`, `/admin/categories`
- Draft → pending review → active/rejected workflow with prohibited-content checks
- Inventory adjustment history on seller stock updates
- Category subcategory seeds (fashion, home) and admin activate/deactivate toggles
- Seed products for approved seller (active + draft)

### Deferred (documented in roadmap)

- Product attributes and multi-SKU variants (single-SKU MVP for Phase 7)

---

## [0.6.0] — 2026-07-14

Milestone 6 — Phase 6 seller application and shop management (pending owner review).

### Added

- Extended `SellerProfile` with shop slug, address, policies, media paths, onboarding state
- Extended `SellerApplication` with contact and location fields
- Migration `20260714160001_seller_shop_management`
- Seller services (`src/lib/seller/`), admin seller review (`src/lib/admin/sellers.ts`)
- Local seller media uploads (`src/lib/storage/seller-media.ts`) with type/size validation
- API routes: `/api/seller/application`, `/api/seller/shop/*`, `/api/admin/sellers/*`
- Pages: `/seller/application`, `/seller/onboarding`, `/seller/shop`, `/admin/sellers`
- `SellerLayout`, `AdminLayout`, seller/admin components
- Audit actions for seller approval, rejection, suspension, reactivation
- Seed users: `pending-seller@trimnexa.local`, `seller@trimnexa.local`

### Changed

- Seller dashboard uses approved-seller guards (role + profile status)
- Become a Seller page links to live application flow
- User menu shows seller dashboard, application, or become-a-seller based on status
- `npm run dev` runs `prisma generate` before Astro dev

---

## [0.5.0] — 2026-07-14

Milestone 5 — Phase 5 customer account (pending owner review).

### Added

- Customer account database models: addresses, orders foundation, wishlist, notifications, support tickets
- Migration `20260714134429_customer_account`
- Account services and Zod validation (`src/lib/account/`)
- Account API routes under `/api/account/*` with session auth
- Account layout with responsive sidebar navigation
- Pages: `/account`, `/account/profile`, `/account/addresses`, `/account/orders`, `/account/wishlist`, `/account/notifications`, `/account/support`
- Profile editing, address CRUD, support ticket submission, notification read state
- Bilingual account copy (EN/FR)

### Changed

- Account dashboard links to live account sections with summary counts
- User menu dropdown links to dedicated account routes
- Registration provisioning creates wishlist + welcome notification
- Seed backfills wishlists for existing customer profiles

---

## [0.4.0] — 2026-07-14

Milestone 4 — Phase 4 authentication and authorization (pending owner review).

### Added

- Better Auth (`better-auth`) with Prisma adapter and email/password authentication
- `@astrojs/node` adapter with `output: 'server'`; public pages remain prerendered
- `src/lib/auth.ts`, `src/lib/auth-client.ts`, `src/middleware.ts`
- Better Auth API handled in `src/middleware.ts` (avoids Astro catch-all `GetStaticPathsRequired` in dev)
- API route `src/pages/api/auth/redirect-target.ts`
- Authz helpers and path utilities (`src/lib/authz/`)
- In-memory rate limiting for `/api/auth/*` (`src/lib/rate-limit.ts`)
- Localized auth pages: login, register, forgot-password, reset-password, verify, logout
- Protected stubs: `/account`, `/seller`, `/admin` with server-side role gates
- React auth form islands (`src/components/auth/`) — replaced with Astro forms after hydration issue
- Prisma migration `20260714160000_better_auth` (sessions, accounts, verifications)
- Auth, account, seller, and admin i18n strings (EN/FR)
- Unit tests for role isolation (`src/lib/authz/authz.test.ts`)

### Changed

- `User` model aligned with Better Auth (`emailVerified`, `name`, `image`; password in `Account`)
- Seed script creates dev admin credential account (`SEED_ADMIN_PASSWORD` override)
- [.env.example](../.env.example) — `BETTER_AUTH_SECRET`, `SEED_ADMIN_PASSWORD`
- [ROADMAP.md](./ROADMAP.md): Phase 4 complete; Phase 5 next
- [DECISIONS.md](./DECISIONS.md): Better Auth accepted

### Notes

- Email verification and password-reset emails require Phase 16 email provider
- Run `npm run db:migrate:dev` and `npm run db:seed` after pulling
- Set `AUTH_SECRET` or `BETTER_AUTH_SECRET` before production deployment

---

## [0.3.0] — 2026-07-14

Milestone 3 — Phase 3 database and server foundation (Phase 4 not started).

### Added

- Prisma 7 with PostgreSQL (`prisma/schema.prisma`, `prisma.config.ts`)
- Initial migration: users, roles, profiles, categories, audit logs, site settings
- Seed script: categories (EN/FR), site settings, development admin placeholder
- `src/lib/db.ts` — Prisma client singleton with `@prisma/adapter-pg`
- `src/lib/money.ts` — integer minor-unit money utilities
- `src/lib/validation/` — shared Zod schemas
- `src/lib/audit/` — `recordAuditLog()` foundation
- [FINANCIAL-DATA.md](./FINANCIAL-DATA.md) — financial handling rules
- npm scripts: `db:generate`, `db:migrate`, `db:migrate:dev`, `db:seed`, `db:studio`
- Unit tests for money and validation utilities

### Changed

- `build` and `typecheck` scripts run `prisma generate` first
- [.env.example](../.env.example) — `DATABASE_URL` documented with local example
- [ROADMAP.md](./ROADMAP.md): Phase 3 complete; Phase 4 blocked on auth provider

### Notes

- Phase 4 authentication **not implemented** — awaiting owner selection of auth provider
- Deployment adapter deferred until Phase 4 API/auth routes
- Run `npm run db:migrate:dev` and `npm run db:seed` after configuring PostgreSQL locally

---

## [0.2.0] — 2026-07-14

Milestone 2 — Public website and brand identity (Phase 2).

### Added

- Bilingual public site with locale path prefix (`/en/`, `/fr/`)
- i18n foundation: `src/i18n/` with EN/FR translation dictionaries and utilities
- `PublicLayout.astro` with announcement bar, header, category nav, footer
- Original logo mark (`public/brand/logo-mark.svg`) and `Logo.astro` wordmark
- Responsive header with search bar, language switcher, mobile navigation (no JS)
- Category navigation, footer with newsletter placeholder
- Homepage sections: hero, category tiles, trust, seller CTA, product placeholders
- Public pages: about, contact, help, become-a-seller, search
- Policy placeholders: privacy, terms, returns, seller-policy, prohibited-products
- Navigation config in `src/config/navigation.ts`
- Vitest tests for i18n utilities (`src/i18n/i18n.test.ts`)

### Changed

- Root `/` redirects to `/en/`
- Error pages link to localized home
- Global CSS: focus-visible outline for accessibility
- [ROADMAP.md](./ROADMAP.md): Phase 2 marked complete (pending review)
- [DECISIONS.md](./DECISIONS.md): locale routing and logo placeholder decisions
- [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md): navigation and Phase 2 component status

---

## [0.1.0] — 2026-07-14

Milestone 1 — Project foundation (Phase 1A, 1B, 1C).

### Added

- Astro project structure with `@/*` path alias and strict TypeScript
- Tailwind CSS 4 (`@tailwindcss/vite`) and React 19 integration (`@astrojs/react`)
- ESLint, Prettier, `@astrojs/check`, Zod, and Vitest
- Foundation modules: `src/config/`, `src/seo/`, `src/types/`, `src/styles/`
- SEO utility: `createPageMetadata()` in `src/seo/metadata.ts`
- Site constants in `src/config/site.ts`
- Environment validation in `src/config/env.ts` and `.env.example`
- `BaseLayout.astro` with integrated SEO metadata via `SeoHead.astro`
- Error pages: `404.astro`, `500.astro`
- Generic components: `Button`, `Card`, `Alert`, `Container`
- Design tokens in `src/styles/tokens.css` (provisional teal + gold palette)
- Vitest with `src/seo/metadata.test.ts` (5 tests)
- Minimal foundation homepage replacing Astro starter content
- npm scripts: `lint`, `format`, `format:check`, `typecheck`, `test`

### Changed

- `index.astro` uses `BaseLayout` and design system components
- `Layout.astro` delegates to `BaseLayout`
- [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) updated with implemented tokens and components
- [ROADMAP.md](./ROADMAP.md): Phase 1 (1A–1C) marked complete
- [DECISIONS.md](./DECISIONS.md): brand palette marked provisional pending Phase 2 approval

### Removed

- Unused Astro starter files: `Welcome.astro`, `astro.svg`, `background.svg`

### Fixed

- Zod 4 deprecations in `src/config/env.ts` (`z.url()`, `z.email()`)
- ESLint flat config: replaced deprecated `tseslint.config()` wrapper with array export

---

## [0.0.3] — 2026-07-14

### Added

- Tailwind CSS 4 via official `@tailwindcss/vite` integration
- React 19 via official `@astrojs/react` integration (prepared for future islands)
- ESLint, Prettier, `@astrojs/check`, and Zod
- Foundation modules: `src/config/`, `src/seo/`, `src/types/`, `src/styles/global.css`
- SEO utility: `createPageMetadata()` in `src/seo/metadata.ts`
- Site constants in `src/config/site.ts`
- Environment validation in `src/config/env.ts` and `.env.example`
- Path alias `@/*` → `src/*`
- npm scripts: `lint`, `format`, `format:check`, `typecheck`

### Changed

- [ROADMAP.md](./ROADMAP.md): Phase 1 split into 1A (complete), 1B, and 1C
- [Layout.astro](../src/layouts/Layout.astro): imports global Tailwind stylesheet only

### Notes

- Phase 1A only — no marketplace pages, components, or business logic
- Phase 1B not started

---

## [0.0.2] — 2026-07-14

### Added

- [PRD.md](./PRD.md): Vision statement, mission statement, core values, expanded business goals, project principles, non-functional requirements, success metrics
- [ARCHITECTURE.md](./ARCHITECTURE.md): High-level architecture diagram, authentication evaluation (candidates not locked in)
- [ROADMAP.md](./ROADMAP.md): Project progress summary for all phases 0–22
- [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md): Planning placeholders for design tokens and components (Phase 2)
- Cross-references between all documentation files
- Project progress section on root [README.md](../README.md)

### Changed

- Authentication no longer locked to Better Auth — deferred to Phase 4 evaluation ([DECISIONS.md](./DECISIONS.md))
- [UI-DESIGN.md](./UI-DESIGN.md): Component specifications moved to DESIGN-SYSTEM.md (single authoritative source)
- [docs/README.md](./README.md): Expanded index, quick links, and document relationship diagram
- Consolidated duplicate performance and analytics content into PRD NFRs and success metrics

### Notes

- Documentation-only changes; no application code modified
- Phase 1 not started

---

## [0.0.1] — 2026-07-14

### Added

- Restarted project using Astro 7 (`^7.0.9`) with TypeScript strict mode
- Completed Phase 0 planning and repository review
- Created comprehensive project documentation in `docs/`:
  - [PRD.md](./PRD.md) — Product Requirements Document
  - [ROADMAP.md](./ROADMAP.md) — Development phases 0–22
  - [ARCHITECTURE.md](./ARCHITECTURE.md) — Technical architecture
  - [DATABASE.md](./DATABASE.md) — Database planning
  - [ROUTES.md](./ROUTES.md) — Application routes
  - [UI-DESIGN.md](./UI-DESIGN.md) — Design and branding
  - [SECURITY.md](./SECURITY.md) — Security requirements
  - [PAYMENTS.md](./PAYMENTS.md) — Payment planning
  - [DEPLOYMENT.md](./DEPLOYMENT.md) — Deployment planning
  - [DECISIONS.md](./DECISIONS.md) — Architecture decision log
  - [RISKS.md](./RISKS.md) — Risk register
  - [CONTRIBUTING.md](./CONTRIBUTING.md) — Contribution and AI development rules
- Rewrote root [README.md](../README.md) as concise project entry page

### Changed

- Migrated from prior Next.js/Prisma prototype to Astro basics starter template
- Reorganized documentation from monolithic README into dedicated `docs/` files

### Notes

- No marketplace application features implemented
- No deployment adapter installed (hosting-neutral until Phase 20)
- Phase 1 (Project foundation) not started

---

## [Unreleased]

Future releases will be documented here as development phases complete.
