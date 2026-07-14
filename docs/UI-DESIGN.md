# UI Design

[← Documentation index](./README.md)

Design philosophy, brand identity, and UI planning for Trimnexa. Implementation begins in Phase 1–2.

**Component tokens and specifications:** [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) (planning placeholders for Phase 2)

**Product context:** [PRD.md](./PRD.md) · **Implementation phases:** [ROADMAP.md](./ROADMAP.md)

## Design philosophy

Trimnexa must have an **original marketplace identity** suitable for Cameroon and the wider African market.

### Design goals

- Professional, modern, trustworthy, and clean
- Mobile-first and accessible
- Easy for first-time online shoppers
- Fast and consistent across all pages
- Suitable for Cameroon and the wider African market

**Do not** copy Amazon's exact colours, header layout, spacing, typography, icons, or page structure. Amazon may inspire the marketplace _business concept_ only — not the visual design.

---

## Brand identity

### Trimnexa brand requirements

- Original logo and visual identity (Phase 2)
- Professional and trustworthy appearance
- Distinct from major global marketplaces
- Culturally appropriate for Cameroon
- Works well on mobile devices

### Brand colours (planned — Phase 2)

Define an original colour palette during Phase 2. Requirements and token placeholders: [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md#brand-colors).

### Typography (planned — Phase 2)

Token placeholders and requirements: [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md#typography).

### Spacing and layout

Token placeholders: [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md#spacing) · [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md#grid-and-layout).

---

## Component library (Phase 2)

All UI components will be specified in [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) during Phase 2, including buttons, cards, forms, tables, modals, alerts, badges, and state patterns (empty, loading, error).

Build components in `src/components/common/` once tokens are defined.

---

## Responsive design

- **Mobile-first** approach — design for small screens first
- Breakpoints for tablet and desktop layouts
- Collapsible navigation on mobile
- Touch-friendly interactions
- Responsive product grids and image galleries
- Dashboard layouts adapt for seller and admin areas

Test on mobile, tablet, and desktop during each phase.

---

## Accessibility

Target strong accessibility practices:

- Semantic HTML
- Keyboard navigation throughout
- Visible focus indicators
- Accessible labels on all form fields
- Alternative text for images
- Proper heading order (no skipped levels)
- Accessible form error messages linked to fields
- Sufficient colour contrast
- Accessible modal behaviour (focus trap, escape to close)
- Reduced-motion consideration (`prefers-reduced-motion`)
- Screen-reader-friendly status messages and live regions

Run accessibility checks in Phase 2 and Phase 19.

---

## Marketplace homepage planning

Planned homepage sections (Phase 2):

1. **Announcement bar** — Promotions, shipping info, seller recruitment
2. **Main header** — Logo, search bar, account controls, cart
3. **Category navigation** — Top-level product categories
4. **Hero banner** — Featured promotion or seasonal campaign
5. **Featured categories** — Visual category tiles
6. **Popular products** — Best-selling or trending items
7. **New products** — Recently added listings
8. **Deals or promotions** — Discounted items
9. **Featured sellers** — Highlighted verified shops
10. **Trust and buyer-protection** — Security, returns, support info
11. **Become-a-seller section** — Seller recruitment CTA
12. **Newsletter section** — Email signup (optional for MVP)
13. **Footer** — Links, policies, contact, social

---

## Localization (UI)

### Initial languages

- English (`en`)
- French (`fr`)

### UI requirements

- Language switcher in the header
- Translated navigation labels
- Translated button text, form labels, and validation messages
- Translated static policy pages (after legal review)
- Product descriptions remain seller-provided unless separately translated
- Default locale defined clearly in configuration

### Routing strategy (pending — Phase 2/17)

| Approach                                                | Pros                                   | Cons                             |
| ------------------------------------------------------- | -------------------------------------- | -------------------------------- |
| **Locale path prefix** (`/en/products`, `/fr/products`) | SEO-friendly; shareable localized URLs | More routing complexity          |
| **Cookie/session preference** (same URLs)               | Simpler routing                        | Weaker SEO for localized content |

**Recommendation:** Locale path prefix for SEO. Final decision in Phase 2/17.

See [ARCHITECTURE.md](./ARCHITECTURE.md#localization) for technical implementation.

---

## SEO and metadata (UI)

Public pages should include:

- Unique page titles and meta descriptions
- Canonical URLs
- Open Graph metadata and social-sharing images
- Product structured data (JSON-LD)
- Breadcrumb navigation
- Human-readable URLs

Private pages (account, seller, admin) use `noindex` meta tags.

---

## Legal and policy pages (UI placeholders)

Reserve UI for these pages (content requires legal review):

- Privacy policy, terms and conditions, customer terms
- Seller agreement, return and refund policy, delivery policy
- Cookie information, prohibited-products policy
- Buyer-protection policy, seller code of conduct
- Contact and company information

Use clear placeholder styling indicating content is pending legal approval.

---

## Related documents

- [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) — Planned tokens and components (authoritative for UI specs)
- [PRD.md](./PRD.md) — Product requirements and accessibility NFRs
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Astro components and React islands
- [ROADMAP.md](./ROADMAP.md) — Phase 1–2 implementation tasks
- [ROUTES.md](./ROUTES.md) — Page routes and navigation structure
