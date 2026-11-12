# Integrit — Production Build Plan (Payload 3 + Next.js 16 + Docker)

## Primary goal
A visitor opens the Integrit site (pixel-identical to the AI Studio mockup), submits the RFP form, and the inquiry is stored in Payload and emailed to the Integrit team (plus a confirmation to the visitor) — all running from `docker compose up` on any server.

## Verified facts (checked 2026-11-10, npm + Payload docs via context7)
- Latest: `payload` / `@payloadcms/next` / `@payloadcms/db-postgres` / `@payloadcms/email-nodemailer` / `@payloadcms/richtext-lexical` = **3.93.0**; `next` 16.4.6 (Payload peer range allows `>=16.3.3 <17`); `react` 19.3.1; `nodemailer` 10.5.0; `sharp` 0.35.5; `graphql ^16.8.1` (peer, required).
- Payload requires Node `^22.23.4 || >=24.22.1` -> Docker base `node:24-alpine` (docs example uses `node:24.22.1-alpine`).
- Mockup: Vite 8 + React 19 + Tailwind 4 SPA, no backend. All state is client-side (`App.tsx`: `activeView`, `inquiries`, toast). Only the RFP form (`src/components/RfqContactSection.tsx`) needs a backend. `ClientDashboard` reads `INITIAL_CLIENT_INQUIRIES` from `src/data/mockData.ts`. Fonts via Google Fonts link in `index.html`. Tailwind via `@theme` in `src/index.css`. Unused deps to drop: `express`, `dotenv`, `@google/genai`, `esbuild`, `tsx`, `vite`.
- Project is not a git repo; Docker/`.env` files must be git-ignored carefully (`.gitignore` exists, 73 bytes).

## Decisions (change in review if wrong)
1. **Single Next.js app hosts site + Payload admin** (`/admin`), per Payload's supported install. Mockup components move over unchanged as client components.
2. **Database: Postgres 17** (`@payloadcms/db-postgres`), migrations committed, `prodMigrations` on boot, `push:false` in production.
3. **Email: `@payloadcms/email-nodemailer` via SMTP** (any provider; Mailpit container in dev compose profile to see mail locally). "Receive emails" = notification email to team on each RFP; the inquiry is also always stored in Payload so no lead is lost if SMTP is down.
4. **Client Portal privacy:** mockup shows other companies' RFPs and contact emails to anyone. In production the portal shows demo sample inquiries (clearly seeded, no real data) plus *only the visitor's own* submission (kept in browser state / returned RFP number). Real inquiries are visible only in `/admin`.
5. **Reverse proxy/TLS:** Caddy container (automatic HTTPS) in compose; optional, app also reachable on :3000.

## Phase 0 — Documentation discovery (done above; re-read before Phase 1)
**How this serves the goal:** prevents invented Payload APIs breaking the build.
Allowed APIs (all from Payload docs/`/payloadcms/payload`):
- `withPayload(nextConfig)` from `@payloadcms/next/withPayload` in ESM `next.config.mjs`; `output: 'standalone'`.
- `buildConfig({ db: postgresAdapter({ pool:{connectionString}, prodMigrations, push:false }), email: nodemailerAdapter({ defaultFromAddress, defaultFromName, transportOptions:{host,port,auth} }), collections, secret, editor: lexicalEditor(), typescript:{outputFile} })`.
- `getPayload({ config })` from `payload`, `payload.create({collection, data})`, `payload.sendEmail({to,subject,html})`; collection `access`, `hooks.afterChange`.
- Next App Router: server action or `POST /api/rfp` route for the form.
Anti-patterns: v2 `payload.init` / `email:{transport}` config (removed in v3); `@payloadcms/bundler-*`; MongoDB adapter; Next 15.3.0–15.3.8 (outside peer range); `overrideAccess` omitted in public routes (creates must be validated server-side, never exposing read).
Docs to consult: `docs/getting-started/installation.mdx`, `docs/production/deployment.mdx` (Dockerfile), `docs/database/migrations.mdx`, `packages/email-nodemailer/README.md`.

## Phase 1 — Scaffold Payload + Next.js in this folder
**How this serves the goal:** gives a runnable app shell that can host the mockup and store data.
- Run `npx create-payload-app@latest` into a temp dir (blank template, postgres), copy `src/app/(payload)`, `payload.config.ts`, `next.config.mjs`, `tsconfig` paths (`@payload-config`) into the project; replace `package.json` deps with latest from the facts above; remove Vite files (`vite.config.ts`, `index.html`, `src/main.tsx`) after Phase 2.
- Collections: `users` (auth, admin), `media` (optional, sharp), `rfp-inquiries`.
- Verify: `npm run dev` -> `/admin` creates first user; `npm run generate:types`; `npm run build` passes.
- Guard: no Mongo adapter; no Vite leftovers in `package.json`.

## Phase 2 — Port the mockup 1:1
**How this serves the goal:** the site must look exactly like the mockup.
- Move `src/components/*`, `src/data`, `src/types`, `App.tsx` logic into `src/app/(frontend)/` (`page.tsx` renders a `'use client'` `<SiteApp/>` = current `App.tsx`). Add `'use client'` to every component using hooks/`motion`.
- Move metadata from `index.html` to `layout.tsx` `metadata`; load fonts with `next/font/google` (Plus Jakarta Sans, DM Sans, JetBrains Mono) mapped to the existing `--font-*` theme variables; keep `src/index.css` Tailwind 4 `@theme` via `@tailwindcss/postcss`.
- Admin and frontend route groups must not share the global CSS (Payload admin has its own styles).
- Verify: screenshot compare against `integrit-desktop.png` at 1440px and mobile 375px; no horizontal scroll; `design.md` section 7 rules intact (Traefik, Proxmox LXC, dual-viewport hero).
- Guard: do not restyle or refactor components; copy as-is.

## Phase 3 — RFP storage + email
**How this serves the goal:** this is the "receive emails" requirement.
- `rfp-inquiries` collection fields = `RfqFormData` (fullName, workEmail, companyName, companyLocation, selectedServices[], hypervisor, container, firewall, estimatedNodes, timeline, notes) + `rfpNumber` (unique, generated server-side), `status` (the 5 existing statuses), `submissionDate`. Access: `create` none via REST for public (server action uses Local API), `read/update/delete` admin only.
- Server action `submitRfp`: zod-validate (same rules as `validate()` in `RfqContactSection.tsx`), honeypot field + simple per-IP rate limit, create doc, return `rfpNumber`. Replace client `Math.random` RFP number with server value; form then calls the action.
- `afterChange` hook (create only): `payload.sendEmail` -> team (`RFP_NOTIFY_TO`) with full details, and confirmation to `workEmail`. Email failure is caught and logged, never fails the submit.
- Note: also add `estimatedNodes`/`timeline` to the payload — mockup collects them in state but never shows inputs for them; keep defaults.
- Verify: Mailpit receives both emails; doc appears in admin; invalid input rejected; SMTP down -> inquiry still saved.
- Guard: never trust client-sent `rfpNumber`/`status`; no secrets in client bundle.

## Phase 4 — Docker & deployment
**How this serves the goal:** one command hosts it.
- `Dockerfile`: multi-stage from the Payload docs example (`node:24-alpine`, deps -> builder -> runner, standalone, non-root, `HOSTNAME=0.0.0.0`); copy `src/migrations` so `prodMigrations` runs.
- `docker-compose.yml`: `app`, `postgres:17-alpine` (named volume, healthcheck, app `depends_on: service_healthy`), `caddy` (80/443, `Caddyfile` -> `app:3000`, volumes for certs), `mailpit` under profile `dev`. Volume for `media` uploads.
- `.env.example`: `DATABASE_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, `SMTP_HOST/PORT/USER/PASS`, `EMAIL_FROM`, `RFP_NOTIFY_TO`, `POSTGRES_PASSWORD`, `DOMAIN`. `.dockerignore`, updated `.gitignore`.
- `README.md`: run, first admin, SMTP setup, backups (`pg_dump` command), DNS/SPF/DKIM note for deliverability.
- Verify: `docker compose build` and `up` from clean; `/` and `/admin` respond; form submit end-to-end; `docker compose down && up` keeps data.
- Guard: no secrets baked into the image; `PAYLOAD_SECRET` required at runtime; Postgres port not published.

## Phase 5 — Final verification
**How this serves the goal:** proves it works before anyone relies on it.
- `npm run build`, `tsc --noEmit`, lint; grep for removed APIs (`payload.init`, `bundler-`, `express`, `vite`).
- Compose end-to-end test with Mailpit; visual diff vs mockup; mobile 340–640px no horizontal scroll, 44px touch targets.
- Security pass (security-review skill): access rules, rate limit, XSS in emailed HTML (escape all user input), headers.
- Note: render/a11y gates need `npx playwright install chrome` (hook preflight says no browser) — until then visual claims are unmeasured.

## Not now
Auth-gated real client portal · CMS-editable marketing copy (content stays in components) · i18n · analytics · CI/CD · S3 media storage
