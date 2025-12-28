import clsx from 'clsx'
import { ReactNode } from 'react'

export default function Alert({ type = 'info', children }: { type?: 'info' | 'success' | 'error' | 'warning'; children: ReactNode }) {
  const theme = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  }[type]
  return <div className={clsx('rounded-md border px-3 py-2 text-sm', theme)}>{children}</div>
}
