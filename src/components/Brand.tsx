import Image from 'next/image'
import Link from 'next/link'
import { FIRM } from '@/lib/firm'
import { cx } from './ui'

/** The FSG mark with the firm's name beside it. On dark backgrounds the mark sits on a white tile. */
export function Brand({ dark, onClick }: { dark?: boolean; onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="flex shrink-0 items-center gap-3 rounded-lg" aria-label={`${FIRM.name}, home`}>
      <span className={cx('flex items-center', dark && 'rounded-lg bg-white px-2 py-1.5')}>
        <Image src="/logo-mark.jpeg" alt="" width={545} height={240} loading="eager" className="h-8 w-auto sm:h-9" />
      </span>
      <span className={cx('border-l pl-3 leading-[1.15]', dark ? 'border-white/15' : 'border-ink-200')}>
        <span className={cx('block text-[15px] font-bold tracking-[-0.01em]', dark ? 'text-white' : 'text-ink-900')}>Fin Savvy</span>
        <span className={cx('block text-[12px] font-medium', dark ? 'text-ink-300' : 'text-ink-500')}>Consultors LLP</span>
      </span>
    </Link>
  )
}
