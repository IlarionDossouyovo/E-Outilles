import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Conditions Générales de Vente - E-Outilles',
}

// /cgu is an alias of the terms page.
export default function CGUPage() {
  redirect('/terms')
}
