import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/plus-jakarta-sans'
import './globals.css'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { FIRM, isPlaceholder, SITE_URL } from '@/lib/firm'
import { BOOKS_AND_PAYROLL, REGISTRATIONS, SERVICE_AREAS } from '@/lib/services'

const description =
  'Fin Savvy Consultors LLP handles GST returns, TDS, income-tax filing, audits and business registrations for companies, LLPs, firms, proprietors and individuals.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${FIRM.name} · GST, TDS, income tax and audit`,
    template: `%s · ${FIRM.name}`,
  },
  description,
  applicationName: FIRM.name,
  openGraph: {
    type: 'website',
    siteName: FIRM.name,
    locale: 'en_IN',
    title: `${FIRM.name} · GST, TDS, income tax and audit`,
    description,
    images: [{ url: '/logo.jpeg', width: 640, height: 640, alt: `${FIRM.name} logo` }],
  },
  twitter: { card: 'summary' },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
}

/** Who the firm is, for search engines. Contact details are left out while they are placeholders. */
function StructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'AccountingService',
    name: FIRM.name,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.jpeg`,
    description,
    areaServed: { '@type': 'Country', name: 'India' },
    ...(isPlaceholder(FIRM.phone) ? {} : { telephone: FIRM.phone }),
    ...(isPlaceholder(FIRM.email) ? {} : { email: FIRM.email }),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services',
      itemListElement: [...SERVICE_AREAS.flatMap((a) => a.includes), ...BOOKS_AND_PAYROLL.items, ...REGISTRATIONS.items].map((name) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name },
      })),
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en-IN">
      <body className="flex min-h-dvh flex-col">
        <StructuredData />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}
