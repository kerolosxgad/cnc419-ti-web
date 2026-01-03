'use client'
import { useState, ReactNode } from 'react'
import clsx from 'clsx'

export function Tabs({ tabs, initial = 0 }: { tabs: { label: string; content: ReactNode }[]; initial?: number }) {
  const [idx, setIdx] = useState(initial)
  return (
    <div>
      <div className="mb-4 flex gap-2 border-b">
        {tabs.map((t, i) => (
          <button key={i} className={clsx('px-3 py-2 text-sm', idx === i ? 'border-b-2 border-blue-600 font-medium text-blue-700' : 'text-gray-600 hover:text-gray-800')} onClick={() => setIdx(i)}>
            {t.label}
          </button>
        ))}
      </div>
      <div>{tabs[idx]?.content}</div>
    </div>
  )
}
