# Local development
## Requirements
Node.js 24 (validated with 24.16.0), npm 11 (validated with 11.13.0). The lockfile pins dependencies. PostgreSQL 17 is the local database target; Docker Compose is optional if an existing PostgreSQL service is available.

## Read-only demonstration (no database or credentials)
In PowerShell:
```powershell
Set-Location 'C:\Users\asus\Desktop\NEXORA'
npm.cmd ci
npm.cmd run db:generate
npm.cmd run dev
```
Open [localhost:3000](http://localhost:3000). All nine public navigation areas use static synthetic fixtures from src/modules/core/demo-data.ts. These pages intentionally do not query operational records. Search and chart controls affect the preview locally. Marketplace mutations, optimization, negotiation, verification, risk computation, simulation execution and payment execution are not implemented.

## Database-backed authentication
```powershell
Copy-Item .env.example .env.local
```
Edit .env.local locally:
- Set APP_MODE=operational and APP_BASE_URL=http://localhost:3000.
- Choose POSTGRES_USER, POSTGRES_PASSWORD and POSTGRES_DB.
- Set DATABASE_URL to postgresql://USER:PERCENT_ENCODED_PASSWORD@localhost:5432/DATABASE using those same values.
- Generate a random secret of at least 32 characters for AUTH_SESSION_SECRET. One local generator is `node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"`; do not paste its output into chat or commit it.
- Leave AI_PROVIDER=disabled and PAYMENTS_MODE=disabled. Other values are rejected during Phase 1.

Start Docker Desktop or your PostgreSQL service, then:
```powershell
docker compose --env-file .env.local up -d postgres
npm.cmd run db:generate
npm.cmd run db:validate
npm.cmd run db:migrate
npm.cmd run db:seed
```
The initial checked-in migration is additive on an empty database. It contains custom CHECK constraints beyond Prisma schema syntax; preserve them in future migrations. `db:migrate` deploys checked-in migrations; `db:dev -- --name descriptive_name` creates future development migrations and can propose resets. Never approve a reset or use destructive commands without explicit authorization. Do not use db push to bypass reviewed migrations. Do not delete the Docker volume.

The seed is local-only, idempotent and transactional. It creates a separate isDemo organization and synthetic users without passwords or sessions. Coalition memberships are invitations; no real consent is asserted. Evidence, verified fulfillment and provider successes are not fabricated. Existing fixture IDs are not overwritten; seed changes require a reviewed follow-up migration/script.

## Provisioning trusted accounts
Public registration and browser role selection are disabled. An operator creates one account/membership at a time using environment variables; use distinct accounts to exercise BUYER, SUPPLIER and ORG_ADMIN. Set PROVISION_EMAIL, PROVISION_NAME, PROVISION_PASSWORD (12–128 characters), PROVISION_ROLE, PROVISION_ORG_SLUG and PROVISION_ORG_NAME in the ignored .env.local.
```powershell
npm.cmd run auth:provision
npm.cmd run dev
```
The script hashes the password with Better Auth's password primitive and creates user/account/membership/audit records in one transaction. Existing emails are not overwritten and demo organizations reject account provisioning. Clear the PROVISION_PASSWORD value after use. The script is a trusted local administrative interface, never a browser endpoint.

Visit /login, then /workspace. Active organization membership is read from PostgreSQL on every protected operation, so a client role or forged header grants nothing. Buyer access: /workspace/ORG_ID/buying; supplier: /workspace/ORG_ID/supplying; administrator: /workspace/ORG_ID/administration. Roles do not imply one another. Phase 1 exposes authorization foundations, not role-management or commerce mutation tools. Session cookies use Better Auth's secure configuration; remote production operational origins require HTTPS. Trusted origins and authentication rate limiting are configured server-side.

Email verification delivery, password recovery, invitations, SSO/MFA and multi-node deployment hardening are not implemented. Provisioned account access does not certify mailbox ownership. Do not expose a public production service until those operational requirements have been reviewed.

## Commands and checks
```powershell
npm.cmd run db:validate
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build
npm.cmd run start
```
Build generates Prisma Client first and does not require a database or a real session secret in demo mode. It does not prove migrations or login work. Runtime environment validation occurs when server routes access configuration; the public static preview never needs private configuration.

For PostgreSQL integration tests, provision a dedicated database, point TEST_DATABASE_URL at it, apply the same migration to it, then run `npm.cmd run test:db`. Tests use transactions and roll back their own inserts. Without TEST_DATABASE_URL they are explicitly skipped.

The browser suite expects demo mode and no operational environment. Stop any existing server, then:
```powershell
$env:APP_MODE = 'demo'
npx.cmd playwright install chromium
npm.cmd run build
npm.cmd run test:e2e
```
If local Chromium launch is blocked but Microsoft Edge is installed:
```powershell
$env:PLAYWRIGHT_CHANNEL = 'msedge'
npm.cmd run test:e2e
```
CI uses Chromium. Clear temporary environment overrides after testing. Browser tests cover the demo navigation and fail-closed auth, not a real database-backed login. The CI workflow defines a PostgreSQL service, applies migrations, seeds twice, and runs integration tests; it has not been remotely executed merely by adding the workflow.

## Health and observability
/api/health reports application liveness and execution disabled status. /api/health/ready checks database connectivity only; it is not proof of schema migration, permission correctness, model availability or payment readiness. API errors have safe messages and request IDs; structured logs project only approved fields. Production log retention/alerting and the durable outbox worker remain later work. No worker processes or sponsor integrations run in Phase 1.
