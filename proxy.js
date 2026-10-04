import { NextResponse } from 'next/server';

export function proxy(request) {
  const { pathname } = request.nextUrl;
  if (pathname === '/admin/login' || pathname === '/admin/signup') return NextResponse.next();
  if (!request.cookies.has('jsa_session')) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };