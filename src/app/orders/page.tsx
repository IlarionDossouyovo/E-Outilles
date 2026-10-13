import { redirect } from 'next/navigation'

// Orders are listed on the account page; keep /orders as a friendly alias.
export default function OrdersIndexPage() {
  redirect('/profile')
}
