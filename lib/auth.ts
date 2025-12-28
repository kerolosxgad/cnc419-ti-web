import { cookies } from 'next/headers'

const TOKEN_COOKIE = 'jwt'

export async function getTokenFromCookies() {
  const store = await cookies()
  return store.get(TOKEN_COOKIE)?.value || null
}

export async function setTokenCookie(token: string) {
  'use server'
  const store = await cookies()
  store.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    // 7 days
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearTokenCookie() {
  'use server'
  const store = await cookies()
  store.delete(TOKEN_COOKIE)
}

export async function requireAuth() {
  const token = getTokenFromCookies()
  if (!token) throw new Error('Unauthorized')
  return token
}
