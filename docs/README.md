# Trimnexa Documentation

Welcome to the Trimnexa project documentation. This folder contains the complete planning, architecture, and operational reference for the marketplace platform.

**Website:** [https://trimnexa.com](https://trimnexa.com)

**Current project phase:** Phase 0 complete — Phase 1 (Project foundation) next, pending approval

**Last roadmap update:** 2026-07-14

---

## Documentation index

| Document                               | Description                                                                          |
| -------------------------------------- | ------------------------------------------------------------------------------------ |
| [PRD.md](./PRD.md)                     | Product Requirements — vision, mission, values, goals, principles, NFRs, MVP         |
| [ROADMAP.md](./ROADMAP.md)             | Development phases 0–22, project progress, acceptance criteria, definition of done   |
| [ARCHITECTURE.md](./ARCHITECTURE.md)   | Technology stack, high-level architecture diagram, auth evaluation, folder structure |
| [DATABASE.md](./DATABASE.md)           | Entities, relationships, money handling, orders, commissions                         |
| [ROUTES.md](./ROUTES.md)               | Public, auth, customer, seller, admin, and API routes                                |
| [UI-DESIGN.md](./UI-DESIGN.md)         | Design philosophy, brand identity, homepage, accessibility                           |
| [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) | Planned design tokens and components (Phase 2 — planning only)                       |
| [SECURITY.md](./SECURITY.md)           | Authentication requirements, authorization, validation, audit logs                   |
| [PAYMENTS.md](./PAYMENTS.md)           | Commission model, payouts, Mobile Money, webhooks, refunds                           |
| [DEPLOYMENT.md](./DEPLOYMENT.md)       | Environments, hosting comparison, Hetzner DNS, HTTPS, CI/CD                          |
| [DECISIONS.md](./DECISIONS.md)         | Architecture decision log and template                                               |
| [RISKS.md](./RISKS.md)                 | Project risks and mitigation strategies                                              |
| [CHANGELOG.md](./CHANGELOG.md)         | Version history and release notes                                                    |
| [CONTRIBUTING.md](./CONTRIBUTING.md)   | AI development rules, coding standards, review process                               |

---

## Quick links

- [Project entry page (root README)](../README.md)
- [Project progress (all phases)](./ROADMAP.md#project-progress)
- [Vision and mission](./PRD.md#vision-statement)
- [Project principles](./PRD.md#project-principles)
- [Success metrics](./PRD.md#success-metrics)
- [High-level architecture](./ARCHITECTURE.md#high-level-architecture)
- [Authentication evaluation](./ARCHITECTURE.md#authentication-evaluation-phase-4)
- [Current phase and progress rules](./ROADMAP.md#current-phase)
- [Pending business decisions](./ROADMAP.md#pending-business-decisions)
- [Environment variables](./ARCHITECTURE.md#environment-variables)

---

## Document relationships

```
PRD (what & why)
  ├── ROADMAP (when)
  ├── ARCHITECTURE (how — technical)
  │     ├── DATABASE
  │     ├── ROUTES
  │     ├── SECURITY
  │     └── DEPLOYMENT
  ├── UI-DESIGN + DESIGN-SYSTEM (how — visual)
  ├── PAYMENTS (financial flows)
  ├── DECISIONS (choices made)
  ├── RISKS (what could go wrong)
  └── CONTRIBUTING (how to work on the project)
```

---

_Update the relevant document when completing roadmap phases or making architectural decisions._
