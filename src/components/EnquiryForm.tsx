'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Check, Mail, MessageCircle } from 'lucide-react'
import { FIRM, mailHref, whatsappHref } from '@/lib/firm'
import { BUSINESS_TYPES, ENQUIRY_OPTIONS } from '@/lib/services'
import { buttonClass, cx } from './ui'

type Errors = Partial<Record<'name' | 'phone', string>>

const inputCls =
  'block w-full rounded-xl border-0 bg-white px-3.5 py-3 text-[16px] text-ink-900 ring-1 ring-ink-200 ring-inset placeholder:text-ink-400 focus:ring-2 focus:ring-brand-500 focus:outline-none aria-[invalid=true]:ring-red-500'

/**
 * There is no backend yet, so an enquiry is handed to WhatsApp (or email) with every
 * detail typed in, and the visitor presses send. The fields match a lead in the CRM.
 */
export function EnquiryForm() {
  const params = useSearchParams()
  const [services, setServices] = useState<string[]>(() => params.getAll('service').filter((s) => ENQUIRY_OPTIONS.some((o) => o.id === s)))
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState<'whatsapp' | 'email' | null>(null)

  const toggle = (id: string) => setServices((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  function compose(form: HTMLFormElement) {
    const data = new FormData(form)
    const get = (k: string) => String(data.get(k) ?? '').trim()
    const found: Errors = {}
    if (!get('name')) found.name = 'Please tell us your name.'
    if (get('phone').replace(/\D/g, '').length < 10) found.phone = 'Please enter a 10-digit mobile number.'
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      ;(form.elements.namedItem(first) as HTMLInputElement | null)?.focus()
      return null
    }
    const picked = ENQUIRY_OPTIONS.filter((o) => services.includes(o.id)).map((o) => o.label)
    return [
      'New enquiry from the website\n',
      `Name: ${get('name')}`,
      `Phone: ${get('phone')}`,
      get('email') && `Email: ${get('email')}`,
      get('type') && `Business type: ${get('type')}`,
      get('place') && `Place: ${get('place')}`,
      picked.length > 0 && `Interested in: ${picked.join(', ')}`,
      get('message') && `\n${get('message')}`,
    ]
      .filter(Boolean)
      .join('\n')
  }

  function send(form: HTMLFormElement, via: 'whatsapp' | 'email') {
    const text = compose(form)
    if (!text) return
    if (via === 'whatsapp') window.open(whatsappHref(text), '_blank', 'noopener')
    else window.open(`${mailHref}?subject=${encodeURIComponent('Enquiry from the website')}&body=${encodeURIComponent(text)}`, '_self')
    setSent(via)
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        send(e.currentTarget, 'whatsapp')
      }}
      className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-ink-900/5 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" error={errors.name} required>
          {(props) => <input {...props} name="name" autoComplete="name" className={inputCls} />}
        </Field>
        <Field label="Mobile / WhatsApp" error={errors.phone} required>
          {(props) => <input {...props} name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="98xxx xxxxx" className={inputCls} />}
        </Field>
        <Field label="Email" hint="Optional">
          {(props) => <input {...props} name="email" type="email" autoComplete="email" className={inputCls} />}
        </Field>
        <Field label="Place" hint="Optional">
          {(props) => <input {...props} name="place" autoComplete="address-level2" className={inputCls} />}
        </Field>
        <Field label="Type of business" className="sm:col-span-2">
          {(props) => (
            <select {...props} name="type" defaultValue="" className={cx(inputCls, 'appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22none%22%20stroke%3D%22%236b727c%22%20stroke-width%3D%222%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E")] bg-[position:right_0.9rem_center] bg-no-repeat pr-10')}>
              <option value="">Choose one</option>
              {BUSINESS_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          )}
        </Field>
      </div>

      <fieldset className="mt-6">
        <legend className="text-[14px] font-semibold text-ink-800">
          What do you need help with? <span className="font-normal text-ink-500">Pick any</span>
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {ENQUIRY_OPTIONS.map((o) => {
            const on = services.includes(o.id)
            return (
              <label
                key={o.id}
                className={cx(
                  'inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-[14px] font-medium ring-1 transition-colors select-none ring-inset has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-500',
                  on ? 'bg-brand-50 text-brand-800 ring-brand-300' : 'bg-white text-ink-700 ring-ink-200 hover:ring-ink-300',
                )}
              >
                <input type="checkbox" className="sr-only" checked={on} onChange={() => toggle(o.id)} />
                {on && <Check className="size-3.5" strokeWidth={3} aria-hidden />}
                {o.label}
              </label>
            )
          })}
        </div>
      </fieldset>

      <Field label="Anything else we should know?" hint="Optional" className="mt-6">
        {(props) => <textarea {...props} name="message" rows={4} className={cx(inputCls, 'resize-y')} />}
      </Field>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" className={buttonClass('whatsapp')}>
          <MessageCircle className="size-4" aria-hidden />
          Send on WhatsApp
        </button>
        <button type="button" onClick={(e) => send(e.currentTarget.form!, 'email')} className={buttonClass('outline')}>
          <Mail className="size-4" aria-hidden />
          Send by email instead
        </button>
      </div>

      <p className="mt-4 text-[14px] text-ink-500" aria-live="polite">
        {sent === 'whatsapp'
          ? 'WhatsApp has opened with your enquiry typed in. Press send there and we’ll get back to you.'
          : sent === 'email'
            ? 'Your email app has opened with the enquiry. Press send there and we’ll get back to you.'
            : `Your enquiry opens in WhatsApp, addressed to ${FIRM.short}, ready to send.`}
      </p>
    </form>
  )
}

function Field({
  label,
  hint,
  error,
  required,
  className,
  children,
}: {
  label: string
  hint?: string
  error?: string
  required?: boolean
  className?: string
  children: (props: { id: string; 'aria-invalid'?: boolean; 'aria-describedby'?: string; required?: boolean }) => React.ReactNode
}) {
  const id = `f-${label.toLowerCase().replace(/[^a-z]+/g, '-')}`
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-[14px] font-semibold text-ink-800">
        {label}
        {hint && <span className="text-[13px] font-normal text-ink-500">{hint}</span>}
      </label>
      {children({ id, required, 'aria-invalid': error ? true : undefined, 'aria-describedby': error ? `${id}-error` : undefined })}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[13px] font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
