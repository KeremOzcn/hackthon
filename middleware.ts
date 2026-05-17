import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const isDemo = request.cookies.get('demo_auth')?.value === 'true'

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Auth pages are public but redirect authenticated users to dashboard
  if (pathname.startsWith('/auth')) {
    if (user || isDemo) {
      if (isDemo) {
        return NextResponse.redirect(new URL('/teacher', request.url))
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user!.id)
        .single()

      const role = profile?.role
      if (role === 'teacher') return NextResponse.redirect(new URL('/teacher', request.url))
      if (role === 'parent') return NextResponse.redirect(new URL('/parent', request.url))
      return NextResponse.redirect(new URL('/student/session', request.url))
    }
    return response
  }

  // Public pages
  if (pathname === '/' || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    return response
  }

  // Protected routes — allow demo mode through
  if (!user && !isDemo) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
