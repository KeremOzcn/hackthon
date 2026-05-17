'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

const DEMO_EMAIL = 'demo@learntwin.ai'
const DEMO_PASSWORD = 'demo123'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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

  async function handleDemoLogin() {
    setError('')
    setLoading(true)

    // Try real login first
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    })

    if (!signInError) {
      router.refresh()
      router.push('/')
      return
    }

    // Fall back to demo session cookie bypass
    window.location.href = '/api/demo-session'
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
          style={{ padding: '16px', marginTop: '20px', textAlign: 'center' }}
        >
          <div style={{ fontSize: '12px', color: 'var(--color-muted)', marginBottom: '10px' }}>
            Hızlı Demo
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
            <div style={{ fontSize: '13px', color: 'var(--on-surface-variant)' }}>
              <span style={{ color: 'var(--color-muted)' }}>E-posta:</span> {DEMO_EMAIL}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--on-surface-variant)' }}>
              <span style={{ color: 'var(--color-muted)' }}>Şifre:</span> {DEMO_PASSWORD}
            </div>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="btn-ghost"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? 'Giriş yapılıyor...' : 'Demo Girişi'}
          </button>
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
