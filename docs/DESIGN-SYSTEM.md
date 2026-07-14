# Design System

[← Documentation index](./README.md)

Trimnexa design tokens and base components. **Phase 1C foundation** and **Phase 2 public UI** implemented.

**Colour palette status:** The teal-and-gold token set is **provisional** — pending project-owner approval.

**Logo status:** SVG mark + wordmark in `Logo.astro` is **provisional** — pending final brand design approval.

**Source files:** `src/styles/tokens.css` · `src/styles/global.css` · `src/components/common/` · `src/components/layout/` · `src/components/brand/` · `src/components/home/`

**Related:** [UI-DESIGN.md](./UI-DESIGN.md) · [ROADMAP.md](./ROADMAP.md)

---

## Phase 1C status (foundation)

| Area                  | Status                    | Location                                                        |
| --------------------- | ------------------------- | --------------------------------------------------------------- |
| Design tokens         | Implemented               | `src/styles/tokens.css`                                         |
| Global styles         | Implemented               | `src/styles/global.css`                                         |
| Button                | Implemented               | `src/components/common/Button.astro`                            |
| Card                  | Implemented               | `src/components/common/Card.astro`                              |
| Alert                 | Implemented               | `src/components/common/Alert.astro`                             |
| Container             | Implemented               | `src/components/common/Container.astro`                         |
| Logo                  | Implemented (provisional) | `src/components/brand/Logo.astro`, `public/brand/logo-mark.svg` |
| Forms, tables, modals | Phase 2                   | —                                                               |

### Token summary

- **Primary:** Deep teal (`primary-600` #0b6e6e) — trust, distinct from Amazon blue/orange
- **Accent:** Warm gold (`accent-500` #e8a317) — highlights and commerce warmth
- **Neutrals:** Green-tinted slate scale (`neutral-50`–`900`)
- **Semantic:** success, warning, error, info scales
- **Typography:** System sans stack with French character support
- **Radius:** sm 4px, md 8px, lg 12px, xl 16px
- **Motion:** Respects `prefers-reduced-motion` in global CSS

---

## Implemented base components

### Button (`Button.astro`)

| Prop       | Values                                    | Default   |
| ---------- | ----------------------------------------- | --------- |
| `variant`  | `primary`, `secondary`, `ghost`, `danger` | `primary` |
| `size`     | `sm`, `md`, `lg`                          | `md`      |
| `href`     | URL string (renders `<a>`)                | —         |
| `disabled` | boolean                                   | `false`   |

Minimum touch height: 36px (sm), 44px (md/lg) for accessibility.

### Card (`Card.astro`)

| Prop      | Values             | Default   |
| --------- | ------------------ | --------- |
| `variant` | `default`, `muted` | `default` |

### Alert (`Alert.astro`)

| Prop      | Values                                | Default |
| --------- | ------------------------------------- | ------- |
| `variant` | `info`, `success`, `warning`, `error` | `info`  |
| `title`   | string                                | —       |

Uses `role="alert"` for screen readers.

### Container (`Container.astro`)

Responsive max-width container (`max-w-7xl`) with horizontal padding.

---

## Purpose

The Trimnexa design system provides a consistent, original, accessible visual language for the entire marketplace — distinct from major global platforms such as Amazon.

---

## Logo

| Item                  | Status           | Notes                                                   |
| --------------------- | ---------------- | ------------------------------------------------------- |
| Primary logo          | _To be designed_ | Original Trimnexa mark; suitable for header and favicon |
| Logo mark (icon only) | _To be designed_ | For compact mobile header and app icons (future)        |
| Logo usage rules      | _To be defined_  | Minimum size, clear space, light/dark backgrounds       |
| Favicon set           | _To be defined_  | SVG and ICO variants                                    |

---

## Brand colors

| Token               | Status           | Notes                              |
| ------------------- | ---------------- | ---------------------------------- |
| Primary brand color | **Defined**      | `primary-600` #0b6e6e (deep teal)  |
| Secondary color     | **Defined**      | `neutral` scale for UI chrome      |
| Accent color        | **Defined**      | `accent-500` #e8a317 (warm gold)   |
| Neutral palette     | **Defined**      | `neutral-50` through `neutral-900` |
| Semantic: success   | **Defined**      | `success-600` #1a7f4b              |
| Semantic: warning   | **Defined**      | `warning-600` #c17d0d              |
| Semantic: error     | **Defined**      | `error-600` #b91c1c                |
| Semantic: info      | **Defined**      | `info-600` #0369a1                 |
| Contrast compliance | _To be verified_ | WCAG AA audit in Phase 2           |

---

## Typography

| Item               | Status      | Notes                                  |
| ------------------ | ----------- | -------------------------------------- |
| Font family — body | **Defined** | `var(--font-sans)` system stack        |
| Type scale         | **Defined** | `text-xs` through `text-4xl` in tokens |

---

## Spacing

| Item                       | Status          | Notes                         |
| -------------------------- | --------------- | ----------------------------- |
| Base spacing unit          | _To be defined_ | e.g. 4px grid                 |
| Spacing scale              | _To be defined_ | xs, sm, md, lg, xl, 2xl, etc. |
| Component internal padding | _To be defined_ | Buttons, cards, inputs        |
| Section vertical rhythm    | _To be defined_ | Homepage and page sections    |

---

## Grid and layout

| Item              | Status          | Notes                            |
| ----------------- | --------------- | -------------------------------- |
| Content max-width | _To be defined_ | Desktop readability              |
| Column grid       | _To be defined_ | Product grids, dashboard layouts |
| Gutter sizes      | _To be defined_ | Per breakpoint                   |
| Container padding | _To be defined_ | Mobile and desktop               |

---

## Buttons

| Variant                | Status          | Notes                              |
| ---------------------- | --------------- | ---------------------------------- |
| Primary                | **Implemented** | `Button.astro` variant `primary`   |
| Secondary              | **Implemented** | `Button.astro` variant `secondary` |
| Ghost / outline        | **Implemented** | `Button.astro` variant `ghost`     |
| Danger                 | **Implemented** | `Button.astro` variant `danger`    |
| Sizes (sm, md, lg)     | **Implemented** | Touch-friendly min heights         |
| Disabled               | **Implemented** | `disabled` prop                    |
| Loading / icon buttons | Phase 2         | —                                  |

---

## Cards

| Variant                   | Status           | Notes                       |
| ------------------------- | ---------------- | --------------------------- |
| Product card              | _To be designed_ | Image, title, price, seller |
| Shop card                 | _To be designed_ | Logo, name, rating          |
| Info card                 | _To be designed_ | Help, policy summaries      |
| Dashboard stat card       | _To be designed_ | Seller/admin metrics        |
| Elevation / shadow levels | _To be defined_  |                             |

---

## Forms

| Item                     | Status           | Notes                           |
| ------------------------ | ---------------- | ------------------------------- |
| Text input               | _To be designed_ | Default, focus, error, disabled |
| Select / dropdown        | _To be designed_ |                                 |
| Checkbox and radio       | _To be designed_ |                                 |
| Textarea                 | _To be designed_ |                                 |
| Label and helper text    | _To be designed_ |                                 |
| Validation error display | _To be designed_ | Accessible, linked to fields    |
| Field groups             | _To be designed_ | Address forms, checkout         |

---

## Navigation

| Item                | Status          | Notes                                                    |
| ------------------- | --------------- | -------------------------------------------------------- |
| Main header         | **Implemented** | `Header.astro` — logo, search, account, cart, mobile nav |
| Mobile navigation   | **Implemented** | Checkbox toggle, no client JS                            |
| Category navigation | **Implemented** | `CategoryNav.astro` — placeholder categories             |
| Footer              | **Implemented** | `Footer.astro` — links, newsletter placeholder           |
| Language switcher   | **Implemented** | `LanguageSwitcher.astro` — EN / FR                       |

---

## Icons

| Item                 | Status          | Notes                                |
| -------------------- | --------------- | ------------------------------------ |
| Icon library choice  | _To be decided_ | Consistent set; original or licensed |
| Icon sizes           | _To be defined_ | sm, md, lg                           |
| Icon + text patterns | _To be defined_ | Navigation, buttons                  |

---

## Tables

| Item                        | Status           | Notes                        |
| --------------------------- | ---------------- | ---------------------------- |
| Data table (admin/seller)   | _To be designed_ | Sortable columns, pagination |
| Table header and row styles | _To be designed_ |                              |
| Empty table state           | _To be designed_ |                              |
| Responsive table behaviour  | _To be designed_ | Mobile card fallback         |

---

## Modals

| Item                | Status           | Notes                       |
| ------------------- | ---------------- | --------------------------- |
| Modal container     | _To be designed_ | Focus trap, escape to close |
| Confirmation dialog | _To be designed_ | Dangerous actions           |
| Drawer (mobile)     | _To be designed_ | Optional for filters/cart   |

---

## Alerts

| Variant            | Status           | Notes            |
| ------------------ | ---------------- | ---------------- |
| Success            | _To be designed_ |                  |
| Warning            | _To be designed_ |                  |
| Error              | _To be designed_ |                  |
| Info               | _To be designed_ |                  |
| Dismissible alerts | _To be designed_ | Announcement bar |

---

## Badges

| Variant          | Status           | Notes                             |
| ---------------- | ---------------- | --------------------------------- |
| Status badge     | _To be designed_ | Order status, product status      |
| Stock badge      | _To be designed_ | In stock, low stock, out of stock |
| Sale / new badge | _To be designed_ | Promotions                        |
| Count badge      | _To be designed_ | Cart item count                   |

---

## Empty states

| Context              | Status           | Notes |
| -------------------- | ---------------- | ----- |
| Empty cart           | _To be designed_ |       |
| No search results    | _To be designed_ |       |
| No orders            | _To be designed_ |       |
| No products (seller) | _To be designed_ |       |
| Empty wishlist       | _To be designed_ |       |

---

## Loading states

| Item               | Status           | Notes                        |
| ------------------ | ---------------- | ---------------------------- |
| Skeleton loaders   | _To be designed_ | Product cards, lists         |
| Spinner            | _To be designed_ | Button loading, page loading |
| Progress indicator | _To be designed_ | Checkout steps               |

---

## Error states

| Context                | Status           | Notes                 |
| ---------------------- | ---------------- | --------------------- |
| Form validation errors | _To be designed_ | Per-field and summary |
| Page not found (404)   | _To be designed_ | Phase 1               |
| Server error (500)     | _To be designed_ | Phase 1               |
| Payment failure        | _To be designed_ | Checkout failed page  |
| Network error          | _To be designed_ | Retry guidance        |

---

## Dark mode

| Item                   | Status            | Notes                          |
| ---------------------- | ----------------- | ------------------------------ |
| Dark mode support      | _To be evaluated_ | Post-MVP unless required early |
| Color token pairs      | _To be defined_   | If dark mode adopted           |
| User preference toggle | _To be defined_   | System preference vs manual    |

---

## Animation principles

| Principle         | Notes                                              |
| ----------------- | -------------------------------------------------- |
| Purposeful motion | Animate only to guide attention or confirm actions |
| Reduced motion    | Respect `prefers-reduced-motion`                   |
| Performance       | Prefer CSS transitions over heavy JS animation     |
| Duration scale    | _To be defined_                                    | fast (150ms), normal (250ms), slow (400ms) |
| Easing            | _To be defined_                                    | Consistent easing curves                   |

---

## Responsive breakpoints

| Breakpoint | Target         | Status          |
| ---------- | -------------- | --------------- |
| Mobile     | &lt; 640px     | _To be defined_ |
| Tablet     | 640px – 1024px | _To be defined_ |
| Desktop    | &gt; 1024px    | _To be defined_ |
| Wide       | &gt; 1280px    | _To be defined_ |

Align with Tailwind CSS default breakpoints unless custom values are justified.

---

## Related documents

- [UI-DESIGN.md](./UI-DESIGN.md) — Design philosophy, brand identity, homepage, accessibility
- [PRD.md](./PRD.md) — Product requirements and project principles
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Astro components and React islands
- [ROADMAP.md](./ROADMAP.md) — Phase 1–2 implementation tasks
- [CONTRIBUTING.md](./CONTRIBUTING.md) — Development standards
