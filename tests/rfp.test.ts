import { describe, expect, it } from 'vitest'

import { buildConfirmationEmail, buildTeamEmail } from '@/lib/rfp/emails'
import { escapeHtml, stripLineBreaks } from '@/lib/rfp/escapeHtml'
import { createRateLimiter } from '@/lib/rfp/rateLimit'
import { generateRfpNumber, RFP_NUMBER_RE } from '@/lib/rfp/rfpNumber'
import { parseRfpInput } from '@/lib/rfp/schema'

const valid = {
  fullName: 'Marcus Vance',
  workEmail: 'm.vance@company.com',
  companyName: 'Apex',
  companyLocation: 'NY',
  selectedServices: ['VMware to Proxmox Migration'],
  hypervisorPreference: 'Proxmox VE',
  containerRequirement: 'Talos',
  firewallRequirement: 'pfSense',
  estimatedNodes: '12-30 Nodes',
  timeline: 'Within 30-60 Days',
  notes: '',
}

describe('rfp schema', () => {
  it('accepts valid input and trims', () => {
    const r = parseRfpInput({ ...valid, fullName: '  Bob  ' })
    expect(r.ok && r.data.fullName).toBe('Bob')
  })
  it('requires core fields', () => {
    const r = parseRfpInput({ ...valid, fullName: ' ', companyName: '', companyLocation: '' })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(['companyLocation', 'companyName', 'fullName'])
  })
  it('rejects bad email', () => {
    const r = parseRfpInput({ ...valid, workEmail: 'nope' })
    expect(!r.ok && r.errors.workEmail).toBe('Enter a valid corporate email address')
  })
  it('needs >=1 service', () => {
    expect(parseRfpInput({ ...valid, selectedServices: [] }).ok).toBe(false)
  })
  it('enforces length caps', () => {
    expect(parseRfpInput({ ...valid, fullName: 'a'.repeat(201) }).ok).toBe(false)
    expect(parseRfpInput({ ...valid, notes: 'a'.repeat(5001) }).ok).toBe(false)
    expect(parseRfpInput({ ...valid, notes: 'a'.repeat(5000) }).ok).toBe(true)
  })
  it('rejects non-objects and strips unknown keys (rfpNumber/status)', () => {
    expect(parseRfpInput(null).ok).toBe(false)
    const r = parseRfpInput({ ...valid, rfpNumber: 'X', status: 'Production Cutover' })
    expect(r.ok && 'rfpNumber' in r.data).toBe(false)
    expect(r.ok && 'status' in r.data).toBe(false)
  })
})

describe('escapeHtml', () => {
  it('escapes special chars', () => {
    expect(escapeHtml(`<img src=x onerror="a('b')">&`)).toBe(
      '&lt;img src=x onerror=&quot;a(&#39;b&#39;)&quot;&gt;&amp;',
    )
    expect(escapeHtml(undefined)).toBe('')
  })
  it('stripLineBreaks removes CR/LF', () => {
    expect(stripLineBreaks('a\r\nBcc: x@y.z')).toBe('a Bcc: x@y.z')
  })
  it('emails escape user data and keep subject single-line', () => {
    const d = parseRfpInput({ ...valid, companyName: '<b>x</b>\r\nBcc: evil@x.com', notes: '<script>1</script>' })
    if (!d.ok) throw new Error('invalid')
    const meta = { rfpNumber: 'RFP-2026-1234', submissionDate: '2026-01-01T00:00:00.000Z' }
    const team = buildTeamEmail(d.data, meta)
    expect(team.html).not.toContain('<script>')
    expect(team.html).not.toContain('<b>x</b>')
    expect(team.subject).not.toMatch(/[\r\n]/)
    expect(buildConfirmationEmail(d.data, meta).html).not.toContain('<b>x</b>')
  })
})

describe('generateRfpNumber', () => {
  it('matches format and year', () => {
    for (let i = 0; i < 200; i++) expect(generateRfpNumber()).toMatch(RFP_NUMBER_RE)
    expect(generateRfpNumber(new Date('2031-05-05T00:00:00Z'))).toMatch(/^RFP-2031-\d{4}$/)
  })
})

describe('rate limiter', () => {
  it('allows limit then blocks, per key, and resets after window', () => {
    const rl = createRateLimiter(5, 1000)
    for (let i = 0; i < 5; i++) expect(rl.check('ip1', 0)).toBe(true)
    expect(rl.check('ip1', 10)).toBe(false)
    expect(rl.check('ip2', 10)).toBe(true)
    expect(rl.check('ip1', 1001)).toBe(true)
  })
})
