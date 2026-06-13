import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for your "admin" cookie or a custom header
  const isAdmin = request.cookies.get('isAdmin');

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};