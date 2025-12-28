import './globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'DeltaTI Dashboard',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-dvh">
          <header className="border-b bg-white">
            <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
              <h1 className="text-lg font-semibold">DeltaTI Dashboard</h1>
              <nav className="text-sm text-gray-600">Powered by Next.js</nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </div>
      </body>
    </html>
  )
}
