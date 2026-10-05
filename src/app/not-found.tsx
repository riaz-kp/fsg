import { ArrowRight } from 'lucide-react'
import { ButtonLink, Eyebrow } from '@/components/ui'

export default function NotFound() {
  return (
    <section className="shell py-24 sm:py-32">
      <Eyebrow>Page not found</Eyebrow>
      <h1 className="mt-4 max-w-xl text-[clamp(2rem,1.4rem+2vw,3rem)] leading-[1.1] font-extrabold tracking-[-0.03em]">This page isn’t on file</h1>
      <p className="mt-4 max-w-lg text-[17px] text-ink-600">The link may be old or mistyped. These are the pages people usually look for:</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/">
          Home
          <ArrowRight className="size-4" aria-hidden />
        </ButtonLink>
        <ButtonLink href="/services" variant="outline">Services</ButtonLink>
        <ButtonLink href="/due-dates" variant="outline">Due dates</ButtonLink>
        <ButtonLink href="/contact" variant="outline">Contact</ButtonLink>
      </div>
    </section>
  )
}
