'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TopNav } from '@/components/layout/TopNav'
import { Footer } from '@/components/layout/Footer'
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { ACHIEVEMENTS } from '@/lib/gamification'

const EVOLUTION_DATA = [
  { week: 'W1', xp: 420 },
  { week: 'W2', xp: 680 },
  { week: 'W3', xp: 540 },
  { week: 'W4', xp: 890 },
  { week: 'W5', xp: 720 },
  { week: 'W6', xp: 1100 },
  { week: 'W7', xp: 950 },
  { week: 'W8', xp: 1350 },
]

const FALLBACK_XP_TOTAL = 10000
const FALLBACK_XP_CURRENT = 8450
const FALLBACK_LEVEL = 42
const FALLBACK_STREAK = 14
const FALLBACK_ACCURACY = 94
const FALLBACK_VELOCITY = 1.2

const BADGE_BG: string[] = [
  'rgba(167,139,250,0.15)',
  'rgba(16,185,129,0.15)',
  'rgba(245,158,11,0.15)',
  'rgba(59,130,246,0.15)',
  'rgba(236,72,153,0.15)',
  'rgba(99,102,241,0.15)',
  'rgba(20,184,166,0.15)',
  'rgba(139,92,246,0.15)',
]

interface Session {
  id: string
  accuracy: number
  completedAt: string
  achievements: Array<{ id: string; name: string; xp: number }>
}

interface Badge {
  icon: string
  name: string
  desc: string
  bg: string
  locked: boolean
}

function safeParse<T>(value: string | null): T | null {
  if (!value) return null
  try { return JSON.parse(value) as T } catch { return null }
}

function computeStreak(sessions: Session[]): number {
  if (sessions.length === 0) return 0
  const dates = Array.from(
    new Set(sessions.map(s => new Date(s.completedAt).toISOString().slice(0, 10)))
  ).sort().reverse()

  let streak = 1
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1])
    const curr = new Date(dates[i])
    const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
    if (diff === 1) {
      streak++
    } else {
      break
    }
  }
  return streak
}

function computeVelocity(sessions: Session[]): number {
  if (sessions.length < 2) return 1.0
  const sorted = [...sessions].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  )
  const current = sorted[0].accuracy
  const previous = sorted[1].accuracy
  if (previous === 0) return current > 0 ? 9.9 : 1.0
  return current / previous
}

export default function AchievementsPage() {
  const router = useRouter()
  const [, setStudentName] = useState('Öğrenci')
  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState<Session[]>([])

  useEffect(() => {
    const student = safeParse<{ id?: string; name?: string }>(localStorage.getItem('learntwin_student'))
    if (!student?.id) { router.push('/'); return }
    if (student.name) setStudentName(student.name)

    fetch(`/api/sessions/${student.id}`)
      .then(res => res.json())
      .then(data => {
        const fetched: Session[] = data?.sessions ?? []
        setSessions(fetched)
      })
      .catch(() => {
        setSessions([])
      })
      .finally(() => setLoading(false))
  }, [router])

  const hasRealData = sessions.length > 0

  const totalXP = hasRealData
    ? sessions.reduce((sum, s) => sum + s.achievements.reduce((aSum, a) => aSum + (a.xp ?? 0), 0), 0)
    : FALLBACK_XP_CURRENT

  const level = hasRealData ? Math.floor(totalXP / 250) : FALLBACK_LEVEL
  const streak = hasRealData ? computeStreak(sessions) : FALLBACK_STREAK
  const accuracy = hasRealData
    ? Math.round(sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length)
    : FALLBACK_ACCURACY
  const velocity = hasRealData ? computeVelocity(sessions) : FALLBACK_VELOCITY

  const xpCurrent = hasRealData ? totalXP : FALLBACK_XP_CURRENT
  const xpTotal = hasRealData ? (level + 1) * 250 : FALLBACK_XP_TOTAL
  const xpPercent = Math.round((xpCurrent / xpTotal) * 100)

  const earnedIds = new Set<string>()
  for (const s of sessions) {
    for (const a of s.achievements) {
      earnedIds.add(a.id)
    }
  }

  const badges: Badge[] = ACHIEVEMENTS.map((ach, i) => ({
    icon: ach.icon,
    name: ach.name,
    desc: ach.description,
    bg: BADGE_BG[i % BADGE_BG.length],
    locked: !earnedIds.has(ach.id),
  }))

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)' }}>
        Yükleniyor...
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNav active="analytics" />

      <main style={{ flex: 1, padding: '48px 20px' }}>
        <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* Page header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{ fontSize: '14px' }}>🏆</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-muted)', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>BAŞARILAR VE DÖNÜM NOKTALARI</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px' }}>
              Öğrenci Rozetler
            </h1>
            <p style={{ color: 'var(--color-muted)', fontSize: '15px', lineHeight: 1.6, maxWidth: '560px' }}>
              Öğrenme evrimini takip edin, seri desenlerinizi analiz edin ve Twin ekosisteminde kazandığınız rozetleri sergileyin.
            </p>
          </div>

          {/* Twin Evolution + Stats */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'stretch', flexWrap: 'wrap' }}>

            {/* Twin Evolution card */}
            <div className="glass-card" style={{ flex: 1, minWidth: '0', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '17px', marginBottom: '4px' }}>Twin Gelişimi</div>
                  <div style={{ color: 'var(--color-muted)', fontSize: '13px' }}>Mevcut Bilişsel Seviye: Seviye {level}</div>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '999px', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', fontSize: '12px', fontWeight: 700, color: '#f59e0b', flexShrink: 0 }}>
                  🔥 {streak} GÜNLÜK SERİ
                </span>
              </div>

              <div style={{ height: 160, marginTop: '24px', marginBottom: '20px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={EVOLUTION_DATA} barSize={28}>
                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                    <Tooltip
                      cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                      contentStyle={{ background: '#141A29', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '12px' }}
                      labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
                      itemStyle={{ color: '#a78bfa' }}
                      formatter={(v) => [`${v ?? 0} XP`, '']}
                    />
                    <Bar dataKey="xp" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--color-muted)' }}>Seviye {level + 1} İlerlemesi</span>
                  <span style={{ fontSize: '12px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>{xpCurrent.toLocaleString()} / {xpTotal.toLocaleString()} XP</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.07)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${xpPercent}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #a78bfa)', borderRadius: '999px', transition: 'width 700ms cubic-bezier(0.16,1,0.3,1)' }} />
                </div>
              </div>
            </div>

            {/* Stat cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '220px', flexShrink: 0 }}>
              <div className="glass-card" style={{ padding: '28px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '14px' }}>
                  🎯
                </div>
                <div style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '6px' }}>{accuracy}%</div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-muted)', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>DOĞRULUK ORANI</div>
              </div>

              <div className="glass-card" style={{ padding: '28px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '14px' }}>
                  ⚡
                </div>
                <div style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '6px' }}>{velocity.toFixed(1)}x</div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-muted)', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>ÖĞRENME HIZI</div>
              </div>
            </div>
          </div>

          {/* Earned Distinctions */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontWeight: 700, fontSize: '20px' }}>Kazanılan Rozetler</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-accent)', fontSize: '13px', fontWeight: 600 }}>
                TÜMÜNÜ GÖR →
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {badges.map(badge => (
                <div key={badge.name} className="glass-card" style={{ padding: '24px 20px', textAlign: 'center', opacity: badge.locked ? 0.45 : 1 }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: badge.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', margin: '0 auto 14px' }}>
                    {badge.icon}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '8px', color: badge.locked ? 'var(--color-muted)' : 'var(--color-text)' }}>
                    {badge.name}
                  </div>
                  <p style={{ color: 'var(--color-muted)', fontSize: '12px', lineHeight: 1.6 }}>{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-outline" onClick={() => router.push('/student/history')} style={{ flex: 1, justifyContent: 'center' }}>Geçmişim</button>
            <button className="btn-primary" onClick={() => router.push('/')} style={{ flex: 1, justifyContent: 'center' }}>Ana Sayfa</button>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
