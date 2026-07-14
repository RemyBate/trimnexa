# Deployment

[← Documentation index](./README.md)

Deployment planning for Trimnexa. Production deployment begins in Phase 20.

**Domain:** [trimnexa.com](https://trimnexa.com) — DNS managed through Hetzner

**Roadmap:** [ROADMAP.md](./ROADMAP.md) (Phase 20) · **Architecture:** [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## Hosting-neutral policy (Phases 0–19)

- **No deployment adapter** is installed (`@astrojs/node`, Vercel, Netlify, Cloudflare)
- **No production host** is selected or configured
- Local development uses Astro's default static output until SSR is required (Phase 3+)
- The domain `trimnexa.com` is managed through **Hetzner DNS**, but the application does **not** need to be hosted on Hetzner

---

## Environments

| Environment         | Purpose                | Database                     | Credentials            | URL              |
| ------------------- | ---------------------- | ---------------------------- | ---------------------- | ---------------- |
| **Local**           | Development            | Local or dev PostgreSQL      | `.env` (not committed) | `localhost:4321` |
| **Staging/Preview** | Pre-production testing | Separate staging database    | Platform env vars      | TBD              |
| **Production**      | Live marketplace       | Separate production database | Platform env vars only | `trimnexa.com`   |

### Environment rules

- Separate database per environment
- Separate environment variables per environment
- Separate payment credentials (sandbox vs production)
- Separate storage configuration
- Separate email configuration
- Never use production credentials locally
- Never commit `.env` files

---

## Phase 20 hosting comparison

Final host selection happens in **Phase 20** by comparing managed deployment platforms against self-managed Node.js on Hetzner.

### Comparison criteria

| Criterion               | Managed platform (e.g. Railway, Render, Fly.io)                        | Node.js on Hetzner (VPS/Cloud)                                  |
| ----------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------- |
| Astro SSR compatibility | Platform Node support + adapter (`@astrojs/node` or platform-specific) | `@astrojs/node` on self-managed VM                              |
| Database access         | Managed PostgreSQL add-on                                              | Self-hosted or external PostgreSQL (Neon, Supabase, Hetzner DB) |
| Payment webhooks        | Public HTTPS URL with platform-managed TLS                             | Reverse proxy (Caddy/Nginx) + TLS on VPS                        |
| File storage            | External S3-compatible or Cloudinary (required either way)             | Same external object storage                                    |
| Deployment complexity   | Lower operations; git-push deploy                                      | Higher operations; CI/CD + server maintenance                   |
| Maintenance             | Platform handles OS patching                                           | Team manages updates, backups, monitoring                       |
| Scalability             | Vertical or auto-scale per platform                                    | Manual scaling; load balancer added later                       |
| Cost                    | Predictable SaaS pricing                                               | Lower infrastructure cost at scale; higher ops time             |
| DNS connection          | Point Hetzner DNS A/CNAME record to platform                           | Point Hetzner DNS A record to Hetzner server IP                 |

### Deployment flow

```
Evaluate criteria
    → Choose managed platform OR Hetzner Node.js
    → Document decision in DECISIONS.md
    → Install Astro deployment adapter
    → Configure production environment
    → Point Hetzner DNS to chosen host
    → Configure HTTPS
    → Configure backups and monitoring
    → Test production checkout safely
```

---

## Hetzner DNS

The domain `trimnexa.com` is already purchased and managed through Hetzner DNS.

### DNS configuration (Phase 20)

- `trimnexa.com` → A or CNAME record to chosen host
- `www.trimnexa.com` → redirect to apex or vice versa
- HTTPS enforced in production

DNS management remains on Hetzner regardless of where the application is hosted.

---

## HTTPS

- TLS certificate required for production (Let's Encrypt or platform-managed)
- Enforce HTTPS redirects
- HSTS header in production (Phase 18)
- Valid certificate for webhook endpoints (payment providers require HTTPS)

---

## Domain

| Setting               | Value                 |
| --------------------- | --------------------- |
| Domain                | `trimnexa.com`        |
| DNS provider          | Hetzner               |
| Production connection | Phase 20              |
| www redirect          | Configure in Phase 20 |

---

## Backups

Plan for production (Phase 20):

- **Database:** Automated daily backups with retention policy
- **Object storage:** Provider-managed durability
- **Configuration:** Environment variables documented (not in repo)
- **Test restore** procedure before launch

---

## Monitoring

Plan for production (Phase 20):

- Uptime monitoring for `trimnexa.com`
- Application error tracking (e.g. Sentry)
- Server logs (structured, no sensitive data)
- Payment webhook failure alerts
- Database connection monitoring
- Performance monitoring for critical pages

See [PRD.md](./PRD.md) for marketplace metrics to track.

---

## CI/CD (planned)

Configure continuous integration to run on every push/PR:

```yaml
# Planned pipeline steps
- Install dependencies
- Type checking
- Linting
- Unit tests
- Production build
- (Future) E2E tests on staging
```

### Rules

- Prevent deployment when critical checks fail
- Clear commit messages
- Feature branches for phase work
- Small, reviewable changes
- Database migration review before applying
- Update [ROADMAP.md](./ROADMAP.md) on phase completion

CI/CD configuration added during Phase 19–20.

---

## Production checklist (Phase 20)

- [ ] Compare hosting options and document decision
- [ ] Install and configure deployment adapter
- [ ] Configure production database with backups
- [ ] Configure production image storage
- [ ] Configure email service
- [ ] Configure payment production credentials
- [ ] Configure environment variables
- [ ] Configure staging/preview deployment
- [ ] Connect trimnexa.com through Hetzner DNS
- [ ] Configure HTTPS and www redirect
- [ ] Configure monitoring and alerts
- [ ] Configure sitemap and robots.txt
- [ ] Test production checkout safely
- [ ] Verify production build is reproducible

---

## Sitemap and robots

- Generate sitemap for public product, category, and shop pages
- `robots.txt` allowing crawl of public pages
- `noindex` on private routes (account, seller, admin)
- Canonical URLs on all public pages

---

## Related documents

- [ROADMAP.md](./ROADMAP.md) — Phase 20 deployment tasks and [project progress](./ROADMAP.md#project-progress)
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Stack, adapter requirements, and high-level architecture
- [PRD.md](./PRD.md) — Success metrics and NFRs (availability, observability)
- [SECURITY.md](./SECURITY.md) — Production security headers and secrets
- [DECISIONS.md](./DECISIONS.md) — Hosting decision (Phase 20)
- [PAYMENTS.md](./PAYMENTS.md) — Payment production credentials
