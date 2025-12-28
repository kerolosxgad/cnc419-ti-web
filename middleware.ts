import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isProtected = pathname.startsWith('/dashboard')
  if (!isProtected) return NextResponse.next()

  const token = req.cookies.get('jwt')?.value
  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
