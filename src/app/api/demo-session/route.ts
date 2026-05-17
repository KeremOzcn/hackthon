import { NextResponse } from 'next/server'

export async function GET() {
  const response = NextResponse.redirect(new URL('/teacher', process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'))
  response.cookies.set('demo_auth', 'true', {
    httpOnly: false,
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
    sameSite: 'lax',
  })
  return response
}
