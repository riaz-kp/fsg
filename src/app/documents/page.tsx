import type { Metadata } from 'next'
import { Info } from 'lucide-react'
import { CtaBand } from '@/components/CtaBand'
import { DocumentChecklist } from '@/components/DocumentChecklist'
import { PageHero } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Documents checklist',
  description:
    'Documents needed for GST registration (proprietorship, partnership, LLP, company), LLP and company incorporation, TDS on property purchase, MSME / Udyam, TAN and income-tax portal registration.',
  alternates: { canonical: '/documents' },
}

const yes = <span className="font-bold text-wa">✓</span>

/** Who has to give PAN, Aadhaar and so on, for every service at once. */
const QUICK_REFERENCE: Array<{ service: string; pan: React.ReactNode; aadhaar: React.ReactNode; other: string }> = [
  { service: 'GST · Proprietorship', pan: 'Proprietor', aadhaar: 'Proprietor', other: 'Photo, rent agreement, property tax receipt, business and address details' },
  { service: 'GST · Partnership', pan: 'Firm and partners', aadhaar: 'Partners', other: 'Partnership deed, photos, business and address details' },
  { service: 'GST · LLP', pan: 'LLP and partners', aadhaar: 'Partners', other: 'Certificate of incorporation, business and address details' },
  { service: 'GST · Company', pan: 'Company and directors', aadhaar: 'Directors', other: 'Certificate of incorporation, business and address details' },
  { service: 'LLP incorporation', pan: yes, aadhaar: yes, other: 'Bank statement, contribution pattern, office NOC and electricity bill' },
  { service: 'Company incorporation', pan: yes, aadhaar: yes, other: 'Bank statement, shareholding pattern, office NOC and electricity bill' },
  { service: 'TDS on property', pan: 'Buyer and seller', aadhaar: 'Buyer and seller', other: 'Sale deed or agreement, share of ownership, buyer’s IT password if any' },
  { service: 'Income-tax registration', pan: yes, aadhaar: yes, other: '—' },
  { service: 'MSME / Udyam', pan: yes, aadhaar: yes, other: '—' },
  { service: 'TAN application', pan: yes, aadhaar: yes, other: '—' },
]

export default function DocumentsPage() {
  return (
    <>
      <PageHero
        eyebrow="Documents checklist"
        title="Know what to bring before you start"
        intro="Pick what you need done and your type of business. Tick off what you already have; your ticks stay on this device. Then send the list to whoever is collecting the papers."
      >
        <p className="mt-7 flex max-w-2xl items-start gap-3 rounded-xl bg-white px-4 py-3 text-[15px] text-ink-700 ring-1 ring-brand-200">
          <Info className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden />
          <span>
            <b className="font-semibold text-ink-900">All mobile numbers must be linked to Aadhaar.</b> That goes for every registration and filing, wherever a mobile number is asked for.
          </span>
        </p>
      </PageHero>

      <div className="shell py-12 sm:py-16">
        <DocumentChecklist />
      </div>

      <section aria-labelledby="ref-title" className="border-t border-ink-100 bg-ink-50/70">
        <div className="shell py-16 sm:py-20">
          <h2 id="ref-title" className="text-[clamp(1.6rem,1.3rem+1vw,2.1rem)] font-extrabold tracking-[-0.025em]">
            Quick reference
          </h2>
          <p className="mt-2 text-ink-600">Whose PAN and Aadhaar we need, service by service. A mobile number and email ID are needed for all of them.</p>

          <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-ink-900/8">
            <table className="w-full text-left text-[14px]">
              <thead className="hidden bg-ink-50 text-[13px] text-ink-600 md:table-header-group">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">Service</th>
                  <th scope="col" className="px-5 py-3 font-semibold">PAN</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Aadhaar</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Also needed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {QUICK_REFERENCE.map((row) => (
                  <tr key={row.service} className="grid grid-cols-2 gap-x-4 gap-y-1 px-5 py-4 md:table-row md:p-0">
                    <th scope="row" className="col-span-2 pb-1 font-bold text-ink-900 md:px-5 md:py-3.5">
                      {row.service}
                    </th>
                    <td className="md:px-5 md:py-3.5">
                      <span className="block text-[12px] text-ink-500 md:hidden">PAN</span>
                      {row.pan}
                    </td>
                    <td className="md:px-5 md:py-3.5">
                      <span className="block text-[12px] text-ink-500 md:hidden">Aadhaar</span>
                      {row.aadhaar}
                    </td>
                    <td className="col-span-2 pt-1 text-ink-600 md:px-5 md:py-3.5">
                      <span className="block text-[12px] text-ink-500 md:hidden">Also needed</span>
                      {row.other}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <p className="rounded-2xl bg-white p-5 text-[14px] leading-relaxed text-ink-600 ring-1 ring-ink-900/8">
              <b className="block text-[15px] text-ink-900">GST registration varies</b>
              The exact papers depend on how the business is set up and whether the premises are owned, rented or shared. We confirm the list with you before we file.
            </p>
            <p className="rounded-2xl bg-white p-5 text-[14px] leading-relaxed text-ink-600 ring-1 ring-ink-900/8">
              <b className="block text-[15px] text-ink-900">LLPs don’t have shares</b>
              For an LLP we need how much each partner contributes and how profit is shared between them, rather than a shareholding pattern.
            </p>
          </div>
        </div>
      </section>

      <CtaBand title="Have your documents ready?" intro="Send them to us on WhatsApp and we’ll take it from there, or ask us if you’re unsure about anything on the list." />
    </>
  )
}
