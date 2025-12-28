import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { apiFetch } from '@/lib/api'

async function ingestAction() {
  'use server'
  await apiFetch<any>('/admins/ingest', { method: 'POST' })
}

export default async function AdminPage() {
  let status: any = null
  let error: string | null = null
  try {
    status = await apiFetch<any>('/admins/fetch-status', { method: 'GET' })
  } catch (e: any) {
    error = String(e?.message || e)
  }
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Admin</h2>
      <form action={ingestAction}><Button type="submit">Run Ingest</Button></form>
      {error ? <Alert type="error">{error}</Alert> : null}
      {status ? (
        <pre className="overflow-auto rounded-md border bg-white p-4 text-xs text-gray-800">{JSON.stringify(status, null, 2)}</pre>
      ) : (
        <Alert type="info">No status available.</Alert>
      )}
    </div>
  )
}
