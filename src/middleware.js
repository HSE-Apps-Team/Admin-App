import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the path of the request and HTTP method
  const path = request.nextUrl.pathname;
  const method = request.method;
  
  // Create a custom header for debugging instead of console.log
  // This will be visible in the browser's network tab
  const response = NextResponse.next();
  response.headers.set('x-middleware-cache', 'no-cache');
  response.headers.set('x-middleware-path', path);
  response.headers.set('x-middleware-method', method);
  
  // Allow all API requests except auth to bypass middleware protection
  // if (path.startsWith('/api') && !path.startsWith('/api/auth')) {
  //   return response;
  // }
  
  // Define which paths are protected (require authentication)
  const isProtectedRoute = 
    path !== '/login' && 
    !path.startsWith('/api/auth') && 
    !path.includes('.');  // Skip static files
  
  // Check for the admin token in cookies
  const adminToken = request.cookies.get('adminToken')?.value;
  
  // If trying to access protected route without auth, redirect to login
  if (isProtectedRoute && !adminToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If already logged in and trying to access login page, redirect to dashboard
  if (path === '/login' && adminToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Special test endpoint for middleware debugging
  if (path === '/middleware-test') {
    try {
      return new NextResponse(
        JSON.stringify({ 
          middlewareWorking: true, 
          timestamp: new Date().toISOString(),
          pathTested: path
        }),
        {
          status: 200,
          headers: { 
            'content-type': 'application/json',
            'cache-control': 'no-store'
          }
        }
      );
    } catch (err) {
      return new NextResponse(
        JSON.stringify({ error: 'Middleware error', message: err.message }),
        { status: 500, headers: { 'content-type': 'application/json' } }
      );
    }
  }
  
  return response;
}

// Configure which paths this middleware will run on
export const config = {
  matcher: [
    // Match all request paths
    '/:path*',
    // Special case for middleware test endpoint
    '/middleware-test',
    // Skip static files, images, and other assets
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
