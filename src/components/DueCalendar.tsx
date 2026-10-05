'use client'

import { useMemo, useState } from 'react'
import { CalendarPlus } from 'lucide-react'
import { GROUPS, MONTHS_LONG, parts, type Due, type Group } from '@/lib/dueDates'
import { FIRM } from '@/lib/firm'
import { DueRow } from './DueRow'
import { buttonClass, cx, TONE } from './ui'

const FILTERS: Array<{ id: Group | 'all'; label: string }> = [{ id: 'all', label: 'All' }, ...(Object.keys(GROUPS) as Group[]).map((g) => ({ id: g, label: GROUPS[g].label }))]

/** The next twelve months of due dates, filterable, with a calendar download. */
export function DueCalendar({ items }: { items: Due[] }) {
  const [filter, setFilter] = useState<Group | 'all'>('all')
  const shown = useMemo(() => (filter === 'all' ? items : items.filter((i) => i.group === filter)), [items, filter])

  const months = useMemo(() => {
    const map = new Map<string, { label: string; items: Due[] }>()
    for (const due of shown) {
      const { y, m } = parts(due.date)
      const key = `${y}-${m}`
      if (!map.has(key)) map.set(key, { label: `${MONTHS_LONG[m - 1]} ${y}`, items: [] })
      map.get(key)!.items.push(due)
    }
    return [...map.values()]
  }, [shown])

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Show" className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const on = filter === f.id
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(f.id)}
                className={cx(
                  'inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-[14px] font-semibold ring-1 transition-colors ring-inset',
                  on ? 'bg-ink-900 text-white ring-ink-900' : 'bg-white text-ink-700 ring-ink-200 hover:ring-ink-300',
                )}
              >
                {f.id !== 'all' && <span className={cx('size-2 rounded-full', TONE[f.id].dot)} aria-hidden />}
                {f.label}
              </button>
            )
          })}
        </div>
        <button type="button" onClick={() => downloadIcs(shown)} className={buttonClass('outline', 'min-h-10 text-[14px]')}>
          <CalendarPlus className="size-4" aria-hidden />
          Add to your calendar
        </button>
      </div>

      <p className="mt-4 text-[14px] text-ink-500" aria-live="polite">
        {shown.length} due dates in the next 12 months
      </p>

      <div className="mt-6 space-y-8">
        {months.map((month) => (
          <section key={month.label} aria-label={month.label}>
            <h3 className="sticky top-[68px] z-10 -mx-1 flex items-baseline justify-between bg-white/95 px-1 py-2 text-[15px] font-bold backdrop-blur">
              {month.label}
              <span className="text-[13px] font-medium text-ink-500">{month.items.length} due</span>
            </h3>
            <ul className="divide-y divide-ink-100 border-t border-ink-100">
              {month.items.map((due) => (
                <DueRow key={due.key} due={due} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}

/** An .ics file with each date as an all-day event and a reminder two days before. */
function downloadIcs(items: Due[]) {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z')
  const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/[,;]/g, (c) => '\\' + c).replace(/\n/g, '\\n')
  const compact = (day: string) => day.replace(/-/g, '')
  const nextDay = (day: string) => {
    const { y, m, d } = parts(day)
    return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10).replace(/-/g, '')
  }
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', `PRODID:-//${FIRM.name}//Due dates//EN`, 'CALSCALE:GREGORIAN', `X-WR-CALNAME:${esc(`Tax due dates (${FIRM.short})`)}`]
  for (const due of items) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${due.ruleId}-${compact(due.date)}@fsg-due-dates`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${compact(due.date)}`,
      `DTEND;VALUE=DATE:${nextDay(due.date)}`,
      `SUMMARY:${esc(`${due.title} due (${due.period})`)}`,
      `DESCRIPTION:${esc(`${due.what}.${due.note ? ` ${due.note}.` : ''} From ${FIRM.name}. Check with us before relying on it.`)}`,
      'BEGIN:VALARM',
      'TRIGGER:-P2D',
      'ACTION:DISPLAY',
      `DESCRIPTION:${esc(`${due.title} is due in 2 days`)}`,
      'END:VALARM',
      'END:VEVENT',
    )
  }
  lines.push('END:VCALENDAR')
  const url = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: 'tax-due-dates.ics' })
  document.body.append(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
