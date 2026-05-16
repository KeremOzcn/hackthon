'use client'

import { TopNav } from '@/components/layout/TopNav'
import { Footer } from '@/components/layout/Footer'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const TREND_DATA = [
  { week: 'W1', math: 62, physics: 48 },
  { week: 'W2', math: 71, physics: 55 },
  { week: 'W3', math: 65, physics: 60 },
  { week: 'W4', math: 78, physics: 58 },
  { week: 'W5', math: 74, physics: 67 },
  { week: 'W6', math: 83, physics: 72 },
]

const ARCHETYPES = [
  { label: 'Analytical',  value: 430, color: '#6366f1' },
  { label: 'Creative',    value: 310, color: '#10b981' },
  { label: 'Practical',   value: 250, color: '#f59e0b' },
  { label: 'Theoretical', value: 198, color: '#a78bfa' },
]

const HEATMAP = [
  { subject: 'Advanced Mathematics', s1: 12, s2: 15, s3: 45, s4: 28 },
  { subject: 'Quantum Physics',      s1:  5, s2: 36, s3: 41, s4: 18 },
  { subject: 'Organic Chemistry',    s1: 10, s2: 28, s3: 38, s4: 24 },
]

const KPIS = [
  { label: 'TOTAL ACTIVE TESTS',    value: '12,450', sub: '+12.5% from last week', color: '#10b981', icon: '📋' },
  { label: 'AVG. ENGAGEMENT SCORE', value: '86.4',   sub: '+3.1% from last week',  color: '#6366f1', icon: '📊', suffix: '/100' },
  { label: 'AT-RISK STUDENTS',      value: '342',    sub: 'Requires attention',     color: '#f43f5e', icon: '⚠'  },
  { label: 'AI INTERACTIONS',       value: '1.2M',   sub: 'Across all networks',    color: '#a78bfa', icon: '🤖' },
]

function heatColor(v: number): { bg: string; color: string } {
  if (v <= 15) return { bg: 'rgba(16,185,129,0.18)',  color: '#10b981' }
  if (v <= 35) return { bg: 'rgba(245,158,11,0.18)',  color: '#f59e0b' }
  return              { bg: 'rgba(244,63,94,0.18)',   color: '#f43f5e' }
}

const totalAT = ARCHETYPES.reduce((s, a) => s + a.value, 0)

export default function AnalyticsPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNav active="analytics" />

      <main style={{ flex: 1, padding: '48px 20px' }}>
        <div style={{ width: '100%', maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
                Advanced Analytics
              </h1>
              <p style={{ color: 'var(--color-muted)', fontSize: '15px', lineHeight: 1.6, maxWidth: '560px' }}>
                Deep dive into twin behavior, performance trends, and risk distributions across all your subjects.
              </p>
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-muted)', fontSize: '13px', cursor: 'pointer', fontWeight: 500, whiteSpace: 'nowrap' }}>
              📅 Last 30 Days <span style={{ fontSize: '10px', opacity: 0.7 }}>▾</span>
            </button>
          </div>

          {/* 4 KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {KPIS.map(kpi => (
              <div key={kpi.label} className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: kpi.color, letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>{kpi.label}</div>
                  <span style={{ fontSize: '14px', opacity: 0.7 }}>{kpi.icon}</span>
                </div>
                <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                  <span style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>{kpi.value}</span>
                  {'suffix' in kpi && <span style={{ fontSize: '14px', color: 'var(--color-muted)' }}>{kpi.suffix as string}</span>}
                </div>
                <p style={{ color: kpi.color === '#f43f5e' ? '#f43f5e' : '#10b981', fontSize: '12px', lineHeight: 1.5 }}>{kpi.sub}</p>
              </div>
            ))}
          </div>

          {/* Performance Trends + Twin Archetypes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px' }}>

            <div className="glass-card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ fontWeight: 700, fontSize: '17px' }}>Performance Trends</div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--color-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '14px', height: '2px', background: '#6366f1', display: 'inline-block', borderRadius: '1px' }} /> Mathematics
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '14px', height: '2px', background: '#10b981', display: 'inline-block', borderRadius: '1px' }} /> Physics
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={TREND_DATA}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} domain={[40, 100]} />
                  <Tooltip
                    contentStyle={{ background: '#141A29', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Line type="monotone" dataKey="math"    stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="physics" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card" style={{ padding: '28px' }}>
              <div style={{ fontWeight: 700, fontSize: '17px', marginBottom: '4px' }}>Twin Archetypes</div>
              <div style={{ color: 'var(--color-muted)', fontSize: '13px', marginBottom: '24px' }}>4 Core Types</div>

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                  <svg viewBox="0 0 120 120" width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                    {(() => {
                      let offset = 0
                      const circ = 2 * Math.PI * 44
                      return ARCHETYPES.map(a => {
                        const pct = a.value / totalAT
                        const dash = pct * circ
                        const el = (
                          <circle key={a.label} cx="60" cy="60" r="44" fill="none"
                            stroke={a.color} strokeWidth="14"
                            strokeDasharray={`${dash} ${circ - dash}`}
                            strokeDashoffset={-offset}
                            opacity={0.9}
                          />
                        )
                        offset += dash + 1.5
                        return el
                      })
                    })()}
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <div style={{ fontWeight: 800, fontSize: '22px', lineHeight: 1 }}>4</div>
                    <div style={{ fontSize: '10px', color: 'var(--color-muted)' }}>Types</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {ARCHETYPES.map(a => (
                  <div key={a.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: a.color, flexShrink: 0 }} />
                      <span style={{ color: 'var(--color-muted)' }}>{a.label}</span>
                    </div>
                    <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{a.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Risk Distribution Heatmap */}
          <div>
            <h2 style={{ fontWeight: 700, fontSize: '20px', marginBottom: '16px' }}>Risk Distribution Heatmap</h2>
            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', fontSize: '11px', color: 'var(--color-muted)' }}>
                <span>Low Risk</span>
                {['#10b981', '#f59e0b', '#f43f5e'].map((c) => (
                  <span key={c} style={{ width: '20px', height: '10px', background: c, opacity: 0.5, borderRadius: '2px', display: 'inline-block' }} />
                ))}
                <span>High Risk</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 130px 120px 110px 80px', borderBottom: '1px solid var(--border-subtle)' }}>
                {['SUBJECT', 'S1 FOUNDATIONAL', 'S2 INTERMEDIATE', 'S3 ADVANCED', 'S4 EXPERT', 'ACTION'].map(h => (
                  <div key={h} style={{ padding: '12px 16px', fontSize: '10px', fontWeight: 700, color: 'var(--color-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>{h}</div>
                ))}
              </div>

              {HEATMAP.map((row, i) => (
                <div key={row.subject} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 130px 120px 110px 80px', borderBottom: i < HEATMAP.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <div style={{ padding: '16px 16px', display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: '14px' }}>{row.subject}</div>
                  {[row.s1, row.s2, row.s3, row.s4].map((v, j) => {
                    const { bg, color } = heatColor(v)
                    return (
                      <div key={j} style={{ padding: '16px 16px', display: 'flex', alignItems: 'center' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '6px', background: bg, color, fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{v}%</span>
                      </div>
                    )
                  })}
                  <div style={{ padding: '16px 16px', display: 'flex', alignItems: 'center' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-accent)', fontSize: '12px', fontWeight: 600 }}>View →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
