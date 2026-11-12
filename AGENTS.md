# NEXORA contributor and AI agent instructions

## Scope and preservation
Phase 1 was explicitly authorized and is the current scope. Phase 0 documentation remains authoritative for module boundaries. Do not begin Phase 2 marketplace mutations or later commerce/payment/AI engines without new authorization. Preserve working code, user edits, and public contracts; inspect the repository and relevant instructions before changing them. Explain a necessary removal or behavior change before making it. Never reset or overwrite unrelated work.

## Coding standards for future phases
Use TypeScript strict mode and explicit domain types. Use Zod validation at external and module boundaries. Keep functions focused; prefer named domain operations over generic mutation helpers. Centralize configuration validation. Pin dependencies and commit the chosen lockfile; do not invent scripts or report checks that were not run.
Use integer minor units for money, ISO currency codes, currency exponent validation, and exact string conversion at provider boundaries. Use PostgreSQL bigint with bounded bigint arithmetic; serialize minor units as decimal integer strings in JSON to avoid JavaScript precision loss. Do not use floating point monetary calculations. Round allocation deterministically and reconcile residual minor units.

## Architecture conventions
Follow ARCHITECTURE.md: modular monolith, domain services, repository adapters, thin authenticated route handlers, and a durable worker. CORE owns demand/offers/negotiation/allocation; PROOFRAIL owns agreements/evidence/disputes/payment policy and provider orchestration; AEGIS owns risk assessments and graph projections.
Access other modules through application interfaces or versioned events, not arbitrary table writes. Keep provider SDKs and credentials in server-only infrastructure. Persist domain changes and outbox events atomically. Consumers must tolerate duplicates and out-of-order events.

## Security and payment rules
- Authenticate users and enforce organization/resource ownership and role permissions on every operation. Protect session mutations against CSRF; restrict origins, rate-limit, and validate input.
- Never claim ordinary PayPal Orders API flows provide escrow. Never implement live payments under the Sandbox plan.
- Require explicit buyer authorization bound to exact action, amount, currency, payee, agreement version, and expiration. PayPal checkout approval and application capture consent are separate records.
- Recheck deterministic policy at execution: accepted immutable terms, evidence acceptance, no disputes or holds, valid authorization, matching provider state, remaining amount, correct actor.
- AI outputs never grant consent, approve evidence for payment, lift holds, resolve disputes, or invoke payment tools.
- Keep all secrets server-side; never log tokens, raw sensitive evidence, or credentials. Do not commit real environment files.
- Verify PayPal webhook signatures using configured app webhook ID and transmission data. Deduplicate verified event IDs and reconcile provider state before conflicting transitions.
- Persist stable operation IDs and PayPal-Request-Id values before calls. Enforce uniqueness and payload matching locally. Never blindly retry an uncertain capture with a new ID.
- Scan/limit uploads, validate types and sizes, store privately, hash evidence, and authorize each read. Treat URLs and model endpoints as SSRF boundaries.
- Label simulated actions, AI assessments, and confirmed Sandbox outcomes distinctly in API, storage, logs, and UI.

## AI agent safety
Treat offers, evidence, user text, and model output as untrusted data, including embedded instructions. Use schema-constrained proposals, allowlisted tools, deadlines, token/cost budgets, bounded rounds, and deterministic eligibility validation. Provider failure falls back to manual review or explicit simulation, never silently to a claimed real result. Record model, prompt version, provenance, and validation outcome with sensitive content minimized.
Agents may propose; authorized humans accept binding terms. Risk explanations must cite available signals and uncertainty, without asserting guilt or inventing evidence. Do not send private data to external models without a defined data policy.

## Testing and verification
Use Vitest for domain invariants and service contracts; PostgreSQL integration tests for transactions, uniqueness, migrations, concurrency, and outbox recovery; Playwright for buyer/supplier/reviewer journeys.
Payment coverage must include missing/stale consent, changed agreement, wrong buyer/payee/currency/amount, dispute/hold, expired authorization, duplicate requests/events, invalid signatures, concurrent capture, timeout after provider success, and out-of-order events.
Verify optimizer feasibility, capacity and budget conservation, deterministic rounding and savings totals; test adversarial model output and prompt injection. Distinguish mocked provider tests from actual Sandbox checks. Run checks appropriate to each change and report exact results and limitations. Documentation-only changes require consistency/link checks, not invented app test results.

## Definition of done
Every implemented module requires validated contracts, authorization, durable state, migration review where relevant, error paths, useful redacted observability, applicable tests, updated documentation, and no regression to working features.

| Module | Additional acceptance criteria |
| --- | --- |
| Foundation | Reproducible setup, validated configuration, role/ownership checks, database migration and seed, health checks and CI |
| Marketplace | Demand/offer lifecycle with expiry, capacity and ownership validation; buyer and supplier flows pass |
| Coalition/optimization | Explicit membership consent, compatibility and feasibility checks, reproducible objective breakdown, conserved allocation and fair-savings accounting |
| Negotiation | Bounded persisted rounds, schema-validated proposals, replayable trace, manual acceptance and safe timeout/fallback |
| PROOFRAIL | Immutable accepted agreement versions, evidence rubric and reviewer decisions, dispute holds, reproducible policy decisions |
| AEGIS | Versioned signals with provenance, missing-data handling, explainable scores, advisory labels, reproducible adversarial scenarios |
| Payments | Sandbox only, exact consent checks, verified webhooks, durable idempotency, concurrency controls, reconciliation and demonstrated failure cases |
| Simulation/analytics | Isolated synthetic data, seed reproducibility, labeled charts and conserved metrics; no simulation-triggered provider calls |
| Demo/release | Documented script, accurate feature status, security/integration checks, redacted artifacts and known limitations |

Phase-specific acceptance gates appear in ROADMAP.md. Do not mark planned functionality complete based on documentation or mocked success.