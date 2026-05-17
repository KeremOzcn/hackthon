'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TopNav } from '@/components/layout/TopNav'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase-client'

interface SessionSummary {
  id: string
  subject: string
  topic: string
  twinType: string
  riskLevel: string
  accuracy: number
  avgTimeSeconds: number
  hintsUsed: number
  completedAt: string
  dominantPattern: string
  nextBestAction: string
}

const TWIN_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
  'Hızlı ama Dikkatsiz':              { icon: '⚡', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  'Yavaş ama Sağlam':                  { icon: '🐢', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  'Konuyu Biliyor ama Modelleyemiyor': { icon: '🧩', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  'İpucu Bağımlısı':                   { icon: '💡', color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
  'Sınav Panikçisi':                   { icon: '😰', color: '#f43f5e', bg: 'rgba(244,63,94,0.12)' },
}

const RISK_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  low:    { label: 'Düşük Risk',  color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  medium: { label: 'Orta Risk',   color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  high:   { label: 'Yüksek Risk', color: '#f43f5e', bg: 'rgba(244,63,94,0.12)'  },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })
}

function formatTime(seconds: number) {
  if (!seconds) return '—'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}d ${s}s` : `${s}s`
}

export default function StudentDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [userName, setUserName] = useState('')
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const isDemoStudent = typeof document !== 'undefined' &&
        document.cookie.includes('demo_auth=true') &&
        document.cookie.includes('demo_role=student')

      if (isDemoStudent) {
        setUserName('Demo Öğrenci')
        setSessions([])
        setLoading(false)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'teacher') { router.push('/teacher'); return }
      if (profile?.role === 'parent')  { router.push('/parent');  return }

      const name = (profile?.full_name as string) || (user.user_metadata?.full_name as string) || user.email?.split('@')[0] || 'Öğrenci'
      setUserName(name)

      fetch(`/api/sessions/${user.id}`)
        .then(r => r.json())
        .then(data => { setSessions(data.sessions ?? []); setLoading(false) })
        .catch(() => { setSessions([]); setLoading(false) })
    }
    load()
  }, [router, supabase])

  const avgAccuracy = sessions.length
    ? Math.round(sessions.reduce((s, r) => s + r.accuracy, 0) / sessions.length)
    : 0

  const streak = (() => {
    let count = 0
    for (const s of sessions) {
      if (s.accuracy >= 60) count++
      else break
    }
    return count
  })()

  const lastSession = sessions[0] ?? null
  const lastTwin = lastSession ? (TWIN_CONFIG[lastSession.twinType] ?? null) : null
  const recentSessions = sessions.slice(0, 3)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Günaydın' : hour < 18 ? 'İyi günler' : 'İyi akşamlar'

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <TopNav active="dashboard" role="student" />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div className="skeleton-shimmer" style={{ width: 48, height: 48, borderRadius: '50%' }} />
            <div className="skeleton-shimmer" style={{ width: 200, height: 16, borderRadius: 8 }} />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNav active="dashboard" role="student" />

      <main style={{ flex: 1, padding: '48px 20px' }}>
        <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-muted)', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                ÖĞRENCİ PANELİ
              </div>
              <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
                {greeting}, {userName.split(' ')[0]} 👋
              </h1>
              <p style={{ color: 'var(--color-muted)', fontSize: '15px' }}>
                {sessions.length === 0
                  ? 'Henüz test çözmedin. İlk oturumu başlat!'
                  : `Toplam ${sessions.length} oturum tamamladın.`}
              </p>
            </div>
            <Link
              href="/student/session"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '10px',
                background: 'linear-gradient(90deg, var(--color-accent), #a78bfa)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              Yeni Oturum Başlat →
            </Link>
          </div>

          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#f59e0b', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', marginBottom: '12px' }}>AKTİF SERİ</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
                <span style={{ fontSize: '42px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>{streak}</span>
                <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-muted)' }}>Gün 🔥</span>
              </div>
              <p style={{ color: 'var(--color-muted)', fontSize: '12px' }}>Arka arkaya başarılı oturum</p>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#10b981', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', marginBottom: '12px' }}>ORTALAMA BAŞARI</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                <span style={{ fontSize: '42px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>{avgAccuracy}</span>
                <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-muted)' }}>%</span>
              </div>
              <p style={{ color: avgAccuracy >= 70 ? '#10b981' : 'var(--color-muted)', fontSize: '12px' }}>
                {avgAccuracy >= 70 ? '↑ Harika gidiyorsun!' : sessions.length === 0 ? 'Henüz veri yok' : 'Biraz daha çalışalım'}
              </p>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#6366f1', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', marginBottom: '12px' }}>TAMAMLANAN</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
                <span style={{ fontSize: '42px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>{sessions.length}</span>
                <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-muted)' }}>Oturum ✓</span>
              </div>
              <p style={{ color: 'var(--color-muted)', fontSize: '12px' }}>Toplam çalışma geçmişi</p>
            </div>
          </div>

          {/* Learning Twin Profile */}
          {lastSession && lastTwin && (
            <div className="glass-card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-muted)', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
                  LEARNING TWIN PROFİLİ
                </div>
                <span style={{ fontSize: '11px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
                  Son güncelleme: {formatDate(lastSession.completedAt)}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '72px',
                  height: '72px',
                  borderRadius: '16px',
                  background: lastTwin.bg,
                  border: `1px solid ${lastTwin.color}30`,
                  fontSize: '32px',
                  flexShrink: 0,
                }}>
                  {lastTwin.icon}
                </div>

                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ fontWeight: 800, fontSize: '20px', letterSpacing: '-0.02em', marginBottom: '4px', color: lastTwin.color }}>
                    {lastSession.twinType}
                  </div>
                  <div style={{ color: 'var(--color-muted)', fontSize: '13px', marginBottom: '12px' }}>
                    {lastSession.dominantPattern}
                  </div>
                  {lastSession.nextBestAction && (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: 'rgba(99,102,241,0.1)',
                      border: '0.5px solid rgba(99,102,241,0.2)',
                      fontSize: '12px',
                      color: 'var(--color-accent)',
                      fontWeight: 500,
                    }}>
                      💡 {lastSession.nextBestAction}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: RISK_CONFIG[lastSession.riskLevel]?.bg ?? RISK_CONFIG.medium.bg,
                    fontSize: '11px',
                    fontWeight: 700,
                    color: RISK_CONFIG[lastSession.riskLevel]?.color ?? RISK_CONFIG.medium.color,
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.04em',
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: RISK_CONFIG[lastSession.riskLevel]?.color ?? RISK_CONFIG.medium.color }} />
                    {RISK_CONFIG[lastSession.riskLevel]?.label ?? 'Orta Risk'}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--color-muted)' }}>
                    Son: <span style={{ fontWeight: 700, color: 'var(--on-surface)' }}>{lastSession.accuracy}%</span> — {lastSession.subject}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* No sessions yet */}
          {sessions.length === 0 && (
            <div className="glass-card" style={{ padding: '56px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚀</div>
              <div style={{ fontWeight: 700, fontSize: '20px', marginBottom: '8px' }}>İlk testini çözmeye hazır mısın?</div>
              <div style={{ color: 'var(--color-muted)', fontSize: '14px', marginBottom: '24px' }}>
                AI Learning Twin profilin ilk oturumdan sonra oluşturulacak.
              </div>
              <Link
                href="/student/session"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 28px',
                  borderRadius: '10px',
                  background: 'linear-gradient(90deg, var(--color-accent), #a78bfa)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '14px',
                  textDecoration: 'none',
                }}
              >
                Hemen Başla →
              </Link>
            </div>
          )}

          {/* Recent Sessions */}
          {recentSessions.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h2 style={{ fontWeight: 700, fontSize: '18px' }}>Son Oturumlar</h2>
                <Link href="/student/history" style={{ fontSize: '13px', color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 500 }}>
                  Tümünü Gör →
                </Link>
              </div>

              <div className="glass-card" style={{ overflow: 'hidden' }}>
                {recentSessions.map((s, i) => {
                  const twin = TWIN_CONFIG[s.twinType]
                  const risk = RISK_CONFIG[s.riskLevel] ?? RISK_CONFIG.medium
                  return (
                    <div
                      key={s.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '40px 1fr auto',
                        gap: '16px',
                        alignItems: 'center',
                        padding: '16px 20px',
                        borderBottom: i < recentSessions.length - 1 ? '0.5px solid var(--border-subtle)' : 'none',
                        transition: 'background 150ms ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ fontSize: '20px', textAlign: 'center' }}>{twin?.icon ?? '📋'}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>{s.topic}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
                          {s.subject} · {formatDate(s.completedAt)} · {formatTime(s.avgTimeSeconds)} ort.
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontWeight: 800, fontSize: '16px' }}>{s.accuracy}%</span>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: risk.bg,
                          fontSize: '10px',
                          fontWeight: 700,
                          color: risk.color,
                          fontFamily: 'var(--font-mono)',
                          letterSpacing: '0.04em',
                          whiteSpace: 'nowrap',
                        }}>
                          {risk.label}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <Link href="/student/history" style={{ textDecoration: 'none' }}>
              <div
                className="glass-card"
                style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', transition: 'border-color 150ms ease' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '')}
              >
                <span style={{ fontSize: '24px' }}>📊</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>Performans Geçmişi</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>Tüm sonuçlarını gör</div>
                </div>
              </div>
            </Link>

            <Link href="/student/achievements" style={{ textDecoration: 'none' }}>
              <div
                className="glass-card"
                style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', transition: 'border-color 150ms ease' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#f59e0b')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '')}
              >
                <span style={{ fontSize: '24px' }}>🏆</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>Başarımlar</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>Rozetlerin ve ilerlemen</div>
                </div>
              </div>
            </Link>

            <Link href="/student/session" style={{ textDecoration: 'none' }}>
              <div
                className="glass-card"
                style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', transition: 'border-color 150ms ease', border: '0.5px solid rgba(99,102,241,0.3)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)')}
              >
                <span style={{ fontSize: '24px' }}>⚡</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>Yeni Oturum</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>Test çözmeye başla</div>
                </div>
              </div>
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
