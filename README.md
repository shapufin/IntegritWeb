# Integrit

Marketing site plus Payload CMS admin in one Next.js 16 app (Payload 3.93, Postgres 17). The RFP form on the site stores each inquiry in Payload and emails the Integrit team, with a confirmation to the visitor.

## Requirements

- Docker with Compose v2 (production and the quick start below), or
- Node `^22.23.4 || >=24.22.1` (Payload's requirement; the Docker image uses `node:24.22.2-alpine`) and a Postgres 17 database if you run without Docker.

## Quick start (Docker)

```powershell
Copy-Item .env.example .env
# Edit .env: set PAYLOAD_SECRET, POSTGRES_PASSWORD, DOMAIN, SMTP_*, RFP_NOTIFY_TO
docker compose --profile dev up -d --build   # dev: includes Mailpit
docker compose up -d --build                 # production: no Mailpit
```

- Site: `https://<DOMAIN>` (with `DOMAIN=localhost` Caddy uses its internal CA; your browser will warn once).
- Admin: `https://<DOMAIN>/admin`.
- Mailpit UI (dev profile only): http://localhost:8025.

On first boot the app runs the committed database migrations automatically (`prodMigrations`), so no manual step is needed.

## First admin user

Open `/admin` on a fresh database. Payload shows the "Create first user" form; the account you create is the admin. Do this immediately after the first deploy, before the site is publicly reachable if possible.

## Environment variables

All are documented in `.env.example`.

| Variable | Purpose |
| --- | --- |
| `PAYLOAD_SECRET` | Required. Long random string (`openssl rand -base64 48`). |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | Postgres container credentials. Compose builds the app's `DATABASE_URL` from them. URL-encode the password if it has reserved characters. |
| `DOMAIN` | Public hostname for Caddy and automatic HTTPS. |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | Outgoing mail. Port 465 uses implicit TLS; others use STARTTLS when offered. |
| `EMAIL_FROM` | From address on outgoing mail. |
| `RFP_NOTIFY_TO` | Where new-RFP notifications go. If unset, the team email is skipped (the inquiry is still saved). |
| `DATABASE_URL` | Only for running outside Docker. |
| `MEDIA_DIR` | Optional upload directory (default `./media`, the `media` volume in Docker). |

## Email setup

- Development: run with `--profile dev`. Mailpit catches all mail; read it at http://localhost:8025. The `.env.example` defaults (`SMTP_HOST=mailpit`, `SMTP_PORT=1025`) already point at it.
- Production: set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` and `EMAIL_FROM` to your provider (Postmark, SES, Mailgun, Microsoft 365, and so on), and `RFP_NOTIFY_TO` to the team inbox.
- Deliverability: send from a domain you control and publish SPF, DKIM and DMARC DNS records for it (your provider gives the exact values). Without them, mail often lands in spam.
- If SMTP is down, the inquiry is still saved and visible in `/admin`; the email failure is logged.

## Database migrations

Production runs with `push: false`; the schema changes only through migrations in `src/migrations`.

```powershell
npm run migrate:create -- <name>   # after changing collections; needs DATABASE_URL pointing at a Postgres
npm run migrate                    # apply pending migrations manually (optional: the app also does this on boot)
```

Commit the generated files (`.ts`, `.json`, and the updated `index.ts`) and rebuild the image.

## Backup and restore

```powershell
# Backup
# (written inside the container, then copied out: PowerShell `>` would corrupt binary output)
docker compose exec postgres sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc -f /tmp/integrit.dump'
docker compose cp postgres:/tmp/integrit.dump integrit-backup.dump

# Restore (into a running, empty or disposable database)
docker compose cp integrit-backup.dump postgres:/tmp/integrit.dump
docker compose exec postgres sh -c 'pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists /tmp/integrit.dump'
```

Also back up uploaded files (the `media` volume) and keep copies off the server:

```powershell
docker run --rm -v integritweb_media:/m -v ${PWD}:/b alpine tar czf /b/media-backup.tgz -C /m .
```

The volume name is `<project>_media`; check with `docker volume ls`.

## Updating

```powershell
docker compose build --pull
docker compose up -d
```

Migrations run on boot. Data lives in the `pgdata`, `media` and `caddy_data` volumes and survives `docker compose down` (do not add `-v`).

## Local development without Docker

```powershell
npm ci
# set DATABASE_URL (a local Postgres) and PAYLOAD_SECRET in .env
npm run dev
npm run lint    # tsc --noEmit
npm test        # vitest
```

In development Payload pushes schema changes automatically; create a migration before deploying them.

## Security notes

- Set a strong, unique `PAYLOAD_SECRET` and a strong `POSTGRES_PASSWORD`. Never commit `.env`.
- Do not publish port 5432. The compose file deliberately exposes only Caddy (80/443); the app (3000) and Postgres are internal. Mailpit's UI binds to 127.0.0.1 only.
- Create the first admin user right after deploying, then use strong passwords for every admin.
- RFP submissions are validated server-side, rate limited per IP and honeypot-protected; real inquiries are readable only from `/admin`.
- Keep the host patched and update the images regularly (see Updating).
