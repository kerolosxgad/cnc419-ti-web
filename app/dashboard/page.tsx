import { apiFetch } from '@/lib/api'
import Alert from '@/components/ui/Alert'

export default async function DashboardHome() {
  let user: any = null
  try {
    // Adjust endpoint if your API uses a different path
    const res = await apiFetch<{ authorized?: boolean; user?: any } | { user?: any }>('/auth/check', { method: 'GET' })
    user = (res as any).user || res
  } catch (e: any) {
    return <Alert type="error">Failed to fetch user info: {String(e?.message || e)}</Alert>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Welcome{user?.firstName ? `, ${user.firstName}` : ''}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-4">
          <h3 className="mb-2 font-medium">Account</h3>
          <div className="text-sm text-gray-700">
            <div><span className="font-semibold">Username:</span> {user?.username ?? '-'}</div>
            <div><span className="font-semibold">Email:</span> {user?.email ?? '-'}</div>
            <div><span className="font-semibold">Role:</span> {user?.role ?? '-'}</div>
            <div><span className="font-semibold">Status:</span> {user?.status ?? '-'}</div>
          </div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <h3 className="mb-2 font-medium">Quick Links</h3>
          <div className="text-sm">
            <ul className="list-disc pl-5">
              <li><a className="underline" href="/dashboard/threat-intel">Search indicators</a></li>
              <li><a className="underline" href="/dashboard/admin">Ingest and fetch status</a></li>
              <li><a className="underline" href="/dashboard/profile">Update your profile</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
