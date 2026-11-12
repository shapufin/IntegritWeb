'use server'

import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

import { sendRfpEmails } from '@/lib/rfp/emails'
import { createRateLimiter } from '@/lib/rfp/rateLimit'
import { generateRfpNumber } from '@/lib/rfp/rfpNumber'
import { parseRfpInput } from '@/lib/rfp/schema'

export type SubmitRfpResult =
  | { ok: true; rfpNumber: string; submissionDate: string }
  | { ok: false; errors: Record<string, string> }

const limiter = createRateLimiter(5, 60 * 60 * 1000)

async function clientIp(): Promise<string> {
  const h = await headers()
  const fwd = h.get('x-forwarded-for')
  return (fwd?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown').slice(0, 64)
}

export async function submitRfp(raw: unknown): Promise<SubmitRfpResult> {
  const input = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>

  // Honeypot: bots fill the hidden field. Pretend success, save nothing.
  if (typeof input.website === 'string' && input.website.trim() !== '') {
    return {
      ok: true,
      rfpNumber: generateRfpNumber(),
      submissionDate: new Date().toISOString(),
    }
  }

  if (!limiter.check(await clientIp())) {
    return { ok: false, errors: { form: 'Too many submissions. Please try again later.' } }
  }

  const parsed = parseRfpInput(input)
  if (!parsed.ok) return { ok: false, errors: parsed.errors }

  try {
    const payload = await getPayload({ config })
    const submissionDate = new Date().toISOString()

    let rfpNumber: string | null = null
    for (let attempt = 0; attempt < 8 && !rfpNumber; attempt++) {
      const candidate = generateRfpNumber()
      const dup = await payload.find({
        collection: 'rfp-inquiries',
        where: { rfpNumber: { equals: candidate } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      if (dup.totalDocs > 0) continue
      try {
        await payload.create({
          collection: 'rfp-inquiries',
          data: { ...parsed.data, rfpNumber: candidate, status: 'In Review', submissionDate },
          overrideAccess: true,
        })
        rfpNumber = candidate
      } catch (err) {
        // Unique-constraint race: retry with a fresh number; rethrow anything else.
        if (!/unique|duplicate|already/i.test(String((err as Error)?.message))) throw err
      }
    }
    if (!rfpNumber) throw new Error('Could not allocate a unique RFP number')

    await sendRfpEmails(payload, parsed.data, { rfpNumber, submissionDate })

    return { ok: true, rfpNumber, submissionDate }
  } catch (err) {
    console.error('submitRfp failed', err)
    return {
      ok: false,
      errors: { form: 'We could not save your request. Please try again or email us directly.' },
    }
  }
}
