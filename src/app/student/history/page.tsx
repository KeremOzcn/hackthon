'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/layout/PageHeader'
import { SkeletonRow } from '@/components/ui/Skeleton'
import type { TwinType, RiskLevel } from '@/types'

interface SessionSummary {
  id: string
  subject: string
  topic: string
  twinType: TwinType
  riskLevel: RiskLevel
  accuracy: number
  avgTimeSeconds: number
  hintsUsed: number
  completedAt: string
  dominantPattern: string
  nextBestAction: string
}

const TWIN_ICONS: Record<string, string> = {
  'Hızlı ama Dikkatsiz': '⚡',
  'Yavaş ama Sağlam': '🐢',
  'Konuyu Biliyor ama Modelleyemiyor': '🧩',
  'İpucu Bağımlısı': '🔦',
  'Sınav Panikçisi': '😰',
}

const TWIN_COLORS: Record<string, string> = {
  'Hızlı ama Dikkatsiz': '#f59e0b',
  'Yavaş ama Sağlam': '#10b981',
  'Konuyu Biliyor ama Modelleyemiyor': '#6366f1',
  'İpucu Bağımlısı': '#a78bfa',
  'Sınav Panikçisi': '#f43f5e',
}

const RISK_LABEL: Record<string, string> = { low: 'Düşük', medium: 'Orta', high: 'Yüksek' }

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}

function AccuracyBar({ value }: { value: number }) {
  const color = value >= 80 ? '#10b981' : value >= 50 ? '#f59e0b' : '#f43f5e'
  return (
    <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden', marginTop: '6px' }}>
      <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: '999px', transition: 'width 700ms cubic-bezier(0.16,1,0.3,1)' }} />
    </div>
  )
}

export default function HistoryPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [studentName, setStudentName] = useState('Öğrenci')

  function safeParse<T>(value: string | null): T | null {
    if (!value) return null
    try {
      return JSON.parse(value) as T
    } catch {
      return null
    }
  }

  useEffect(() => {
    const raw = localStorage.getItem('learntwin_student')
    const student = safeParse<{ id?: string; name?: string }>(raw)
    if (!student?.id) { router.push('/'); return }
    setStudentName(student.name || 'Öğrenci')
    const id = student.id

    fetch(`/api/sessions/${id}`)
      .then(r => r.json())
      .then(data => { setSessions(data.sessions ?? []); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [router])

  // Streak: ardışık %60+ doğruluk (en yeniden başlayarak)
  const streak = (() => {
    let count = 0
    for (const s of sessions) {
      if (s.accuracy >= 60) count++
      else break
    }
    return count
  })()

  const avgAccuracy = sessions.length
    ? Math.round(sessions.reduce((s, r) => s + r.accuracy, 0) / sessions.length)
    : 0
  const bestAccuracy = sessions.length ? Math.max(...sessions.map(s => s.accuracy)) : 0

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-2xl flex flex-col gap-6">

        <PageHeader
          title="Geçmiş Testlerim"
          subtitle={`${studentName} · ${sessions.length} oturum`}
          backHref="/"
          backLabel="Ana Sayfa"
          actions={
            <button
              className="btn-primary"
              onClick={() => router.push('/')}
              style={{ fontSize: '13px', padding: '9px 18px' }}
            >
              + Yeni Test
            </button>
          }
        />

        {/* Özet istatistikler */}
        {!loading && sessions.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }} className="fade-in">
            {[
              { icon: '📋', label: 'Toplam Test', value: sessions.length, color: '#6366f1' },
              { icon: '🎯', label: 'Ort. Doğruluk', value: `%${avgAccuracy}`, color: avgAccuracy >= 70 ? '#10b981' : '#f59e0b' },
              { icon: '🏆', label: 'En Yüksek', value: `%${bestAccuracy}`, color: '#a78bfa' },
            ].map(s => (
              <div key={s.label} className="glass-card" style={{ padding: '18px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', marginBottom: '6px' }}>{s.icon}</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ color: 'var(--color-muted)', fontSize: '11px', marginTop: '2px', fontWeight: 600, letterSpacing: '0.03em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Streak banner */}
        {streak >= 2 && (
          <div className="fade-in" style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(244,63,94,0.08))',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: '14px', padding: '16px 20px',
            display: 'flex', alignItems: 'center', gap: '14px',
          }}>
            <span style={{ fontSize: '32px' }}>🔥</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '16px', color: '#f59e0b' }}>{streak} oturumluk seri!</div>
              <div style={{ color: 'var(--color-muted)', fontSize: '13px', marginTop: '2px' }}>
                Son {streak} testinde %60+ doğruluk — harika gidiyorsun!
              </div>
            </div>
          </div>
        )}

        {/* Session listesi */}
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{
            padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)',
            fontWeight: 700, fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span>Oturum Geçmişi</span>
            {!loading && <span style={{ color: 'var(--color-muted)', fontWeight: 400, fontSize: '12px' }}>{sessions.length} kayıt</span>}
          </div>

          {/* Loading skeleton */}
          {loading && Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}

          {/* Hata */}
          {!loading && error && (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--color-muted)' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚠️</div>
              <div style={{ fontWeight: 600, marginBottom: '6px' }}>Geçmiş yüklenemedi</div>
              <div style={{ fontSize: '13px' }}>Bağlantını kontrol et ve sayfayı yenile.</div>
            </div>
          )}

          {/* Boş durum */}
          {!loading && !error && sessions.length === 0 && (
            <div style={{ padding: '56px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
              <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>Henüz test çözmedin</div>
              <div style={{ color: 'var(--color-muted)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
                İlk testini çöz ve Learning Twin&apos;ini keşfet!
              </div>
              <button className="btn-primary" onClick={() => router.push('/')} style={{ justifyContent: 'center' }}>
                Teste Başla →
              </button>
            </div>
          )}

          {/* Session kartları */}
          {!loading && !error && sessions.map((s, idx) => {
            const color = TWIN_COLORS[s.twinType] ?? '#6366f1'
            const icon = TWIN_ICONS[s.twinType] ?? '🧠'
            const isOpen = expanded === s.id

            return (
              <div key={s.id} style={{ borderBottom: idx < sessions.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                {/* Row */}
                <button
                  onClick={() => setExpanded(isOpen ? null : s.id)}
                  style={{
                    width: '100%', textAlign: 'left', padding: '16px 20px', border: 'none', cursor: 'pointer',
                    background: isOpen ? `${color}08` : 'transparent',
                    transition: 'background 150ms ease',
                    display: 'flex', alignItems: 'center', gap: '14px',
                  }}
                >
                  {/* İkon avatar */}
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                    background: `${color}15`, border: `1px solid ${color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                  }}>
                    {icon}
                  </div>

                  {/* Bilgi */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, fontSize: '13px', color }}>{s.twinType}</span>
                      <span style={{ fontSize: '11px', color: 'var(--color-muted)', background: 'rgba(255,255,255,0.06)', padding: '2px 7px', borderRadius: '999px' }}>
                        {s.subject}
                      </span>
                    </div>
                    <div style={{ color: 'var(--color-muted)', fontSize: '12px' }}>{formatDate(s.completedAt)}</div>
                    <AccuracyBar value={s.accuracy} />
                  </div>

                  {/* Stats */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: '18px', marginBottom: '4px' }}>%{s.accuracy}</div>
                    <span className={`badge badge-${s.riskLevel}`}>{RISK_LABEL[s.riskLevel]}</span>
                  </div>

                  {/* Chevron */}
                  <span style={{
                    color: 'var(--color-muted)', fontSize: '11px',
                    transition: 'transform 200ms ease',
                    transform: isOpen ? 'rotate(90deg)' : 'none',
                    flexShrink: 0,
                  }}>▶</span>
                </button>

                {/* Expand paneli */}
                {isOpen && (
                  <div className="fade-in" style={{ padding: '0 20px 20px' }}>
                    <div style={{ borderTop: `1px solid ${color}20`, paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {/* Mini istatistikler */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                        {[
                          { label: 'Ort. Süre', value: `${s.avgTimeSeconds}s` },
                          { label: 'İpucu', value: `${s.hintsUsed}` },
                          { label: 'Konu', value: s.topic },
                        ].map(stat => (
                          <div key={stat.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                            <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '2px' }}>{stat.value}</div>
                            <div style={{ color: 'var(--color-muted)', fontSize: '11px' }}>{stat.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Dominant kalıp */}
                      <div style={{
                        background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)',
                        borderRadius: '10px', padding: '12px 14px', fontSize: '13px', lineHeight: 1.6,
                      }}>
                        <span style={{ fontWeight: 600, color, marginRight: '4px' }}>Dominant Kalıp:</span>
                        <span style={{ color: 'var(--color-muted)' }}>{s.dominantPattern}</span>
                      </div>

                      {/* Öneri */}
                      <div style={{
                        background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
                        borderRadius: '10px', padding: '12px 14px', fontSize: '13px', lineHeight: 1.6,
                      }}>
                        <div style={{ fontWeight: 600, color: '#a5b4fc', fontSize: '11px', marginBottom: '4px', letterSpacing: '0.05em' }}>
                          ÖNERİLEN EYLEM
                        </div>
                        {s.nextBestAction}
                      </div>

                      <button
                        className="btn-outline"
                        onClick={() => router.push('/')}
                        style={{ width: '100%', justifyContent: 'center', fontSize: '13px', padding: '10px' }}
                      >
                        Bu konuyu tekrar çöz →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
