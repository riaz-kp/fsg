import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Building,
  Check,
  ClipboardCheck,
  FileSpreadsheet,
  FileText,
  Info,
  Landmark,
  MessageCircle,
  ReceiptIndianRupee,
  Upload,
  UserCheck,
  type LucideIcon,
} from 'lucide-react'
import { AREA_ICONS } from '@/components/areaIcons'
import { CtaBand } from '@/components/CtaBand'
import { DueRow } from '@/components/DueRow'
import { MonthRuler } from '@/components/MonthRuler'
import { ButtonLink, cx, Eyebrow, SectionHeading, Tag, TONE, type Tone } from '@/components/ui'
import { DOC_SERVICES } from '@/lib/documents'
import { formatDay, MONTHS, RULES, todayInIndia, upcoming } from '@/lib/dueDates'
import { FIRM, whatsappHref } from '@/lib/firm'
import { BOOKS_AND_PAYROLL, CLIENT_TYPES, REGISTRATIONS, SERVICE_AREAS } from '@/lib/services'

/** The due-date card counts down from today, so rebuild the page every hour. */
export const revalidate = 3600

const STEPS: Array<{ icon: LucideIcon; title: string; text: string }> = [
  { icon: Upload, title: 'Send what you have', text: 'Bills, a Tally backup or an Excel sheet. There’s no new format for you to learn.' },
  { icon: FileSpreadsheet, title: 'We prepare and reconcile', text: 'The person on your account converts the data, checks it against the portal and asks for anything missing.' },
  { icon: UserCheck, title: 'A head signs it off', text: 'Every return and report is approved by the head of that department before it is filed.' },
  { icon: MessageCircle, title: 'Filed, and you’re told', text: 'We file ahead of the due date and send you the status on WhatsApp.' },
]

const DEPARTMENTS: Array<{ tone: Tone; icon: LucideIcon; label: string; note: string }> = [
  { tone: 'gst', icon: ReceiptIndianRupee, label: 'GST', note: 'Returns, e-way bills, registration' },
  { tone: 'tds', icon: Landmark, label: 'TDS', note: 'Payments, returns, TRACES' },
  { tone: 'it', icon: FileText, label: 'Income tax', note: 'Audit and non-audit returns' },
  { tone: 'audit', icon: ClipboardCheck, label: 'Audit', note: 'Tax audit and internal audit' },
  { tone: 'neutral', icon: Building, label: 'Registrations', note: 'LLP, company, MSME and more' },
  { tone: 'neutral', icon: BookOpen, label: 'Bookkeeping', note: 'Tally, PF and ESI' },
]

/** Yearly dates worth knowing by heart, for the home page. */
const YEARLY_HIGHLIGHTS = ['itr-individual', 'itr-business', 'tax-audit', 'itr-audit', 'gstr9'].map((id) => {
  const rule = RULES.find((r) => r.id === id)!
  const { m, d } = rule.yearly![0]
  return { id, title: rule.title, tone: rule.group, date: `${d} ${MONTHS[m - 1]}` }
})

export default function Home() {
  const today = todayInIndia()
  const next = upcoming(today, 120).slice(0, 5)

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_80%_70%_at_75%_10%,#000_15%,transparent_70%)]" />
        <div aria-hidden className="absolute top-[-10rem] right-[-8rem] size-[32rem] rounded-full bg-brand-100/70 blur-3xl" />
        <div className="shell relative grid gap-14 py-14 sm:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-16 lg:py-24">
          <div className="animate-rise">
            <Eyebrow>Tax and compliance practice</Eyebrow>
            <h1 className="mt-5 text-[clamp(2.3rem,1.5rem+3.4vw,3.9rem)] leading-[1.04] font-extrabold tracking-[-0.035em]">
              GST, TDS and income tax, <span className="text-brand-600">filed before they’re due</span>
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink-600 sm:text-lg">
              {FIRM.name} looks after the returns, audits and registrations a business has to keep up with, for companies, LLPs, partnership firms, proprietors, individuals and trusts.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={whatsappHref()} variant="whatsapp">
                <MessageCircle className="size-4" aria-hidden />
                WhatsApp us
              </ButtonLink>
              <ButtonLink href="/services" variant="outline">
                See our services
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
            </div>
          </div>

          <div className="relative animate-rise [animation-delay:120ms]">
            <div aria-hidden className="absolute inset-x-8 top-8 -bottom-4 rotate-[2.5deg] rounded-3xl bg-brand-200/50" />
            <section aria-labelledby="next-due" className="relative rounded-3xl bg-white p-5 shadow-lift ring-1 ring-ink-900/5 sm:p-7">
              <header className="flex items-start justify-between gap-3 border-b border-ink-100 pb-4">
                <div>
                  <p className="text-[13px] font-semibold text-ink-500">Coming up</p>
                  <h2 id="next-due" className="text-[19px] font-extrabold tracking-[-0.015em]">
                    Next due dates
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-wa/10 px-2.5 py-1 text-[12px] font-semibold whitespace-nowrap text-wa">
                  <span className="size-1.5 animate-pulse rounded-full bg-wa" aria-hidden />
                  As of {formatDay(today)}
                </span>
              </header>
              <ul className="divide-y divide-ink-100">
                {next.map((due) => (
                  <DueRow key={due.key} due={due} compact />
                ))}
              </ul>
              <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-ink-100 pt-4">
                <p className="text-[13px] text-ink-500">We work to a cut-off a day before each.</p>
                <Link href="/due-dates" className="inline-flex items-center gap-1 text-[14px] font-semibold text-brand-700 hover:text-brand-800">
                  All due dates
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </footer>
            </section>
          </div>
        </div>
      </section>

      {/* Who we work with */}
      <section aria-label="Who we work with" className="border-y border-ink-100 bg-ink-50/70">
        <div className="shell flex flex-col gap-3 py-6 md:flex-row md:items-center md:gap-10">
          <p className="shrink-0 text-[13px] font-semibold text-ink-500">We work with</p>
          <ul className="flex flex-wrap gap-x-7 gap-y-2 text-[15px] font-semibold text-ink-800">
            {CLIENT_TYPES.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span aria-hidden className="h-1 w-2.5 -skew-x-[24deg] bg-brand-400" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Services */}
      <section aria-labelledby="services-title" className="shell py-20 sm:py-28">
        <SectionHeading
          id="services-title"
          eyebrow="Services"
          title="What we look after"
          intro="The returns that come round every month, quarter and year, and the one-time registrations you need when you start or grow."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {SERVICE_AREAS.map((area) => {
            const Icon = AREA_ICONS[area.slug]
            const t = TONE[area.tone]
            return (
              <article key={area.slug} className="group relative flex flex-col rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-900/8 transition duration-200 hover:-translate-y-0.5 hover:shadow-lift sm:p-7">
                <div className="flex items-start justify-between gap-3">
                  <span className={cx('grid size-12 place-items-center rounded-xl', t.soft, t.text)}>
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <Tag tone={area.tone}>{area.cadence}</Tag>
                </div>
                <h3 className="mt-5 text-[22px] font-extrabold tracking-[-0.02em]">{area.title}</h3>
                <p className="mt-2 text-ink-600">{area.summary}</p>
                <ul className="mt-5 space-y-2 text-[15px]">
                  {area.includes.map((line) => (
                    <li key={line} className="flex gap-2.5">
                      <Check className={cx('mt-[3px] size-4 shrink-0', t.text)} strokeWidth={2.5} aria-hidden />
                      {line}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/services#${area.slug}`}
                  className="mt-6 inline-flex items-center gap-1.5 self-start pt-1 text-[15px] font-semibold text-brand-700 after:absolute after:inset-0 after:rounded-2xl"
                >
                  More on {area.title}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </article>
            )
          })}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.65fr_1fr]">
          <article className="rounded-2xl bg-brand-50 p-6 ring-1 ring-brand-100 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-xl bg-white text-brand-600 ring-1 ring-brand-100">
                <Building className="size-6" aria-hidden />
              </span>
              <div>
                <h3 className="text-[19px] font-extrabold tracking-[-0.015em]">{REGISTRATIONS.title}</h3>
                <p className="text-[15px] text-ink-600">{REGISTRATIONS.summary}</p>
              </div>
            </div>
            <ul className="mt-6 flex flex-wrap gap-2">
              {REGISTRATIONS.items.map((r) => (
                <li key={r} className="rounded-lg bg-white px-3 py-1.5 text-[14px] font-medium text-ink-800 ring-1 ring-brand-100">
                  {r}
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-900/8 sm:p-7">
            <span className="grid size-12 place-items-center rounded-xl bg-ink-100 text-ink-700">
              <BookOpen className="size-6" aria-hidden />
            </span>
            <h3 className="mt-5 text-[19px] font-extrabold tracking-[-0.015em]">{BOOKS_AND_PAYROLL.title}</h3>
            <p className="mt-1 text-[15px] text-ink-600">{BOOKS_AND_PAYROLL.summary}</p>
            <ul className="mt-5 space-y-2 text-[15px]">
              {BOOKS_AND_PAYROLL.items.map((line) => (
                <li key={line} className="flex gap-2.5">
                  <Check className="mt-[3px] size-4 shrink-0 text-ink-500" strokeWidth={2.5} aria-hidden />
                  {line}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      {/* How we work */}
      <section aria-labelledby="how-title" className="border-y border-ink-100 bg-ink-50">
        <div className="shell py-20 sm:py-28">
          <SectionHeading id="how-title" eyebrow="How we work" title="From your bills to a filed return" intro="The same four steps for every client, every month." />
          <ol className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative">
                {i < STEPS.length - 1 && <span aria-hidden className="absolute top-6 -right-6 left-16 hidden border-t-2 border-dashed border-ink-200 lg:block" />}
                <div className="flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-xl bg-white text-brand-600 shadow-card ring-1 ring-ink-900/8">
                    <step.icon className="size-6" aria-hidden />
                  </span>
                  <span className="text-[13px] font-bold text-ink-400 tabular-nums">0{i + 1}</span>
                </div>
                <h3 className="mt-5 text-[18px] font-bold tracking-[-0.01em]">{step.title}</h3>
                <p className="mt-2 text-ink-600">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Due dates */}
      <section aria-labelledby="dates-title" className="shell grid gap-12 py-20 sm:py-28 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
        <div>
          <SectionHeading
            id="dates-title"
            eyebrow="Due dates"
            title="Three dates every month. A handful every year."
            intro="GST and TDS come round monthly; income tax, audit and the GST annual return once a year. Our team works to its own cut-off a day before each one."
          />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/due-dates">
              See the full calendar
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </div>
        </div>
        <div className="min-w-0 space-y-5">
          <MonthRuler today={today} />
          <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-ink-900/5 sm:p-6">
            <p className="font-bold text-ink-900">Every year</p>
            <ul className="mt-3 grid gap-x-8 sm:grid-cols-2">
              {YEARLY_HIGHLIGHTS.map((y) => (
                <li key={y.id} className="flex items-center gap-3 border-b border-ink-100 py-2.5 text-[15px] last:border-0 sm:[&:nth-last-child(2)]:border-0">
                  <span className={cx('w-14 shrink-0 font-bold tabular-nums', TONE[y.tone].text)}>{y.date}</span>
                  <span className="text-ink-700">{y.title}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 border-t border-ink-100 pt-3 text-[13px] text-ink-500">Plus TDS returns every quarter and advance tax in June, September, December and March.</p>
          </div>
        </div>
      </section>

      {/* Documents */}
      <section aria-labelledby="docs-title" className="bg-gradient-to-b from-brand-50/40 to-brand-50/80">
        <div className="shell py-20 sm:py-28">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              id="docs-title"
              eyebrow="Documents checklist"
              title="Starting a registration? Know what to bring."
              intro="Pick a service and your type of business, tick off what you already have, and send the list to whoever is collecting the papers."
            />
            <ButtonLink href="/documents" variant="outline" className="self-start lg:self-auto">
              Open the checklist
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DOC_SERVICES.slice(0, 4).map((s) => {
              const count = s.variants[0].groups.reduce((n, g) => n + g.items.length, 0)
              return (
                <li key={s.id}>
                  <Link
                    href={`/documents#${s.id}`}
                    className="group flex h-full flex-col rounded-2xl bg-white p-5 shadow-card ring-1 ring-ink-900/8 transition hover:-translate-y-0.5 hover:shadow-lift"
                  >
                    <span className="text-[13px] font-semibold text-brand-600">{s.variants.length > 1 ? `${s.variants.length} business types` : `${count} documents`}</span>
                    <span className="mt-1 text-[17px] font-bold text-ink-900">{s.title}</span>
                    <span className="mt-2 flex-1 text-[14px] text-ink-600">{s.blurb}</span>
                    <span className="mt-4 inline-flex items-center gap-1 text-[14px] font-semibold text-brand-700">
                      See the list
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
          <p className="mt-6 flex items-start gap-2 text-[14px] text-ink-600">
            <Info className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
            Every mobile number you give for a registration or filing must be linked to Aadhaar.
          </p>
        </div>
      </section>

      {/* About */}
      <section id="about" aria-labelledby="about-title" className="shell grid gap-12 py-20 sm:py-28 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <SectionHeading id="about-title" eyebrow={`About ${FIRM.short}`} title={`A team of ${FIRM.teamSize}, organised by department.`} />
          <div className="mt-5 space-y-4 text-[17px] leading-relaxed text-ink-600">
            <p>
              {FIRM.name} is a tax and accounting practice. Each department has its own people and a head who answers for its work, so the person filing your GST knows GST.
            </p>
            <p>
              Your work is assigned to someone by name and tracked against its due dates. Nothing is filed until the head of the department has approved it, and you hear the status from us without having to ask.
            </p>
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {DEPARTMENTS.map((d) => {
            const t = TONE[d.tone]
            return (
              <li key={d.label} className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-ink-900/8 sm:p-5">
                <span className={cx('grid size-10 place-items-center rounded-lg', t.soft, t.text)}>
                  <d.icon className="size-5" aria-hidden />
                </span>
                <p className="mt-4 font-bold text-ink-900">{d.label}</p>
                <p className="mt-0.5 text-[13px] leading-snug text-ink-500">{d.note}</p>
              </li>
            )
          })}
        </ul>
      </section>

      <CtaBand />
    </>
  )
}
