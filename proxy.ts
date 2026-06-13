import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // 1. Get the cookie
  const isAdmin = request.cookies.get('isAdmin');
  const pathname = request.nextUrl.pathname;

  // 2. If the user is trying to access ANY /admin route...
  if (pathname.startsWith('/admin')) {
    
    // EXCEPTION: Let them access the login page normally!
    if (pathname.startsWith('/admin/login')) {
      return NextResponse.next(); 
    }

    // 3. If they are on any other admin page and DO NOT have the cookie, kick them out
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // 4. Allow all non-admin routes (like your storefront) to pass through normally
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'], 
};