# Changelog

[← Documentation index](./README.md)

All notable changes to the Trimnexa project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
