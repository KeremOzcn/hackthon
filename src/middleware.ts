import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if route needs protection
  const isProtected =
    pathname.startsWith('/student/') ||
    pathname.startsWith('/teacher/') ||
    pathname.startsWith('/parent/') ||
    (pathname.startsWith('/api/') && !isPublicApi(pathname))

  if (!isProtected) {
    return NextResponse.next()
  }

  // Check demo cookie
  const demoAuth = request.cookies.get('demo_auth')?.value
  if (demoAuth) {
    return NextResponse.next()
  }

  // Check Supabase session
  let response = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return response
}

function isPublicApi(pathname: string) {
  const publicApis = [
    '/api/analyze',
    '/api/questions',
    '/api/subjects',
    '/api/demo-session',
    '/api/demo-session-student',
  ]
  return publicApis.some((api) => pathname.startsWith(api))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
