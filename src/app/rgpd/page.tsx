import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Politique de confidentialité (RGPD) - E-Outilles',
}

// /rgpd is an alias of the privacy policy page.
export default function RGPDStatusPage() {
  redirect('/privacy')
}
