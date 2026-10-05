/**
 * What a client has to bring for each registration or filing.
 * Source: "Document & Information Requirements.md" in the FSG folder.
 */

export type DocItem = { label: string; note?: string; parts?: string[] }
export type DocGroup = { title: string; items: DocItem[] }
export type DocVariant = { id: string; label: string; groups: DocGroup[] }
export type DocService = { id: string; title: string; blurb: string; variants: DocVariant[] }

const item = (label: string, extra: Omit<DocItem, 'label'> = {}): DocItem => ({ label, ...extra })

const PAN = item('PAN card')
const AADHAAR = item('Aadhaar card')
const MOBILE = item('Mobile number', { note: 'Must be linked to Aadhaar' })
const EMAIL = item('Email ID')
const PHOTO = item('Passport-size photograph')
const BANK = item('Latest bank statement', { note: 'Not older than 6 months' })

const ADDRESS_PARTS = ['Building number', 'Street', 'Nearby landmark', 'City or town', 'District', 'State', 'PIN code']

const PERSON = [PAN, AADHAAR, MOBILE, PHOTO, EMAIL]
const BASIC = [AADHAAR, PAN, MOBILE, EMAIL]

const PREMISES: DocGroup = {
  title: 'Business and premises',
  items: [item('Rent agreement'), item('Property tax receipt'), item('Nature of business'), item('Complete business address', { parts: ADDRESS_PARTS })],
}

const gstVariant = (id: string, label: string, entity: DocGroup | null, people: string): DocVariant => ({
  id,
  label,
  groups: [...(entity ? [entity] : []), { title: people, items: PERSON }, PREMISES],
})

const incorporation = (kind: 'LLP' | 'Company'): DocVariant => ({
  id: 'all',
  label: kind,
  groups: [
    { title: kind === 'LLP' ? 'Each designated partner' : 'Each director', items: [PAN, AADHAAR, BANK, MOBILE, EMAIL] },
    {
      title: kind === 'LLP' ? 'About the LLP' : 'About the company',
      items: [
        item(`Proposed ${kind === 'LLP' ? 'LLP' : 'company'} name`),
        item('Business activity'),
        kind === 'LLP'
          ? item('Contribution and profit-sharing between partners', { note: 'An LLP has partners’ contribution rather than shares' })
          : item('Shareholding pattern'),
        item('Full address of the registered office'),
      ],
    },
    { title: 'Registered office', items: [item('NOC from the building owner'), item('Latest electricity bill')] },
  ],
})

export const DOC_SERVICES: DocService[] = [
  {
    id: 'gst-registration',
    title: 'GST registration',
    blurb: 'What we need depends on how the business is set up.',
    variants: [
      gstVariant('proprietorship', 'Proprietorship', null, 'Proprietor'),
      gstVariant('partnership', 'Partnership', { title: 'The firm', items: [item('PAN of the firm'), item('Partnership deed')] }, 'Each partner'),
      gstVariant('llp', 'LLP', { title: 'The LLP', items: [item('PAN of the LLP'), item('Certificate of incorporation')] }, 'Each partner'),
      gstVariant('company', 'Company', { title: 'The company', items: [item('PAN of the company'), item('Certificate of incorporation')] }, 'Each relevant director'),
    ],
  },
  { id: 'llp-incorporation', title: 'LLP incorporation', blurb: 'For each designated partner, the LLP itself and its registered office.', variants: [incorporation('LLP')] },
  { id: 'company-incorporation', title: 'Company incorporation', blurb: 'For each director, the company itself and its registered office.', variants: [incorporation('Company')] },
  {
    id: 'tds-property',
    title: 'TDS on property purchase',
    blurb: 'When you buy immovable property and have to deduct TDS from the payment.',
    variants: [
      {
        id: 'all',
        label: 'Property',
        groups: [
          { title: 'Seller', items: BASIC },
          { title: 'Buyer', items: [...BASIC, item('Income-tax portal password', { note: 'If you have one' })] },
          { title: 'The property', items: [item('Agreement or sale deed'), item('Share of ownership of each owner')] },
        ],
      },
    ],
  },
  { id: 'msme', title: 'MSME / Udyam registration', blurb: 'Four things, all for the owner.', variants: [{ id: 'all', label: 'MSME', groups: [{ title: 'Owner', items: BASIC }] }] },
  { id: 'tan', title: 'TAN application', blurb: 'Four things, all for the applicant.', variants: [{ id: 'all', label: 'TAN', groups: [{ title: 'Applicant', items: BASIC }] }] },
  {
    id: 'it-registration',
    title: 'Income-tax portal registration',
    blurb: 'To create your login on the income-tax e-filing portal.',
    variants: [{ id: 'all', label: 'Income tax', groups: [{ title: 'Taxpayer', items: BASIC }] }],
  },
]

/** Plain-text list for WhatsApp, the clipboard or a note. */
export function checklistText(service: DocService, variant: DocVariant, firm: string) {
  const heading = service.variants.length > 1 ? `${service.title} (${variant.label})` : service.title
  const lines = [`*Documents for ${heading}*`, '']
  for (const group of variant.groups) {
    lines.push(`_${group.title}_`)
    for (const it of group.items) {
      lines.push(`• ${it.label}${it.note ? ` (${it.note.toLowerCase()})` : ''}`)
      if (it.parts) lines.push(`   ${it.parts.join(', ')}`)
    }
    lines.push('')
  }
  lines.push('All mobile numbers must be linked to Aadhaar.', `From ${firm}`)
  return lines.join('\n')
}

export const itemKey = (service: string, variant: string, group: string, label: string) =>
  [service, variant, group, label].join('/').toLowerCase().replace(/[^a-z0-9/]+/g, '-')
