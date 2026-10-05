import { ClipboardCheck, FileText, Landmark, ReceiptIndianRupee, type LucideIcon } from 'lucide-react'

/** The icon for each service area, shared by the home and services pages. */
export const AREA_ICONS: Record<string, LucideIcon> = {
  gst: ReceiptIndianRupee,
  tds: Landmark,
  'income-tax': FileText,
  audit: ClipboardCheck,
}
