import { NextResponse, type NextRequest } from 'next/server';

const SESSION_COOKIES = [
  'authjs.session-token',
  '__Secure-authjs.session-token',
];

// Convenience redirect only. Real checks live in the admin layout and every admin action (D-12).
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === '/admin/login') return NextResponse.next();

  const hasSession = SESSION_COOKIES.some((name) => request.cookies.has(name));
  if (!hasSession) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
