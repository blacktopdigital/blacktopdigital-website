import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const isPortalRoute = request.nextUrl.pathname.startsWith('/portal/dashboard') ||
    request.nextUrl.pathname.startsWith('/portal/clients')

  if (isPortalRoute && !token) {
    return NextResponse.redirect(new URL('/portal', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/portal/dashboard/:path*', '/portal/clients/:path*'],
}
