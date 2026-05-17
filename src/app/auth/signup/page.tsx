'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

type Role = 'student' | 'teacher' | 'parent'

const ROLE_LABELS: Record<Role, string> = {
  student: 'Öğrenci',
  teacher: 'Öğretmen',
  parent: 'Veli',
}

const DEMO_EMAIL = 'demo@learntwin.ai'
const DEMO_PASSWORD = 'demo123'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('student')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.')
      setLoading(false)
      return
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message === 'User already registered'
        ? 'Bu e-posta adresi zaten kayıtlı.'
        : 'Kayıt olurken bir hata oluştu.')
      setLoading(false)
      return
    }

    router.refresh()
    router.push('/')
  }

  async function handleDemoSignup() {
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
            İşler LearnTwin AI
          </div>
          <div style={{ color: 'var(--color-muted)', fontSize: '14px' }}>
            Yeni hesap oluşturun
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 500 }}>
            Ad Soyad
            <input
              type="text"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 500 }}>
            Rol
            <div style={{ display: 'flex', gap: '8px' }}>
              {(Object.keys(ROLE_LABELS) as Role[]).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: '0.5px solid',
                    borderColor: role === r ? 'var(--color-accent)' : 'var(--border-highlight)',
                    background: role === r ? 'rgba(128,131,255,0.12)' : 'rgba(255,255,255,0.04)',
                    color: role === r ? 'var(--color-accent)' : 'var(--color-muted)',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  {ROLE_LABELS[r]}
                </button>
              ))}
            </div>
          </div>

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
            {loading ? 'Kaydediliyor...' : 'Kaydol'}
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
              <span style={{ color: 'var(--color-muted)' }}>Rol:</span> Öğretmen
            </div>
            <div style={{ fontSize: '13px', color: 'var(--on-surface-variant)' }}>
              <span style={{ color: 'var(--color-muted)' }}>E-posta:</span> {DEMO_EMAIL}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--on-surface-variant)' }}>
              <span style={{ color: 'var(--color-muted)' }}>Şifre:</span> {DEMO_PASSWORD}
            </div>
          </div>
          <button
            type="button"
            onClick={handleDemoSignup}
            disabled={loading}
            className="btn-ghost"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? 'Kaydediliyor...' : 'Demo Hesap Oluştur'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--color-muted)' }}>
          Zaten hesabınız var mı?{' '}
          <a href="/auth/login" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}>
            Giriş yapın
          </a>
        </div>
      </div>
    </div>
  )
}
