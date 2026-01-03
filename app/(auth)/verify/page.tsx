import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Alert from '@/components/ui/Alert'
import { apiFetch } from '@/lib/api'
import { redirect } from 'next/navigation'

async function verifyAction(formData: FormData) {
  'use server'
  const email = formData.get('email')
  const otp = formData.get('otp')
  await apiFetch<any>('/auth/verify', { method: 'POST', body: { email, otp } })
  redirect('/login')
}

async function resendAction(formData: FormData) {
  'use server'
  const email = formData.get('email')
  await apiFetch<any>('/auth/resend', { method: 'POST', body: { email } })
  return
}

export default async function VerifyPage(props: { searchParams: Promise<{ email?: string }> }) {
  const searchParams = await props.searchParams
  return (
    <div className="mx-auto max-w-md space-y-6">
      <h2 className="text-xl font-semibold">Verify your email</h2>
      <Alert type="info">Enter the verification code sent to your email.</Alert>
      <form action={verifyAction} className="space-y-4">
        <Input id="email" name="email" type="email" label="Email" defaultValue={searchParams?.email || ''} required />
        <Input id="otp" name="otp" label="Verification code" required />
        <div className="flex items-center gap-3">
          <Button type="submit">Verify</Button>
          <form action={resendAction}>
            <input type="hidden" name="email" value={searchParams?.email || ''} />
            <Button type="submit" variant="secondary">Resend code</Button>
          </form>
        </div>
      </form>
    </div>
  )
}
