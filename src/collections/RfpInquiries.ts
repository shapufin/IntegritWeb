import type { CollectionConfig } from 'payload'

const authenticated = ({ req: { user } }: { req: { user?: unknown } }) => Boolean(user)

export const RFP_STATUSES = [
  'In Review',
  'Technical Assessment',
  'PoC Blueprint',
  'Hardened Staging',
  'Production Cutover',
] as const

export const RfpInquiries: CollectionConfig = {
  slug: 'rfp-inquiries',
  labels: { singular: 'RFP Inquiry', plural: 'RFP Inquiries' },
  admin: {
    useAsTitle: 'rfpNumber',
    defaultColumns: ['rfpNumber', 'companyName', 'workEmail', 'status', 'submissionDate'],
  },
  // Admin-only. Public submissions go through a server action using the Local API.
  access: {
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    { name: 'rfpNumber', type: 'text', required: true, unique: true, index: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'In Review',
      options: RFP_STATUSES.map((s) => ({ label: s, value: s })),
    },
    {
      name: 'submissionDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
    },
    { name: 'fullName', type: 'text', required: true },
    { name: 'workEmail', type: 'email', required: true },
    { name: 'companyName', type: 'text', required: true },
    { name: 'companyLocation', type: 'text' },
    { name: 'selectedServices', type: 'text', hasMany: true },
    { name: 'hypervisorPreference', type: 'text' },
    { name: 'containerRequirement', type: 'text' },
    { name: 'firewallRequirement', type: 'text' },
    { name: 'estimatedNodes', type: 'text' },
    { name: 'timeline', type: 'text' },
    { name: 'notes', type: 'textarea' },
  ],
}
