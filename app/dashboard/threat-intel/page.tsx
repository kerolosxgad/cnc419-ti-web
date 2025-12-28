import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Table } from '@/components/ui/Table'
import Alert from '@/components/ui/Alert'
import { apiFetch } from '@/lib/api'

async function searchAction(formData: FormData) {
  'use server'
  const query = String(formData.get('query') || '')
  const limit = formData.get('limit') ? Number(formData.get('limit')) : undefined
  const offset = formData.get('offset') ? Number(formData.get('offset')) : undefined
  const body: any = { query }
  if (limit) body.limit = limit
  if (offset) body.offset = offset
  const res = await apiFetch<any>('/threat-intel/search', { method: 'POST', body })
  return JSON.stringify(res)
}

export default async function ThreatIntelPage() {
  let results: any = null
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Threat Intel Search</h2>
      <form action={searchAction} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <Input id="query" name="query" label="Search Query" placeholder="e.g., 218.75.38.210, example.com, or CVE-2025-1338" required />
          </div>
          <div className="flex items-end"><Button type="submit">Search</Button></div>
        </div>
        <Alert type="info">Search supports IP addresses, domains, URLs, hashes, CVEs, and more. The system auto-detects the IOC type.</Alert>
      </form>
      <Results />
    </div>
  )
}

async function Results() {
  // Placeholder server component to show instructions
  return <Alert type="info">Submit a search to view results. Data will render below once wired with server actions that return UI state.</Alert>
}
