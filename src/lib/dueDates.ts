/**
 * Statutory due dates, worked out for whatever today is in India.
 *
 * A `monthly` rule falls on the same day every month, for the month before.
 * A `yearly` rule lists its dates in the order of the year's work; `fy` says which financial year each belongs to
 * (0 = the FY that starts in the due date's calendar year, -1 = the one before).
 */

export type Group = 'gst' | 'tds' | 'it' | 'audit'

export const GROUPS: Record<Group, { label: string }> = {
  gst: { label: 'GST' },
  tds: { label: 'TDS' },
  it: { label: 'Income tax' },
  audit: { label: 'Audit' },
}

type YearlyDate = { m: number; d: number; fy: number; label?: string }

export type Rule = {
  id: string
  group: Group
  title: string
  what: string
  monthly?: { day: number; aprilDay?: number }
  yearly?: YearlyDate[]
}

export const RULES: Rule[] = [
  { id: 'tds-pay', group: 'tds', title: 'TDS / TCS payment', what: 'Tax deducted or collected during the month', monthly: { day: 7, aprilDay: 30 } },
  { id: 'gstr1', group: 'gst', title: 'GSTR-1', what: 'Outward supplies, monthly filers', monthly: { day: 11 } },
  { id: 'gstr3b', group: 'gst', title: 'GSTR-3B', what: 'Summary return and GST payment, monthly filers', monthly: { day: 20 } },
  {
    id: 'tds-return',
    group: 'tds',
    title: 'TDS return',
    what: 'Quarterly statement (24Q, 26Q, 27Q)',
    yearly: [
      { m: 7, d: 31, fy: 0, label: 'Q1 (Apr–Jun)' },
      { m: 10, d: 31, fy: 0, label: 'Q2 (Jul–Sep)' },
      { m: 1, d: 31, fy: -1, label: 'Q3 (Oct–Dec)' },
      { m: 5, d: 31, fy: -1, label: 'Q4 (Jan–Mar)' },
    ],
  },
  {
    id: 'advance-tax',
    group: 'it',
    title: 'Advance tax',
    what: 'Part of the year’s tax, paid ahead',
    yearly: [
      { m: 6, d: 15, fy: 0, label: '1st instalment (15%)' },
      { m: 9, d: 15, fy: 0, label: '2nd instalment (45%)' },
      { m: 12, d: 15, fy: 0, label: '3rd instalment (75%)' },
      { m: 3, d: 15, fy: -1, label: 'Last instalment (100%)' },
    ],
  },
  { id: 'itr-individual', group: 'it', title: 'ITR · individuals', what: 'Salary, house property and capital gains (ITR-1, ITR-2)', yearly: [{ m: 7, d: 31, fy: -1 }] },
  { id: 'itr-business', group: 'it', title: 'ITR · business, no audit', what: 'Business or professional income (ITR-3, ITR-4)', yearly: [{ m: 8, d: 31, fy: -1 }] },
  { id: 'tax-audit', group: 'audit', title: 'Tax audit report', what: 'Form 3CA / 3CB with 3CD', yearly: [{ m: 9, d: 30, fy: -1 }] },
  { id: 'itr-audit', group: 'it', title: 'ITR · audit cases', what: 'Returns of businesses whose accounts are audited', yearly: [{ m: 10, d: 31, fy: -1 }] },
  { id: 'gstr9', group: 'gst', title: 'GSTR-9', what: 'GST annual return', yearly: [{ m: 12, d: 31, fy: -1 }] },
]

/**
 * Due dates the government has moved. Each entry moves one occurrence of a rule:
 * `was` is the statutory date, `now` the new one (both YYYY-MM-DD).
 * Remove an entry once its date has passed.
 */
export const DUE_DATE_CHANGES: Array<{ rule: string; was: string; now: string; note: string }> = [
  { rule: 'tax-audit', was: '2026-09-30', now: '2026-10-21', note: 'Extended by CBDT' },
  { rule: 'itr-audit', was: '2026-10-31', now: '2026-11-21', note: 'Extended by CBDT' },
]

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** A calendar day with no time zone attached, as YYYY-MM-DD. */
export type Day = string

const pad = (n: number) => String(n).padStart(2, '0')
const toDay = (y: number, m: number, d: number): Day => {
  // Normalise overflow (e.g. day 0) through Date.UTC so we never touch the server's zone.
  const t = new Date(Date.UTC(y, m - 1, d))
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`
}
export const parts = (day: Day) => {
  const [y, m, d] = day.split('-').map(Number)
  return { y, m, d, weekday: new Date(Date.UTC(y, m - 1, d)).getUTCDay() }
}
const dayNumber = (day: Day) => {
  const { y, m, d } = parts(day)
  return Date.UTC(y, m - 1, d) / 86400000
}
export const daysBetween = (from: Day, to: Day) => dayNumber(to) - dayNumber(from)
const addDays = (day: Day, n: number) => {
  const { y, m, d } = parts(day)
  return toDay(y, m, d + n)
}

/** Today's date in India, whatever zone the server runs in. */
export function todayInIndia(now = new Date()): Day {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
}

const fyLabel = (start: number) => `FY ${start}-${String(start + 1).slice(-2)}`

export type Due = {
  key: string
  ruleId: string
  group: Group
  title: string
  what: string
  date: Day
  /** The statutory date, when the government has moved it. */
  was?: Day
  note?: string
  period: string
  daysLeft: number
}

/** Every deadline from `from` for the next `days` days, with moved dates applied. */
export function upcoming(from: Day, days: number, groups?: Group[]): Due[] {
  const to = addDays(from, days)
  const startYear = parts(from).y - 1 // a year early, so a date moved forward into range is still found
  const endYear = parts(to).y
  const out: Due[] = []

  const push = (rule: Rule, date: Day, period: string) => {
    const change = DUE_DATE_CHANGES.find((c) => c.rule === rule.id && c.was === date)
    const actual = change ? change.now : date
    out.push({
      key: `${rule.id}-${date}`,
      ruleId: rule.id,
      group: rule.group,
      title: rule.title,
      what: rule.what,
      date: actual,
      was: change ? date : undefined,
      note: change?.note,
      period,
      daysLeft: daysBetween(from, actual),
    })
  }

  for (let y = startYear; y <= endYear; y++) {
    for (let m = 1; m <= 12; m++) {
      for (const rule of RULES) {
        if (rule.monthly) {
          const day = m === 4 && rule.monthly.aprilDay ? rule.monthly.aprilDay : rule.monthly.day
          const period = m === 1 ? `${MONTHS[11]} ${y - 1}` : `${MONTHS[m - 2]} ${y}`
          push(rule, toDay(y, m, day), `for ${period}`)
        }
        for (const due of rule.yearly ?? []) {
          if (due.m === m) push(rule, toDay(y, m, due.d), [due.label, fyLabel(y + due.fy)].filter(Boolean).join(' · '))
        }
      }
    }
  }

  return out
    .filter((o) => o.daysLeft >= 0 && o.date <= to && (!groups || groups.includes(o.group)))
    .sort((a, b) => a.daysLeft - b.daysLeft || RULES.findIndex((r) => r.id === a.ruleId) - RULES.findIndex((r) => r.id === b.ruleId))
}

/** 1st, 2nd, 3rd, 4th … 21st, 31st. */
export function ordinal(n: number) {
  const tail = n % 100 >= 11 && n % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th'
  return `${n}${tail}`
}

/** "Today", "Tomorrow", "in 6 days", and how urgent that is. */
export function countdown(daysLeft: number) {
  const text = daysLeft === 0 ? 'Today' : daysLeft === 1 ? 'Tomorrow' : `in ${daysLeft} days`
  const tone: 'soon' | 'near' | 'later' = daysLeft <= 3 ? 'soon' : daysLeft <= 10 ? 'near' : 'later'
  return { text, tone }
}

export function formatDay(day: Day, withWeekday = false) {
  const { m, d, weekday } = parts(day)
  return `${withWeekday ? `${WEEKDAYS[weekday]}, ` : ''}${d} ${MONTHS[m - 1]}`
}

/** The yearly dates, month by month in financial-year order (April first), for the year-at-a-glance grid. */
export function yearAtAGlance() {
  const months = MONTHS_LONG.map((name, i) => ({
    name,
    items: RULES.flatMap((rule) => (rule.yearly ?? []).filter((d) => d.m === i + 1).map((d) => ({ rule, d: d.d, label: d.label }))).sort((a, b) => a.d - b.d),
  }))
  return [...months.slice(3), ...months.slice(0, 3)]
}

/** The dates that come round every month, for the month ruler. */
export const MONTHLY = RULES.filter((r) => r.monthly).map((r) => ({ id: r.id, group: r.group, title: r.title, day: r.monthly!.day }))
