import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Clock, ExternalLink, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { EnquiryForm } from '@/components/EnquiryForm'
import { PageHero } from '@/components/ui'
import { FIRM, mailHref, telHref, whatsappHref } from '@/lib/firm'

export const metadata: Metadata = {
  title: 'Contact',
  description: `Call, WhatsApp or send an enquiry to ${FIRM.name} about GST, TDS, income tax, audit or a registration.`,
  alternates: { canonical: '/contact' },
}

const NEXT_STEPS = [
  'Someone from the team calls or messages you to understand the work.',
  'We send you the list of documents and logins we need.',
  'We confirm the fee and the date we’ll have it done by, then start.',
]

export default function ContactPage() {
  const rows = [
    { icon: Phone, label: 'Call', value: FIRM.phone, href: telHref },
    { icon: MessageCircle, label: 'WhatsApp', value: FIRM.whatsapp, href: whatsappHref() },
    { icon: Mail, label: 'Email', value: FIRM.email, href: mailHref },
  ]

  return (
    <>
      <PageHero eyebrow="Contact" title="Tell us what you need" intro="Fill in a few details and your enquiry opens in WhatsApp, ready to send. Or call us, if that’s easier." />

      <div className="shell grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.45fr_1fr] lg:gap-12">
        <Suspense fallback={<div className="h-[640px] rounded-2xl bg-ink-50" />}>
          <EnquiryForm />
        </Suspense>

        <aside className="space-y-5">
          <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-900/8">
            <h2 className="text-[17px] font-bold">{FIRM.name}</h2>
            <ul className="mt-4 divide-y divide-ink-100">
              {rows.map((r) => (
                <li key={r.label}>
                  <a
                    href={r.href}
                    {...(r.href.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {})}
                    className="group flex items-center gap-3.5 py-3.5"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600 group-hover:bg-brand-100">
                      <r.icon className="size-5" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] text-ink-500">{r.label}</span>
                      <span className="block font-semibold break-all text-ink-900 group-hover:text-brand-700">{r.value}</span>
                    </span>
                  </a>
                </li>
              ))}
              <li className="flex gap-3.5 py-3.5">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                  <MapPin className="size-5" aria-hidden />
                </span>
                <span>
                  <span className="block text-[13px] text-ink-500">Office</span>
                  <address className="font-semibold text-ink-900 not-italic">
                    {FIRM.address.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                  {FIRM.mapUrl && (
                    <a href={FIRM.mapUrl} target="_blank" rel="noopener" className="mt-1 inline-flex items-center gap-1 text-[14px] font-semibold text-brand-700">
                      Get directions
                      <ExternalLink className="size-3.5" aria-hidden />
                    </a>
                  )}
                </span>
              </li>
              {FIRM.hours && (
              <li className="flex gap-3.5 py-3.5">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                  <Clock className="size-5" aria-hidden />
                </span>
                <span>
                  <span className="block text-[13px] text-ink-500">Open</span>
                  <span className="font-semibold text-ink-900">{FIRM.hours}</span>
                </span>
              </li>
              )}
            </ul>
          </div>

          <div className="rounded-2xl bg-ink-50 p-6 ring-1 ring-ink-100">
            <h2 className="text-[15px] font-bold">What happens next</h2>
            <ol className="mt-4 space-y-3.5">
              {NEXT_STEPS.map((s, i) => (
                <li key={s} className="flex gap-3 text-[15px] text-ink-700">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white text-[12px] font-bold text-brand-700 ring-1 ring-brand-200">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </>
  )
}
