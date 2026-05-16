'use client'

import { useParams, useRouter } from 'next/navigation'
import { TopNav } from '@/components/layout/TopNav'
import { Footer } from '@/components/layout/Footer'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell,
} from 'recharts'

const CLASS_META: Record<string, { name: string; subject: string; students: number; color: string }> = {
  '1': { name: '12-A Matematik', subject: 'ADVANCED MATHEMATICS', students: 28, color: '#6366f1' },
  '2': { name: '11-B Matematik',  subject: 'CALCULUS I',           students: 32, color: '#10b981' },
  '3': { name: '10-C Tarih',      subject: 'WORLD HISTORY',        students: 24, color: '#f59e0b' },
}

const PERF_DATA = [
  { topic: 'Türev',     avg: 54 },
  { topic: 'İntegral',  avg: 48 },
  { topic: 'Trigon',    avg: 83 },
  { topic: 'Logaritma', avg: 61 },
  { topic: 'Diziler',   avg: 44 },
  { topic: 'Limitler',  avg: 52 },
  { topic: 'Olasılık',  avg: 58 },
]
const CLASS_AVG = Math.round(PERF_DATA.reduce((s, d) => s + d.avg, 0) / PERF_DATA.length)

const AI_INSIGHTS = [
  {
    tag: 'MASTER BECERİ',
    tagColor: '#6366f1',
    icon: '🏆',
    text: "Sınıfın %45'i 'Belirli İntegral'de Alana Hesap' konusunda yapısal hata paternleri gösteriyor.",
  },
  {
    tag: 'GÜÇLÜ YÖN',
    tagColor: '#10b981',
    icon: '💡',
    text: "'Trigonometrik Denklemler' işlem hızı sınıf genelinde hedeflenen sürenin %15 altında.",
  },
  {
    tag: 'ÖNERİ',
    tagColor: '#f59e0b',
    icon: '🎯',
    text: 'İntegral konusundaki eksiği kapatmak için seviye 2 mini-test alınması tavsiye edilir.',
  },
]

type TwinBadge = { label: string; color: string }

interface Student {
  id: string
  num: number
  initials: string
  name: string
  twin: TwinBadge
  score: number
  lastActive: string
}

const STUDENTS: Student[] = [
  { id: 'a', num: 44, initials: 'AY', name: 'Ahmet Yılmaz',  twin: { label: 'GÜÇLÜ İNTEGRAL',    color: '#10b981' }, score: 92, lastActive: '2 saat önce' },
  { id: 'b', num: 28, initials: 'ZK', name: 'Zeynep Kaya',   twin: { label: 'KONUYU KAVRAYAMAYAN', color: '#f43f5e' }, score: 54, lastActive: '1 gün önce'  },
  { id: 'c', num: 38, initials: 'CD', name: 'Can Demir',     twin: { label: 'DETAYLI',             color: '#a78bfa' }, score: 76, lastActive: '5 saat önce' },
]

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ width: '80px', height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: '3px', transition: 'width 600ms ease' }} />
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>{value}</span>
    </div>
  )
}

export default function ClassDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = (params?.id as string) ?? '1'
  const cls = CLASS_META[id] ?? CLASS_META['1']
  const maxAvg = Math.max(...PERF_DATA.map(d => d.avg))

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNav active="courses" />

      <main style={{ flex: 1, padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
            <span style={{ cursor: 'pointer', opacity: 0.6 }} onClick={() => router.push('/teacher')}>LER</span>
            <span style={{ opacity: 0.4 }}>•</span>
            <span style={{ cursor: 'pointer', opacity: 0.6 }} onClick={() => router.push('/courses')}>SINIF</span>
            <span style={{ opacity: 0.4 }}>•</span>
            <span style={{ color: 'var(--color-text)' }}>{cls.students} ÖĞRENCİ</span>
          </div>

          {/* Page header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
                {cls.name}
              </h1>
              <p style={{ color: 'var(--color-muted)', fontSize: '14px', lineHeight: 1.6, maxWidth: '480px' }}>
                Detaylı sınıf performansı ve yapay zeka destekli bilişsel öğrenme kalıpları analizi.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
              <button className="btn-outline" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                ↓ Raporu İndir
              </button>
              <button className="btn-primary" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                + Toplu Görev Ata
              </button>
            </div>
          </div>

          {/* Performance + AI Analysis */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px' }}>

            {/* Performance chart */}
            <div className="glass-card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ fontWeight: 700, fontSize: '17px' }}>Performans Dağılımı</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-muted)' }}>
                  <span style={{ width: '10px', height: '2px', background: '#f59e0b', display: 'inline-block', borderRadius: '1px' }} />
                  Sınıf Ort. {CLASS_AVG}%
                </div>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-muted)', marginBottom: '20px' }}>Son 4 haftalık deneme sınav ortalamaları</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={PERF_DATA} barCategoryGap="30%">
                  <XAxis dataKey="topic" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                    contentStyle={{ background: '#141A29', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
                    itemStyle={{ color: '#e2e8f0' }}
                    formatter={(v) => [`${v}%`, 'Ortalama']}
                  />
                  <ReferenceLine y={CLASS_AVG} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.6} />
                  <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                    {PERF_DATA.map((entry) => (
                      <Cell
                        key={entry.topic}
                        fill={entry.avg === maxAvg ? cls.color : 'rgba(255,255,255,0.08)'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* AI Analysis */}
            <div className="glass-card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <span style={{ fontSize: '18px' }}>✦</span>
                <div style={{ fontWeight: 700, fontSize: '17px' }}>Yapay Zeka Analizi</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {AI_INSIGHTS.map((ins) => (
                  <div key={ins.tag} style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '9px', fontWeight: 700, color: ins.tagColor, letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', padding: '3px 8px', borderRadius: '4px', background: `${ins.tagColor}18` }}>
                        {ins.tag}
                      </span>
                      <span style={{ fontSize: '14px', opacity: 0.7 }}>{ins.icon}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--color-muted)', lineHeight: 1.6, margin: 0 }}>{ins.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Student List */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontWeight: 700, fontSize: '20px', marginBottom: '4px' }}>Öğrenci Listesi</h2>
                <p style={{ color: 'var(--color-muted)', fontSize: '13px' }}>Sınıftaki öğrencilerin bilişsel analizleri ve durumları.</p>
              </div>
              <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-muted)', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}>
                Tüm Öğrenciler <span style={{ fontSize: '10px', opacity: 0.7 }}>▾</span>
              </button>
            </div>

            <div className="glass-card" style={{ overflow: 'hidden' }}>
              {/* Table header */}
              <div style={{ display: 'grid', gridTemplateColumns: '32px 48px 1fr 200px 140px 120px', borderBottom: '1px solid var(--border-subtle)', padding: '0 4px' }}>
                <div style={{ padding: '12px 8px', display: 'flex', alignItems: 'center' }}>
                  <input type="checkbox" style={{ accentColor: cls.color, cursor: 'pointer' }} readOnly />
                </div>
                <div />
                {['ÖĞRENCİ ADI', 'İKİZİ', 'EN YAKIN KONUSU', 'SON ETKİNLİK'].map(h => (
                  <div key={h} style={{ padding: '12px 16px', fontSize: '10px', fontWeight: 700, color: 'var(--color-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>{h}</div>
                ))}
              </div>

              {STUDENTS.map((s, i) => (
                <div
                  key={s.id}
                  style={{
                    display: 'grid', gridTemplateColumns: '32px 48px 1fr 200px 140px 120px',
                    borderBottom: i < STUDENTS.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    transition: 'background 150ms ease', padding: '0 4px',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ padding: '16px 8px', display: 'flex', alignItems: 'center' }}>
                    <input type="checkbox" style={{ accentColor: cls.color, cursor: 'pointer' }} readOnly />
                  </div>
                  <div style={{ padding: '16px 4px', display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `${cls.color}18`, border: `1px solid ${cls.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: cls.color }}>
                      {s.initials}
                    </div>
                  </div>
                  <div style={{ padding: '16px 16px', display: 'flex', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{s.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>#{s.num}</div>
                    </div>
                  </div>
                  <div style={{ padding: '16px 16px', display: 'flex', alignItems: 'center' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 700,
                      fontFamily: 'var(--font-mono)', letterSpacing: '0.04em',
                      background: `${s.twin.color}18`, color: s.twin.color,
                    }}>
                      {s.twin.label}
                    </span>
                  </div>
                  <div style={{ padding: '16px 16px', display: 'flex', alignItems: 'center' }}>
                    <ScoreBar value={s.score} color={s.score >= 70 ? '#10b981' : s.score >= 50 ? '#f59e0b' : '#f43f5e'} />
                  </div>
                  <div style={{ padding: '16px 16px', display: 'flex', alignItems: 'center', fontSize: '12px', color: 'var(--color-muted)' }}>
                    {s.lastActive}
                  </div>
                </div>
              ))}

              <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--color-muted)' }}>1-3 / 32 Gösteriliyor</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['←', '→'].map(arrow => (
                    <button key={arrow} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>{arrow}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
