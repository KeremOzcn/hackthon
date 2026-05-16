'use client'

import { useParams, useRouter } from 'next/navigation'
import { TopNav } from '@/components/layout/TopNav'
import { Footer } from '@/components/layout/Footer'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell,
} from 'recharts'

const COURSE_META: Record<string, { name: string; subject: string; topics: string[]; color: string }> = {
  matematik: {
    name: 'Matematik',
    subject: 'İLERİ MATEMATİK',
    topics: ['Turev', 'Integral', 'Trigonometri', 'Logaritma', 'Diziler', 'Limitler', 'Olasilik'],
    color: '#8083ff',
  },
  'fen-bilimleri': {
    name: 'Fen Bilimleri',
    subject: 'FEN BİLİMLERİ',
    topics: ['Fizik', 'Kimya', 'Biyoloji', 'Astronomi', 'Jeoloji'],
    color: '#10b981',
  },
  turkce: {
    name: 'Turkce',
    subject: 'TÜRKÇE',
    topics: ['Dil Bilgisi', 'Paragraf', 'Siir', 'Anlatim Bozuklugu', 'Yazi Turleri'],
    color: '#f59e0b',
  },
}

const PERF_DATA: Record<string, { topic: string; avg: number }[]> = {
  matematik: [
    { topic: 'Turev', avg: 54 },
    { topic: 'Integral', avg: 48 },
    { topic: 'Trigonometri', avg: 83 },
    { topic: 'Logaritma', avg: 61 },
    { topic: 'Diziler', avg: 44 },
    { topic: 'Limitler', avg: 52 },
    { topic: 'Olasilik', avg: 58 },
  ],
  'fen-bilimleri': [
    { topic: 'Fizik', avg: 62 },
    { topic: 'Kimya', avg: 55 },
    { topic: 'Biyoloji', avg: 71 },
    { topic: 'Astronomi', avg: 45 },
    { topic: 'Jeoloji', avg: 50 },
  ],
  turkce: [
    { topic: 'Dil Bilgisi', avg: 68 },
    { topic: 'Paragraf', avg: 72 },
    { topic: 'Siir', avg: 55 },
    { topic: 'Anlatim Bozuklugu', avg: 60 },
    { topic: 'Yazi Turleri', avg: 48 },
  ],
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = (params?.id as string) ?? 'matematik'
  const course = COURSE_META[id] ?? COURSE_META['matematik']
  const perfData = PERF_DATA[id] ?? PERF_DATA['matematik']
  const classAvg = Math.round(perfData.reduce((s, d) => s + d.avg, 0) / perfData.length)
  const maxAvg = Math.max(...perfData.map(d => d.avg))

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNav active="courses" />

      <main style={{ flex: 1, padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
            <span style={{ cursor: 'pointer', opacity: 0.6 }} onClick={() => router.push('/courses')}>DERSLER</span>
            <span style={{ opacity: 0.4 }}>/</span>
            <span style={{ color: 'var(--color-text)', textTransform: 'uppercase' }}>{course.subject}</span>
          </div>

          {/* Page header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
                {course.name}
              </h1>
              <p style={{ color: 'var(--color-muted)', fontSize: '14px', lineHeight: 1.6, maxWidth: '480px' }}>
                Ders icerigi ve ogrenci performans ozetleri.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
              <button className="btn-ghost" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                ← Derslere Don
              </button>
            </div>
          </div>

          {/* Konu listesi + Performans chart */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '16px' }}>

            {/* Konu listesi */}
            <div className="glass-card" style={{ padding: '28px' }}>
              <div style={{ fontWeight: 700, fontSize: '17px', marginBottom: '20px' }}>Konu Listesi</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {course.topics.map((topic, i) => {
                  const perf = perfData.find(p => p.topic === topic)
                  const avg = perf?.avg ?? 0
                  return (
                    <div
                      key={topic}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px 16px',
                        borderRadius: '10px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '0.5px solid rgba(255,255,255,0.06)',
                        transition: 'background 150ms ease, border-color 150ms ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                      }}
                    >
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: `${course.color}18`,
                        border: `1px solid ${course.color}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: course.color,
                        flexShrink: 0,
                      }}>
                        {i + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{topic}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '60px', height: '4px', borderRadius: '999px', background: 'var(--surface-mid)', overflow: 'hidden' }}>
                          <div style={{ width: `${avg}%`, height: '100%', borderRadius: '999px', background: avg >= 70 ? '#10b981' : avg >= 50 ? '#f59e0b' : '#f43f5e' }} />
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--color-muted)', minWidth: '28px', textAlign: 'right' }}>
                          {avg}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* AI Analysis */}
            <div className="glass-card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <span style={{ fontSize: '14px', color: 'var(--color-accent)', fontWeight: 700 }}>AI</span>
                <div style={{ fontWeight: 700, fontSize: '17px' }}>Performans Ozeti</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: '#10b981', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', padding: '3px 8px', borderRadius: '4px', background: 'rgba(16,185,129,0.12)' }}>
                      GÜÇLÜ ALAN
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--color-muted)', lineHeight: 1.6, margin: 0 }}>
                    Sinifin en yuksek performans gosterdigi konu: <strong style={{ color: 'var(--color-text)' }}>{perfData.reduce((a, b) => a.avg > b.avg ? a : b).topic}</strong> (%{maxAvg})
                  </p>
                </div>

                <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: '#f59e0b', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', padding: '3px 8px', borderRadius: '4px', background: 'rgba(245,158,11,0.12)' }}>
                      ODAKLANILMASI GEREKEN
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--color-muted)', lineHeight: 1.6, margin: 0 }}>
                    Sinif ortalamasinin altinda kalan konu: <strong style={{ color: 'var(--color-text)' }}>{perfData.reduce((a, b) => a.avg < b.avg ? a : b).topic}</strong> (%{perfData.reduce((a, b) => a.avg < b.avg ? a : b).avg}) ek calisma gerektiriyor.
                  </p>
                </div>

                <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: '#8083ff', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', padding: '3px 8px', borderRadius: '4px', background: 'rgba(128,131,255,0.12)' }}>
                      ÖNERİ
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--color-muted)', lineHeight: 1.6, margin: 0 }}>
                    Dusuk performansli konularda mini testler ve tekrar videolari atanmasi tavsiye edilir.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance chart */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ fontWeight: 700, fontSize: '17px' }}>Konu Performans Dagilimi</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-muted)' }}>
                <span style={{ width: '10px', height: '2px', background: '#f59e0b', display: 'inline-block', borderRadius: '1px' }} />
                Sinif Ort. {classAvg}%
              </div>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-muted)', marginBottom: '20px' }}>Son 4 haftalik deneme sinav ortalamalari</div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={perfData} barCategoryGap="30%">
                <XAxis
                  dataKey="topic"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                />
                <YAxis hide domain={[0, 100]} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                  contentStyle={{
                    background: 'rgba(12,19,36,0.9)',
                    border: '0.5px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    color: '#dce1fb',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3), 0 10px 15px rgba(0,0,0,0.2)',
                  }}
                  labelStyle={{ color: '#94a3b8' }}
                  itemStyle={{ color: '#dce1fb' }}
                  formatter={(v) => [`${v}%`, 'Ortalama']}
                />
                <ReferenceLine y={classAvg} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.6} />
                <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                  {perfData.map((entry) => (
                    <Cell
                      key={entry.topic}
                      fill={entry.avg === maxAvg ? course.color : 'rgba(255,255,255,0.08)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
