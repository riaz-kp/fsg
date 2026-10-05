/**
 * Everything about the firm that the pages show, in one place.
 */
export const FIRM = {
  name: 'Fin Savvy Consultors LLP',
  short: 'FSG',
  tagline: 'GST, TDS, income tax, audit and business registrations.',
  teamSize: 13,

  /** Office number for "Call" links. Include the country code. */
  phone: '+91 9048002106',
  /** Number that receives website enquiries on WhatsApp. Include the country code. */
  whatsapp: '+91 9048002106',
  email: 'finsavvyconsultorsllp@gmail.com',
  /** One line per entry. */
  address: ['SS Complex, 1st Floor', 'Areekode, Ugrapuram', 'Malappuram, Kerala - 673639', 'Opposite of Aster Mother Hospital'],
  /** Office hours. Empty hides the row on the contact page. */
  hours: '',
  /** Google Maps link to the office. Empty hides "Get directions". */
  mapUrl: '',
  /** The practice manager (CRM). Empty hides "Staff login" in the footer. */
  crmUrl: '',
}

/** The address the site is served from, for canonical links, the sitemap and social cards. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

const digits = (s: string) => s.replace(/\D/g, '')

export const telHref = `tel:${FIRM.phone.replace(/[^\d+]/g, '')}`
export const mailHref = `mailto:${FIRM.email}`

/** A wa.me link to the firm, with a message typed in when given. */
export function whatsappHref(text = 'Hello, I would like to know more about your services.') {
  return `https://wa.me/${digits(FIRM.whatsapp)}?text=${encodeURIComponent(text)}`
}

/** A wa.me link that lets the visitor pick who to send the text to. */
export function shareOnWhatsappHref(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

/** True while a phone number or email is still the placeholder, so search engines aren't told it. */
export function isPlaceholder(value: string) {
  if (value.includes('@')) return value.endsWith('@example.com')
  return !/[1-9]/.test(digits(value).replace(/^91/, ''))
}
