import { NextResponse } from 'next/server'
import { clearTokenCookie } from '@/lib/auth'
import { apiFetch } from '@/lib/api'

export async function POST() {
  try {
    await apiFetch<any>('/auth/logout', { method: 'POST' })
  } catch {
    // ignore errors on remote logout; still clear locally
  }
  await clearTokenCookie()
  return NextResponse.json({ ok: true })
}
