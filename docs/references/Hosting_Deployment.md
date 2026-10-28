# Ecommerce Hosting & Deployment — Cross-Document Review (B&V Impact)
## Final Knowledge and Reference Document

**Project:** B&V (Buwi & Vila) Ecommerce Platform, and a separate agricultural ecommerce store (Anuradhapura)
**Document type:** Final Knowledge and Reference Document
**Version:** 1.0
**Date generated:** 28 October 2026
**Status:** Working Reference. The platform selection is pending validation.
**Prepared from:** Review of the supplied Ecommerce Hosting & Deployment Final Reference Document v1.0 (28 October 2026). The review cross-checked it against the B&V Logging, Payment and Google OAuth references.

> This document records the review of the hosting decision and its consequences for the other B&V designs. The hosting source document remains the detailed specification. No server, deployment, bill or test was verified.

---

## Table of Contents

1. Executive Summary
2. Background and Original Requirement
3. Scope
4. Current Verified State
5. Review Findings
6. Options Considered
7. Final Decision and Recommended Approach
8. Target Architecture and Operations
9. Detailed Functional Requirements
10. Technical Design and Impact on Other B&V Documents
11. Security, Privacy, and Permissions
12. Configuration and Environment
13. Implementation Status
14. Testing and Verification
15. Lessons Learned
16. Risks and Limitations
17. Open Questions and Blockers
18. Recommended Next Steps
19. AI Agent Handoff Context
20. Glossary
21. References
Appendix A — Decision Register
Appendix B — B&V Document Update Register

---

## Document Control

| Field | Value |
|---|---|
| Document purpose | Hosting decision reference and cross-document impact record |
| Scope | Deployment options, cost model, single-VPS architecture, operations, and impact on the B&V logging, payment and authentication designs |
| Current status | Research complete; provider not selected; nothing deployed |
| Intended audience | Developers, technical leads, business stakeholders, AI coding agents |
| Source period covered | Hosting source dated 28 October 2026 |
| Version | 1.0 |
| Last updated | 28 October 2026 |
| Primary source of truth | Live provider pricing and terms at procurement; current code when available |

---

## 1. Executive Summary

The hosting research began for an **agricultural ecommerce store** in Anuradhapura (agrochemicals, equipment, tools). B&V was later used as a reference architecture.

**The two products are separate.** The source document's first blocking question is which product the hosting decision applies to.

**Main findings:**

- **RECOMMENDED, not approved:** Pilot one Linux VPS running Next.js, PostgreSQL, local uploads and Nginx/Caddy for HTTPS.
  - Current preference: **DigitalOcean Droplet**.
  - Close alternative: **AWS Lightsail**, the earlier recommendation, which the source document corrects having called "final".
- A single VPS is **not high availability**. Before launch, it requires:
  - off-server backups;
  - a restore drill on a clean machine;
  - monitoring;
  - security hardening.
- **VERIFIED (by review):** This is the first B&V-related document that **conflicts** with the rest of the set. The tech stack, logging, payment and authentication documents all assume Vercel now and Railway later.

**Current status:** Research only.

**Main blocker:** Confirm which product is being deployed, and for B&V, Vercel versus VPS.

**Next major action:** Confirm the target product. Then benchmark memory, obtain live same-day quotes, and run a proof-of-concept deployment.

---

## 2. Background and Original Requirement

- The agricultural store needs the following, with low cost and an upgrade path:
  - catalog;
  - stock;
  - orders;
  - staff/admin access;
  - payments;
  - images;
  - supplier collaboration.
- The user clarified that the Rs. 6,000–15,000 range was not a separate charge each for frontend and backend; one server can run both.
- The user explored a strict one-instance setup: frontend, backend, database and local storage together.
- The B&V stack introduced external services (Sanity, Cloudinary) that challenge the "all-in-one" definition.

---

## 3. Scope

### In Scope
- Deployment options.
- Cost components.
- One-instance architecture.
- Next.js self-hosting.
- Durability and backups.
- Security hardening.
- Payment callbacks.
- Scaling path.
- Impact on the other B&V designs.

### Out of Scope
- Storefront implementation.
- Legal approval for regulated agrochemicals.
- Tax and legal advice.
- Multi-region high-availability design.

### Assumptions
- Low initial traffic.
- A small team.
- PostgreSQL for B&V; the agricultural database engine is unconfirmed.
- No availability SLA.
- Bills in USD, converted to LKR at payment time.

---

## 4. Current Verified State

| Item | State | Label |
|---|---|---|
| B&V stack baseline (Next.js, Prisma, PostgreSQL, Auth.js, Sanity, Cloudinary, PayHere/KOKO, Vercel→Railway) | Documented | VERIFIED (documentation only) |
| Agricultural app runtime and database | Unknown | UNCERTAIN |
| Hosting account, server, deployment, tests, bills | None supplied | NOT STARTED |
| Provider choice | DigitalOcean recommended; Lightsail alternative | PLANNED / UNCERTAIN |

---

## 5. Review Findings

### From the Hosting Source
1. **VPS capability.** DigitalOcean and Lightsail can both run Node.js with self-managed PostgreSQL. The operator owns patching, backups and monitoring. Next.js supports self-hosting as a Node server or Docker container. *(Official: providers, Next.js.)*
2. **Cost.** One VPS can host every component; there is no second server fee. Total cost must still include:
   - backups and snapshots;
   - domain;
   - email/SMS;
   - monitoring;
   - bandwidth overage;
   - tax and exchange-rate differences.
3. **Failure domain.** One server is a shared point of failure. A backup on the same disk is not a recovery plan.
4. **Region.** Benchmark Singapore or Mumbai with real latency tests from Sri Lanka.
5. **Payments.** Callbacks need stable public HTTPS, signature verification, idempotency and reconciliation, regardless of host.

### Cross-Document Findings (this review)
6. **Logging transport.** On a VPS, stdout goes to journald or Docker logs. These need rotation and size caps, and there is no Vercel Runtime Logs search. The logging document treats file logs as "dev / self-hosted only"; on a VPS they become the production design. Sentry is unaffected.
7. **Scheduled jobs.** Retention cleanup and payment reconciliation would run as systemd timers or cron on the VPS instead of a Vercel scheduler.
8. **Staging.** Vercel preview deployments disappear. A stable staging environment is required by both:
   - the OAuth design (separate Google non-production project);
   - the payment design (PayHere sandbox).

   On a VPS, that means a second server or a second deployment, with its own cost.
9. **Callbacks and redirects.** Fixed domains simplify PayHere `notify_url` and Google exact-match redirect URIs. Deployments must keep the callback route available without downtime.
10. **Media.** The hosting design plans local uploads, while B&V uses Cloudinary. If Cloudinary is kept, B&V needs no local upload storage. Backups get smaller and later migration gets easier.
11. **Database concentration.** All Phase 1 tables promoted by the payment, logging and auth designs live on the same disk as the app. The off-server backup and restore drill becomes a hard prerequisite before accepting real payments.

---

## 6. Options Considered

| Option | Advantages | Disadvantages | Status |
|---|---|---|---|
| DigitalOcean Droplet | Simple, predictable pricing | Self-managed operations and backups | **RECOMMENDED pilot** |
| AWS Lightsail | AWS ecosystem; gradual migration path | Transfer allowances; billing complexity | **Strong alternative** |
| Hostinger VPS | Root access; low cost | Renewal terms, region and backups need review; shared hosting is not equivalent | **CONDITIONAL** |
| Vercel | Best Next.js developer experience; previews | Needs a separate database and storage; commercial tiers | **DEFERRED** under the all-in-one requirement; the existing B&V direction |
| Railway / Render | Managed deployments | Per-service billing; database durability needs review | **CONDITIONAL** |
| EC2 + RDS + ALB + S3 | Enterprise-grade | Cost and operations not justified yet | **DEFERRED** |
| WordPress/WooCommerce | Less custom development | A different product strategy, not a hosting option | **ALTERNATE STRATEGY** |

---

## 7. Final Decision and Recommended Approach

**Not finalised.**

- For the agricultural store, or for B&V if cost dominates: pilot DigitalOcean (or Lightsail) after:
  - live quotes;
  - a memory benchmark (2 GB versus 4 GB);
  - a proof-of-concept that includes a backup restore.
- For B&V specifically, decide explicitly between **Vercel (convenience, previews)** and a **VPS (cost)**. Then update the dependent documents (Appendix B).

**Illustrative pricing (not quotes):**

| Plan | Approx. USD/month | Approx. LKR at 330/USD |
|---|---|---|
| 2 GB Droplet or Lightsail | 12 | 3,960 |
| 4 GB Lightsail | 24 | 7,920 |

The lean planning envelope is Rs. 5,000–7,000/month in total.

**Budget formula:**
VPS + off-server backups + domain + email/SMS + monitoring + extra storage or bandwidth + tax/FX.

---

## 8. Target Architecture and Operations

```text
Customer / store staff
    ↓ DNS
Nginx or Caddy (HTTPS, TLS renewal)
    ↓
Next.js Node.js process (systemd / PM2 / Docker Compose)
    ↓ Prisma
PostgreSQL (bound to loopback)
Local uploads (persistent disk)  — or Cloudinary for B&V
External providers → public HTTPS callback routes
Backups → off-server storage (separate failure domain)
```

- **Server:**
  - Ubuntu LTS.
  - Firewall.
  - SSH key authentication.
  - Non-root deploy user.
  - Supported Node LTS.
  - Log rotation.
  - Monitoring.
- **Deploy pipeline:** Git → CI test and build (off-server) → migrate with rollback plan → release → health checks.
- **Growth path:** resize the VPS → managed database → object storage/CDN → workers/queue → multiple app instances behind a load balancer.

---

## 9. Detailed Functional Requirements

| ID | Requirement | Status |
|---|---|---|
| FR-01 | HTTPS for the storefront and admin, with access controls | PLANNED |
| FR-02 | Supported Next.js, Node, Prisma and PostgreSQL versions on the server | REQUIRES VERIFICATION |
| FR-03 | Orders, customers and inventory survive redeploys and restarts | PLANNED |
| FR-04 | Media persists, is access-controlled and is backed up | PLANNED |
| FR-05 | Payment callbacks are public, verified, idempotent and safely logged | PLANNED |
| FR-06 | Rollback and migration safety | PLANNED |
| FR-07 | Monitoring for downtime, disk, database, resources and backup failure | PLANNED |
| FR-08 | Migration preserves domain, data integrity and order history | PLANNED |

---

## 10. Technical Design and Impact on Other B&V Documents

**No verified file paths.** Before writing deployment changes, inspect:
- `package.json`;
- Next.js configuration;
- Prisma schema and migrations;
- the environment-variable contract;
- Docker or process-manager configuration;
- upload implementation;
- webhook handlers;
- CI workflow.

See Appendix B for the specific updates each B&V document needs if a VPS is selected.

---

## 11. Security, Privacy, and Permissions

- SSH keys only, with limited access.
- Only ports 80 and 443 public.
- PostgreSQL on loopback only.
- OS and dependency patching.
- Least-privilege database roles.
- Secrets outside Git.
- HTTPS with secure cookies.
- Upload validation.
- Rate limits.
- Audit records for order, payment and stock changes.
- No credentials, payment data, tokens or full bodies in logs.
- Regulated agrochemical sale and delivery needs separate legal review; hosting does not confer compliance.

---

## 12. Configuration and Environment

Placeholders only; real names must come from code.

```env
DATABASE_URL=<postgresql-connection-string>
AUTH_SECRET=<secure-random-secret>
APP_PUBLIC_URL=<https-origin>
PAYMENT_CALLBACK_SECRET=<provider-secret>
STORAGE_ROOT=<persistent-upload-path>
```

- Store time in UTC; present it in Sri Lanka time.
- Configure TLS renewal, DNS, email deliverability, log retention, backup schedules and disk alerts.
- Keep staging and production secrets separate.

---

## 13. Implementation Status

| Area | Status | Remaining Work |
|---|---|---|
| Research and comparison | Completed | — |
| One-instance requirement | Agreed | Backup and security acceptance |
| Provider | Recommended, not purchased | Live quotes; proof of concept |
| Plan size and region | Open | Benchmark; latency test |
| Domain, DNS, TLS, server, deploy, backups, monitoring, CI/CD | Not verified | All |
| B&V document alignment | Not started | Appendix B |

---

## 14. Testing and Verification

**Performed:** None.

**Required:**
- Clean-server reproducible deployment.
- TLS check.
- Authentication and permission tests.
- Migration and rollback rehearsal.
- Uploads persist across restarts.
- Payment callback signature, duplicate and retry tests.
- Order and stock concurrency tests.
- Uptime and error monitoring.
- Off-site backup and restore drill.
- Disk-full behaviour.
- Latency from Sri Lanka.
- 24-hour soak test.

**Acceptance criteria:**
- Checkout passes with documented evidence.
- Recovery (backup restore) passes with documented evidence.

---

## 15. Lessons Learned

| Earlier Claim | Correction |
|---|---|
| "One small VPS supports 500–5,000 users" | No load test was done; benchmark real traffic |
| Frontend and backend priced separately | One server runs both; price the whole architecture |
| Lightsail described as "final" | It was an evolving recommendation; DigitalOcean is now preferred |
| "All-in-one" stated without qualification | B&V uses external Sanity and Cloudinary; define the term |
| Two products discussed together | Keep the agricultural store and B&V decisions separate |

---

## 16. Risks and Limitations

| Risk | Likelihood | Impact | Mitigation | Status |
|---|---|---|---|---|
| Single-server outage or disk failure | High | High | Off-server backups; restore test; RPO/RTO | Open |
| App and database compete for RAM | Medium | High | Build in CI; monitor; resize | Open |
| Missing or failed backups | Medium | High | Automated verified dumps; restore drills | Open |
| Webhook downtime or duplicates | Medium | High | Idempotency; reconciliation; alerts | Open |
| Price, region or transfer surprises | Medium | Medium | Live quotes; billing alerts | Open |
| Server compromise | Medium | High | Hardening; patching; least privilege | Open |
| Hard migration from local database and uploads | Medium | Medium | Portable formats; rehearsal | Open |
| B&V docs drift from the hosting choice | High | Medium | Appendix B updates | Open |

---

## 17. Open Questions and Blockers

### Blocking (before procurement)
- Which product: the agricultural store or B&V?
- Actual runtime and database engine.
- External CMS and media in scope?
- Monthly LKR ceiling.
- Server operator and backup owner.
- Available regions and payment methods for the Sri Lankan account.
- Acceptable RPO/RTO.

### Non-Blocking
- CDN.
- Worker queue.
- Managed database timing.
- Auto-scaling provider.

### Required Decisions
- Provider, plan and region.
- Backup retention and restore policy.
- Payment and regulated-product compliance handling.
- **For B&V:** Vercel or VPS.

---

## 18. Recommended Next Steps

1. Confirm the product, and whether Sanity and Cloudinary stay in scope.
2. For B&V, decide between Vercel and VPS.
3. Benchmark build and runtime memory with PostgreSQL; estimate image volume and traffic.
4. Get same-day, same-region quotes, including backups, bandwidth and tax; verify the payment method.
5. Run a proof-of-concept: HTTPS, database, uploads, monitoring and an off-server restore.
6. If a VPS is chosen for B&V, apply Appendix B updates to the logging, payment, auth and tech-stack documents.
7. Approve the platform, recording measured cost, performance, RPO/RTO and the operational owner.

---

## 19. AI Agent Handoff Context

**Objective:** Deploy the confirmed ecommerce codebase economically on a maintainable host, while keeping a migration path.

**Current state:** Research done. Nothing deployed.

**Agreed approach:** Single VPS pilot (DigitalOcean preferred), subject to validation.

**Hard constraints:**
- No secrets in Git.
- No production database without off-server backups.
- No public PostgreSQL port.
- Never claim high availability on one VM.
- No invented paths or routes.

**Preserve:**
- Next.js and Prisma configuration.
- Payment verification.
- Audit patterns.
- Cloudinary and Sanity unless explicitly removed.

**High-risk areas:** payments, orders, inventory, migrations, media, restore.

**First action:** Confirm which project, then inspect the repository.

**Do not assume:**
- That a provider has been purchased.
- That the app is deployed.
- That a free tier is production-eligible.
- A fixed LKR exchange rate.
- That Vercel has been abandoned for B&V.

---

## 20. Glossary

| Term | Meaning |
|---|---|
| VPS | Virtual private server |
| Droplet | DigitalOcean virtual machine |
| Lightsail | AWS simplified VPS offering |
| RPO / RTO | Maximum acceptable data loss / time to restore |
| Reverse proxy | Web server routing public traffic to the app |
| Failure domain | Set of components that fail together |
| Log drain | Forwarding runtime logs to an external platform |

---

## 21. References

### Official (prices and policies must be revalidated at procurement)
- AWS Lightsail and its pricing page.
- DigitalOcean Droplet pricing and Next.js hosting page.
- Next.js deployment documentation.
- Vercel pricing.
- Hostinger VPS.

### Project Files
- Ecommerce Hosting & Deployment Final Reference Document v1.0.
- B&V Technology Stack Reference v1.0.
- B&V Logging & Observability Reference v1.0.
- B&V Payment Gateway Integration Final Reference Document v1.0.
- B&V Google OAuth & Centralized Authentication Final Reference Document v1.0.

### Community (non-authoritative)
Reddit, DEV and Medium Lightsail/self-hosting guides, as cited in the source. The source notes that not every page was fully inspected.

---

## Appendix A — Decision Register

| ID | Decision | Status |
|---|---|---|
| D-01 | One-instance start | User requirement; subject to backup and security acceptance |
| D-02 | AWS Lightsail | Previously recommended; not purchased |
| D-03 | DigitalOcean Droplet | Latest recommendation; awaiting validation |
| D-04 | Full AWS multi-service | Deferred |
| D-05 | Vercel | Deferred under all-in-one; still the documented B&V direction |
| D-06 | Local database and uploads | Conditional; off-server backups mandatory |
| D-07 | 2 GB vs 4 GB | Open pending measurement |
| D-08 | B&V hosting platform | **Open**; requires an explicit decision (this review) |

## Appendix B — B&V Document Update Register (if a VPS is chosen for B&V)

| Document | Required Update |
|---|---|
| Technology Stack Reference | Replace Vercel→Railway direction with VPS plus growth path |
| Logging & Observability | stdout via journald/Docker with rotation; production file-log design; no Vercel Runtime Logs; consider a log drain earlier |
| Logging & Observability | Retention cleanup via systemd timer/cron |
| Payment Gateway | Reconciliation jobs via systemd timer/cron; zero-downtime deploys for the callback route; stable `notify_url` |
| Google OAuth | Fixed staging and production domains for redirect URIs; staging server required |
| All | Off-server backup and restore drill required before the first paid release |
| Hosting (this design) | Drop local uploads if Cloudinary is kept |
