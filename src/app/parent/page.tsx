'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TopNav } from '@/components/layout/TopNav'
import { Footer } from '@/components/layout/Footer'
import { supabase } from '@/lib/supabase'
import { generateStudentPDF } from '@/lib/pdf'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area } from 'recharts'
import type { LearningTwinResult, TwinType, RiskLevel } from '@/types'

interface ParentData {
  student_name: string
  twin_type: string
  accuracy: number
  parent_message: string
  next_best_action: string
  risk_level: string
  created_at: string
  subject: string
  topic: string
  dominant_pattern: string
}

function toLearningTwinResult(d: ParentData): LearningTwinResult {
  return {
    twinType: d.twin_type as TwinType,
    dominantPattern: d.dominant_pattern || d.twin_type,
    cognitiveIssue: '',
    behavioralIssue: '',
    riskLevel: d.risk_level as RiskLevel,
    nextBestAction: d.next_best_action,
    studentMessage: '',
    teacherAction: '',
    parentMessage: d.parent_message,
    stats: {
      accuracy: d.accuracy,
      avgTimeSeconds: 0,
      hintsUsed: 0,
      highConfidenceWrong: 0,
    },
  }
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function getFirstName(name: string): string {
  return name.split(' ')[0]
}

export default function ParentPage() {
  const router = useRouter()
  const [allData, setAllData] = useState<ParentData[]>([])
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: rows } = await supabase
        .from('learning_twin_results')
        .select('student_name, twin_type, risk_level, accuracy, parent_message, next_best_action, subject, topic, created_at, dominant_pattern')
        .order('created_at', { ascending: false })
        .limit(50)

      const validRows = (rows as ParentData[] | null)?.filter(r => r.student_name) ?? []
      if (validRows.length > 0) {
        setAllData(validRows)
        setSelectedStudent(validRows[0].student_name)
      } else {
        setAllData([])
        setSelectedStudent(null)
      }
      setLoading(false)
    }
    load()
  }, [])

  const grouped = useMemo(() => {
    const map = new Map<string, ParentData[]>()
    for (const row of allData) {
      if (!map.has(row.student_name)) map.set(row.student_name, [])
      map.get(row.student_name)!.push(row)
    }
    for (const [, rows] of map) {
      rows.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }
    return map
  }, [allData])

  const students = Array.from(grouped.keys())
  const currentStudent = selectedStudent ?? students[0] ?? null
  const sessions = currentStudent ? (grouped.get(currentStudent) ?? []) : []
  const d = sessions[0]

  const firstName = d ? getFirstName(d.student_name) : ''
  const initials = d ? getInitials(d.student_name) : ''

  const actionItems = d
    ? d.next_best_action.split(/[.\n]/).map(s => s.trim()).filter(s => s.length > 15).slice(0, 3)
    : []

  const trendData = useMemo(() => {
    return sessions
      .slice(0, 7)
      .reverse()
      .map(s => ({
        date: new Date(s.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
        accuracy: s.accuracy,
      }))
  }, [sessions])

  const subjectStats = useMemo(() => {
    const map = new Map<string, { accuracy: number; count: number; latest: number; trend: 'up' | 'down' | 'stable' }>()
    const studentSessions = currentStudent ? (grouped.get(currentStudent) ?? []) : []
    // Group by subject
    for (const row of studentSessions) {
      if (!row.subject) continue
      if (!map.has(row.subject)) {
        map.set(row.subject, { accuracy: 0, count: 0, latest: row.accuracy, trend: 'stable' })
      }
      const current = map.get(row.subject)!
      current.accuracy += row.accuracy
      current.count += 1
    }
    const result = Array.from(map.entries()).map(([subject, stats]) => {
      const avg = Math.round(stats.accuracy / stats.count)
      return { subject, accuracy: avg, trend: avg >= 60 ? 'up' as const : 'down' as const }
    })
    return result
  }, [sessions, currentStudent, grouped, d])

  async function handleDownloadPDF() {
    if (!d) return
    const result = toLearningTwinResult(d)
    const url = await generateStudentPDF(result, d.student_name)
    const a = document.createElement('a')
    a.href = url
    a.download = `${d.student_name} - Rapor.pdf`
    a.click()
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNav active="analytics" />

      <main style={{ flex: 1, padding: '48px 20px' }}>
        <div style={{ width: '100%', maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>

          {/* Page header */}
          <div style={{ textAlign: 'center' }}>
            <button onClick={() => router.push('/')} style={{ color: 'var(--color-muted)', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              ← Geri
            </button>
            <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '10px' }}>
              Veli Bilgilendirme Raporu
            </h1>
            <p style={{ color: 'var(--color-muted)', fontSize: '15px', lineHeight: 1.6, maxWidth: '460px', margin: '0 auto' }}>
              {firstName}&apos;nin son dönem öğrenme yolculuğuna dair yapay zeka destekli özet ve öneriler.
            </p>
          </div>

          {loading ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-muted)' }}>Yükleniyor...</div>
          ) : !d ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
              <div style={{ fontWeight: 700, marginBottom: '6px' }}>Henüz veri yok</div>
              <div style={{ color: 'var(--color-muted)', fontSize: '13px' }}>Öğrenci verisi bulunamadı.</div>
            </div>
          ) : (
            <>
              {/* Child selector */}
              {students.length > 1 && (
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '12px', color: 'var(--color-muted)' }}>Çocuklarınız</div>
                  <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {students.map(name => {
                      const isActive = name === currentStudent
                      const studentSessions = grouped.get(name) ?? []
                      const latest = studentSessions[0]
                      const studentInitials = getInitials(name)
                      return (
                        <button
                          key={name}
                          onClick={() => setSelectedStudent(name)}
                          className="glass-card"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            flexShrink: 0,
                            minWidth: '180px',
                            transition: 'all 0.2s ease',
                            borderColor: isActive ? 'var(--color-accent)' : undefined,
                            background: isActive ? 'rgba(128,131,255,0.10)' : undefined,
                          }}
                        >
                          <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: isActive ? 'linear-gradient(135deg, #8083ff, #a78bfa)' : 'linear-gradient(135deg, #475569, #64748b)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '16px',
                            color: '#fff',
                            flexShrink: 0,
                          }}>
                            {studentInitials}
                          </div>
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-text)' }}>{name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>Son: %{latest?.accuracy ?? 0}</div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Student profile card */}
              <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #8083ff, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '20px', color: '#fff', flexShrink: 0 }}>
                  {initials}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '4px' }}>{d.student_name}</div>
                  <div style={{ color: 'var(--color-muted)', fontSize: '13px' }}>10. Sınıf &bull; Son 30 Günde Aktif</div>
                </div>
                <span className={`badge badge-${d.risk_level}`}>
                  {d.risk_level === 'low' ? 'Düşük Risk' : d.risk_level === 'medium' ? 'Orta Risk' : 'Yüksek Risk'}
                </span>
              </div>

              {/* Weekly accuracy trend */}
              {trendData.length > 1 && (
                <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <h2 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>Haftalık Doğruluk Trendi</h2>
                    <p style={{ color: 'var(--color-muted)', fontSize: '13px' }}>Son 7 seansın doğruluk oranı (%)</p>
                  </div>
                  <div style={{ height: '220px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="parentTrendFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgba(128,131,255,0.2)" />
                            <stop offset="100%" stopColor="rgba(128,131,255,0)" />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                          dataKey="date"
                          stroke="rgba(255,255,255,0.1)"
                          tick={{ fill: '#94a3b8', fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                          dy={10}
                        />
                        <YAxis
                          stroke="rgba(255,255,255,0.1)"
                          tick={{ fill: '#94a3b8', fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                          domain={[0, 100]}
                          tickFormatter={(val) => `${val}%`}
                        />
                        <Tooltip
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
                          itemStyle={{ fontWeight: 600, color: '#8083ff' }}
                          labelStyle={{ color: '#94a3b8' }}
                        />
                        <Area type="monotone" dataKey="accuracy" stroke="none" fill="url(#parentTrendFill)" />
                        <Line
                          type="monotone"
                          dataKey="accuracy"
                          stroke="#8083ff"
                          strokeWidth={3}
                          dot={{ fill: '#0c1324', stroke: '#8083ff', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, fill: '#8083ff', stroke: '#fff' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Genel Performans */}
              <div>
                <h2 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '14px' }}>Genel Performans</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                  {subjectStats.map((stat) => (
                    <div key={stat.subject} className="glass-card" style={{ padding: '20px', borderTop: `2px solid ${stat.trend === 'up' ? '#10b981' : '#f59e0b'}` }}>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: stat.trend === 'up' ? '#10b981' : '#f59e0b', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', marginBottom: '12px', textTransform: 'uppercase' }}>
                        {stat.subject}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '22px', marginBottom: '8px', fontFamily: 'var(--font-hanken)' }}>
                        %{stat.accuracy}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: '4px', borderRadius: '999px', background: 'var(--surface-mid)', overflow: 'hidden' }}>
                          <div style={{ width: `${stat.accuracy}%`, height: '100%', borderRadius: '999px', background: stat.trend === 'up' ? '#10b981' : '#f59e0b', transition: 'width var(--duration-normal) cubic-bezier(0.4, 0, 0.2, 1)' }} />
                        </div>
                        <span style={{ fontSize: '12px', color: stat.trend === 'up' ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                          {stat.trend === 'up' ? 'Yukari' : 'Dikkat'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Öneriler */}
              <div className="glass-card" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '17px', marginBottom: '4px' }}>Ne Yapılmali? (Yapay Zeka Onerisi)</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>Kisisellestirilmis aksiyon plani</div>
                  </div>
                  <span style={{ fontSize: '22px', color: 'var(--color-accent)' }}>AI</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                  {(actionItems.length > 0 ? actionItems : [d.next_best_action]).map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(128,131,255,0.12)', border: '1px solid rgba(128,131,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--color-accent)', flexShrink: 0 }}>
                        {i + 1}
                      </div>
                      <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--color-muted)', margin: 0 }}>{item}</p>
                    </div>
                  ))}
                </div>

                <button onClick={handleDownloadPDF} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Detayli Raporu Incele
                </button>
              </div>

              <p style={{ textAlign: 'center', color: 'var(--color-muted)', fontSize: '12px', lineHeight: 1.7 }}>
                Bu rapor <strong style={{ color: 'var(--color-text)' }}>İşler LearnTwin AI</strong> tarafindan {d.student_name}&apos;nin soru cozum davranisindan otomatik olusturulmustur.
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
