import { forwardRef, type InputHTMLAttributes } from 'react'
import clsx from 'clsx'

type Props = InputHTMLAttributes<HTMLInputElement> & { label?: string }

const Input = forwardRef<HTMLInputElement, Props>(function Input({ className, label, id, ...props }, ref) {
  return (
    <div className="space-y-1">
      {label ? (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      ) : null}
      <input ref={ref} id={id} className={clsx('w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200', className)} {...props} />
    </div>
  )
})

export default Input
