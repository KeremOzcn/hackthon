'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TopNav } from '@/components/layout/TopNav'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase-client'
import type { RiskLevel } from '@/types'

interface SessionSummary {
  id: string
  subject: string
  topic: string
  twinType: string
  riskLevel: RiskLevel
  accuracy: number
  avgTimeSeconds: number
  hintsUsed: number
  completedAt: string
  dominantPattern: string
  nextBestAction: string
}

const PAGE_SIZE = 4

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const RISK_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  low:    { label: 'DÜŞÜK RİSK',  color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  medium: { label: 'ORTA RİSK',   color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  high:   { label: 'YÜKSEK RİSK', color: '#f43f5e', bg: 'rgba(244,63,94,0.12)'  },
}

export default function HistoryPage() {
  const router = useRouter()
  const supabase = createClient()
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  useEffect(() => {
    async function load() {
      const isDemoStudent = document.cookie.includes('demo_auth=true') && document.cookie.includes('demo_role=student')
      if (isDemoStudent) { setSessions([]); setLoading(false); return }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      fetch(`/api/sessions/${user.id}`)
        .then(r => r.json())
        .then(data => { setSessions(data.sessions ?? []); setLoading(false) })
        .catch(() => { setSessions([]); setLoading(false) })
    }
    load()
  }, [router, supabase])

  const streak = (() => {
    let count = 0
    for (const s of sessions) {
      if (s.accuracy >= 60) count++
      else break
    }
    return count
  })()
  const avgAccuracy = sessions.length ? Math.round(sessions.reduce((s, r) => s + r.accuracy, 0) / sessions.length) : 0
  const totalSessions = sessions.length

  const filtered = sessions.filter(s =>
    !search || s.topic.toLowerCase().includes(search.toLowerCase()) || s.subject.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const startIdx = filtered.length ? page * PAGE_SIZE + 1 : 0
  const endIdx = Math.min((page + 1) * PAGE_SIZE, filtered.length)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNav active="history" role="student" />

      <main style={{ flex: 1, padding: '48px 20px' }}>
        <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* Page header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{ color: 'var(--color-muted)', fontSize: '14px' }}>⊙</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-muted)', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>ÖĞRENCİ GEÇMİŞİ</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px' }}>
              Performans Analizi
            </h1>
            <p style={{ color: 'var(--color-muted)', fontSize: '15px', lineHeight: 1.6, maxWidth: '520px' }}>
              Geçmiş değerlendirme sonuçlarınızı, gelişim trendlerinizi ve tespit edilen risk alanlarınızı inceleyin.
            </p>
          </div>

          {/* 3 KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#f59e0b', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>AKTİF SERİ</div>
                <span style={{ fontSize: '16px', opacity: 0.8 }}>🔥</span>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '44px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>{streak}</span>
                <span style={{ fontSize: '17px', fontWeight: 600, color: 'var(--color-muted)', marginLeft: '6px' }}>Gün</span>
              </div>
              <p style={{ color: 'var(--color-muted)', fontSize: '12px', lineHeight: 1.6 }}>Son 30 günün en iyi performansı.</p>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#10b981', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>ORTALAMA BAŞARI</div>
                <span style={{ fontSize: '16px', opacity: 0.8 }}>📊</span>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '44px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>{avgAccuracy}</span>
                <span style={{ fontSize: '17px', fontWeight: 600, color: 'var(--color-muted)', marginLeft: '4px' }}>%</span>
              </div>
              <p style={{ color: avgAccuracy >= 70 ? '#10b981' : 'var(--color-muted)', fontSize: '12px', lineHeight: 1.6 }}>
                {avgAccuracy >= 70 ? '↑ +4.2% geçen aya göre' : 'Geçen aya göre'}
              </p>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#6366f1', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>TAMAMLANAN TESTLER</div>
                <span style={{ fontSize: '16px', opacity: 0.8 }}>✓</span>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '44px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>{totalSessions}</span>
                <span style={{ fontSize: '17px', fontWeight: 600, color: 'var(--color-muted)', marginLeft: '6px' }}>Oturum</span>
              </div>
              <p style={{ color: 'var(--color-muted)', fontSize: '12px', lineHeight: 1.6 }}>Toplam çalışma geçmişi.</p>
            </div>
          </div>

          {/* Table section */}
          <div>
            {/* Header + search */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', gap: '16px', flexWrap: 'wrap' }}>
              <h2 style={{ fontWeight: 700, fontSize: '20px' }}>Sonuç Geçmişi</h2>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', fontSize: '13px', pointerEvents: 'none' }}>🔍</span>
                  <input
                    type="text"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(0) }}
                    placeholder="Test veya konu ara..."
                    style={{ paddingLeft: '34px', paddingRight: '14px', paddingTop: '9px', paddingBottom: '9px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-text)', fontSize: '13px', outline: 'none', width: '220px', fontFamily: 'var(--font-inter)', transition: 'border-color 150ms ease' }}
                  />
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-muted)', fontSize: '13px', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-inter)' }}>
                  ⊞ Filtrele
                </button>
              </div>
            </div>

            <div className="glass-card" style={{ overflow: 'hidden' }}>
              {/* Table header */}
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 130px 80px 160px', borderBottom: '1px solid var(--border-subtle)' }}>
                {['TARİH', 'DEĞERLENDİRME ADI', 'KONU', 'SKOR', 'RİSK DURUMU'].map(h => (
                  <div key={h} style={{ padding: '12px 20px', fontSize: '10px', fontWeight: 700, color: 'var(--color-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
                    {h}
                  </div>
                ))}
              </div>

              {/* Skeleton */}
              {loading && Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 130px 80px 160px', borderBottom: '1px solid var(--border-subtle)' }}>
                  {[70, 180, 80, 40, 90].map((w, j) => (
                    <div key={j} style={{ padding: '20px 20px' }}>
                      <div className="skeleton-shimmer" style={{ width: w, height: 13 }} />
                    </div>
                  ))}
                </div>
              ))}

              {/* Empty */}
              {!loading && filtered.length === 0 && (
                <div style={{ padding: '56px 24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
                  <div style={{ fontWeight: 700, marginBottom: '6px' }}>{search ? 'Sonuç bulunamadı' : 'Henüz test çözmedin'}</div>
                  <div style={{ color: 'var(--color-muted)', fontSize: '13px' }}>{search ? 'Farklı bir arama dene.' : 'İlk testini çöz!'}</div>
                </div>
              )}

              {/* Rows */}
              {!loading && paginated.map((s, i) => {
                const risk = RISK_CONFIG[s.riskLevel] ?? RISK_CONFIG.medium
                return (
                  <div
                    key={s.id}
                    style={{ display: 'grid', gridTemplateColumns: '120px 1fr 130px 80px 160px', borderBottom: i < paginated.length - 1 ? '1px solid var(--border-subtle)' : 'none', transition: 'background 150ms ease', cursor: 'default' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', fontSize: '12px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
                      {formatDate(s.completedAt)}
                    </div>
                    <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: '14px' }}>
                      {s.topic}
                    </div>
                    <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', fontSize: '13px', color: 'var(--color-muted)' }}>
                      {s.subject}
                    </div>
                    <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: '14px' }}>
                      {s.accuracy}%
                    </div>
                    <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '6px', background: risk.bg, fontSize: '11px', fontWeight: 700, color: risk.color, fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: risk.color, flexShrink: 0 }} />
                        {risk.label}
                      </span>
                    </div>
                  </div>
                )
              })}

              {/* Pagination */}
              {!loading && filtered.length > 0 && (
                <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: 'var(--color-muted)' }}>
                    {startIdx}-{endIdx} / {filtered.length} sonuç gösteriliyor
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setPage(p => Math.max(0, p - 1))}
                      disabled={page === 0}
                      style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-text)', cursor: page === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', opacity: page === 0 ? 0.35 : 1 }}
                    >
                      ←
                    </button>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                      disabled={page >= totalPages - 1}
                      style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-text)', cursor: page >= totalPages - 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', opacity: page >= totalPages - 1 ? 0.35 : 1 }}
                    >
                      →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
