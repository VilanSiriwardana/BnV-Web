# B&V Google OAuth & Centralized Authentication — Cross-Document Review
## Final Knowledge and Reference Document

**Project:** B&V (Buwi & Vila) Modern Romantic Lifestyle Ecommerce Platform
**Document type:** Final Knowledge and Reference Document
**Version:** 1.0
**Date generated:** 28 October 2026
**Status:** Working Reference
**Prepared from:** Review of the supplied B&V Google OAuth & Centralized Authentication Final Reference Document v1.0 (28 October 2026). The review cross-checked it against the B&V Payment Gateway and Logging & Observability references.

> This document records the review of the authentication design and its interactions with the payment and logging designs. The source authentication document remains the detailed specification. Two copies of the source were supplied (`..._Document.md` and `..._Document_1.md`); they were confirmed byte-identical. No authentication code was inspected or verified.

---

## Table of Contents

1. Executive Summary
2. Background and Original Requirement
3. Scope
4. Current Verified State
5. Review Findings
6. Options Considered
7. Final Decision and Recommended Approach
8. Target Architecture and Workflow
9. Detailed Functional Requirements
10. Technical Design and Data Impact
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
Appendix A — Cross-Document Gap Register

---

## Document Control

| Field | Value |
|---|---|
| Document purpose | Cross-document reference for B&V centralized authentication |
| Scope | Local email/password, Google OAuth, Facebook-ready design, account linking, sessions, and interaction with the payment and logging designs |
| Current status | Architecture agreed; implementation not started or verified |
| Intended audience | B&V developers, reviewers, AI coding agents |
| Source period covered | Source document generated 28 October 2026 |
| Version | 1.0 |
| Last updated | 28 October 2026 |
| Primary source of truth | Current code and schema when available; otherwise official Google and Auth.js documentation, then the source reference |

---

## 1. Executive Summary

B&V needs one customer account that can be reached through several sign-in methods: B&V email/password, Google, and later Facebook.

**Main findings:**

- **AGREED:** The canonical identity is the B&V `users.id`. Orders, addresses, wishlist and profile reference `users.id`, never a Google ID or email.
- **AGREED:** Returning Google users are resolved by `(provider = 'google', provider_account_id = Google sub)`. Google's own guidance warns against using email as a permanent user identifier.
- **AGREED:** When a Google email matches an existing, unlinked B&V account, B&V must neither create a duplicate nor silently merge. Ownership must be proven before linking.
- **AGREED:** Authorization (role, status, permissions) remains B&V-owned. Social sign-in can only ever create customer access.
- **VERIFIED in the source, as of 28 October 2026:** npm lists `next-auth` 4.24.15 as `latest` and 5.0.0-beta.32 as `beta`. The Auth.js version is a material risk.
- **VERIFIED (by review):** Authentication adds a further set of Phase 1 table promotions. It also requires the logging event catalogue and the `security_events` phase placement to be updated.

**Current status:** Research and architecture only.

**Main blocker:** The Auth.js version and session strategy are undecided.

**Next major action:** Run an Auth.js compatibility spike against the exact B&V Next.js and Prisma versions.

---

## 2. Background and Original Requirement

The customer must experience email/password, Google and Facebook as one account system, not three. A customer who registers locally and later connects Google keeps the same order history, wishlist, addresses and profile.

The B&V stack (Next.js App Router, TypeScript, Prisma, PostgreSQL, Zod, Auth.js) is already approved. The database reference already plans:
- `users` in Phase 1;
- `accounts`, `sessions` and `verification_tokens` in Phase 2.

---

## 3. Scope

### In Scope
- Canonical identity model.
- Google OAuth/OIDC configuration.
- Local credentials.
- Email verification.
- Account linking and unlinking.
- Session boundary.
- Authorization ownership.
- Security controls.
- Environment separation.
- Interaction with the payment and logging designs.

### Out of Scope
- Implementation code.
- Facebook implementation details.
- Passkeys/WebAuthn.
- Enterprise SSO.
- Staff MFA implementation (recommended, not designed).
- Legal and privacy advice.

### Assumptions
- Google is used for identity only; no Drive, Gmail or other Google API access.
- **INFERRED:** Guest checkout exists, per the payment design.

---

## 4. Current Verified State

| Item | State | Label |
|---|---|---|
| `users` table design | Phase 1. Includes UUID `id`, unique normalised `email`, nullable `password_hash`, `role` (`customer`/`admin`/`staff`), `status` (`active`/`disabled`/`deleted`), `email_verified_at`, `last_login_at` | VERIFIED (documentation) |
| `accounts` table design | `user_id`, `provider`, `provider_account_id`, optional token fields, `UNIQUE(provider, provider_account_id)` | VERIFIED (documentation) |
| `sessions`, `verification_tokens` | Originally planned for Phase 2 | VERIFIED (documentation) |
| Auth code, Google client, migrations, environment, tests | Not supplied | Treat as NOT STARTED |

---

## 5. Review Findings

1. **One user, many sign-in methods.** Provider identities map to `users.id` through `accounts`. Google `sub` is stable; email may change. *(Official: Google OIDC.)*
2. **Two-sided configuration.** Google side: project, branding, audience, scopes, Web OAuth client and exact redirect URIs. B&V side: provider configuration, server-side secrets, account resolution, session creation and B&V authorization.
3. **Exact redirect matching.** Scheme, host, port, path and trailing slash must all match. Production requires HTTPS. *(Official: Google.)*
4. **Testing versus production.** Testing mode allows at most 100 test users, and test authorizations can expire after 7 days. Google recommends separate projects for non-production and production. *(Official: Google.)*
5. **Minimal scopes.** Identity scopes only. Sensitive scopes add verification burden.
6. **Credentials provider limits.** Auth.js Credentials does not persist users or implement hashing, reset or rate limiting. B&V owns all local-account behaviour. *(Official: Auth.js.)*
7. **Version risk.** Many tutorials present v5 as stable. Package metadata does not.
8. **Authorization ownership.** Provider claims must never grant `admin` or `staff`.

### Cross-Document Findings (this review)

9. **Phase 1 promotions.** `accounts` is required at authentication launch. `sessions` and `verification_tokens` are required only if the chosen design needs them. This is the third document asking to move tables into Phase 1, after payment and logging.
10. **Session strategy affects the schema.** **INFERRED from historical Auth.js behaviour; verify in the spike.** Auth.js has historically required JWT sessions when Credentials is used. If confirmed:
    - a database `sessions` table may be unnecessary;
    - "log out all devices" and immediate revocation become harder, needing a token-version or denylist approach.
11. **Logging catalogue gap.** The authentication document defines:
    - `auth.login_succeeded`
    - `auth.login_failed`
    - `auth.oauth_callback_failed`
    - `auth.email_verified`
    - `auth.password_reset_completed`
    - `auth.account_linked`
    - `auth.account_unlinked`
    - `auth.session_revoked`
    - `auth.user_disabled`

    The logging catalogue lists only `auth.login_succeeded`, `auth.login_failed`, `auth.permission_denied` and `auth.role_changed`. It also places `security_events` in Phase 2.
12. **Guest-to-account linkage.** Neither the payment nor the authentication document defines how guest orders attach to a `users.id` after later registration. **UNCERTAIN / gap.**
13. **Shared transactional email.** Needed here for verification and reset, and by payments for confirmations. Neither document selects a provider.

---

## 6. Options Considered

| Option | Description | Status |
|---|---|---|
| Auth.js with provider-neutral B&V identity | Auth.js handles the protocol; B&V owns users, linking and authorization | **SELECTED**, conditional on the compatibility spike |
| Hand-written OAuth | Implement state, nonce, PKCE, token exchange and sessions directly | **REJECTED**: larger security surface |
| Better Auth | Replace Auth.js | **DEFERRED**: fallback only if the spike fails |
| Auto-merge on matching email | Link any provider with the same email | **REJECTED**: account-takeover risk |

---

## 7. Final Decision and Recommended Approach

- Keep Auth.js. Pin the exact version only after a spike proves it with the B&V Next.js and Prisma versions.
- Map providers through `accounts`, using Google `sub` as `provider_account_id`.
- Require ownership confirmation before linking a colliding email.
- Implement local credentials as a first-class method:
  - Argon2id hashing;
  - Zod validation;
  - email verification;
  - throttling;
  - reset and recovery.
- Store provider access and refresh tokens only when a documented feature requires them.

**Reconsider if:** the spike exposes a blocker in combining Credentials with OAuth, or in the session strategy. In that case, re-evaluate Better Auth.

---

## 8. Target Architecture and Workflow

```text
B&V Email/Password ─┐
Google OAuth ───────┼─> Auth.js + B&V account resolution ─> canonical users.id
Facebook OAuth ─────┘                                       ├─> orders
                                                            ├─> addresses
                                                            ├─> wishlist
                                                            └─> profile
```

**Returning Google user:**
```text
callback → accounts(provider='google', provider_account_id=sub) → users.id
        → reject if disabled/deleted → update last_login_at → issue B&V session
```

**Email collision:**
```text
unlinked Google identity + email matches existing B&V user
        → no new user, no auto-merge
        → re-authenticate with existing method or verified challenge
        → explicitly create accounts link
```

**Local registration:**
```text
form → Zod → normalise email → handle existing safely → Argon2id hash
     → pending user → single-use expiring verification → verified → session allowed
```

The session is a B&V session, not a Google token. Sensitive actions re-check B&V user state on the server.

---

## 9. Detailed Functional Requirements

| ID | Requirement | Status |
|---|---|---|
| FR-01 | Every sign-in method resolves to exactly one `users.id` | PLANNED |
| FR-02 | Google mapping uses `sub`, unique per provider | PLANNED |
| FR-03 | Local credentials without a separate user model; `password_hash` nullable | PLANNED |
| FR-04 | Local email verification; trust Google email only when `email_verified` is true | PLANNED |
| FR-05 | No silent merge on email equality | PLANNED (UX pending) |
| FR-06 | Cannot unlink the last sign-in method; recent authentication required for link/unlink | PLANNED |
| FR-07 | B&V roles and status are authoritative | PLANNED |
| FR-08 | Disabled or deleted accounts are blocked regardless of provider success | PLANNED |
| FR-09 | Post-login redirects restricted to an internal allowlist | PLANNED |
| FR-10 | Security events logged without secrets or tokens | PLANNED |

---

## 10. Technical Design and Data Impact

- **Source code paths:** None verified. The source document states that the repository was not supplied. **Do not invent paths.**
- **Tables:**
  - `users` (Phase 1).
  - `accounts` (promote to the authentication release).
  - `sessions` and `verification_tokens` (promote only if the chosen design needs them).
- **Audit:** The `auth.*` events need a destination. Either `security_events` is promoted to Phase 1, or these events are routed to `admin_activity_logs` and runtime logs until it exists. **Decision required.**
- **UI:**
  - "Continue with Google" button.
  - Registration, verification, forgot and reset screens.
  - Collision and confirmation screen.
  - Connected-accounts management (timing open).

---

## 11. Security, Privacy, and Permissions

- **OAuth protocol:** state, PKCE and nonce handled by Auth.js. Exact redirect URIs. HTTPS in production.
- **Passwords:** Argon2id, throttling and rate limits, single-use expiring tokens for verification and reset.
- **Cookies:** Secure, HttpOnly, appropriate SameSite.
- **Authorization:** checked on the server for every sensitive action.
- **Secrets:** client secret and `AUTH_SECRET` server-side only, separated per environment.
- **Logging:** never log passwords, hashes, tokens, cookies or authorization headers. This is consistent with logging reference §11.
- **Privileged users:** stronger authentication recommended for staff and admin.

---

## 12. Configuration and Environment

Placeholders only.

```env
AUTH_SECRET=<secure-random-secret>
AUTH_GOOGLE_ID=<google-client-id>
AUTH_GOOGLE_SECRET=<google-client-secret>
APP_PUBLIC_URL=<https-origin>
```

- Use separate Google projects and clients for non-production and production.
- Use stable staging and production domains, because redirect URIs must match exactly.
- The hosting choice affects this: Vercel preview hostnames vary, while a VPS gives fixed domains. See the Hosting cross-review.

---

## 13. Implementation Status

| Area | Status | Remaining Work |
|---|---|---|
| Identity architecture | Agreed | — |
| Auth.js version | Blocked | Compatibility spike |
| Session strategy | Blocked | Decide after spike |
| Google Cloud configuration | Not started | Non-production project first |
| Identity migrations | Not started | After spike |
| Collision UX | Blocked | Design required |
| Logging catalogue update | Not started | Add `auth.*` events |

---

## 14. Testing and Verification

**Performed:** None.

**Required:**
- New Google user.
- Returning Google user.
- Email collision.
- Disabled user.
- User cancels at Google.
- Invalid `state`.
- Redirect mismatch.
- Open-redirect attempt.
- Local registration, verification, reset and throttling.
- Unlink-last-method rejected.
- Session revocation behaviour under the chosen strategy.
- No tokens in logs.

**Acceptance criteria:**
- All flows resolve to a single `users.id`.
- No duplicate accounts are created.
- Disabled accounts are blocked.
- Security events appear with `requestId` and no secrets.

---

## 15. Lessons Learned

| Issue | Lesson |
|---|---|
| Tutorials present Auth.js v5 as stable | Check npm tags and official documentation, not articles |
| Email is tempting as a join key | Use provider `sub` plus `users.id`; email only detects a possible collision |
| Phase labels lag behind designs | Promote tables required for a safe release instead of shipping a partial implementation |
| Duplicate source file supplied | Confirmed identical; one canonical copy should be kept |

---

## 16. Risks and Limitations

| Risk | Likelihood | Impact | Mitigation | Status |
|---|---|---|---|---|
| Account takeover through unsafe linking | Medium | High | Ownership confirmation | Open |
| Auth.js beta instability | Medium | High | Spike; pin exact version | Open |
| JWT sessions limit revocation | Medium | Medium | Token versioning or a database-session design | Open |
| Google testing-mode limits in staging | High | Low | Manage test users; plan verification | Open |
| Provider outage blocks Google users | Low | Medium | Local credentials as an alternative | Open |
| Guest orders orphaned from later accounts | Medium | Medium | Define linkage rule | Open |

---

## 17. Open Questions and Blockers

### Blocking
- Exact Next.js version.
- Auth.js v4 or v5.
- Session strategy.
- Collision UX.

### Non-Blocking
- Transactional email provider (shared with payments).
- "Log out all devices" in the first release.
- Connected-accounts UI timing.
- Facebook timing.

### Required Decisions
- Verification-token design.
- Stable staging and production domains.
- Where `auth.*` audit events are stored in Phase 1.
- Guest-order linkage rule.

---

## 18. Recommended Next Steps

1. Inspect the repository: Next.js and Prisma versions, any existing auth code.
2. Run the Auth.js compatibility spike: Google, Prisma mapping, Credentials and session strategy.
3. Decide the session strategy, and therefore whether `sessions` is needed.
4. Update the logging event catalogue with the `auth.*` events, and decide the Phase 1 placement of `security_events`.
5. Migrate `users` and `accounts`, plus any verification and session tables the design needs.
6. Configure the non-production Google project and client.
7. Implement Google end to end, including all test cases in §14.
8. Add local registration and recovery, then Facebook.

---

## 19. AI Agent Handoff Context

**Objective:** Implement centralized B&V authentication, Google first, under one `users.id`.

**Current state:** Design only. Nothing is implemented.

**Agreed approach:**
- Auth.js after the spike.
- `accounts` mapping by Google `sub`.
- B&V-owned authorization.
- Ownership-confirmed linking.

**Hard constraints:**
- No auto-merge on email.
- No admin or staff role from provider claims.
- Disabled users are always blocked.
- No tokens or secrets in logs or the client.
- Internal-only post-login redirects.
- Do not store provider tokens without a documented need.

**High-risk areas:** account linking, session revocation, migrations, password reset.

**Remaining tasks:** Section 18.

**Verification required:** Section 14.

**Do not assume:**
- Auth.js version.
- Session strategy.
- File paths.
- That any Google client exists.
- The staging domain.
- The hosting platform.

---

## 20. Glossary

| Term | Meaning |
|---|---|
| OIDC | OpenID Connect, the identity layer on OAuth 2.0 |
| `sub` | Google's stable subject identifier for an account |
| Canonical identity | The single B&V `users.id` behind all sign-in methods |
| Credentials provider | Auth.js mechanism for custom username/password sign-in |
| PKCE | Proof Key for Code Exchange, which protects authorization codes |
| Spike | Short, throwaway compatibility experiment |
| Argon2id | Recommended memory-hard password-hashing algorithm |

---

## 21. References

### Official Sources (as cited by the source document; not re-fetched in this review)
- Google OpenID Connect documentation.
- Google OAuth 2.0 web-server flow.
- Google Auth Platform audience and verification guidance.
- Auth.js documentation (Credentials provider, adapters).
- npm `next-auth` package metadata (checked 28 October 2026).

### Project Files
- B&V Google OAuth & Centralized Authentication Final Reference Document v1.0 (two identical copies).
- B&V Logging & Observability Reference v1.0.
- B&V Payment Gateway Integration Final Reference Document v1.0.
- B&V PostgreSQL Database Design Reference v1.0 (as cited).

---

## Appendix A — Cross-Document Gap Register

| # | Gap | Documents | Recommended Resolution |
|---|---|---|---|
| 1 | `accounts` (and possibly `sessions`, `verification_tokens`) needed at launch but planned for Phase 2 | Auth vs Database reference | Promote per spike outcome |
| 2 | Missing `auth.*` events in the logging catalogue | Auth vs Logging | Add all nine events |
| 3 | `security_events` placed in Phase 2 | Auth vs Logging | Promote, or define an interim destination |
| 4 | Guest-order linkage undefined | Auth vs Payment | Define the rule (for example, link on verified email after registration) |
| 5 | Transactional email provider unselected | Auth and Payment | Select once for both |
| 6 | Redirect URIs depend on stable domains | Auth vs Hosting | Fix domains as part of the hosting decision |
