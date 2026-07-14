# Contributing to Trimnexa

[← Documentation index](./README.md)

Guidelines for human contributors and AI-assisted development on the Trimnexa project.

---

## Before you start

1. Read the [root README](../README.md) for project overview and quick start
2. Read [ROADMAP.md](./ROADMAP.md) to identify the current phase
3. Confirm your work belongs to the current phase
4. Read relevant technical docs ([ARCHITECTURE.md](./ARCHITECTURE.md), [SECURITY.md](./SECURITY.md), etc.)

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
10. Do not change the stack without approval — document changes in [DECISIONS.md](./DECISIONS.md)
11. Do not create fake production credentials
12. Do not claim tests passed unless they were run
13. Do not mark roadmap items completed without verification
14. Do not remove roadmap history
15. Keep commits focused
16. Explain database migrations before applying them
17. Protect financial operations with database transactions
18. Ask for clarification when a business rule is genuinely unresolved

---

## Rules for Cursor

- Start every task by reading [ROADMAP.md](./ROADMAP.md) and the root README
- Update the relevant `docs/` file when completing roadmap items (primarily ROADMAP.md checkboxes)
- Add architectural decisions to [DECISIONS.md](./DECISIONS.md)
- Add newly discovered risks to [RISKS.md](./RISKS.md)
- Do not begin a new phase until the previous phase is stable
- Do not install packages or modify application code unless the current phase requires it
- Summarize changed files and validation results after each task

---

## Coding standards

- **TypeScript:** Strict mode; strong typing throughout
- **Astro-first:** Use Astro components for static and server-rendered content; React islands only for interactivity
- **Server-side validation:** All inputs validated on the server with Zod (Phase 3+)
- **Authorization:** Server-side checks on every protected route and API endpoint
- **Money:** Never use floating-point; integer minor units or Decimal; always store currency
- **Comments:** Code should be self-explanatory; comment only non-obvious business logic
- **Scope:** Minimize diff size; do not change unrelated code
- **Conventions:** Match existing naming, types, and patterns in the codebase

See [ARCHITECTURE.md](./ARCHITECTURE.md) for folder structure and server/client responsibilities.

---

## Commit standards

- Use [Conventional Commits](https://www.conventionalcommits.org/) with a concise subject describing the **actual work** (not milestone or phase numbers)
- Subject line: imperative mood, lowercase after the type prefix (e.g. `feat: add prisma database layer`)
- Body (optional): explain _why_ when the subject alone is not enough
- One logical change per commit where practical
- Never commit `.env` files or secrets
- Never commit production credentials
- Update documentation in the same commit when behavior or architecture changes
- Track roadmap progress in `docs/ROADMAP.md` and `docs/CHANGELOG.md` — do not put milestone names in commit messages

**Do not use** subjects such as `feat: Milestone 2` or `feat: Phase 3`.

Examples:

```
feat: add prisma database layer with migrations and seed

feat: add bilingual public layout with header and footer

fix: resolve mobile navigation toggle visibility

docs: document financial data handling rules
```

---

## Branch strategy

- `main` — stable, deployable code
- Feature branches for phase work or discrete features (e.g. `phase-1-foundation`, `feature/cart`)
- Small, reviewable pull requests preferred
- Do not merge incomplete phases
- Run type checking, linting, and tests before merging (when available)

---

## Documentation rules

- **Root README.md** — Concise entry page only; link to `docs/` for details
- **docs/ROADMAP.md** — Source of truth for phase progress and checkboxes
- **docs/DECISIONS.md** — Record significant architectural choices
- **docs/RISKS.md** — Record new risks with mitigations
- **docs/CHANGELOG.md** — Record version releases
- Update the relevant doc when completing work; do not duplicate content across files
- Use markdown links between documents
- Do not falsely mark roadmap items as complete

---

## Review process

Before marking any roadmap item complete:

1. Feature meets the requirement stated in [ROADMAP.md](./ROADMAP.md)
2. Type checking passes
3. Linting passes
4. Relevant tests pass
5. Production build passes where applicable
6. Mobile and desktop behaviour checked
7. Accessibility considered
8. Authorization verified for protected features
9. Error handling included
10. Documentation updated
11. No secrets committed
12. No unrelated files changed

See [Definition of done](./ROADMAP.md#definition-of-done) for the full checklist.

---

## Testing strategy (planned)

Layered testing to be implemented across phases:

- Type checking and linting (Phase 1)
- Unit tests (Phase 1+)
- Component tests
- Integration tests
- End-to-end tests (Phase 19)
- Authentication and authorization tests
- Checkout, commission, and payment-webhook tests
- Seller-isolation and administrator-permission tests
- Accessibility checks
- Responsive testing
- Manual acceptance testing

Critical flows requiring strongest testing: registration, login, seller approval, product creation, cart, checkout, payment confirmation, order creation, commission calculation, delivery confirmation, seller earnings, refunds, administrator actions.

---

## Related documents

- [PRD.md](./PRD.md) — Product vision, principles, and NFRs
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Authentication evaluation and coding standards
- [ROADMAP.md](./ROADMAP.md) — Phase-gated development and definition of done
- [SECURITY.md](./SECURITY.md) — Security requirements
- [DECISIONS.md](./DECISIONS.md) — Architecture decisions
- [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) — Component implementation standards (Phase 2)
