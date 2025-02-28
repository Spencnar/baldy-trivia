import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    // Check if user is authenticated and is an admin
    if (
      request.nextUrl.pathname.startsWith('/admin') &&
      request.nextauth.token?.isAdmin !== true
    ) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};