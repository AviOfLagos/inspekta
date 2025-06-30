import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define route protection patterns
const publicRoutes = [
  '/',
  '/about',
  '/faq',
  '/contact',
  '/careers',
  '/privacy',
  '/terms',
  '/marketplace',
  '/listings',
  '/agents',
  '/auth/login',
  '/auth/register',
  '/auth/verify-email',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/api/auth',
  '/api/listings',
];

const roleBasedRoutes = {
  client: ['/client'],
  agent: ['/agent'],
  inspector: ['/inspector'],
  company_admin: ['/company'],
  platform_admin: ['/admin'],
};

const authRequiredRoutes = [
  '/client',
  '/agent', 
  '/inspector',
  '/company',
  '/admin',
  '/onboarding',
  '/schedule-inspection',
  '/profile',
  '/settings',
];

// Utility functions
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => {
    if (route === '/') return pathname === '/';
    return pathname.startsWith(route);
  });
}

function isAuthRequiredRoute(pathname: string): boolean {
  return authRequiredRoutes.some(route => pathname.startsWith(route));
}

function getUserRoleFromPath(pathname: string): string | null {
  for (const [role, paths] of Object.entries(roleBasedRoutes)) {
    if (paths.some(path => pathname.startsWith(path))) {
      return role;
    }
  }
  return null;
}

function isRoleAuthorized(userRole: string, pathname: string): boolean {
  const requiredRole = getUserRoleFromPath(pathname);
  if (!requiredRole) return true; // No specific role required
  
  // Platform admin can access everything
  if (userRole === 'platform_admin') return true;
  
  // Company admin can access company routes
  if (userRole === 'company_admin' && requiredRole === 'company_admin') return true;
  
  // Regular role matching
  return userRole === requiredRole;
}

async function getSessionFromCookie(request: NextRequest) {
  const sessionCookie = request.cookies.get('inspekta-session');
  if (!sessionCookie) return null;
  
  try {
    // Import JWT verification function
    const { jwtVerify } = await import('jose');
    const JWT_SECRET = new TextEncoder().encode(
      process.env.JWT_SECRET || 'inspekta-super-secret-key-change-in-production'
    );
    
    // Verify and decode the JWT token
    const { payload } = await jwtVerify(sessionCookie.value, JWT_SECRET);
    
    // Validate that the payload has the required SessionUser fields
    if (
      typeof payload.id === 'string' &&
      typeof payload.email === 'string' &&
      typeof payload.role === 'string' &&
      typeof payload.isVerified === 'boolean'
    ) {
      return {
        user: {
          id: payload.id,
          email: payload.email,
          role: payload.role.toLowerCase(), // Ensure consistent case
          isVerified: payload.isVerified,
        }
      };
    }
    return null;
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and API routes that don't need protection
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Get session from JWT token
  const session = await getSessionFromCookie(request);

  // Redirect unauthenticated users to login
  if (isAuthRequiredRoute(pathname) && !session) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    
    // Track intended role if accessing role-specific route
    const intendedRole = getUserRoleFromPath(pathname);
    if (intendedRole) {
      loginUrl.searchParams.set('intendedRole', intendedRole);
    }
    
    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated, check additional requirements
  if (session) {
    // Check if email is verified (except for verification page)
    if (!session.user.isVerified && !pathname.startsWith('/auth/verify-email')) {
      return NextResponse.redirect(new URL('/auth/verify-email', request.url));
    }

    // Check role-based access
    if (!isRoleAuthorized(session.user.role, pathname)) {
      const intendedRole = getUserRoleFromPath(pathname);
      if (intendedRole) {
        // Redirect to role mismatch page with information about intended access
        const mismatchUrl = new URL('/auth/role-mismatch', request.url);
        mismatchUrl.searchParams.set('currentRole', session.user.role);
        mismatchUrl.searchParams.set('intendedRole', intendedRole);
        mismatchUrl.searchParams.set('intendedPath', pathname);
        return NextResponse.redirect(mismatchUrl);
      }
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Redirect authenticated users away from auth pages
    if (pathname.startsWith('/auth/') && pathname !== '/auth/verify-email') {
      const dashboardUrl = getDashboardUrlForRole(session.user.role);
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }
  }

  // Add security headers
  const response = NextResponse.next();
  
  // Basic security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set(
    'X-Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  );

  return response;
}

function getDashboardUrlForRole(role: string): string {
  switch (role) {
    case 'client':
      return '/client';
    case 'agent':
      return '/agent';
    case 'inspector':
      return '/inspector';
    case 'company_admin':
      return '/company';
    case 'platform_admin':
      return '/admin';
    default:
      return '/';
  }
}

// Configure which routes should run the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
};