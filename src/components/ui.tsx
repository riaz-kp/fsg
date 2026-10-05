import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import type { Group } from '@/lib/dueDates'

export type Tone = Group | 'neutral'

/** Full class names per colour family, so Tailwind sees every one of them. */
export const TONE: Record<Tone, { text: string; soft: string; dot: string; ring: string }> = {
  gst: { text: 'text-gst', soft: 'bg-gst-soft', dot: 'bg-gst', ring: 'ring-gst/15' },
  tds: { text: 'text-tds', soft: 'bg-tds-soft', dot: 'bg-tds', ring: 'ring-tds/15' },
  it: { text: 'text-it', soft: 'bg-it-soft', dot: 'bg-it', ring: 'ring-it/15' },
  audit: { text: 'text-audit', soft: 'bg-audit-soft', dot: 'bg-audit', ring: 'ring-audit/15' },
  neutral: { text: 'text-ink-700', soft: 'bg-ink-100', dot: 'bg-ink-400', ring: 'ring-ink-900/10' },
}

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

/** Small label above a heading, with the slanted bar of the logo's italic letters. */
export function Eyebrow({ children, className, light }: { children: ReactNode; className?: string; light?: boolean }) {
  return (
    <p className={cx('flex items-center gap-2.5 text-[13px] font-semibold tracking-wide', light ? 'text-brand-200' : 'text-brand-600', className)}>
      <span aria-hidden className={cx('h-1 w-4 -skew-x-[24deg] rounded-[1px]', light ? 'bg-brand-300' : 'bg-brand-500')} />
      {children}
    </p>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  center,
  id,
}: {
  eyebrow?: string
  title: ReactNode
  intro?: ReactNode
  center?: boolean
  id?: string
}) {
  return (
    <div className={cx('max-w-2xl', center && 'mx-auto text-center [&>p:first-child]:justify-center')}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 id={id} className="mt-3 text-[clamp(1.65rem,1.2rem+1.6vw,2.4rem)] leading-[1.15] font-extrabold tracking-[-0.025em]">
        {title}
      </h2>
      {intro && <p className="mt-4 text-[17px] leading-relaxed text-ink-600">{intro}</p>}
    </div>
  )
}

const BUTTON = {
  base: 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4.5 py-2.5 text-[15px] font-semibold whitespace-nowrap transition-[background-color,box-shadow,color,transform] duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-60',
  primary: 'bg-brand-600 text-white shadow-sm shadow-brand-900/20 hover:bg-brand-700',
  whatsapp: 'bg-wa text-white shadow-sm shadow-wa/25 hover:bg-wa-dark',
  outline: 'bg-white text-ink-800 ring-1 ring-ink-200 ring-inset hover:bg-ink-50 hover:ring-ink-300',
  ghost: 'text-brand-700 hover:bg-brand-50',
  light: 'bg-white/10 text-white ring-1 ring-white/25 ring-inset hover:bg-white/15',
}

export type ButtonVariant = Exclude<keyof typeof BUTTON, 'base'>

export function buttonClass(variant: ButtonVariant = 'primary', className?: string) {
  return cx(BUTTON.base, BUTTON[variant], className)
}

/** A link styled as a button. Internal paths go through next/link; everything else opens normally. */
export function ButtonLink({
  href,
  variant = 'primary',
  className,
  children,
  ...rest
}: { href: string; variant?: ButtonVariant } & Omit<ComponentProps<'a'>, 'href'>) {
  const cls = buttonClass(variant, className)
  if (href.startsWith('/')) {
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    )
  }
  const external = /^https?:/.test(href)
  return (
    <a href={href} className={cls} {...(external ? { target: '_blank', rel: 'noopener' } : {})} {...rest}>
      {children}
    </a>
  )
}

export function Tag({ tone = 'neutral', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  const t = TONE[tone]
  return <span className={cx('inline-flex items-center rounded-md px-2 py-0.5 text-[12px] font-semibold', t.soft, t.text, className)}>{children}</span>
}

/** Heading block for the inner pages. */
export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: ReactNode; intro: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-ink-100 bg-gradient-to-b from-brand-50/70 to-white">
      <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_90%_at_85%_0%,#000_10%,transparent_70%)]" />
      <div className="shell relative py-14 sm:py-20">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-4 max-w-3xl text-[clamp(2rem,1.3rem+2.6vw,3.25rem)] leading-[1.08] font-extrabold tracking-[-0.03em]">{title}</h1>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-600 sm:text-lg">{intro}</p>
        {children}
      </div>
    </section>
  )
}
