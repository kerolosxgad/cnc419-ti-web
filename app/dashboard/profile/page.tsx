import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Alert from '@/components/ui/Alert'
import { apiFetch, apiFetchForm } from '@/lib/api'

async function loadUser() {
  try {
    // First check auth to get username
    const authRes = await apiFetch<any>('/auth/check', { method: 'GET' })
    if (!authRes?.user?.username) return null
    
    // Then get full user data
    const res = await apiFetch<any>('/users/get', { method: 'POST', body: { username: authRes.user.username } })
    return (res as any).userData || res
  } catch (e) {
    return null
  }
}

async function updateAction(formData: FormData) {
  'use server'
  const body: any = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    phone: formData.get('phone'),
  }
  // Remove empty values
  Object.keys(body).forEach(key => {
    if (!body[key]) delete body[key]
  })
  await apiFetch<any>('/users/update', { method: 'POST', body })
}

async function uploadImageAction(formData: FormData) {
  'use server'
  await apiFetchForm<any>('/users/update-image', formData)
}

async function deleteAction() {
  'use server'
  await apiFetch<any>('/users/delete', { method: 'POST' })
}

export default async function ProfilePage() {
  const user = await loadUser()
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Profile</h2>
      {user ? (
        <div className="rounded-lg border bg-white p-4 text-sm">
          <div><span className="font-semibold">Username:</span> {user.username}</div>
          <div><span className="font-semibold">Email:</span> {user.email ?? '-'}</div>
          <div><span className="font-semibold">Name:</span> {user.firstName} {user.lastName}</div>
          <div><span className="font-semibold">Phone:</span> {user.dialCode || ''} {user.phone || '-'}</div>
          <div><span className="font-semibold">Role:</span> {user.role || '-'}</div>
          <div><span className="font-semibold">Status:</span> {user.status || '-'}</div>
        </div>
      ) : (
        <Alert type="warning">Could not load user data.</Alert>
      )}

      <section className="space-y-3">
        <h3 className="font-medium">Update details</h3>
        <form action={updateAction} className="grid gap-3 sm:grid-cols-3">
          <Input id="firstName" name="firstName" label="First name" defaultValue={user?.firstName || ''} />
          <Input id="lastName" name="lastName" label="Last name" defaultValue={user?.lastName || ''} />
          <Input id="phone" name="phone" label="Phone" defaultValue={user?.phone || ''} />
          <div className="sm:col-span-3"><Button type="submit">Save changes</Button></div>
        </form>
      </section>

      <section className="space-y-3">
        <h3 className="font-medium">Profile image</h3>
        <form action={uploadImageAction} className="space-y-2">
          <input type="file" name="image" accept="image/*" />
          <Button type="submit" variant="secondary">Upload</Button>
        </form>
      </section>

      <section className="space-y-3">
        <h3 className="font-medium">Danger zone</h3>
        <form action={deleteAction}>
          <Button type="submit" variant="danger">Delete account</Button>
        </form>
      </section>
    </div>
  )
}
