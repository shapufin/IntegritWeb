import { z } from 'zod'

const str = (max = 200) => z.string().trim().max(max, `Must be at most ${max} characters`)
const required = (msg: string, max = 200) => str(max).min(1, msg)

export const rfpInputSchema = z.object({
  fullName: required('Full name is required'),
  workEmail: required('Work email is required', 254).regex(
    // No commas/semicolons/angle brackets: the value is used as a mail recipient, so a
    // list like "a@x.com,b@y.com" must not pass.
    /^[^\s@,;<>"()]+@[^\s@,;<>"()]+\.[^\s@,;<>"()]+$/,
    'Enter a valid corporate email address',
  ),
  companyName: required('Company name is required'),
  companyLocation: required('Location/State is required'),
  selectedServices: z
    .array(str(200).min(1))
    .min(1, 'Select at least one service')
    .max(20, 'Too many services selected'),
  hypervisorPreference: str().default(''),
  containerRequirement: str().default(''),
  firewallRequirement: str().default(''),
  estimatedNodes: str().default(''),
  timeline: str().default(''),
  notes: str(5000).default(''),
})

export type RfpInput = z.infer<typeof rfpInputSchema>

/** Returns field -> first error message. */
export function parseRfpInput(
  raw: unknown,
): { ok: true; data: RfpInput } | { ok: false; errors: Record<string, string> } {
  const result = rfpInputSchema.safeParse(raw)
  if (result.success) return { ok: true, data: result.data }
  const errors: Record<string, string> = {}
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? 'form')
    if (!errors[key]) errors[key] = issue.message
  }
  return { ok: false, errors }
}
