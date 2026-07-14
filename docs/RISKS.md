# Project Risks

[← Documentation index](./README.md)

This document identifies known project risks and their mitigation strategies. Add new risks as they are discovered during development.

---

## Risk register

| Risk                                                     | Mitigation                                                                                                 |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Marketplace scope becoming too large                     | Phase-gated [ROADMAP.md](./ROADMAP.md); no new phase until prior is stable                                 |
| Payment providers not supporting automatic seller splits | Administrator-reviewed payouts; immutable ledger tracks all obligations — see [PAYMENTS.md](./PAYMENTS.md) |
| Legal restrictions on holding seller funds               | Follow payment provider's supported model; legal review before launch                                      |
| Seller fraud                                             | Seller verification, application review, audit logs, suspension tools                                      |
| Customer fraud                                           | Order verification, payment confirmation via webhook, dispute process                                      |
| Fake products                                            | Product moderation, prohibited-product policy, administrator approval                                      |
| Delivery failures                                        | Clear status tracking, support tickets, seller accountability metrics                                      |
| Incomplete physical addresses                            | Cameroon-adapted address fields (landmark, quarter, phone, GPS) — see [PRD.md](./PRD.md)                   |
| Mobile-money payment failures                            | Retry guidance, clear error messages, admin payment visibility                                             |
| Refund and dispute complexity                            | Phased workflow in Phase 14; connect refunds to ledger and payments                                        |
| Multi-seller order complexity                            | Parent order + suborders; seller-grouped checkout review — see [DATABASE.md](./DATABASE.md)                |
| Data-protection requirements                             | Data minimization, secure storage, privacy policy with legal review                                        |
| Seller identity-document security                        | Encrypted storage, access controls, audit logging — see [SECURITY.md](./SECURITY.md)                       |
| Product-image storage cost                               | Object storage with size limits; image optimization                                                        |
| Insufficient customer support                            | Support ticket system in Phase 16; staffed before launch                                                   |
| Poor seller fulfilment                                   | Order metrics, seller ratings, suspension for repeated failures                                            |
| Premature launch across too many cities                  | Controlled launch in Phase 21; one or two cities initially                                                 |
| Overuse of client-side JavaScript                        | Astro-first; React islands only where needed — see [ARCHITECTURE.md](./ARCHITECTURE.md)                    |
| Weak server-side authorization                           | Auth checks on every route/API; dedicated security review in Phase 18                                      |
| Inaccurate commission calculations                       | Server-side calculation; unit tests; immutable order snapshots                                             |
| AI-generated code introducing inconsistent architecture  | [CONTRIBUTING.md](./CONTRIBUTING.md) AI rules; code review; phase-scoped changes                           |
| Documentation drift from implementation                  | Update relevant `docs/` file when completing roadmap phases                                                |
| Provisional brand palette used before Phase 2 approval   | Tokens marked provisional in DESIGN-SYSTEM.md and DECISIONS.md; final palette decided in Phase 2           |

---

## Related documents

- [PRD.md](./PRD.md) — Project principles and NFRs
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Authentication evaluation and technical standards
- [ROADMAP.md](./ROADMAP.md) — Phase-gated development
- [DECISIONS.md](./DECISIONS.md) — Record mitigations that become architectural decisions
- [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) — Planned UI components
