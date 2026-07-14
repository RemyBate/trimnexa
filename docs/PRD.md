# Product Requirements Document (PRD)

[← Documentation index](./README.md)

**Website:** [https://trimnexa.com](https://trimnexa.com) (domain purchased; production connection planned in Phase 20)

---

## Vision statement

> Our vision is to build the most trusted digital marketplace in Cameroon, empowering local businesses through secure technology, exceptional customer experience, and modern e-commerce.

Trimnexa connects customers, verified sellers, delivery partners (future), and platform administrators into a single marketplace designed for confidence, convenience, and growth.

---

## Mission statement

> Our mission is to make online commerce accessible and reliable for everyone in Cameroon — giving local businesses the tools to sell online, giving customers a safe place to shop, and building sustainable marketplace infrastructure for Central Africa.

We achieve this through verified sellers, secure payments in XAF/FCFA, bilingual support, and platform operations that prioritize trust over speed of expansion.

---

## Core values

| Value                        | Meaning for Trimnexa                                                                                |
| ---------------------------- | --------------------------------------------------------------------------------------------------- |
| **Trust**                    | Verified sellers, secure payments, transparent policies, and buyer protection                       |
| **Transparency**             | Clear pricing, commission disclosure, and honest order status communication                         |
| **Security**                 | Server-side validation, protected financial data, and responsible data handling                     |
| **Innovation**               | Modern technology and UX suited to local market needs — without copying global platforms            |
| **Reliability**              | Stable orders, payments, and fulfilment processes customers and sellers can depend on               |
| **Scalability**              | Architecture that grows from a controlled MVP to multi-city and regional expansion                  |
| **Accessibility**            | Inclusive design for all users, including first-time online shoppers and assistive technology users |
| **Customer first**           | Shopping experience, support, and dispute resolution designed around customer needs                 |
| **Support local businesses** | Tools and onboarding that help Cameroonian sellers succeed online                                   |
| **Continuous improvement**   | Phased delivery, feedback-driven iteration, and documentation that evolves with the product         |

---

## Business goals

Trimnexa aims to become:

- **The trusted online marketplace in Cameroon** — the default choice for safe local e-commerce
- **A platform that helps local businesses sell online** — lowering barriers for small and medium sellers
- **A secure shopping platform** — payments, data, and transactions handled responsibly
- **A scalable marketplace for future Central African expansion** — architecture and operations that extend beyond the initial launch cities
- **A sustainable commission-based marketplace business** — revenue aligned with successful seller and customer outcomes

### Short-term goals (MVP — Phases 1–21)

- Launch a controlled MVP in one or two cities (Douala and/or Yaoundé)
- Onboard a verified group of initial sellers with moderated product listings
- Support customer registration, browsing, cart, checkout, and order tracking
- Integrate at least one Cameroon-compatible payment method
- Calculate and record marketplace commission and seller earnings accurately
- Deliver bilingual (English/French) public experience and core user flows
- Establish customer support and basic return/dispute processes
- Deploy to production at [trimnexa.com](https://trimnexa.com) with monitoring and backups

### Long-term goals (post-MVP — Phase 22+)

- Expand to additional cities and countries in Central Africa
- Introduce delivery-partner infrastructure and pickup stations
- Automate seller payouts when payment providers and regulation allow
- Launch mobile application and advanced seller analytics
- Add sponsored products, subscriptions, and additional revenue streams
- Build recommendation, fraud detection, and loyalty capabilities
- Support additional currencies and languages

See [ROADMAP.md](./ROADMAP.md) for phase-by-phase delivery plan.

---

## Project principles

These principles guide every product and engineering decision:

| Principle                                     | Explanation                                                                                |
| --------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **Security before convenience**               | Never sacrifice authentication, authorization, or financial safety for faster shortcuts    |
| **Mobile-first design**                       | Most users will shop on phones; design and test for mobile before desktop                  |
| **Performance-first architecture**            | Minimal JavaScript, optimized images, efficient queries — speed is a feature               |
| **Accessibility by default**                  | Semantic HTML, keyboard navigation, and contrast are requirements, not extras              |
| **Server-side validation**                    | Never trust browser-submitted prices, roles, stock, or commission data                     |
| **Original UI and branding**                  | Distinct Trimnexa identity; no copying Amazon or other platforms visually                  |
| **Maintainable code**                         | Clear structure, strong typing, focused changes, and readable modules                      |
| **Reusable components**                       | Shared design system and component library; avoid one-off UI patterns                      |
| **Documentation before implementation**       | Plan in `docs/` first; update documentation when behaviour changes                         |
| **Scalability**                               | Modular monolith that can grow without premature microservices                             |
| **Incremental development**                   | One stable phase at a time; no new phase until the previous is complete                    |
| **Clean architecture**                        | Separation of public, customer, seller, and admin concerns; clear server/client boundaries |
| **AI-assisted development with human review** | AI tools accelerate work; humans verify security, correctness, and consistency             |

Technical expression of these principles: [ARCHITECTURE.md](./ARCHITECTURE.md) · [SECURITY.md](./SECURITY.md) · [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## Marketplace concept

Trimnexa operates as a marketplace similar in _business concept_ to platforms like Amazon Marketplace — sellers list products, customers purchase through a unified checkout, and the platform retains a commission — but with **original design, branding, architecture, and user experience**. Amazon's visual identity, layout, or source code must not be copied.

### Initial market

| Setting        | Value                                                      |
| -------------- | ---------------------------------------------------------- |
| Country        | Cameroon                                                   |
| Currency       | Central African CFA franc (XAF / FCFA)                     |
| Languages      | English, French                                            |
| Initial cities | Douala and/or Yaoundé (operational decision before launch) |

### Launch strategy

- Start with one or two major cities
- Begin with a controlled group of verified sellers
- Begin with a limited number of product categories
- Expand only after order, payment, support, and delivery processes are stable

The system architecture must allow other cities and countries to be added later.

---

## Business model

### Primary revenue

Marketplace commission on successfully completed sales.

Example flow:

1. Customer purchases a product
2. Payment is confirmed via verified webhook
3. Order is fulfilled by the seller
4. Delivery is confirmed
5. Trimnexa calculates and records its commission
6. Seller earnings become available for payout according to platform policy

Commission must be configurable. Future options include global, category-specific, seller-specific, and promotional rates.

### Additional future revenue sources (post-MVP)

- Sponsored products
- Featured shop placement
- Seller subscription plans
- Advertising banners
- Delivery service margin
- Promotional campaigns
- Premium seller analytics

Do not implement all revenue options in the MVP.

See [PAYMENTS.md](./PAYMENTS.md) for commission and payout details.

---

## Target users

### A. Guest

A guest can:

- Visit the public website
- Browse product categories
- Search for products
- View product details
- View seller information
- Read help pages and policies
- Register or log in
- Begin a cart where technically appropriate

### B. Customer

A customer can:

- Create and manage an account
- Verify email or telephone number
- Manage profile information
- Save delivery addresses
- Search and filter products
- Add products to a cart
- Save products to a wishlist
- Place orders
- Select a payment method
- Track order status
- View order history
- Request cancellation where permitted
- Request returns or refunds
- Review delivered products
- Review sellers where permitted
- Contact customer support
- Receive email, in-app, and future SMS or WhatsApp notifications

### C. Seller

A seller can:

- Create a normal account
- Apply to become a seller
- Submit identity and business information
- Wait for administrator approval
- Create and manage a shop profile
- Upload a shop logo and banner
- Add products with images, prices, variants, and stock
- Manage orders and fulfilment status
- View sales, commission deductions, and earnings balances
- View payout history and request payout where supported
- View seller analytics
- Respond to customer questions or support cases
- Manage shop policies
- Receive notifications

### D. Administrator

An administrator can:

- Access a protected administrator dashboard
- Review and approve seller applications
- Suspend or reject sellers
- Moderate products and manage categories
- Manage customers, sellers, orders, payments, refunds, and returns
- Manage commissions, seller balances, and payouts
- Manage promotional banners, coupons, and featured products
- View audit logs and marketplace reports
- Manage prohibited products, static content, support tickets, and platform settings

### E. Support or operations staff (future)

Architecture should allow a restricted staff role with permissions such as viewing orders, handling support tickets, reviewing returns, and communicating with users — without full administrator power.

### F. Delivery partner (future)

Delivery-partner functionality is not required in the first release, but the architecture should allow it later.

---

## Product requirements

Each product should eventually support:

- Name, slug, description, short description
- Seller, shop, category, subcategory, brand (where applicable)
- Product images and main image
- Price, optional previous price, currency
- Stock quantity, SKU, product condition
- Product variants and attributes
- Weight, dimensions, delivery information, return eligibility
- Status: draft or published state, approval state, featured state
- Average rating, review count
- Created and updated timestamps

### Possible product statuses

`DRAFT`, `PENDING_REVIEW`, `APPROVED`, `REJECTED`, `ACTIVE`, `OUT_OF_STOCK`, `SUSPENDED`, `ARCHIVED`

Sellers should not be able to publish prohibited products. Administrator moderation should initially be available.

See [DATABASE.md](./DATABASE.md) for entity details.

---

## Delivery requirements

The platform should be adapted to local address realities.

A delivery address may include:

- Recipient name
- Telephone number
- WhatsApp number
- Region, city, district or quarter
- Street where available
- Landmark
- GPS coordinates or shared location
- Delivery instructions

### Possible delivery methods

- Seller delivery
- Trimnexa delivery partner
- Pickup point
- Store pickup
- Third-party courier

The first MVP should use a simple and controlled delivery model. Delivery fees must not be hardcoded throughout the application.

---

## Internationalization

### Initial languages

- English (`en`)
- French (`fr`)

### Requirements

- Language switcher
- Locale-aware routes or another consistent localization strategy
- Translated navigation, validation messages, and customer emails
- Translated static policies (after legal review)
- Product descriptions remain seller-provided unless separately translated
- Default locale defined clearly

See [UI-DESIGN.md](./UI-DESIGN.md) and [ARCHITECTURE.md](./ARCHITECTURE.md) for localization strategy.

---

## Non-functional requirements

Non-functional requirements define _how_ the system must perform, not _what_ features it provides. Detailed technical standards: [ARCHITECTURE.md](./ARCHITECTURE.md) · [SECURITY.md](./SECURITY.md) · [DEPLOYMENT.md](./DEPLOYMENT.md)

### Performance

- Mobile-first page load performance on typical Cameroon mobile networks
- Minimal unnecessary client-side JavaScript (Astro islands only where needed)
- Optimized images with lazy loading and appropriate formats
- Server-rendered or statically generated public catalogue pages for SEO and speed
- Efficient database queries; avoid N+1 query patterns
- Pagination for large product, order, and admin lists
- Skeleton loaders and responsible loading indicators

### Availability

- Production uptime target to be defined in Phase 20 (monitoring and alerting)
- Graceful degradation when non-critical services (email, notifications) fail
- Payment and order processing must not depend on optional services

### Reliability

- Transaction-safe order and financial operations (database transactions)
- Idempotent payment webhook processing
- Controlled order status transitions with audit history
- No data loss on checkout or payment confirmation

### Accessibility

- WCAG AA contrast and keyboard navigation targets
- Semantic HTML, accessible forms, and screen-reader-friendly status messages
- Reduced-motion support (`prefers-reduced-motion`)
- See [UI-DESIGN.md](./UI-DESIGN.md) and [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md)

### Maintainability

- TypeScript strict mode, modular monolith structure, reversible migrations
- Clear separation of concerns in `src/lib/` services
- Phase-gated development with documented decisions ([DECISIONS.md](./DECISIONS.md))

### Security

- Server-side authorization on every protected route and API
- Secure password handling, session management, and rate limiting
- No secrets in source control; webhook signature verification
- See [SECURITY.md](./SECURITY.md)

### Scalability

- Modular monolith architecture; extract services only when proven necessary
- Database indexes on high-traffic queries
- External object storage for images; CDN for static assets in production
- Architecture supports multi-city and multi-country expansion

### Observability

- Structured logging without sensitive data (Phase 18–20)
- Error tracking, uptime monitoring, and payment webhook failure alerts in production
- Marketplace metrics dashboard for administrators (Phase 15)

### Documentation quality

- Authoritative source per topic in `docs/`; cross-linked and kept current
- Roadmap checkboxes updated when phases complete ([ROADMAP.md](./ROADMAP.md))
- Architecture decisions recorded in [DECISIONS.md](./DECISIONS.md)

### Code quality

- Linting, formatting, and type checking (Phase 1)
- Unit, integration, and end-to-end tests for critical flows (Phases 1, 19)
- Code review and AI-assisted development rules ([CONTRIBUTING.md](./CONTRIBUTING.md))

---

## Success metrics

Key metrics to track marketplace health. Instrumentation planned from Phase 15–21; monitoring infrastructure in [DEPLOYMENT.md](./DEPLOYMENT.md).

### Growth and catalogue

| Metric                         | Description                                         |
| ------------------------------ | --------------------------------------------------- |
| **Approved sellers**           | Number of verified, active sellers on the platform  |
| **Active products**            | Published, in-stock products available to customers |
| **Monthly active users (MAU)** | Unique customers browsing or purchasing per month   |

### Commerce

| Metric                            | Description                                                |
| --------------------------------- | ---------------------------------------------------------- |
| **Completed orders**              | Orders reaching delivered (or equivalent completed) status |
| **Gross merchandise value (GMV)** | Total value of completed orders (XAF)                      |
| **Average order value (AOV)**     | GMV divided by completed orders                            |
| **Commission revenue**            | Trimnexa earnings from marketplace commission              |

### Quality and satisfaction

| Metric                           | Description                                          |
| -------------------------------- | ---------------------------------------------------- |
| **Customer satisfaction**        | Reviews, support ratings, and qualitative feedback   |
| **Order success rate**           | Orders completed vs cancelled or failed              |
| **Delivery success rate**        | Orders delivered on time vs failed deliveries        |
| **Payment success rate**         | Successful payments vs failed or abandoned checkouts |
| **Repeat customers**             | Customers placing more than one order                |
| **Return and cancellation rate** | Returns and cancellations as % of orders             |
| **Seller fulfilment time**       | Average time from paid to shipped/delivered          |

### Operational

| Metric                               | Description                                  |
| ------------------------------------ | -------------------------------------------- |
| **Seller application approval rate** | Approved vs rejected seller applications     |
| **Product moderation turnaround**    | Time to approve or reject submitted products |
| **Support ticket resolution time**   | Average time to close support tickets        |

---

The project should reserve pages for:

- Privacy policy
- Terms and conditions
- Customer terms
- Seller agreement
- Return and refund policy
- Delivery policy
- Cookie information
- Prohibited-products policy
- Buyer-protection policy
- Seller-code-of-conduct policy
- Contact and company information

**Do not generate final legal text and present it as legally approved.** Mark legal documents as requiring review by a qualified professional familiar with Cameroon and, where relevant, Germany or the European Union.

---

## SEO requirements

Public marketplace pages should support:

- Unique titles and meta descriptions
- Canonical URLs and Open Graph metadata
- Product, organization, and breadcrumb structured data
- Sitemap and robots configuration
- Human-readable URLs and server-rendered product content
- Image optimization and pagination strategy
- Noindex rules for private pages
- Proper handling of discontinued products
- Avoidance of duplicate category URLs

---

## Privacy and legal pages

The first production-ready MVP must support:

- [ ] Public marketplace homepage
- [ ] Product categories
- [ ] Product search
- [ ] Product listing pages
- [ ] Product detail pages
- [ ] Customer registration and login
- [ ] Seller application
- [ ] Administrator seller approval
- [ ] Seller shop profile
- [ ] Seller product creation
- [ ] Product image upload
- [ ] Product stock management
- [ ] Shopping cart
- [ ] Checkout
- [ ] Delivery-address collection
- [ ] One supported payment integration or a controlled test payment flow
- [ ] Order creation
- [ ] Order status management
- [ ] Commission calculation
- [ ] Seller earnings records
- [ ] Administrator order management
- [ ] Basic notifications
- [ ] English and French support
- [ ] FCFA/XAF pricing
- [ ] Responsive design
- [ ] Basic legal and support pages
- [ ] Basic return and dispute request process
- [ ] Deployment and domain connection

---

## Non-MVP scope

The following must **not** block the first MVP:

- Native mobile application
- Advanced or AI-powered recommendations
- Multiple warehouses
- International expansion beyond initial Cameroon launch
- Fully automated seller payouts
- Complex loyalty programme
- Live delivery maps
- Advanced real-time chat
- Auction functionality
- Cryptocurrency payments
- Large-scale microservice architecture
- Seller subscriptions and sponsored products (post-MVP revenue)

---

## Future vision

See [ROADMAP.md — Phase 22](./ROADMAP.md#phase-22--post-mvp-roadmap) for the detailed post-MVP roadmap.

High-level directions:

- Geographic expansion beyond initial Cameroon cities
- Delivery-partner portal and pickup stations
- Automated seller payouts when provider support allows
- Mobile application
- Advanced analytics, recommendations, and fraud detection
- Additional revenue streams (sponsored products, subscriptions, advertising)
- Business-to-business marketplace features
- Additional African currencies and languages

Implement only when the MVP is stable and real business evidence supports each investment.

---

## Related documents

- [ROADMAP.md](./ROADMAP.md) — Development phases, project progress, and definition of done
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Technical architecture and high-level system diagram
- [DATABASE.md](./DATABASE.md) — Data model and financial entities
- [ROUTES.md](./ROUTES.md) — Application routes
- [UI-DESIGN.md](./UI-DESIGN.md) — Design philosophy and homepage planning
- [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) — Planned design tokens and components (Phase 2)
- [SECURITY.md](./SECURITY.md) — Security requirements
- [PAYMENTS.md](./PAYMENTS.md) — Payment and commission model
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Deployment and monitoring
- [DECISIONS.md](./DECISIONS.md) — Architecture decisions
- [RISKS.md](./RISKS.md) — Project risks
