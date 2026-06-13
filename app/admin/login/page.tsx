// 1. You must have these two imports at the very top!
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const isAdmin = request.cookies.get('isAdmin');
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/admin')) {
    
    // Let them access the login page normally
    if (pathname.startsWith('/admin/login')) {
      return NextResponse.next(); 
    }

    // If they are on any other admin page and DO NOT have the cookie, redirect to login
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Allow all non-admin routes to pass through
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'], 
};