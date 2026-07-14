# Architecture Decision Log

[← Documentation index](./README.md)

This document records significant architectural and technical decisions for Trimnexa. Each decision includes the date, rationale, and consequences.

---

## Decision template

Use this template when adding new decisions:

```markdown
### [Short title]

| Field                       | Value                                                       |
| --------------------------- | ----------------------------------------------------------- |
| **Date**                    | YYYY-MM-DD                                                  |
| **Status**                  | Proposed / Accepted / Superseded                            |
| **Decision**                | What was decided                                            |
| **Reason**                  | Why this choice was made                                    |
| **Consequences**            | Positive and negative effects; what it enables or restricts |
| **Alternatives considered** | Other options evaluated                                     |
```

---

## Initial decisions

| Date       | Decision                                                     | Reason                                                            | Consequences                                                                       |
| ---------- | ------------------------------------------------------------ | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 2026-07-14 | Project uses Astro as the main framework                     | SEO, performance, islands architecture, team familiarity          | SSR adapter required when adding API routes and auth                               |
| 2026-07-14 | Project uses TypeScript                                      | Type safety across marketplace logic                              | Strict config from project start                                                   |
| 2026-07-14 | React used only for interactive islands                      | Minimize client JS; Astro for static/SSR content                  | `@astrojs/react` added in Phase 1 if needed                                        |
| 2026-07-14 | Modular monolith architecture                                | MVP maintainability and simplicity                                | No microservices until proven necessary                                            |
| 2026-07-14 | Public content favours server rendering or static generation | SEO for product and category pages                                | Adapter needed for dynamic server routes                                           |
| 2026-07-14 | Financial calculations happen on the server                  | Security and auditability                                         | All price/commission logic in server code                                          |
| 2026-07-14 | PostgreSQL preferred production database                     | ACID transactions, relational marketplace data                    | DATABASE_URL and Prisma in Phase 3                                                 |
| 2026-07-14 | Prisma ORM planned                                           | Official Astro 7 guide; migrations                                | Evaluate compatibility in Phase 3                                                  |
| 2026-07-14 | Authentication solution deferred to Phase 4                  | Multiple viable Astro-compatible options; avoid premature lock-in | Evaluate Better Auth, Auth.js, Lucia, and others in Phase 4                        |
| 2026-07-14 | Marketplace launch begins with limited MVP                   | Reduce risk; validate operations before scaling                   | Feature scope strictly phased                                                      |
| 2026-07-14 | Seller payouts not released before fulfilment                | Fraud and dispute risk reduction                                  | Slower seller cash flow; ledger tracks pending vs available                        |
| 2026-07-14 | English and French required                                  | Cameroon bilingual market                                         | i18n routing strategy TBD Phase 2/17                                               |
| 2026-07-14 | Currency is XAF/FCFA                                         | Initial market                                                    | All monetary fields use XAF                                                        |
| 2026-07-14 | trimnexa.com DNS managed in Hetzner                          | Domain already purchased                                          | DNS pointed to chosen host in Phase 20                                             |
| 2026-07-14 | Hosting-neutral until Phase 20                               | Domain on Hetzner ≠ app must be on Hetzner                        | No deployment adapter installed until Phase 20                                     |
| 2026-07-14 | Amazon may inspire marketplace concept only                  | Business model reference                                          | Visual design and code must remain original                                        |
| 2026-07-14 | Parent order + seller suborders                              | Multi-seller checkout with per-seller fulfilment                  | More complex order model; clearer commission tracking                              |
| 2026-07-14 | Documentation split into `docs/` folder                      | Professional structure for large production project               | README is entry page; detailed docs in dedicated files                             |
| 2026-07-14 | Tailwind CSS 4 via `@tailwindcss/vite`                       | Official Astro integration for utility-first styling              | `src/styles/global.css`                                                            |
| 2026-07-14 | React via `@astrojs/react`                                   | Official islands integration for future interactivity             | No React components in Phase 1A                                                    |
| 2026-07-14 | Path alias `@/*` → `src/*`                                   | Cleaner imports across foundation modules                         | `tsconfig.json` + `astro.config.mjs`                                               |
| 2026-07-14 | Zod for environment validation                               | Type-safe env parsing at build/dev time                           | `src/config/env.ts`; secrets in `.env` only                                        |
| 2026-07-14 | Provisional brand palette (teal + gold)                      | Foundation placeholder until Phase 2 brand approval               | `src/styles/tokens.css`; **Status: Proposed** — owner approval required in Phase 2 |
| 2026-07-14 | Vitest for unit tests                                        | Test SEO and foundation utilities                                 | `npm run test`; expand in Phase 19                                                 |

---

## Pending decisions

| Decision                | Options                                                  | Target phase |
| ----------------------- | -------------------------------------------------------- | ------------ |
| Authentication solution | Better Auth, Auth.js, Lucia v3, other Astro-compatible   | Phase 4      |
| Localization routing    | Locale prefix (`/en`, `/fr`) vs cookie preference        | Phase 2/17   |
| Brand colour palette    | Approve provisional teal + gold vs alternative direction | Phase 2      |
| Payment provider        | CamPay vs direct MTN MoMo vs Orange WebPay               | Phase 11     |
| Guest cart strategy     | Session-based guest cart vs auth-required cart           | Phase 9      |
| Initial launch city     | Douala, Yaoundé, or both                                 | Phase 21     |
| Production hosting      | Managed platform vs Hetzner Node.js                      | Phase 20     |

Document the final choice in this log when each decision is made.

---

## Related documents

- [PRD.md](./PRD.md) — Product vision and business goals
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Authentication evaluation and stack
- [ROADMAP.md](./ROADMAP.md) — Phase 4 implementation and project progress
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Hosting comparison (Phase 20)
- [PAYMENTS.md](./PAYMENTS.md) — Payment provider selection (Phase 11)
- [SECURITY.md](./SECURITY.md) — Auth security requirements
