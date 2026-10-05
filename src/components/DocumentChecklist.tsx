'use client'

import { useState, useSyncExternalStore } from 'react'
import { Check, Copy, MessageCircle, Printer, RotateCcw, Send } from 'lucide-react'
import { checklistText, DOC_SERVICES, itemKey, type DocService, type DocVariant } from '@/lib/documents'
import { FIRM, shareOnWhatsappHref, whatsappHref } from '@/lib/firm'
import { buttonClass, cx } from './ui'

/* ---------- Ticks, remembered in this browser ---------- */

const TICKS_KEY = 'fsg-document-ticks'
type Ticks = Record<string, true>
const NO_TICKS: Ticks = {}
let ticksCache: Ticks | null = null
const tickListeners = new Set<() => void>()

function readTicks(): Ticks {
  if (!ticksCache) {
    try {
      ticksCache = JSON.parse(localStorage.getItem(TICKS_KEY) ?? '{}') as Ticks
    } catch {
      ticksCache = {}
    }
  }
  return ticksCache
}
function writeTicks(next: Ticks) {
  ticksCache = next
  try {
    localStorage.setItem(TICKS_KEY, JSON.stringify(next))
  } catch {
    /* storage blocked: ticks last until the page closes */
  }
  tickListeners.forEach((l) => l())
}
function subscribeTicks(l: () => void) {
  tickListeners.add(l)
  return () => tickListeners.delete(l)
}

/* ---------- Which list is open, kept in the URL hash so it can be linked to ---------- */

function subscribeHash(l: () => void) {
  window.addEventListener('hashchange', l)
  return () => window.removeEventListener('hashchange', l)
}
const readHash = () => window.location.hash.slice(1)

function pick(hash: string): { service: DocService; variant: DocVariant } {
  const [sid, vid] = hash.split('/')
  const service = DOC_SERVICES.find((s) => s.id === sid) ?? DOC_SERVICES[0]
  const variant = service.variants.find((v) => v.id === vid) ?? service.variants[0]
  return { service, variant }
}

function open(service: DocService, variant?: DocVariant) {
  const hash = variant && service.variants.length > 1 ? `${service.id}/${variant.id}` : service.id
  history.replaceState(null, '', `#${hash}`)
  window.dispatchEvent(new HashChangeEvent('hashchange'))
}

/* ---------- The checklist ---------- */

export function DocumentChecklist() {
  const hash = useSyncExternalStore(subscribeHash, readHash, () => '')
  const ticks = useSyncExternalStore(subscribeTicks, readTicks, () => NO_TICKS)
  const { service, variant } = pick(hash)

  const keys = variant.groups.flatMap((g) => g.items.map((it) => itemKey(service.id, variant.id, g.title, it.label)))
  const done = keys.filter((k) => ticks[k]).length
  const text = checklistText(service, variant, FIRM.name)

  const toggle = (key: string) => {
    const next = { ...ticks }
    if (next[key]) delete next[key]
    else next[key] = true
    writeTicks(next)
  }
  const clear = () => {
    const next = { ...ticks }
    keys.forEach((k) => delete next[k])
    writeTicks(next)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[17rem_1fr] lg:gap-10">
      {/* Service picker */}
      <nav aria-label="Choose a service" className="no-print">
        <label htmlFor="doc-service" className="mb-2 block text-[13px] font-semibold text-ink-500 lg:mb-3">
          I need help with
        </label>
        {/* A native picker on phones and tablets; a list on wide screens */}
        <select
          id="doc-service"
          value={service.id}
          onChange={(e) => open(DOC_SERVICES.find((s) => s.id === e.target.value)!)}
          className="block w-full appearance-none rounded-xl border-0 bg-white bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22none%22%20stroke%3D%22%236b727c%22%20stroke-width%3D%222%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')] bg-[position:right_0.9rem_center] bg-no-repeat py-3 pr-10 pl-3.5 text-[16px] font-semibold text-ink-900 shadow-card ring-1 ring-ink-200 ring-inset focus:ring-2 focus:ring-brand-500 focus:outline-none lg:hidden"
        >
          {DOC_SERVICES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
        <ul className="hidden flex-col gap-1 lg:flex">
          {DOC_SERVICES.map((s) => {
            const on = s.id === service.id
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => open(s)}
                  aria-current={on ? 'true' : undefined}
                  className={cx(
                    'w-full rounded-xl px-3.5 py-2.5 text-left text-[15px] font-semibold transition-colors',
                    on ? 'bg-brand-600 text-white' : 'text-ink-700 hover:bg-ink-50 hover:text-ink-900',
                  )}
                >
                  {s.title}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* The list */}
      <section aria-labelledby="checklist-title" className="min-w-0 rounded-2xl bg-white shadow-card ring-1 ring-ink-900/5">
        <header className="border-b border-ink-100 p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 id="checklist-title" className="text-[22px] font-extrabold tracking-[-0.02em]">
                {service.title}
                {service.variants.length > 1 && <span className="hidden text-ink-400 sm:inline"> · {variant.label}</span>}
              </h2>
              <p className="mt-1 text-ink-600">{service.blurb}</p>
            </div>
            <p className="text-[14px] font-semibold text-ink-600 tabular-nums" aria-live="polite">
              {done} of {keys.length} ready
            </p>
          </div>

          {service.variants.length > 1 && (
            <div role="group" aria-label="Type of business" className="no-print mt-5 grid grid-cols-2 gap-1 rounded-xl bg-ink-100 p-1 sm:inline-grid sm:grid-flow-col sm:grid-cols-none">
              {service.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={v.id === variant.id}
                  onClick={() => open(service, v)}
                  className={cx(
                    'rounded-lg px-3.5 py-1.5 text-[14px] font-semibold transition-colors',
                    v.id === variant.id ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-600 hover:text-ink-900',
                  )}
                >
                  {v.label}
                </button>
              ))}
            </div>
          )}

          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-ink-100" aria-hidden>
            <div className="h-full rounded-full bg-wa transition-[width] duration-300" style={{ width: `${(done / keys.length) * 100}%` }} />
          </div>
        </header>

        <div className="grid gap-x-10 gap-y-7 p-5 sm:p-7 md:grid-cols-2">
          {variant.groups.map((group) => (
            <fieldset key={group.title} className="min-w-0">
              <legend className="mb-2 text-[13px] font-bold tracking-wide text-brand-700 uppercase">{group.title}</legend>
              <ul className="space-y-1">
                {group.items.map((it) => {
                  const key = itemKey(service.id, variant.id, group.title, it.label)
                  const on = !!ticks[key]
                  return (
                    <li key={key}>
                      <label className="group flex cursor-pointer gap-3 rounded-lg px-2 py-2 -mx-2 hover:bg-ink-50">
                        <input type="checkbox" checked={on} onChange={() => toggle(key)} className="peer sr-only" />
                        <span
                          aria-hidden
                          className={cx(
                            'mt-0.5 grid size-5 shrink-0 place-items-center rounded-md ring-1 transition-colors ring-inset peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-500',
                            on ? 'bg-wa text-white ring-wa' : 'bg-white ring-ink-300 group-hover:ring-ink-400',
                          )}
                        >
                          {on && <Check className="size-3.5" strokeWidth={3} />}
                        </span>
                        <span className="min-w-0">
                          <span className={cx('font-medium', on ? 'text-ink-400 line-through decoration-ink-300' : 'text-ink-900')}>{it.label}</span>
                          {it.note && <span className="block text-[13px] text-ink-500">{it.note}</span>}
                          {it.parts && <span className="mt-0.5 block text-[13px] leading-relaxed text-ink-500">{it.parts.join(' · ')}</span>}
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </fieldset>
          ))}
        </div>

        <footer className="no-print flex flex-wrap gap-2 border-t border-ink-100 p-5 sm:px-7">
          <a href={whatsappHref(`Hello, I'd like to start ${service.title.toLowerCase()}${service.variants.length > 1 ? ` for a ${variant.label.toLowerCase()}` : ''}. I have the documents ready.`)} target="_blank" rel="noopener" className={buttonClass('whatsapp', 'text-[14px]')}>
            <Send className="size-4" aria-hidden />
            Send to FSG
          </a>
          <a href={shareOnWhatsappHref(text)} target="_blank" rel="noopener" className={buttonClass('outline', 'text-[14px]')}>
            <MessageCircle className="size-4" aria-hidden />
            Share list
          </a>
          <CopyButton text={text} />
          <button type="button" onClick={() => window.print()} className={buttonClass('outline', 'text-[14px]')}>
            <Printer className="size-4" aria-hidden />
            Print
          </button>
          {done > 0 && (
            <button type="button" onClick={clear} className={buttonClass('ghost', 'text-[14px] sm:ml-auto')}>
              <RotateCcw className="size-4" aria-hidden />
              Clear ticks
            </button>
          )}
        </footer>
      </section>
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [label, setLabel] = useState('Copy')
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setLabel('Copied')
    } catch {
      setLabel('Copy failed')
    }
    setTimeout(() => setLabel('Copy'), 1600)
  }
  return (
    <button type="button" onClick={copy} className={buttonClass('outline', 'text-[14px]')}>
      <Copy className="size-4" aria-hidden />
      <span aria-live="polite">{label}</span>
    </button>
  )
}
