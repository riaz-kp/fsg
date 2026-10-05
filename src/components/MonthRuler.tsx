import { MONTHLY, MONTHS, ordinal, parts, type Day } from '@/lib/dueDates'
import { cx, TONE } from './ui'

/** A month drawn as a ruler: the three monthly due dates, and where today falls. */
export function MonthRuler({ today }: { today: Day }) {
  const { y, m, d } = parts(today)
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate()
  const at = (day: number) => `${((day - 1) / (last - 1)) * 100}%`

  return (
    <figure className="@container rounded-2xl bg-white p-5 shadow-card ring-1 ring-ink-900/5 sm:p-6">
      <figcaption className="flex items-baseline justify-between gap-3">
        <span className="font-bold text-ink-900">Every month</span>
        <span className="text-[13px] text-ink-500">
          1–{last} {MONTHS[m - 1]}
        </span>
      </figcaption>

      <div className="relative mx-3 mt-12 mb-11" role="img" aria-label={`Monthly due dates: ${MONTHLY.map((x) => `${x.title} on the ${ordinal(x.day)}`).join(', ')}. Today is the ${ordinal(d)}.`}>
        {/* the passed part of the month */}
        <div className="h-2 rounded-full bg-ink-100" />
        <div className="absolute inset-y-0 left-0 h-2 rounded-full bg-brand-200" style={{ width: at(d) }} />

        {MONTHLY.map((x) => {
          const t = TONE[x.group]
          const past = x.day < d
          return (
            <div key={x.id} className="absolute top-1 -translate-x-1/2" style={{ left: at(x.day) }}>
              <span className={cx('absolute bottom-6 left-1/2 -translate-x-1/2 rounded-md px-1.5 py-0.5 text-[12px] font-bold whitespace-nowrap tabular-nums', t.soft, t.text, past && 'opacity-60')}>
                {x.day}
              </span>
              <span className={cx('block size-3.5 -translate-y-1/2 rounded-full ring-[3px] ring-white', t.dot, past && 'opacity-60')} />
            </div>
          )
        })}

        <div className="absolute top-1 -translate-x-1/2" style={{ left: at(d) }}>
          <span className="block h-5 w-0.5 -translate-y-1/2 rounded-full bg-ink-900" />
          <span className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-ink-900 px-2 py-0.5 text-[11px] font-bold whitespace-nowrap text-white">Today</span>
        </div>
      </div>

      <ul className="grid gap-2 border-t border-ink-100 pt-4 text-[14px] @lg:grid-cols-3">
        {MONTHLY.map((x) => (
          <li key={x.id} className="flex items-center gap-2">
            <span className={cx('size-2.5 rounded-full', TONE[x.group].dot)} aria-hidden />
            <span>
              <b className="font-bold text-ink-900">{ordinal(x.day)}</b> <span className="text-ink-600">{x.title}</span>
            </span>
          </li>
        ))}
      </ul>
    </figure>
  )
}
