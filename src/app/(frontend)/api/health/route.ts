export const dynamic = 'force-dynamic'

// Liveness probe for Docker/Caddy. Intentionally does not touch the database.
export function GET() {
  return Response.json({ status: 'ok' })
}
