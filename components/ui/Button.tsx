import { type ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' }

export default function Button({ className, variant = 'primary', ...props }: Props) {
  const base = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'
  const theme = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }[variant]
  return <button className={clsx(base, theme, className)} {...props} />
}
