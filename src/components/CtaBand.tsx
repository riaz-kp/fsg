import { MessageCircle, Phone } from 'lucide-react'
import { FIRM, telHref, whatsappHref } from '@/lib/firm'
import { ButtonLink, Eyebrow } from './ui'

export function CtaBand({ title = 'Tell us what you need filed.', intro }: { title?: string; intro?: string }) {
  return (
    <section className="shell py-16 sm:py-24">
      <div className="relative overflow-hidden rounded-3xl bg-brand-900 px-6 py-12 text-white sm:px-12 sm:py-16">
        <div aria-hidden className="bg-grid absolute inset-0 [--grid-line:rgb(255_255_255/0.07)] [mask-image:radial-gradient(ellipse_60%_100%_at_100%_0%,#000_20%,transparent_75%)]" />
        <div aria-hidden className="absolute -top-24 -right-24 size-72 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <Eyebrow light>Talk to {FIRM.short}</Eyebrow>
            <h2 className="mt-3 text-[clamp(1.7rem,1.2rem+1.8vw,2.5rem)] leading-[1.12] font-extrabold tracking-[-0.025em] text-white">{title}</h2>
            <p className="mt-4 text-[17px] leading-relaxed text-brand-100">
              {intro ?? 'Message us on WhatsApp or call. We’ll ask a few questions, tell you what documents to send and confirm the fee before any work starts.'}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={whatsappHref()} variant="whatsapp">
              <MessageCircle className="size-4" aria-hidden />
              WhatsApp us
            </ButtonLink>
            <ButtonLink href={telHref} variant="light">
              <Phone className="size-4" aria-hidden />
              {FIRM.phone}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  )
}
