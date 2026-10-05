import Link from 'next/link'
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { FIRM, mailHref, telHref, whatsappHref } from '@/lib/firm'
import { Brand } from './Brand'

const SERVICE_LINKS = [
  { href: '/services#gst', label: 'GST' },
  { href: '/services#tds', label: 'TDS' },
  { href: '/services#income-tax', label: 'Income tax' },
  { href: '/services#audit', label: 'Audit' },
  { href: '/services#registrations', label: 'Registrations' },
]

const HELP_LINKS = [
  { href: '/due-dates', label: 'Due dates' },
  { href: '/documents', label: 'Documents checklist' },
  { href: '/contact', label: 'Send an enquiry' },
]

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[13px] font-semibold tracking-wide text-white">{title}</h2>
      <ul className="mt-4 space-y-2.5 text-[15px]">{children}</ul>
    </div>
  )
}

const linkCls = 'text-ink-300 transition-colors hover:text-white'

export function SiteFooter() {
  return (
    <footer className="bg-ink-900 text-ink-300">
      <div className="shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div className="max-w-xs">
          <Brand dark />
          <p className="mt-5 text-[15px] leading-relaxed">{FIRM.tagline}</p>
        </div>
        <Column title="Services">
          {SERVICE_LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={linkCls}>
                {l.label}
              </Link>
            </li>
          ))}
        </Column>
        <Column title="Help">
          {HELP_LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={linkCls}>
                {l.label}
              </Link>
            </li>
          ))}
        </Column>
        <Column title="Get in touch">
          <li>
            <a href={telHref} className={`${linkCls} inline-flex items-center gap-2.5`}>
              <Phone className="size-4 text-ink-400" aria-hidden />
              {FIRM.phone}
            </a>
          </li>
          <li>
            <a href={whatsappHref()} target="_blank" rel="noopener" className={`${linkCls} inline-flex items-center gap-2.5`}>
              <MessageCircle className="size-4 text-ink-400" aria-hidden />
              WhatsApp
            </a>
          </li>
          <li>
            <a href={mailHref} className={`${linkCls} inline-flex items-center gap-2.5 break-all`}>
              <Mail className="size-4 shrink-0 text-ink-400" aria-hidden />
              {FIRM.email}
            </a>
          </li>
          <li className="flex gap-2.5">
            <MapPin className="mt-1 size-4 shrink-0 text-ink-400" aria-hidden />
            <address className="not-italic">
              {FIRM.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </li>
        </Column>
      </div>
      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-3 py-6 text-[13px] text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {FIRM.name}
          </p>
          <p className="max-w-xl sm:text-right">
            Due dates and checklists here are general guidance. Check with us before relying on them.
            {FIRM.crmUrl && (
              <>
                {' · '}
                <a href={FIRM.crmUrl} className="text-ink-300 underline-offset-2 hover:text-white hover:underline">
                  Staff login
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  )
}
