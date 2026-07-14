# Architecture

[← Documentation index](./README.md)

Technical architecture for Trimnexa — stack, principles, folder structure, and development standards.

**Related:** [PRD.md](./PRD.md) (product requirements) · [DATABASE.md](./DATABASE.md) (data layer) · [DEPLOYMENT.md](./DEPLOYMENT.md) (hosting)

---

## High-level architecture

Conceptual view of the Trimnexa platform. This is not a deployment diagram — see [DEPLOYMENT.md](./DEPLOYMENT.md) for environments and hosting.

```
┌─────────────┐
│  Customer   │  Browser / mobile web
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Astro       │  Public pages, SSR/SSG, layouts, routing, SEO
│ Website     │  React islands for cart, filters, dashboards
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Auth        │  Sessions, roles, protected routes (Phase 4)
│ Layer       │  Solution TBD — see Authentication evaluation below
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Marketplace │  Orders, products, cart, checkout, commissions,
│ Services    │  seller tools, admin tools (src/lib/services/)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ PostgreSQL  │  Users, catalogue, orders, ledger, audit logs
│ Database    │  Prisma ORM (Phase 3)
└──────┬──────┘
       │
       ├──────────────────┬──────────────────┐
       ▼                  ▼                  ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Payments    │  │ Delivery    │  │ Notifications│
│ (webhooks)  │  │ (fulfilment)│  │ (email, in-app)│
└─────────────┘  └─────────────┘  └─────────────┘
```

**Data flow (checkout):** Customer → Astro pages → Marketplace services → Database → Payment provider (webhook) → Order update → Notifications.

---

## Technology stack

### Current (installed)

| Technology        | Version / notes                                   |
| ----------------- | ------------------------------------------------- |
| Astro             | `^7.0.9`                                          |
| TypeScript        | Strict mode via `astro/tsconfigs/strict`          |
| Node.js           | `>=22.12.0`                                       |
| Output mode       | Static (default; no deployment adapter installed) |
| Tailwind CSS      | `^4.3.2` via `@tailwindcss/vite`                  |
| React             | `^19.2.7` via `@astrojs/react`                    |
| Zod               | Environment validation (`src/config/env.ts`)      |
| ESLint / Prettier | Code quality tooling                              |

### Planned (not installed until relevant phase)

| Layer              | Planned choice                 | Rationale                                       | Phase |
| ------------------ | ------------------------------ | ----------------------------------------------- | ----- |
| Database           | PostgreSQL                     | Relational data, ACID transactions              | 3     |
| ORM                | Prisma + `@prisma/adapter-pg`  | Official Astro 7 guide; migrations; type safety | 3     |
| Authentication     | **TBD — evaluated in Phase 4** | Astro-compatible; self-hosted preferred         | 4     |
| Image storage      | Cloudinary or S3-compatible    | Uploads, transforms, CDN                        | 7     |
| Email              | Resend or Postmark             | Transactional email                             | 16    |
| Payments           | TBD after research             | CamPay, MTN MoMo API, Orange WebPay             | 11    |
| Testing            | Vitest + Playwright            | Astro/Vite ecosystem fit                        | 1B/19 |
| Deployment adapter | TBD after Phase 20 comparison  | Installed only after host selection             | 20    |

### Hosting status

**The project is hosting-neutral until Phase 20.** No deployment adapter is installed. See [DEPLOYMENT.md](./DEPLOYMENT.md).

---

## Astro

Astro is the primary framework for:

- Public marketplace pages (SEO-friendly, server-rendered or static)
- Layouts and routing
- Content-heavy pages (help, policies)
- Server-side data fetching for product and category pages

### Output modes

- **Current:** Static (default) — suitable for Phase 0–2
- **Phase 3+:** Server output with deployment adapter when API routes, database access, and authentication are required
- Per-page `export const prerender = true/false` for hybrid rendering

### Astro islands

Use Astro's island architecture for selective hydration:

- Default: zero client JavaScript on public pages
- Hydrate only interactive components (cart, search suggestions, filters, forms)
- Prefer `client:visible` or `client:idle` over `client:load` where possible

---

## TypeScript

- Strict mode enabled from project start
- Strong typing across marketplace logic, API handlers, and database queries
- Shared types in `src/types/`
- Zod schemas for runtime validation with TypeScript inference (Phase 3+)

---

## React islands

React is used **only** for interactive components where Astro alone is insufficient:

| Use React for               | Use Astro for                  |
| --------------------------- | ------------------------------ |
| Shopping cart interactions  | Product listing pages          |
| Search suggestions          | Category pages                 |
| Product filters             | Product detail (mostly static) |
| Image galleries (if needed) | Layouts, header, footer        |
| Account forms               | Help and policy pages          |
| Seller/admin data tables    | SEO metadata                   |
| Checkout steps              | Static content                 |
| Modal dialogs               | Server-rendered content        |

Avoid converting every Astro component into React. Do not add `@astrojs/react` unless Phase 1 confirms it is needed.

---

## Authentication evaluation (Phase 4)

The authentication solution **will be selected after evaluation during Phase 4**. No provider is locked in during planning.

### Requirements

- Astro-compatible with SSR and API routes
- Email/password authentication (minimum)
- Session management with secure cookies
- Role support: customer, seller, administrator (and future staff)
- Prisma or PostgreSQL integration preferred
- Self-hosted (no per-user SaaS pricing preferred for marketplace scale)

### Candidate solutions

| Candidate                            | Advantages                                                                              | Disadvantages                                                        |
| ------------------------------------ | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **Better Auth**                      | Modern TypeScript; Prisma adapter; official Astro guides; self-hosted; extensible roles | Newer ecosystem; evaluation needed for marketplace RBAC patterns     |
| **Auth.js**                          | Mature ecosystem; many provider adapters; wide community                                | Configuration complexity; Astro integration patterns vary by adapter |
| **Lucia v3 (manual)**                | Full control; no framework lock-in; well-documented Astro patterns                      | More implementation work; session and role logic built in-house      |
| **Clerk / SaaS auth**                | Fast setup; hosted sessions                                                             | Per-user cost at scale; less control; vendor dependency              |
| **Other Astro-compatible solutions** | May emerge during Phase 4 research                                                      | Must meet RBAC and self-hosting requirements                         |

### Decision process

1. Review official documentation for Astro 7 compatibility
2. Prototype registration, login, and role checks with top candidates
3. Record decision in [DECISIONS.md](./DECISIONS.md)
4. Implement only the selected solution

See [SECURITY.md](./SECURITY.md) for authentication security requirements.

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

## Folder structure

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
    account/              # Customer account UI
    seller/               # Seller dashboard UI
    admin/                # Administrator dashboard UI
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
    repositories/         # Data access (where useful)
    notifications/        # Email and in-app notifications
  middleware/             # Route protection, locale
  types/                  # Shared TypeScript types
  i18n/                   # Translation files and utilities
  content/                # Static policies (after legal review)
  tests/                  # Unit, integration, e2e tests
prisma/                   # Schema and migrations (Phase 3)
public/                   # Static assets served as-is
docs/                     # Project documentation
```

---

## Server and client responsibilities

### Server (always)

- Authentication and session management
- Authorization and role checks
- Input validation
- Price, total, commission, and earnings calculations
- Order creation and status transitions
- Payment initiation and webhook processing
- Database reads and writes
- File upload validation and storage
- Email and notification dispatch
- Audit logging

### Client (where needed)

- UI interactivity (cart updates, filters, form UX)
- Optimistic UI updates with server reconciliation
- Client-side form validation (duplicate of server validation for UX only)
- Language switcher UI

### Never on client

- Price or commission determination
- Role assignment or elevation
- Payment confirmation logic
- Direct database access
- Secret or credential handling

---

## Environment strategy

### Environments

| Environment     | Purpose                | Database                     | Credentials            |
| --------------- | ---------------------- | ---------------------------- | ---------------------- |
| Local           | Development            | Local or dev PostgreSQL      | `.env` (not committed) |
| Staging/Preview | Pre-production testing | Separate staging database    | Platform env vars      |
| Production      | Live marketplace       | Separate production database | Platform env vars only |

### Rules

- Never commit `.env` files containing secrets
- Use separate values per environment
- Do not use production credentials locally
- Copy `.env.example` (Phase 1) and fill in values locally

---

## Environment variables

Never commit `.env` files containing secrets.

| Variable                 | Purpose                                                   | Phase |
| ------------------------ | --------------------------------------------------------- | ----- |
| `DATABASE_URL`           | PostgreSQL connection string                              | 3     |
| `AUTH_SECRET`            | Authentication signing secret                             | 4     |
| `AUTH_URL`               | Public application URL for auth callbacks                 | 4     |
| `PAYMENT_PROVIDER`       | Selected payment provider identifier                      | 11    |
| `PAYMENT_API_KEY`        | Payment provider API key                                  | 11    |
| `PAYMENT_WEBHOOK_SECRET` | Webhook signature verification secret                     | 11    |
| `STORAGE_PROVIDER`       | Image storage provider identifier                         | 7     |
| `STORAGE_BUCKET`         | Object storage bucket name                                | 7     |
| `STORAGE_ACCESS_KEY`     | Object storage access key                                 | 7     |
| `STORAGE_SECRET_KEY`     | Object storage secret key                                 | 7     |
| `STORAGE_PUBLIC_URL`     | Public base URL for stored images                         | 7     |
| `EMAIL_PROVIDER`         | Email service identifier                                  | 16    |
| `EMAIL_API_KEY`          | Email service API key                                     | 16    |
| `EMAIL_FROM`             | Default sender address                                    | 16    |
| `APP_URL`                | Public application URL                                    | 4     |
| `APP_ENV`                | Environment name (`development`, `staging`, `production`) | 1     |
| `DEFAULT_LOCALE`         | Default language (`en` or `fr`)                           | 2     |
| `COMMISSION_RATE`        | Default marketplace commission (basis points or decimal)  | 13    |

See [SECURITY.md](./SECURITY.md) for security requirements around secrets.

---

## Localization

### Initial languages

- English (`en`)
- French (`fr`)

### Routing strategy (pending — Phase 2/17)

| Approach                                                | Pros                                   | Cons                             |
| ------------------------------------------------------- | -------------------------------------- | -------------------------------- |
| **Locale path prefix** (`/en/products`, `/fr/products`) | SEO-friendly; shareable localized URLs | More routing complexity          |
| **Cookie/session preference** (same URLs)               | Simpler routing                        | Weaker SEO for localized content |

**Recommendation:** Locale path prefix for SEO. Final decision in Phase 2/17.

See [UI-DESIGN.md](./UI-DESIGN.md) for UI localization requirements.

---

## Coding standards

- Match existing conventions in the codebase
- Minimize scope — focused diffs only
- Reuse existing components and utilities
- Comments only for non-obvious business logic
- Protect financial operations with database transactions
- Explain database migrations before applying

See [CONTRIBUTING.md](./CONTRIBUTING.md) for full contribution guidelines.

---

## Future scalability

The modular monolith can evolve without premature microservices:

| Growth area      | Approach                                                            |
| ---------------- | ------------------------------------------------------------------- |
| Traffic          | CDN for static assets; database read replicas; caching              |
| Features         | New modules within monolith; clear service boundaries in `src/lib/` |
| Geography        | Locale routing; multi-currency schema (post-MVP)                    |
| Team size        | Folder structure supports parallel work on areas                    |
| Extract services | Only when a module has proven independent scaling needs             |

Do not introduce microservices, message queues, or separate services until the MVP is stable and metrics justify the complexity.

---

## Testing architecture (planned)

| Layer          | Tool                   | Phase |
| -------------- | ---------------------- | ----- |
| Type checking  | TypeScript             | 1     |
| Linting        | ESLint                 | 1     |
| Formatting     | Prettier               | 1     |
| Unit tests     | Vitest                 | 1     |
| E2E tests      | Playwright             | 19    |
| Database tests | Vitest + test database | 3     |

---

## Related documents

- [PRD.md](./PRD.md) — Product requirements, NFRs, and project principles
- [DATABASE.md](./DATABASE.md) — Data model and Prisma schema planning
- [ROUTES.md](./ROUTES.md) — Application routes and API endpoints
- [SECURITY.md](./SECURITY.md) — Security requirements and auth security
- [PAYMENTS.md](./PAYMENTS.md) — Payment integration architecture
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Hosting, adapter selection, and environments
- [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) — Planned UI tokens and components
- [DECISIONS.md](./DECISIONS.md) — Architecture decision log
- [ROADMAP.md](./ROADMAP.md) — Implementation phases
