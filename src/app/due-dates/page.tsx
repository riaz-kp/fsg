import type { Metadata } from 'next'
import { Info } from 'lucide-react'
import { CtaBand } from '@/components/CtaBand'
import { DueCalendar } from '@/components/DueCalendar'
import { MonthRuler } from '@/components/MonthRuler'
import { cx, PageHero, TONE } from '@/components/ui'
import { formatDay, todayInIndia, upcoming, yearAtAGlance } from '@/lib/dueDates'

export const metadata: Metadata = {
  title: 'Due dates',
  description: 'GST, TDS, income-tax and audit due dates for the next twelve months: GSTR-1, GSTR-3B, GSTR-9, TDS payments and returns, advance tax, ITR and tax audit.',
  alternates: { canonical: '/due-dates' },
}

/** Counts down from today, so rebuild every hour. */
export const revalidate = 3600

const NOTES = [
  'GSTR-1 and GSTR-3B dates are for monthly filers. Quarterly (QRMP) filers have different dates; ask us which applies to you.',
  'TDS deducted in March is paid by 30 April instead of 7 April.',
  'The government often extends due dates. When it does, the new date shows here, marked “Extended”.',
  'Inside FSG, every return has a cut-off a day before its due date, so there is time to fix anything that comes up.',
]

export default function DueDatesPage() {
  const today = todayInIndia()
  const items = upcoming(today, 366)
  const year = yearAtAGlance()

  return (
    <>
      <PageHero
        eyebrow="Due dates"
        title="What’s due, and when"
        intro={`Statutory due dates for GST, TDS, income tax and audit, counted from today, ${formatDay(today, true)}. Add them to your phone’s calendar with a reminder two days ahead.`}
      />

      <div className="shell grid gap-12 py-14 sm:py-20 lg:grid-cols-[1fr_22rem] lg:gap-14">
        <section aria-label="Next 12 months" className="min-w-0">
          <DueCalendar items={items} />
        </section>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <MonthRuler today={today} />
          <div className="rounded-2xl bg-ink-50 p-5 ring-1 ring-ink-100 sm:p-6">
            <h2 className="flex items-center gap-2 text-[15px] font-bold">
              <Info className="size-4 text-brand-600" aria-hidden />
              Good to know
            </h2>
            <ul className="mt-3 space-y-3 text-[14px] leading-relaxed text-ink-600">
              {NOTES.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <section aria-labelledby="year-title" className="border-t border-ink-100 bg-ink-50/70">
        <div className="shell py-16 sm:py-20">
          <h2 id="year-title" className="text-[clamp(1.6rem,1.3rem+1vw,2.1rem)] font-extrabold tracking-[-0.025em]">
            The year at a glance
          </h2>
          <p className="mt-2 text-ink-600">The yearly and quarterly dates, April to March. The 7th, 11th and 20th come round every month on top of these.</p>
          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {year.map((month) => (
              <li key={month.name} className={cx('rounded-2xl p-4', month.items.length ? 'bg-white shadow-card ring-1 ring-ink-900/8' : 'ring-1 ring-ink-200 ring-inset')}>
                <p className="text-[13px] font-bold tracking-wide text-ink-500 uppercase">{month.name}</p>
                {month.items.length ? (
                  <ul className="mt-2.5 space-y-2">
                    {month.items.map(({ rule, d, label }) => (
                      <li key={`${rule.id}-${d}`} className="flex gap-3 text-[14px] leading-snug">
                        <span className={cx('w-6 shrink-0 text-right font-extrabold tabular-nums', TONE[rule.group].text)}>{d}</span>
                        <span className="text-ink-800">
                          {rule.title}
                          {label && <span className="block text-[12px] text-ink-500">{label}</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2.5 text-[14px] text-ink-400">Monthly dates only</p>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand title="Want us to keep track of these for you?" intro="Clients don’t need to watch the calendar. We do, and we tell you what we need well before each date." />
    </>
  )
}
