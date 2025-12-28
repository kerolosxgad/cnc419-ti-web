import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Alert from '@/components/ui/Alert'
import { apiFetch } from '@/lib/api'
import { redirect } from 'next/navigation'

async function resetAction(formData: FormData) {
  'use server'
  const email = formData.get('email')
  const otp = formData.get('otp')
  const newPassword = formData.get('newPassword')
  await apiFetch<any>('/auth/reset-password', { method: 'POST', body: { email, otp, newPassword } })
  redirect('/login')
}

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <h2 className="text-xl font-semibold">Reset password</h2>
      <Alert type="info">Use the code sent to your email to reset password.</Alert>
      <form action={resetAction} className="space-y-4">
        <Input id="email" name="email" type="email" label="Email" required />
        <Input id="otp" name="otp" label="Verification code" required />
        <Input id="newPassword" name="newPassword" type="password" label="New password" required />
        <Button type="submit">Reset password</Button>
      </form>
    </div>
  )
}
