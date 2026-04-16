import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const proxy = async (req: NextRequest) => {
  const sessionToken = req.cookies.get('session_token')?.value;
  const isAuthPage =
    req.nextUrl.pathname.startsWith('/login') ||
    req.nextUrl.pathname.startsWith('/register');

  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/auto-transcribe', req.url));
  }

  if (!sessionToken && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
