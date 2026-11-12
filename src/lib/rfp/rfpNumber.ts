import { randomInt } from 'node:crypto'

export const RFP_NUMBER_RE = /^RFP-\d{4}-\d{4}$/

export function generateRfpNumber(now: Date = new Date()): string {
  return `RFP-${now.getUTCFullYear()}-${randomInt(1000, 10000)}`
}
