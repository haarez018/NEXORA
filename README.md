# NEXORA — Autonomous Commerce Intelligence
**Negotiate. Verify. Transact.**

## Vision and problem
Buyers with compatible needs often negotiate separately, suppliers lack coordinated demand signals, and fulfillment evidence is disconnected from payment decisions. NEXORA proposes a commerce network that aggregates demand, compares supplier offers, negotiates bounded proposals, and connects agreements, evidence, risk assessments, and authorized PayPal Sandbox payments.

## Status
Phase 1 foundation is implemented: Next.js navigation and synthetic command center, Better Auth infrastructure with database membership authorization, foundational Prisma schema/migration/seed, environment validation and test tooling. Database migration/seed and end-to-end login remain unverified locally because PostgreSQL is unavailable. CORE commerce workflows, PROOFRAIL execution, AEGIS computation and all sponsor integrations remain planned. Phase 2 has not started.

The initial Phase 0 directory was empty; no existing application functionality was removed. Public preview data comes from static shared seed fixtures, not operational queries.

See [architecture](ARCHITECTURE.md), [ordered roadmap](ROADMAP.md), and [contributor and agent rules](AGENTS.md).

## Three subsystems
- **NEXORA CORE:** marketplace coordination, compatible demand aggregation, coalitions, bounded buyer/supplier negotiation, constrained deal optimization, and transparent savings allocation.
- **PROOFRAIL:** versioned agreements, milestone conditions, evidence review, internal disputes, deterministic payment eligibility, and server-side PayPal orchestration.
- **AEGIS:** supplier and relationship risk signals, explainable assessments, and adversarial simulations. Scores are advisory; configured deterministic policy and human review govern blocks and payment eligibility.

## Primary users and use cases
| User | Planned use |
| --- | --- |
| Buyer | Submit demand, join a coalition, compare offers, accept an agreement, approve checkout, review fulfillment, explicitly authorize capture |
| Supplier | Publish offers and capacity, negotiate within limits, accept terms, submit evidence |
| Reviewer/operator | Inspect evidence and risk reasons, handle disputes, review reconciliation and audit trails |
| Demo evaluator | Run reproducible synthetic scenarios and inspect clearly labeled simulated versus Sandbox outcomes |

## End-to-end workflow
1. Authenticated buyers submit quantity, category/specification, destination, currency, budget, and delivery constraints.
2. CORE proposes compatible coalitions; buyers opt in. Suppliers submit offers with capacity and expiration.
3. Bounded negotiation agents propose counteroffers; deterministic validation checks budgets, capacity, eligibility, and deadlines.
4. An optimizer proposes feasible allocation and savings against a disclosed baseline. Buyers accept their own allocations; suppliers accept terms.
5. PROOFRAIL freezes a versioned agreement and milestone checklist. Changed terms invalidate prior acceptances and payment permissions.
6. AEGIS records advisory signals and evidence. Unresolved deterministic risk flags or disputes prevent payment actions.
7. Each buyer separately approves a PayPal Sandbox order for that buyer's supplier allocation. Proposed demo scope: one currency, one supplier per buyer allocation, one full authorization/capture per payment. No pooled wallet or automatic supplier payout.
8. Supplier submits evidence; authorized reviewers record acceptance against predefined conditions. AI can summarize or flag evidence but cannot approve payment.
9. Buyer explicitly authorizes capture for an exact agreement version, payee, amount, currency, and action. Server policy rechecks permissions, evidence, disputes, risk holds, provider state, and remaining authorization.
10. Server executes an idempotent capture. Verified webhooks and provider reconciliation establish outcomes; ambiguous responses remain pending reconciliation.

If authorization expires before fulfillment, block capture and obtain fresh buyer approval through a new payment attempt. Long-running milestones are unsuitable for the initial authorization/capture demo.

## Planned technical architecture
Next.js App Router, TypeScript strict mode, and Tailwind CSS; PostgreSQL with Prisma; Zod at trust boundaries; React Flow for relationship networks; Recharts for analytics; OpenAI-compatible provider adapters; Vitest and Playwright. A modular monolith with PostgreSQL outbox/inbox tables and a separate worker process avoids premature microservices. Browser clients never access Prisma, model credentials, or PayPal secrets.

## Development setup
Validated runtime: Node.js 24.16.0 and npm 11.13.0. Dependencies are pinned with package-lock.json. For a read-only demonstration with no database or credentials:

```powershell
Set-Location 'C:\Users\asus\Desktop\NEXORA'
npm.cmd ci
npm.cmd run db:generate
npm.cmd run dev
```
Open [localhost:3000](http://localhost:3000). For full PostgreSQL, migrations, idempotent seeding, trusted account provisioning and authentication setup, follow [DEVELOPMENT.md](docs/DEVELOPMENT.md). Actual local check results and blockers are recorded in [Phase 1 verification](docs/PHASE1_VERIFICATION.md).

## Environment configuration
Copy .env.example to ignored .env.local; Next.js loads it, and Prisma/CLI scripts explicitly load it using dotenv. Process environment overrides file values. Never commit real environment files.

| Variables | Implemented Phase 1 purpose |
| --- | --- |
| APP_MODE | demo by default; operational requires database and session secret |
| APP_BASE_URL | Bare trusted origin; remote production operational origins require HTTPS |
| DATABASE_URL, AUTH_SESSION_SECRET | Server-only PostgreSQL connection and random session secret of at least 32 characters |
| AI_PROVIDER, PAYMENTS_MODE | Must be disabled during Phase 1; no model or payment adapter exists |
| LOG_LEVEL | info, warn or error; approved-field structured logs |
| POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB | User-supplied Docker Compose database credentials/configuration |
| TEST_DATABASE_URL | Optional dedicated migrated PostgreSQL integration test database |
| PROVISION_* | Trusted local operator account/membership provisioning; never browser supplied |
| PLAYWRIGHT_CHANNEL | Optional browser test override, such as msedge |
| AI_BASE_URL, AI_MODEL, AI_API_KEY, PAYPAL_*, EVIDENCE_STORAGE_PATH | Reserved future configuration, not consumed in Phase 1 |

No NEXT_PUBLIC secret variables exist. Operational authentication fails closed when configuration or dependencies are unavailable. Demo mode grants no authenticated access. Public registration is disabled; operator provisioning supports buyer, supplier and organization administrator roles. Password recovery/email delivery and a production deployment review remain outstanding. See [Better Auth's Next.js integration](https://better-auth.com/docs/integrations/next).

## PayPal Sandbox boundaries
Sandbox uses test accounts and test funds; successful calls do not prove production eligibility, settlement, compliance, or fraud protection. Ordinary Orders API flows do not provide escrow. An authorization is a temporary hold, not a custodial balance or guaranteed later capture. PayPal documents a 29-day authorization period and recommends capture within its initial three-day honor period; later capture is subject to provider rules and availability. See [authorize/capture](https://developer.paypal.com/checkout/delay-capture/).

Use stable request IDs for supported payment POST operations, backed by local uniqueness and reconciliation; retention and support vary by endpoint. See [REST requests](https://developer.paypal.com/api/rest/requests/). Verify webhook authenticity with the configured webhook ID, transmission headers, and event through PayPal's signature verification mechanism before processing; simulator notifications alone do not validate a complete transaction. See [webhook integration](https://developer.paypal.com/api/rest/webhooks/rest/).

The demo assumes a single configured Sandbox merchant acting as the demo supplier. Real multi-merchant onboarding, split settlement, marketplace fees, Payouts, and production use require separate product/access review and are out of scope. Application disputes are internal workflow records, not PayPal dispute decisions.

## Assumptions and unresolved decisions
Initial scope proposes one configured currency (USD for fixtures), divisible integer quantities, domestic synthetic logistics, one winning supplier per buyer allocation, and explicit participant acceptance. Supported currency exponents must be validated; amounts are integer minor units internally and exact decimal strings at PayPal boundaries.

Authentication now uses Better Auth email/password accounts, database-backed sessions, and organization-scoped BUYER, SUPPLIER and ORG_ADMIN memberships. Decide data retention, production identity recovery/verification, evidence storage and verification rubric, optimization objective weights and baseline, negotiation limits, human review rules, and deployment/worker hosting before the relevant phases. Before Phase 7, verify merchant/payee permissions, API behavior, webhook delivery, and realistic milestone timing. No live-money rollout is authorized by this plan.
## Sponsor readiness
See the preliminary [sponsor integration matrix](docs/SPONSOR_STRATEGY.md). No prize eligibility is confirmed and no sponsor SDKs or APIs are integrated.
