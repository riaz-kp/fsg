'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, MessageCircle, Phone, X } from 'lucide-react'
import { telHref, whatsappHref } from '@/lib/firm'
import { Brand } from './Brand'
import { ButtonLink, cx } from './ui'

export const NAV = [
  { href: '/services', label: 'Services' },
  { href: '/due-dates', label: 'Due dates' },
  { href: '/documents', label: 'Documents' },
  { href: '/#about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const wide = window.matchMedia('(min-width: 64rem)')
    const onWide = () => wide.matches && setOpen(false)
    document.addEventListener('keydown', onKey)
    wide.addEventListener('change', onWide)
    return () => {
      document.removeEventListener('keydown', onKey)
      wide.removeEventListener('change', onWide)
    }
  }, [open])

  const isActive = (href: string) => !href.includes('#') && pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:shadow-lg"
      >
        Skip to content
      </a>
      <div className="shell flex h-[68px] items-center justify-between gap-4">
        <Brand onClick={close} />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={cx(
                'relative rounded-lg px-3 py-2 text-[15px] font-medium transition-colors',
                isActive(item.href) ? 'text-brand-700' : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900',
              )}
            >
              {item.label}
              {isActive(item.href) && <span aria-hidden className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-brand-500" />}
            </Link>
          ))}
          <ButtonLink href={whatsappHref()} variant="whatsapp" className="ml-3 min-h-10 px-4 py-2 text-[14px]">
            <MessageCircle className="size-4" aria-hidden />
            WhatsApp us
          </ButtonLink>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="-mr-2 grid size-11 place-items-center rounded-xl text-ink-800 hover:bg-ink-50 lg:hidden"
        >
          {open ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
        </button>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-68px)] overflow-y-auto border-b border-ink-200 bg-white shadow-[0_24px_40px_-24px_rgb(27_29_33/0.3)] lg:hidden"
      >
        <nav aria-label="Main" className="shell flex flex-col py-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={cx(
                'flex min-h-12 items-center border-b border-ink-100 text-[17px] font-semibold last:border-0',
                isActive(item.href) ? 'text-brand-700' : 'text-ink-800',
              )}
            >
              {item.label}
            </Link>
          ))}
          <div className="grid grid-cols-2 gap-3 pt-4 pb-2">
            <ButtonLink href={whatsappHref()} variant="whatsapp" onClick={close}>
              <MessageCircle className="size-4" aria-hidden />
              WhatsApp
            </ButtonLink>
            <ButtonLink href={telHref} variant="outline" onClick={close}>
              <Phone className="size-4" aria-hidden />
              Call
            </ButtonLink>
          </div>
        </nav>
      </div>
    </header>
  )
}
