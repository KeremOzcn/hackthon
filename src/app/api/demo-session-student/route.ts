import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const redirectUrl = `${url.origin}/student`
  const response = NextResponse.redirect(redirectUrl)
  response.cookies.set('demo_auth', 'true', {
    httpOnly: false,
    maxAge: 60 * 60 * 24,
    path: '/',
    sameSite: 'lax',
  })
  response.cookies.set('demo_role', 'student', {
    httpOnly: false,
    maxAge: 60 * 60 * 24,
    path: '/',
    sameSite: 'lax',
  })
  return response
}
