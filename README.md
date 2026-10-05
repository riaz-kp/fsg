# FSG website

Public website for Fin Savvy Consultors LLP. Next.js 16 (App Router), React 19, TypeScript and Tailwind v4, with the same blue, charcoal and font as the CRM in `../crm`.

| Page | What it does |
| --- | --- |
| `/` | Services, how the work moves, the next due dates (live), documents and about |
| `/services` | Each service area: what's included, what the client sends, its due dates |
| `/due-dates` | Next 12 months of GST, TDS, income-tax and audit dates, filterable, downloadable as a calendar file |
| `/documents` | Checklist per registration, with ticks remembered on the device and sharing to WhatsApp |
| `/contact` | Enquiry form that opens WhatsApp (or email) with the enquiry typed in |

## Run it

```bash
npm install
npm run dev
```

On this Mac, prefix `npm install` with `NODE_EXTRA_CA_CERTS=/etc/ssl/cert.pem` or it stalls on a certificate error.

## Before going live

1. **Contact details** are placeholders in `src/lib/firm.ts`: phone, WhatsApp number, email, address and hours. Every page reads them from there. The WhatsApp number is where enquiries land.
2. **Site address**: set `NEXT_PUBLIC_SITE_URL` (for example `https://finsavvy.in`) in the host's environment. It's used for the sitemap, canonical links and social previews.
3. **Staff login**: set `crmUrl` in `src/lib/firm.ts` to show a link to the CRM in the footer.

## Keeping it current

- **Extended due dates**: when CBDT or the GST Council moves a date, add it to `DUE_DATE_CHANGES` in `src/lib/dueDates.ts` with the old and new date. It shows as "Extended" everywhere. Remove entries once they've passed.
- **Due-date rules** themselves are in `RULES` in the same file.
- **Services** text is in `src/lib/services.ts`; **document checklists** in `src/lib/documents.ts`.

## Hosting

The home and due-dates pages are rebuilt every hour so the countdowns stay right, so host it somewhere that runs Next.js (Vercel, or `npm run build && npm start` on a Node server). A static export (`output: 'export'`) would freeze the dates at build time.

There's no backend: enquiries go out through WhatsApp or email. When the CRM gets one, the enquiry form can post leads to it instead.
