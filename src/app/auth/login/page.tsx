'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

const DEMO_TEACHER_EMAIL = 'demo@learntwin.ai'
const DEMO_STUDENT_EMAIL = 'demo.student@learntwin.ai'
const DEMO_PASSWORD = 'demo123'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState<'teacher' | 'student' | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message === 'Invalid login credentials'
        ? 'E-posta veya şifre hatalı.'
        : 'Giriş yapılırken bir hata oluştu.')
      setLoading(false)
      return
    }

    router.refresh()
    router.push('/')
  }

  async function handleDemoTeacherLogin() {
    setError('')
    setDemoLoading('teacher')

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: DEMO_TEACHER_EMAIL,
      password: DEMO_PASSWORD,
    })

    if (!signInError) {
      router.refresh()
      router.push('/')
      return
    }

    window.location.href = '/api/demo-session'
  }

  async function handleDemoStudentLogin() {
    setError('')
    setDemoLoading('student')

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: DEMO_STUDENT_EMAIL,
      password: DEMO_PASSWORD,
    })

    if (!signInError) {
      router.refresh()
      router.push('/')
      return
    }

    window.location.href = '/api/demo-session-student'
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'var(--surface)' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-hanken)' }}>
            İşleyen
          </div>
          <div style={{ color: 'var(--color-muted)', fontSize: '14px' }}>
            Hesabınıza giriş yapın
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 500 }}>
            E-posta
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                padding: '12px 14px',
                borderRadius: '8px',
                border: '0.5px solid var(--border-highlight)',
                background: 'rgba(255,255,255,0.04)',
                color: 'var(--color-text)',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 500 }}>
            Şifre
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                padding: '12px 14px',
                borderRadius: '8px',
                border: '0.5px solid var(--border-highlight)',
                background: 'rgba(255,255,255,0.04)',
                color: 'var(--color-text)',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </label>

          {error && (
            <div style={{ color: 'var(--error)', fontSize: '13px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        {/* Demo section */}
        <div
          className="elevated-card"
          style={{ padding: '16px', marginTop: '20px' }}
        >
          <div style={{ fontSize: '12px', color: 'var(--color-muted)', marginBottom: '12px', textAlign: 'center' }}>
            Hızlı Demo — şifre: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--on-surface-variant)' }}>{DEMO_PASSWORD}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={handleDemoTeacherLogin}
              disabled={loading || demoLoading !== null}
              className="btn-ghost"
              style={{ flex: 1, justifyContent: 'center', flexDirection: 'column', gap: '4px', padding: '12px 8px' }}
            >
              <span style={{ fontSize: '18px' }}>👨‍🏫</span>
              <span style={{ fontSize: '12px', fontWeight: 700 }}>
                {demoLoading === 'teacher' ? '...' : 'Öğretmen'}
              </span>
            </button>
            <button
              type="button"
              onClick={handleDemoStudentLogin}
              disabled={loading || demoLoading !== null}
              className="btn-ghost"
              style={{ flex: 1, justifyContent: 'center', flexDirection: 'column', gap: '4px', padding: '12px 8px' }}
            >
              <span style={{ fontSize: '18px' }}>🎓</span>
              <span style={{ fontSize: '12px', fontWeight: 700 }}>
                {demoLoading === 'student' ? '...' : 'Öğrenci'}
              </span>
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--color-muted)' }}>
          Hesabınız yok mu?{' '}
          <a href="/auth/signup" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}>
            Kaydolun
          </a>
        </div>
      </div>
    </div>
  )
}
