import { getTokenFromCookies } from '@/lib/auth'

const API_BASE = process.env.API_BASE?.replace(/\/$/, '') || ''
const API_KEY = process.env.API_KEY

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type ApiOptions = {
  method?: Method
  token?: string | null
  query?: Record<string, string | number | boolean | undefined>
  body?: any
  headers?: Record<string, string>
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  if (!API_BASE) throw new Error('Missing API_BASE env variable')

  const url = new URL(`${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`)
  if (options.query) {
    for (const [k, v] of Object.entries(options.query)) {
      if (v !== undefined) url.searchParams.set(k, String(v))
    }
  }

  const token = options.token ?? await getTokenFromCookies()
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    ...(API_KEY ? { 'api-key': API_KEY } : {}),
    ...(options.headers || {}),
  }
  if (token) headers['authorization'] = `Bearer ${token}`

  const res = await fetch(url, {
    method: options.method || 'POST',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: 'no-store',
  })

  const isJson = res.headers.get('content-type')?.includes('application/json')
  if (!res.ok) {
    let detail: any = undefined
    try { detail = isJson ? await res.json() : await res.text() } catch {}
    throw new Error(`API ${res.status}: ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`)
  }

  return (isJson ? await res.json() : (await res.text())) as T
}

export async function apiFetchForm<T>(path: string, form: FormData, opts: { token?: string | null } = {}): Promise<T> {
  if (!API_BASE) throw new Error('Missing API_BASE env variable')
  const url = `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`
  const token = opts.token ?? await getTokenFromCookies()
  const headers: Record<string, string> = {
    ...(API_KEY ? { 'api-key': API_KEY } : {}),
    // Do not set content-type; browser/Node sets multipart boundary.
  }
  if (token) headers['authorization'] = `Bearer ${token}`

  const res = await fetch(url, { method: 'POST', headers, body: form, cache: 'no-store' })
  const isJson = res.headers.get('content-type')?.includes('application/json')
  if (!res.ok) {
    let detail: any = undefined
    try { detail = isJson ? await res.json() : await res.text() } catch {}
    throw new Error(`API ${res.status}: ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`)
  }
  return (isJson ? await res.json() : (await res.text())) as T
}
