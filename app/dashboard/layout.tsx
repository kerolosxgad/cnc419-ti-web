import Button from '@/components/ui/Button'
import { clearTokenCookie } from '@/lib/auth'
import { apiFetch } from '@/lib/api'
import { redirect } from 'next/navigation'

async function logoutAction() {
  'use server'
  try {
    await apiFetch<any>('/auth/logout', { method: 'POST' })
  } catch {}
  await clearTokenCookie()
  redirect('/login')
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <nav className="flex gap-3 text-sm">
          <a className="underline" href="/dashboard">Overview</a>
          <a className="underline" href="/dashboard/threat-intel">Threat Intel</a>
          <a className="underline" href="/dashboard/admin">Admin</a>
          <a className="underline" href="/dashboard/profile">Profile</a>
        </nav>
        <form action={logoutAction}><Button type="submit" variant="secondary">Logout</Button></form>
      </div>
      {children}
    </div>
  )
}
