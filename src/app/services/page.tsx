import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, Building, CalendarDays, Check, Inbox } from 'lucide-react'
import { AREA_ICONS } from '@/components/areaIcons'
import { CtaBand } from '@/components/CtaBand'
import { ButtonLink, cx, PageHero, Tag, TONE } from '@/components/ui'
import { MONTHS, ordinal, RULES } from '@/lib/dueDates'
import { BOOKS_AND_PAYROLL, REGISTRATIONS, SERVICE_AREAS } from '@/lib/services'

export const metadata: Metadata = {
  title: 'Services',
  description: 'GST returns and registration, TDS, income-tax returns, tax and internal audit, bookkeeping, PF and ESI, and business registrations from LLP and company incorporation to MSME, FSSAI and trademark.',
  alternates: { canonical: '/services' },
}

/** "11th every month", "31 Jul, 31 Oct, 31 Jan, 31 May" — the dates behind a rule, in words. */
function whenDue(ruleId: string) {
  const rule = RULES.find((r) => r.id === ruleId)!
  if (rule.monthly) return `${ordinal(rule.monthly.day)} of every month`
  return rule.yearly!.map((d) => `${d.d} ${MONTHS[d.m - 1]}`).join(', ')
}

const JUMP = [...SERVICE_AREAS.map((a) => ({ id: a.slug, label: a.title })), { id: 'books', label: 'Books & payroll' }, { id: 'registrations', label: 'Registrations' }]

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Everything a business has to file, in one place"
        intro="Recurring compliance every month, quarter and year, and the one-time registrations that come with starting, hiring or growing."
      >
        <nav aria-label="On this page" className="mt-8 flex flex-wrap gap-2">
          {JUMP.map((j) => (
            <a key={j.id} href={`#${j.id}`} className="rounded-full bg-white px-3.5 py-1.5 text-[14px] font-semibold text-ink-700 ring-1 ring-ink-200 hover:text-ink-900 hover:ring-ink-300">
              {j.label}
            </a>
          ))}
        </nav>
      </PageHero>

      <div className="shell divide-y divide-ink-100">
        {SERVICE_AREAS.map((area) => {
          const Icon = AREA_ICONS[area.slug]
          const t = TONE[area.tone]
          return (
            <section key={area.slug} id={area.slug} aria-labelledby={`${area.slug}-title`} className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
              <div>
                <div className="flex items-center gap-3">
                  <span className={cx('grid size-12 place-items-center rounded-xl', t.soft, t.text)}>
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <Tag tone={area.tone}>{area.cadence}</Tag>
                </div>
                <h2 id={`${area.slug}-title`} className="mt-5 text-[clamp(1.75rem,1.4rem+1.2vw,2.3rem)] font-extrabold tracking-[-0.025em]">
                  {area.title}
                </h2>
                <p className="mt-3 text-[18px] leading-relaxed text-ink-800">{area.summary}</p>
                <p className="mt-4 leading-relaxed text-ink-600">{area.detail}</p>
                <ButtonLink href={`/contact?service=${area.enquiry}`} variant="outline" className="mt-7">
                  Ask about {area.title}
                  <ArrowRight className="size-4" aria-hidden />
                </ButtonLink>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-900/8">
                  <h3 className="text-[15px] font-bold">What’s included</h3>
                  <ul className="mt-4 space-y-2.5 text-[15px]">
                    {area.includes.map((line) => (
                      <li key={line} className="flex gap-2.5">
                        <Check className={cx('mt-[3px] size-4 shrink-0', t.text)} strokeWidth={2.5} aria-hidden />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl bg-ink-50 p-6 ring-1 ring-ink-100">
                  <h3 className="flex items-center gap-2 text-[15px] font-bold">
                    <Inbox className="size-4 text-ink-500" aria-hidden />
                    What we need from you
                  </h3>
                  <ul className="mt-4 space-y-2.5 text-[15px] text-ink-700">
                    {area.needs.map((line) => (
                      <li key={line} className="flex gap-2.5">
                        <span aria-hidden className="mt-[9px] size-1.5 shrink-0 rounded-full bg-ink-400" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-900/8 sm:col-span-2 lg:col-span-1 xl:col-span-2">
                  <h3 className="flex items-center gap-2 text-[15px] font-bold">
                    <CalendarDays className="size-4 text-ink-500" aria-hidden />
                    Due dates
                  </h3>
                  <dl className="mt-3 divide-y divide-ink-100 text-[15px]">
                    {area.rules.map((id) => {
                      const rule = RULES.find((r) => r.id === id)!
                      return (
                        <div key={id} className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                          <dt className="font-semibold text-ink-900">{rule.title}</dt>
                          <dd className={cx('font-semibold tabular-nums sm:text-right', t.text)}>{whenDue(id)}</dd>
                        </div>
                      )
                    })}
                  </dl>
                  <Link href="/due-dates" className="mt-3 inline-flex items-center gap-1 text-[14px] font-semibold text-brand-700 hover:text-brand-800">
                    See what’s due next
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </div>
            </section>
          )
        })}

        <section id="books" aria-labelledby="books-title" className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <span className="grid size-12 place-items-center rounded-xl bg-ink-100 text-ink-700">
              <BookOpen className="size-6" aria-hidden />
            </span>
            <h2 id="books-title" className="mt-5 text-[clamp(1.75rem,1.4rem+1.2vw,2.3rem)] font-extrabold tracking-[-0.025em]">
              {BOOKS_AND_PAYROLL.title}
            </h2>
            <p className="mt-3 text-[18px] leading-relaxed text-ink-800">{BOOKS_AND_PAYROLL.summary}</p>
            <p className="mt-4 leading-relaxed text-ink-600">
              Books kept in Tally through the year make the GST returns, TDS statements and the year-end audit faster and cleaner. We also handle PF and ESI for businesses with staff.
            </p>
            <ButtonLink href="/contact?service=bookkeeping" variant="outline" className="mt-7">
              Ask about bookkeeping
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </div>
          <ul className="grid content-start gap-3">
            {BOOKS_AND_PAYROLL.items.map((line) => (
              <li key={line} className="flex items-center gap-3 rounded-2xl bg-white p-5 font-semibold text-ink-900 shadow-card ring-1 ring-ink-900/8">
                <Check className="size-4 shrink-0 text-ink-500" strokeWidth={2.5} aria-hidden />
                {line}
              </li>
            ))}
          </ul>
        </section>

        <section id="registrations" aria-labelledby="reg-title" className="py-16 sm:py-20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="grid size-12 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <Building className="size-6" aria-hidden />
              </span>
              <h2 id="reg-title" className="mt-5 text-[clamp(1.75rem,1.4rem+1.2vw,2.3rem)] font-extrabold tracking-[-0.025em]">
                {REGISTRATIONS.title}
              </h2>
              <p className="mt-3 text-[18px] leading-relaxed text-ink-800">{REGISTRATIONS.summary}</p>
              <p className="mt-4 leading-relaxed text-ink-600">We tell you exactly what to send before we start, and work to the date we commit to with you.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/documents" variant="primary">
                Documents checklist
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
              <ButtonLink href="/contact?service=incorporation" variant="outline">
                Ask about a registration
              </ButtonLink>
            </div>
          </div>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {REGISTRATIONS.items.map((r) => (
              <li key={r} className="flex items-center gap-3 rounded-xl bg-brand-50/60 px-4 py-3.5 font-semibold text-ink-900 ring-1 ring-brand-100">
                <span aria-hidden className="h-1 w-3 shrink-0 -skew-x-[24deg] bg-brand-400" />
                {r}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <CtaBand title="Not sure what applies to you?" intro="Tell us what kind of business you run. We’ll tell you which returns you have to file, when, and what it costs for us to handle them." />
    </>
  )
}
