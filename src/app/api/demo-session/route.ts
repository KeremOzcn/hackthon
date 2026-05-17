import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const redirectUrl = `${url.origin}/teacher`
  const response = NextResponse.redirect(redirectUrl)
  response.cookies.set('demo_auth', 'true', {
    httpOnly: false,
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
    sameSite: 'lax',
  })
  return response
}
