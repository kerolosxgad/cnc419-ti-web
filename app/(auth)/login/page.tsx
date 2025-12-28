import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Alert from '@/components/ui/Alert'
import { apiFetch } from '@/lib/api'
import { setTokenCookie } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

async function loginAction(formData: FormData) {
  'use server'
  const body = {
    email: formData.get('email'),
    password: formData.get('password'),
  }
  const res = await apiFetch<{ token: string; user?: any; message_en?: string; message_ar?: string }>('/auth/login', { method: 'POST', body })
  const token = (res as any).token
  if (!token) throw new Error(res.message_en || 'Login failed: missing token in response')
  await setTokenCookie(token)
  revalidatePath('/')
  redirect('/dashboard')
}

export default async function LoginPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams
  const error = searchParams?.error
  return (
    <div className="mx-auto max-w-md space-y-6">
      <h2 className="text-xl font-semibold">Sign in</h2>
      {error ? <Alert type="error">{error}</Alert> : null}
      <form action={loginAction} className="space-y-4">
        <Input id="email" name="email" type="email" label="Email" placeholder="you@example.com" required />
        <Input id="password" name="password" type="password" label="Password" required />
        <Button type="submit">Login</Button>
      </form>
      <div className="text-sm text-gray-600">
        <a className="underline" href="/register">Create account</a> · <a className="underline" href="/reset-password">Reset password</a>
      </div>
    </div>
  )
}
