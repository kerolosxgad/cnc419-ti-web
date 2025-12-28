import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Alert from '@/components/ui/Alert'
import { apiFetch } from '@/lib/api'
import { redirect } from 'next/navigation'

async function registerAction(formData: FormData) {
  'use server'
  const body = {
    username: formData.get('username'),
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    password: formData.get('password'),
  }
  await apiFetch<any>('/auth/register', { method: 'POST', body })
  redirect(`/verify?email=${encodeURIComponent(String(body.email))}`)
}

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <h2 className="text-xl font-semibold">Create account</h2>
      <Alert type="info">After registration, check your email for the verification code.</Alert>
      <form action={registerAction} className="space-y-4">
        <Input id="username" name="username" label="Username" placeholder="Choose a unique username" required />
        <div className="grid grid-cols-2 gap-3">
          <Input id="firstName" name="firstName" label="First name" required />
          <Input id="lastName" name="lastName" label="Last name" required />
        </div>
        <Input id="email" name="email" type="email" label="Email" required />
        <Input id="password" name="password" type="password" label="Password" required />
        <Button type="submit">Register</Button>
      </form>
    </div>
  )
}
