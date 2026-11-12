# NEXORA ordered development roadmap
Status: Phase 0 complete. Phase 1 foundation implemented with database/authentication execution verification blocked locally. Phase 2 has not started. Future phases require predecessor gates and implementation authorization. Update status with evidence, not aspiration.

## Phase 0 — Architecture and project documentation
Deliverables: repository assessment, README, contributor/agent rules, architecture proposal, this roadmap and placeholder environment template.
Gate: documents agree on trust boundaries, money representation, explicit consent, simulated/Sandbox labeling, limitations and unresolved decisions. Completed in the prior task; Phase 1 was subsequently explicitly authorized.

## Phase 1 — Application foundation and database
Status: implemented foundation; gate pending PostgreSQL migration/seed and real database-backed login validation. See [verification record](docs/PHASE1_VERIFICATION.md).

Delivered: nine responsive preview areas, labeled synthetic dashboard, Better Auth sign-in infrastructure and role-scoped workspace guards, all requested foundational Prisma models with initial SQL migration and safe seed, Compose, environment validation, structured errors/logs, unit/browser tests, CI definition, setup docs and preliminary sponsor matrix. No marketplace mutations or later engines implemented.
Select/pin runtime and package manager; scaffold Next.js App Router, TypeScript strict mode and Tailwind. Configure Prisma/PostgreSQL, Zod environment validation, auth/roles and ownership, migrations, seed fixtures, basic CI and test tooling. Add ignored secret-file rules.
Gate: clean setup and documented scripts work; migrations/seed reproduce; auth and ownership checks pass; no secrets reach client bundles. Decide deployment, sessions, evidence storage and worker environment loading.

## Phase 2 — Buyer and supplier marketplace
Implement demand and offer lifecycle, supplier profiles, expiry, capacity, buyer/supplier dashboards and explicit participant actions.
Gate: validated create/read/update flows, ownership tests, expired-offer rejection, integer money contracts and synthetic fixtures.

## Phase 3 — Coalition optimization
Implement compatibility, explicit coalition opt-in, constrained allocation and transparent savings.
Gate: define baseline, included costs, objective weights, fairness and rounding; deterministic runs conserve quantities/money and respect budget/capacity/deadlines. Infeasible or missing-baseline cases produce explanations. Start with a bounded heuristic; adopt a solver only if needed.

## Phase 4 — Multi-agent negotiation
Implement compatible-provider interface and deterministic mock, persisted bounded rounds, schema-constrained proposals, deadlines, cost limits and human term acceptance.
Gate: proposals cannot exceed constraints; adversarial content and provider outages fail safely; reproducible traces distinguish mock and model outputs. No payment tools exposed to agents.

## Phase 5 — PROOFRAIL agreement engine
Implement immutable agreement versions, participant acceptances, milestone rubrics, private evidence, authorized review, internal disputes and deterministic payment eligibility without provider execution.
Gate: changed terms invalidate permissions; rejected/missing evidence and active disputes block eligibility; review authority and audit are tested. Resolve storage/retention and conflict-of-interest rules.

## Phase 6 — AEGIS risk intelligence
Implement provenance-backed supplier/relationship signals, graph projections, versioned scores, reason codes and advisory explanations.
Gate: missing data/false positives are visible; synthetic collusion cases are reproducible; score alone cannot authorize payment; deterministic holds and authorized review are tested. Resolve thresholds and appeal policy.

## Phase 7 — PayPal Sandbox integration
Validate merchant/payee capability first. Implement server OAuth, order creation/approval verification/authorization, scoped capture consent, deterministic executor, stable request IDs, verified webhooks and reconciliation worker.
Gate: show a real Sandbox authorization/capture with test funds and verified actual event delivery; demonstrate invalid signature, duplicate request/event, stale consent, expiry, concurrent capture and uncertain outcome recovery. Keep simulated records isolated. Reconfirm provider windows and endpoint-specific idempotency. No escrow, split settlement, live credentials or automatic LLM payment decisions.

## Phase 8 — Scenario simulation and analytics
Implement seeded scenarios, synthetic adversarial signals, negotiation comparison, React Flow graphs and Recharts projections.
Gate: scenarios cannot invoke real provider operations; seed/version and data provenance are visible; totals reconcile and simulation, AI and Sandbox outcomes remain clearly labeled.

## Phase 9 — Integration testing and security
Complete Vitest domain suites, real PostgreSQL integration tests and Playwright role journeys. Review permissions, CSRF, SSRF, upload safety, rate limits, secret handling, concurrency, dependency risks and recovery.
Gate: required checks pass; negative payment/security cases pass; reconcile worker restart/dead-letter recovery; document any residual risks and actual Sandbox versus mocked coverage.

## Phase 10 — Demo preparation and submission
Prepare deterministic demo script, architecture narrative, evidence screenshots, short video, setup instructions, feature matrix and submission materials.
Gate: fresh setup rehearsal succeeds; demo distinguishes live model calls, deterministic simulation and actual Sandbox results; no exposed secrets or unsupported claims; known limitations are documented. Production use requires a separate architecture/security/product review.