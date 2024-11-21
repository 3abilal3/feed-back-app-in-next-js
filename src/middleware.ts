import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // If the user is authenticated
  if (token) {
    // Allow access to the dashboard or other authenticated routes
    if (
      url.pathname.startsWith('/dashboard') || // Stay on dashboard paths
      url.pathname === '/' // Allow root access
    ) {
      return NextResponse.next(); // Let the request proceed
    }

    // Redirect authenticated users trying to access sign-in pages to the dashboard
    if (
      url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify')
    ) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // If the user is not authenticated
  if (!token) {
    // Allow access to sign-in and sign-up pages
    if (
      url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify')
    ) {
      return NextResponse.next(); // Let the request proceed
    }

    // Redirect unauthenticated users to the sign-in page if trying to access protected routes
    if (url.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  return NextResponse.next(); // Default case: Let the request proceed
}

export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/verify/:path*',
    '/dashboard/:path*',
  ],
};
