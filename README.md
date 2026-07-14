# Trimnexa

A trusted multi-vendor e-commerce marketplace for Cameroon. Trimnexa connects verified local sellers with customers through an original platform design, secure payments in XAF/FCFA, and bilingual support in English and French.

**Website:** [https://trimnexa.com](https://trimnexa.com)

**Current project phase:** Milestone 5 — Phase 5 complete; pending owner review

**Last roadmap update:** 2026-07-14

---

## Vision

> Our vision is to build the most trusted digital marketplace in Cameroon, empowering local businesses through secure technology, exceptional customer experience, and modern e-commerce.

Full vision, mission, values, and business goals: [docs/PRD.md](docs/PRD.md)

---

## Project progress

- [x] Phase 0 — Planning
- [x] Phase 1 — Foundation (1A, 1B, 1C complete)
- [x] Phase 2 — Public website (EN/FR, header, footer, homepage)
- [x] Phase 3 — Database foundation (Prisma, migrations, seed)
- [x] Phase 4 — Authentication (Better Auth)
- [x] Phase 5 — Customer account
- [ ] Phase 6 — Seller and shop
- [ ] Phase 7 — Products
- [ ] Phase 8 — Catalogue and search
- [ ] Phase 9 — Cart and wishlist
- [ ] Phase 10 — Checkout
- [ ] Phase 11 — Payments
- [ ] Phase 12 — Fulfilment
- [ ] Phase 13 — Commissions and payouts
- [ ] Phase 14 — Returns and disputes
- [ ] Phase 15 — Admin dashboard
- [ ] Phase 16 — Notifications
- [ ] Phase 17 — Internationalization
- [ ] Phase 18 — Security hardening
- [ ] Phase 19 — Testing
- [ ] Phase 20 — Deployment
- [ ] Phase 21 — MVP launch
- [ ] Phase 22 — Expansion

Full roadmap with tasks and acceptance criteria: [docs/ROADMAP.md](docs/ROADMAP.md)

---

## Current status

| Item                 | Status                                                             |
| -------------------- | ------------------------------------------------------------------ |
| Framework            | Astro `^7.0.9`                                                     |
| Language             | TypeScript (strict)                                                |
| Node.js              | `>=22.12.0`                                                        |
| Database             | Prisma 7 + PostgreSQL                                              |
| Authentication       | Better Auth (email/password, sessions, RBAC)                       |
| Customer account     | Dashboard, profile, addresses, orders/wishlist/support foundations |
| Marketplace features | Catalogue and checkout not started                                 |
| Deployment adapter   | `@astrojs/node` (server output)                                    |

Run `npm run db:migrate:dev` and `npm run db:seed` after configuring PostgreSQL and `.env`.

---

## Technology stack

| Layer          | Technology                                     |
| -------------- | ---------------------------------------------- |
| Framework      | Astro 7                                        |
| Language       | TypeScript (strict)                            |
| Styling        | Tailwind CSS 4 (`@tailwindcss/vite`)           |
| Interactivity  | React 19 (`@astrojs/react` — islands prepared) |
| Validation     | Zod (environment validation)                   |
| Tooling        | ESLint, Prettier, Vitest, `astro check`        |
| Database       | PostgreSQL + Prisma (planned — Phase 3)        |
| Authentication | TBD — evaluated in Phase 4                     |
| Payments       | TBD — Cameroon providers (planned — Phase 11)  |

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full stack, high-level architecture diagram, and planned dependencies.

---

## Quick start

### Prerequisites

- Node.js `>=22.12.0`
- npm
- Git

### Setup

```sh
git clone <repository-url>
cd trimnexa
npm install
npm run dev
```

Development server: [http://localhost:4321](http://localhost:4321)

### Commands

| Command                  | Action                              |
| ------------------------ | ----------------------------------- |
| `npm install`            | Install dependencies                |
| `npm run dev`            | Start dev server                    |
| `npm run build`          | Build for production                |
| `npm run preview`        | Preview production build            |
| `npm run lint`           | Run ESLint                          |
| `npm run format`         | Format with Prettier                |
| `npm run typecheck`      | Astro + TypeScript check            |
| `npm run test`           | Run Vitest unit tests               |
| `npm run db:migrate:dev` | Apply migrations (local PostgreSQL) |
| `npm run db:seed`        | Seed categories and dev settings    |

Optional background dev server: `astro dev --background` (see [AGENTS.md](AGENTS.md))

---

## Folder structure

```text
/
├── docs/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/      # Button, Card, Alert, Container
│   │   └── layout/      # SeoHead
│   ├── config/
│   ├── layouts/         # BaseLayout, Layout (compat)
│   ├── pages/
│   ├── seo/             # SEO metadata utilities
│   ├── styles/          # Global CSS (Tailwind entry)
│   └── types/
├── .env.example
├── astro.config.mjs
├── eslint.config.js
├── package.json
├── prettier.config.js
└── tsconfig.json
```

Target application structure: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#folder-structure)

---

## Documentation

| Document                                       | Description                                                   |
| ---------------------------------------------- | ------------------------------------------------------------- |
| [docs/README.md](docs/README.md)               | Documentation index                                           |
| [docs/PRD.md](docs/PRD.md)                     | Product requirements, vision, goals, NFRs, success metrics    |
| [docs/ROADMAP.md](docs/ROADMAP.md)             | Development phases 0–22, project progress, definition of done |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)   | Technology stack, high-level architecture, auth evaluation    |
| [docs/DATABASE.md](docs/DATABASE.md)           | Entities, relationships, money handling                       |
| [docs/ROUTES.md](docs/ROUTES.md)               | Public, auth, customer, seller, admin routes                  |
| [docs/UI-DESIGN.md](docs/UI-DESIGN.md)         | Design philosophy, brand identity, accessibility              |
| [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) | Planned design tokens and components (Phase 2)                |
| [docs/SECURITY.md](docs/SECURITY.md)           | Authentication, authorization, security checklist             |
| [docs/PAYMENTS.md](docs/PAYMENTS.md)           | Commission model, payouts, payment providers                  |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)       | Environments, hosting, Hetzner DNS, CI/CD                     |
| [docs/DECISIONS.md](docs/DECISIONS.md)         | Architecture decision log                                     |
| [docs/RISKS.md](docs/RISKS.md)                 | Project risks and mitigations                                 |
| [docs/CHANGELOG.md](docs/CHANGELOG.md)         | Version history                                               |
| [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)   | AI rules, coding standards, review process                    |

---

## Development workflow

1. Read this README and [docs/ROADMAP.md](docs/ROADMAP.md) to identify the current phase
2. Confirm work belongs to the current phase before implementing
3. Implement only the requested scope — one phase or feature at a time
4. Run relevant checks (build, lint, typecheck, tests)
5. Update roadmap checkboxes and relevant documentation
6. Record architectural decisions in [docs/DECISIONS.md](docs/DECISIONS.md)
7. Do not begin a new phase until the previous phase is stable

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for contribution rules and AI-assisted development guidelines.

---

## License

Trimnexa source code, branding, and visual identity are original to this project. Do not copy Amazon's source code, branding, visual identity, or copyrighted layout.

Legal pages are placeholders until reviewed by a qualified legal professional familiar with Cameroon and, where relevant, Germany or the European Union. Do not present generated legal text as legally approved.

---

_For the complete project plan, start with [docs/README.md](docs/README.md)._
