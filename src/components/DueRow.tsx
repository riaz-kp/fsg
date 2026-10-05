import { countdown, formatDay, GROUPS, MONTHS, parts, WEEKDAYS, type Due } from '@/lib/dueDates'
import { cx, TONE } from './ui'

const COUNTDOWN_TONE = {
  soon: 'bg-red-50 text-red-700 ring-red-600/15',
  near: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  later: 'bg-ink-50 text-ink-600 ring-ink-900/8',
}

/** One deadline: a date block, what's due, and how long is left. */
export function DueRow({ due, compact }: { due: Due; compact?: boolean }) {
  const { m, d, weekday } = parts(due.date)
  const t = TONE[due.group]
  const c = countdown(due.daysLeft)
  return (
    <li className="flex items-start gap-3.5 py-3.5 sm:gap-4">
      <div className={cx('flex w-[52px] shrink-0 flex-col items-center rounded-xl py-1.5 ring-1 ring-inset', t.soft, t.ring)}>
        <span className={cx('text-[20px] leading-tight font-extrabold tabular-nums', t.text)}>{d}</span>
        <span className={cx('text-[11px] font-semibold tracking-wide uppercase', t.text)}>{MONTHS[m - 1]}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 leading-snug">
          <span className="font-bold text-ink-900">{due.title}</span>
          <span className={cx('text-[12px] font-semibold', t.text)}>{GROUPS[due.group].label}</span>
        </p>
        <p className="mt-0.5 text-[14px] text-ink-500">
          {due.period}
          {!compact && <> · {WEEKDAYS[weekday]}</>}
        </p>
        {!compact && <p className="mt-1 text-[14px] text-ink-600">{due.what}</p>}
        {due.was && (
          <p className="mt-1.5 inline-flex rounded-md bg-brand-50 px-2 py-0.5 text-[12px] font-semibold text-brand-700">
            {due.note} · was {formatDay(due.was)}
          </p>
        )}
      </div>
      <span className={cx('mt-0.5 shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold whitespace-nowrap ring-1 ring-inset', COUNTDOWN_TONE[c.tone])}>
        {c.text}
      </span>
    </li>
  )
}
