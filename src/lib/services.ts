import type { Group } from './dueDates'

export type ServiceArea = {
  slug: string
  title: string
  /** Colour family, shared with the due-date groups. */
  tone: Group | 'neutral'
  cadence: string
  summary: string
  detail: string
  includes: string[]
  needs: string[]
  /** Due-date rules shown against this area on the services page. */
  rules: string[]
  /** Pre-ticks this option on the enquiry form. */
  enquiry: string
}

export const SERVICE_AREAS: ServiceArea[] = [
  {
    slug: 'gst',
    title: 'GST',
    tone: 'gst',
    cadence: 'Monthly',
    summary: 'Monthly returns, the annual return and e-way bills, prepared from the records you already keep.',
    detail:
      'Some clients send their bills, some a Tally backup, some an Excel sheet. We turn each into the format the GST offline tool needs, reconcile it and file, working to our own cut-off a day before the 11th and the 20th.',
    includes: ['GSTR-1 and GSTR-3B every month', 'GSTR-9 annual return', 'E-way bills', 'New GST registrations'],
    needs: ['Sales and purchase bills, a Tally backup or an Excel sheet', 'GST portal login', 'E-way bill portal login, if you raise e-way bills'],
    rules: ['gstr1', 'gstr3b', 'gstr9'],
    enquiry: 'gst-filing',
  },
  {
    slug: 'tds',
    title: 'TDS',
    tone: 'tds',
    cadence: 'Monthly & quarterly',
    summary: 'Monthly TDS payments, quarterly returns and the TRACES work that follows them.',
    detail:
      'We pay what you deduct each month, file the quarterly statements and handle TRACES both as deductor and as taxpayer. We also file TDS when you buy property from a seller.',
    includes: ['TDS / TCS payments by the 7th', 'Quarterly TDS returns (24Q, 26Q, 27Q)', 'TRACES, as deductor and as taxpayer', 'TDS on purchase of property'],
    needs: ['Payments made and tax deducted, in Excel', 'TAN, which is also your income-tax login', 'TRACES logins (deductor and taxpayer)'],
    rules: ['tds-pay', 'tds-return'],
    enquiry: 'tds',
  },
  {
    slug: 'income-tax',
    title: 'Income tax',
    tone: 'it',
    cadence: 'Yearly',
    summary: 'Returns for salaried people, professionals and businesses, in audit and non-audit cases.',
    detail:
      'Non-audit returns need no financial statements, just your logins and income details. For audit cases we prepare the return alongside the audit, so both are ready together.',
    includes: ['ITR for individuals (ITR-1, ITR-2)', 'ITR for business and profession (ITR-3, ITR-4)', 'Returns for tax audit cases', 'Income-tax portal registration'],
    needs: ['PAN and income-tax portal login', 'Form 16 and details of other income', 'Books of account, for business and audit cases'],
    rules: ['itr-individual', 'itr-business', 'itr-audit', 'advance-tax'],
    enquiry: 'income-tax',
  },
  {
    slug: 'audit',
    title: 'Audit',
    tone: 'audit',
    cadence: 'Yearly',
    summary: 'Tax audit and internal audit, with the reconciliations and statements that go with them.',
    detail:
      'We prepare financial statements from your books, reconcile them with what has been filed for GST and TDS, and keep every case moving from "to begin" to "completed".',
    includes: ['Tax audit cases', 'Internal audit', 'Reconciliation of books with GST and TDS', 'Financial statements prepared from your books'],
    needs: ['Tally backup or books of account', 'Bank statements for the year', 'Portal logins (GST, income tax, TRACES)'],
    rules: ['tax-audit', 'itr-audit'],
    enquiry: 'audit',
  },
]

export const BOOKS_AND_PAYROLL = {
  title: 'Books and payroll',
  summary: 'Ongoing work that keeps the yearly filings simple.',
  items: ['Bookkeeping in Tally', 'PF compliance', 'ESI compliance'],
}

export const REGISTRATIONS = {
  title: 'Registrations and one-time work',
  summary: 'For when you start a business, take on staff or grow.',
  items: [
    'GST registration',
    'MSME / Udyam registration',
    'LLP incorporation',
    'Company incorporation',
    'Partnership formation',
    'Trademark',
    'FSSAI licence',
    'Digital signature (DSC)',
    'PAN application',
    'TAN application',
    'Income-tax portal registration',
    'Legal metrology',
    'Certifications such as ISO',
    'Project report',
  ],
}

/** The kinds of client FSG works with, as the CRM categorises them. */
export const CLIENT_TYPES = ['Companies', 'LLPs', 'Partnership firms', 'Proprietorships', 'Individuals & professionals', 'Trusts']

/** Options on the enquiry form. `id` is what ?service= links use. */
export const ENQUIRY_OPTIONS = [
  { id: 'gst-filing', label: 'GST filing' },
  { id: 'gst-registration', label: 'GST registration' },
  { id: 'tds', label: 'TDS' },
  { id: 'income-tax', label: 'Income tax return' },
  { id: 'audit', label: 'Audit' },
  { id: 'bookkeeping', label: 'Bookkeeping' },
  { id: 'pf-esi', label: 'PF / ESI' },
  { id: 'incorporation', label: 'LLP / company incorporation' },
  { id: 'partnership', label: 'Partnership formation' },
  { id: 'msme', label: 'MSME / Udyam' },
  { id: 'trademark', label: 'Trademark' },
  { id: 'fssai', label: 'FSSAI' },
  { id: 'dsc', label: 'Digital signature' },
  { id: 'pan-tan', label: 'PAN / TAN' },
  { id: 'project-report', label: 'Project report' },
  { id: 'other', label: 'Something else' },
]

export const BUSINESS_TYPES = ['Company', 'LLP', 'Partnership', 'Proprietorship', 'Individual', 'Trust', 'Not registered yet']
