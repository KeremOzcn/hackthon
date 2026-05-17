'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TopNav } from '@/components/layout/TopNav'
import { Footer } from '@/components/layout/Footer'
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { createClient } from '@/lib/supabase-client'
import { ACHIEVEMENTS } from '@/lib/gamification'

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

function buildEvolutionData(sessions: Session[]) {
  if (sessions.length === 0) return []
  const sorted = [...sessions].sort(
    (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
  )
  return sorted.slice(-8).map((s, i) => ({
    week: `S${i + 1}`,
    xp: s.achievements.reduce((sum, a) => sum + (a.xp ?? 0), 0) + s.accuracy * 10,
  }))
}

export default function AchievementsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [, setStudentName] = useState('Öğrenci')
  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState<Session[]>([])

  useEffect(() => {
    async function load() {
      const isDemoStudent = document.cookie.includes('demo_auth=true') && document.cookie.includes('demo_role=student')
      if (isDemoStudent) { setStudentName('Demo Öğrenci'); setSessions([]); setLoading(false); return }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const name = user.user_metadata?.full_name as string || user.email?.split('@')[0] || 'Öğrenci'
      setStudentName(name)

      fetch(`/api/sessions/${user.id}`)
        .then(res => res.json())
        .then(data => {
          const fetched: Session[] = data?.sessions ?? []
          setSessions(fetched)
        })
        .catch(() => {
          setSessions([])
        })
        .finally(() => setLoading(false))
    }
    load()
  }, [router, supabase])

  const totalXP = sessions.reduce((sum, s) => sum + s.achievements.reduce((aSum, a) => aSum + (a.xp ?? 0), 0), 0)
  const level = Math.floor(totalXP / 250)
  const streak = computeStreak(sessions)
  const accuracy = sessions.length ? Math.round(sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length) : 0
  const velocity = computeVelocity(sessions)
  const xpCurrent = totalXP
  const xpTotal = (level + 1) * 250
  const xpPercent = xpTotal > 0 ? Math.round((xpCurrent / xpTotal) * 100) : 0
  const evolutionData = buildEvolutionData(sessions)

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
      <TopNav active="achievements" role="student" />

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
                {evolutionData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={evolutionData} barSize={28}>
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
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-muted)', fontSize: '13px' }}>
                    Henüz veri yok
                  </div>
                )}
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
