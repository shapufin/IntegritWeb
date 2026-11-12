import type { Payload } from 'payload'

import { escapeHtml, stripLineBreaks } from './escapeHtml'
import type { RfpInput } from './schema'

interface Meta {
  rfpNumber: string
  submissionDate: string
}

function rows(data: RfpInput, meta: Meta): [string, string][] {
  return [
    ['RFP number', meta.rfpNumber],
    ['Submitted', meta.submissionDate],
    ['Name', data.fullName],
    ['Email', data.workEmail],
    ['Company', data.companyName],
    ['Location', data.companyLocation],
    ['Services', data.selectedServices.join(', ')],
    ['Hypervisor', data.hypervisorPreference],
    ['Containers', data.containerRequirement],
    ['Firewall', data.firewallRequirement],
    ['Estimated nodes', data.estimatedNodes],
    ['Timeline', data.timeline],
    ['Notes', data.notes],
  ]
}

export function buildTeamEmail(data: RfpInput, meta: Meta) {
  const body = rows(data, meta)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#555;vertical-align:top"><strong>${escapeHtml(k)}</strong></td><td style="padding:4px 0;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
    )
    .join('')
  return {
    subject: stripLineBreaks(`New RFP ${meta.rfpNumber} - ${data.companyName}`).slice(0, 200),
    html: `<h2>New RFP inquiry ${escapeHtml(meta.rfpNumber)}</h2><table>${body}</table>`,
    text: rows(data, meta)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n'),
  }
}

export function buildConfirmationEmail(data: RfpInput, meta: Meta) {
  return {
    subject: stripLineBreaks(`We received your RFP ${meta.rfpNumber}`),
    html: `<p>Hello ${escapeHtml(data.fullName)},</p><p>Thank you for your inquiry on behalf of <strong>${escapeHtml(data.companyName)}</strong>. Your request is tracked as <strong>${escapeHtml(meta.rfpNumber)}</strong>.</p><p>Our architects will review your scope and respond within 24 business hours.</p><p>Integrit</p>`,
    text: `Hello ${stripLineBreaks(data.fullName)},\n\nThank you for your inquiry on behalf of ${stripLineBreaks(data.companyName)}. Your request is tracked as ${meta.rfpNumber}.\nOur architects will review your scope and respond within 24 business hours.\n\nIntegrit`,
  }
}

/** Sends both emails; never throws. */
export async function sendRfpEmails(payload: Payload, data: RfpInput, meta: Meta): Promise<void> {
  const notifyTo = process.env.RFP_NOTIFY_TO
  if (notifyTo) {
    try {
      const m = buildTeamEmail(data, meta)
      await payload.sendEmail({
        to: notifyTo,
        replyTo: stripLineBreaks(data.workEmail),
        subject: m.subject,
        html: m.html,
        text: m.text,
      })
    } catch (err) {
      payload.logger.error({ err }, `RFP ${meta.rfpNumber}: team notification email failed`)
    }
  } else {
    payload.logger.warn('RFP_NOTIFY_TO not set; team notification skipped')
  }
  try {
    const m = buildConfirmationEmail(data, meta)
    await payload.sendEmail({
      to: stripLineBreaks(data.workEmail),
      subject: m.subject,
      html: m.html,
      text: m.text,
    })
  } catch (err) {
    payload.logger.error({ err }, `RFP ${meta.rfpNumber}: confirmation email failed`)
  }
}
