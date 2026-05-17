'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { TopNav } from '@/components/layout/TopNav'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase-client'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell,
} from 'recharts'

interface TopicPerf {
  topic: string
  avg: number
}

interface TopicInfo {
  id: string
  name: string
  order_index: number
}

interface CourseData {
  name: string
  subject: string
  slug: string
  topics: TopicInfo[]
  color: string
  perfData: TopicPerf[]
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[ı]/g, 'i')
    .replace(/[ğ]/g, 'g')
    .replace(/[ü]/g, 'u')
    .replace(/[ş]/g, 's')
    .replace(/[ö]/g, 'o')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9-]/g, '')
}

const SUBJECT_COLORS: Record<string, string> = {
  Matematik: '#8083ff',
  'Fen Bilimleri': '#10b981',
  Türkçe: '#f59e0b',
  'Sosyal Bilimler': '#f43f5e',
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const id = (params?.id as string) ?? 'matematik'
  const [course, setCourse] = useState<CourseData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        // Fetch subject by slug
        const { data: subjectRow } = await supabase
          .from('subjects')
          .select('id, name')
          .eq('slug', id)
          .single()

        if (!subjectRow) {
          setCourse(null)
          setLoading(false)
          return
        }

        // Fetch topics for this subject
        const { data: topicRows } = await supabase
          .from('topics')
          .select('id, name, order_index')
          .eq('subject_id', subjectRow.id)
          .order('order_index', { ascending: true })

        const topics: TopicInfo[] = (topicRows ?? []).map(t => ({ id: t.id, name: t.name, order_index: t.order_index ?? 0 }))
        const topicNames = topics.map(t => t.name)

        // Fetch aggregated accuracy per topic from results
        const { data: resultRows } = await supabase
          .from('learning_twin_results')
          .select('topic, accuracy')
          .eq('subject', subjectRow.name)

        const perfMap = new Map<string, { sum: number; count: number }>()
        for (const row of (resultRows ?? [])) {
          if (!row.topic) continue
          const existing = perfMap.get(row.topic) ?? { sum: 0, count: 0 }
          existing.sum += row.accuracy ?? 0
          existing.count += 1
          perfMap.set(row.topic, existing)
        }

        const perfData: TopicPerf[] = topicNames.map(topic => {
          const stats = perfMap.get(topic)
          return {
            topic,
            avg: stats ? Math.round(stats.sum / stats.count) : 0,
          }
        })

        setCourse({
          name: subjectRow.name,
          subject: subjectRow.name.toUpperCase(),
          slug: id,
          topics,
          color: SUBJECT_COLORS[subjectRow.name] ?? '#8083ff',
          perfData,
        })
      } catch {
        setCourse(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <TopNav active="courses" />
        <main style={{ flex: 1, padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: 'var(--color-muted)' }}>Yükleniyor...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!course) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <TopNav active="courses" />
        <main style={{ flex: 1, padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center', maxWidth: '400px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📚</div>
            <div style={{ fontWeight: 700, marginBottom: '6px' }}>Ders bulunamadı</div>
            <div style={{ color: 'var(--color-muted)', fontSize: '13px' }}>Bu ders veritabanında kayıtlı değil.</div>
            <button className="btn-primary mt-4" onClick={() => router.push('/courses')}>Derslere Dön</button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const perfData = course.perfData
  const classAvg = perfData.length ? Math.round(perfData.reduce((s, d) => s + d.avg, 0) / perfData.length) : 0
  const maxAvg = perfData.length ? Math.max(...perfData.map(d => d.avg)) : 0
  const hasPerfData = perfData.some(d => d.avg > 0)

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
              <button className="btn-ghost" onClick={() => router.push('/courses')} style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                  const perf = perfData.find(p => p.topic === topic.name)
                  const avg = perf?.avg ?? 0
                  const tSlug = slugify(topic.name)
                  return (
                    <div
                      key={topic.id}
                      onClick={() => router.push(`/courses/${course.slug}/${tSlug}`)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px 16px',
                        borderRadius: '10px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '0.5px solid rgba(255,255,255,0.06)',
                        transition: 'background 150ms ease, border-color 150ms ease',
                        cursor: 'pointer',
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
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{topic.name}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '60px', height: '4px', borderRadius: '999px', background: 'var(--surface-mid)', overflow: 'hidden' }}>
                          <div style={{ width: `${avg}%`, height: '100%', borderRadius: '999px', background: avg >= 70 ? '#10b981' : avg >= 50 ? '#f59e0b' : '#f43f5e' }} />
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--color-muted)', minWidth: '28px', textAlign: 'right' }}>
                          {avg}%
                        </span>
                        <span style={{ color: 'var(--color-accent)', fontSize: '11px', fontWeight: 600 }}>→</span>
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
                {hasPerfData ? (
                  <>
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
                  </>
                ) : (
                  <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.06)' }}>
                    <p style={{ fontSize: '12px', color: 'var(--color-muted)', lineHeight: 1.6, margin: 0 }}>
                      Henüz performans verisi yok. Öğrenciler bu dersteki konularda test çözdükçe veriler otomatik güncellenecektir.
                    </p>
                  </div>
                )}

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
              {hasPerfData && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-muted)' }}>
                  <span style={{ width: '10px', height: '2px', background: '#f59e0b', display: 'inline-block', borderRadius: '1px' }} />
                  Sinif Ort. {classAvg}%
                </div>
              )}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-muted)', marginBottom: '20px' }}>Son 4 haftalik deneme sinav ortalamalari</div>
            {hasPerfData ? (
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
            ) : (
              <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)', fontSize: '13px' }}>
                Henüz performans verisi yok
              </div>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
