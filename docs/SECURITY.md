# Security

[← Documentation index](./README.md)

Security requirements for Trimnexa. Security must be included from the beginning of development.

---

## Core security principles

- **Never trust the browser** for roles, prices, commissions, or seller earnings
- **Server-side validation** on all inputs
- **Server-side authorization** on every protected action
- **Defense in depth** — multiple layers of protection
- **Data minimization** — collect only what is needed
- **Auditability** — log sensitive actions without exposing secrets

---

## Authentication

### Requirements (Phase 4)

- Secure password handling with modern hashing algorithms (e.g. Argon2, bcrypt)
- Email or telephone verification
- Session management with secure, HTTP-only cookies
- Password reset with time-limited tokens
- Account suspension capability
- Session revocation on logout and suspension
- Protection against brute-force login attempts (rate limiting)

### Solution selection (Phase 4)

Authentication solution will be **selected after evaluation during Phase 4**. See [ARCHITECTURE.md — Authentication evaluation](./ARCHITECTURE.md#authentication-evaluation-phase-4) for candidate comparison.

Requirements summary:

- Secure password hashing, session cookies, email/phone verification
- Role-based access: customer, seller, administrator (future staff)
- Rate limiting and account suspension
- Astro SSR and Prisma integration

Record the final choice in [DECISIONS.md](./DECISIONS.md).

---

## Authorization

### Role-based access control (RBAC)

| Role           | Access                                        |
| -------------- | --------------------------------------------- |
| Guest          | Public pages only                             |
| Customer       | Account, cart, checkout, orders               |
| Seller         | Seller dashboard (own shop, products, orders) |
| Administrator  | Full admin dashboard                          |
| Staff (future) | Restricted operations per permission set      |

### Rules

- Server-side authorization on **every** protected route and API endpoint
- Never trust a user role sent from the browser
- Sellers can only access their own shop, products, and orders
- Customers can only access their own account data
- Administrators protected by strong authentication
- Prevention of insecure direct-object references (IDOR)
- Test role isolation in Phase 4 and Phase 18

See [ROUTES.md](./ROUTES.md) for route protection summary.

---

## Input validation

- Validate all inputs server-side with Zod schemas (Phase 3+)
- Output encoding to prevent XSS
- Sanitize user-generated content where displayed
- Validate file uploads: size limits, allowed MIME types, safe filenames
- Reject unexpected fields in API requests
- Validate order quantities, stock availability, and prices on the server

---

## File uploads

- Maximum file size limits enforced server-side
- Allowed MIME types whitelist (images: JPEG, PNG, WebP)
- Rename files to prevent path traversal and malicious filenames
- Store uploads in external object storage (Cloudinary or S3-compatible)
- Do not serve uploaded files from application server directly
- Seller identity documents: encrypted storage, restricted access, audit logging

---

## Payment security

- Webhook **signature verification** on every payment event
- **Idempotent** webhook processing — prevent duplicate charges
- Payment confirmation never relies on browser redirects alone
- All financial calculations on the server
- Payment API keys and webhook secrets in environment variables only
- Administrator payment view for monitoring and reconciliation
- PCI considerations: minimize card data handling; use provider-hosted flows where possible

See [PAYMENTS.md](./PAYMENTS.md).

---

## CSRF protection

- CSRF protection on state-changing forms where required
- Use framework-provided CSRF tokens or SameSite cookie policies
- Verify origin/referer on sensitive API endpoints

---

## Rate limiting

Apply rate limiting to sensitive endpoints:

- Login and registration
- Password reset requests
- Payment webhook endpoints (provider IP allowlisting where supported)
- API endpoints vulnerable to abuse
- File upload endpoints

---

## Session security

- HTTP-only, Secure cookies in production
- Appropriate session expiry
- Session invalidation on password change and account suspension
- No sensitive data in session storage accessible to client JavaScript

---

## Logging

- Log authentication events (success, failure, lockout)
- Log administrator actions
- Log payment webhook events (without sensitive payload data)
- Log order status changes
- **Never** log passwords, API keys, payment card data, or full identity documents
- Structured logging format for production monitoring

---

## Audit logs

Record in `AuditLog` entity (Phase 3 foundation):

- Seller application approvals/rejections
- Product moderation decisions
- Commission configuration changes
- Payout approvals
- Account suspensions
- Administrator settings changes
- Refund and dispute resolutions

Audit log viewer in administrator dashboard (Phase 15).

---

## Environment variables

### Rules

- All secrets in environment variables — never in source code
- Never commit `.env` files containing secrets
- Separate credentials per environment (local, staging, production)
- Do not use production credentials locally
- `.env.example` with variable names only (no values) — Phase 1

### Security-related variables

| Variable                 | Purpose                                    |
| ------------------------ | ------------------------------------------ |
| `AUTH_SECRET`            | Authentication signing secret              |
| `DATABASE_URL`           | Database connection (contains credentials) |
| `PAYMENT_API_KEY`        | Payment provider API key                   |
| `PAYMENT_WEBHOOK_SECRET` | Webhook signature verification             |
| `STORAGE_ACCESS_KEY`     | Object storage credentials                 |
| `STORAGE_SECRET_KEY`     | Object storage credentials                 |
| `EMAIL_API_KEY`          | Email service API key                      |

See [ARCHITECTURE.md](./ARCHITECTURE.md#environment-variables) for full list.

---

## HTTP security headers

Configure in production (Phase 18):

- `Strict-Transport-Security` (HSTS)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options` or `Content-Security-Policy` frame-ancestors
- `Content-Security-Policy` where practical
- `Referrer-Policy`
- `Permissions-Policy`

---

## Dependency security

- Review dependency vulnerabilities in CI (Phase 18)
- Keep dependencies updated
- Do not use deprecated packages
- Pin major versions; review updates before applying

---

## Security checklist (Phase 18)

- [ ] Authorization review — all routes and APIs checked
- [ ] File-upload review — validation and storage secured
- [ ] Payment-security review — webhooks, idempotency, secrets
- [ ] Secure HTTP headers configured
- [ ] Session security reviewed
- [ ] Rate limits on sensitive endpoints
- [ ] Logs reviewed for sensitive data leakage
- [ ] Dependency vulnerabilities addressed
- [ ] Administrator protection verified
- [ ] Insecure direct-object access tested
- [ ] Role escalation tested
- [ ] Security incident procedure documented

---

## Security incident procedure (to be documented in Phase 18)

Plan for:

1. Detection and assessment
2. Containment
3. Credential rotation (auth secrets, payment keys, database passwords)
4. Notification of affected users if required
5. Post-incident review and documentation update

---

## Related documents

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Authentication evaluation and server/client boundaries
- [PRD.md](./PRD.md) — Project principles and security-related NFRs
- [PAYMENTS.md](./PAYMENTS.md) — Payment security
- [DATABASE.md](./DATABASE.md) — Audit log entities
- [RISKS.md](./RISKS.md) — Security-related risks
- [ROADMAP.md](./ROADMAP.md) — Phase 4 and Phase 18 tasks
- [DECISIONS.md](./DECISIONS.md) — Security and auth decisions
