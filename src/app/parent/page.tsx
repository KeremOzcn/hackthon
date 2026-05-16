'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TopNav } from '@/components/layout/TopNav'
import { Footer } from '@/components/layout/Footer'
import { supabase } from '@/lib/supabase'
import { generateStudentPDF } from '@/lib/pdf'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { LearningTwinResult, TwinType, RiskLevel } from '@/types'

interface ParentData {
  student_name: string
  twin_type: string
  accuracy: number
  parent_message: string
  next_best_action: string
  risk_level: string
  created_at: string
}

const MOCK_DATA: ParentData = {
  student_name: 'Ali Yılmaz',
  twin_type: 'Konuyu Biliyor ama Modelleyemiyor',
  accuracy: 40,
  parent_message: 'Ali düzenli çalışıyor ancak uzun problem sorularında ilk adımı kurmakta zorlanıyor. Daha fazla soru çözmek yerine kısa soru anlama egzersizleri daha etkili olacaktır.',
  next_best_action: 'Fizik temel tekrar: Sisteme Ali\'ye özel olarak atanan "Dinamik Temelleri" mini kursunu bu hafta sonu tamamlamasını sağlayın. Zaman yönetimi: Deneme sınavlarında süre yetiştirme konusunda pratik yapması için sisteme eklenen zamanlı testleri kullanmasını hatırlatın. Motivasyon: Matematik dersindeki başarısını takdir ederek bu motivasyonu diğer derslere aktarmasına yardımcı olun.',
  risk_level: 'medium',
  created_at: new Date().toISOString(),
}

function toLearningTwinResult(d: ParentData): LearningTwinResult {
  return {
    twinType: d.twin_type as TwinType,
    dominantPattern: d.twin_type,
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
        .select('student_name,twin_type,accuracy,parent_message,next_best_action,risk_level,created_at')
        .order('created_at', { ascending: false })
        .limit(50)

      const validRows = (rows as ParentData[] | null)?.filter(r => r.student_name) ?? []
      if (validRows.length > 0) {
        setAllData(validRows)
        setSelectedStudent(validRows[0].student_name)
      } else {
        setAllData([MOCK_DATA])
        setSelectedStudent(MOCK_DATA.student_name)
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
  const d = sessions[0] ?? MOCK_DATA

  const firstName = getFirstName(d.student_name)
  const initials = getInitials(d.student_name)

  const actionItems = d.next_best_action
    .split(/[.\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 15)
    .slice(0, 3)

  const trendData = useMemo(() => {
    return sessions
      .slice(0, 7)
      .reverse()
      .map(s => ({
        date: new Date(s.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
        accuracy: s.accuracy,
      }))
  }, [sessions])

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
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            border: isActive ? '1px solid var(--color-accent)' : '1px solid var(--border-subtle)',
                            background: isActive ? 'rgba(128,131,255,0.10)' : 'rgba(255,255,255,0.03)',
                            cursor: 'pointer',
                            flexShrink: 0,
                            minWidth: '180px',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: isActive ? 'linear-gradient(135deg, #6366f1, #a78bfa)' : 'linear-gradient(135deg, #475569, #64748b)',
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

              {/* PDF Download */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleDownloadPDF}
                  className="btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>📄</span>
                  PDF Raporu Al
                </button>
              </div>

              {/* Student profile card */}
              <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '20px', color: '#fff', flexShrink: 0 }}>
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
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                        <XAxis
                          dataKey="date"
                          stroke="var(--color-muted)"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          dy={10}
                        />
                        <YAxis
                          stroke="var(--color-muted)"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          domain={[0, 100]}
                          tickFormatter={(val) => `${val}%`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'var(--bg-secondary)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '8px',
                            color: 'var(--color-text)',
                          }}
                          itemStyle={{ fontWeight: 600, color: 'var(--color-accent)' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="accuracy"
                          stroke="#6366f1"
                          strokeWidth={3}
                          dot={{ fill: '#0b1120', stroke: '#6366f1', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Genel Performans */}
              <div>
                <h2 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '14px' }}>Genel Performans</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="glass-card" style={{ padding: '20px', borderTop: '2px solid #10b981' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#10b981', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', marginBottom: '12px' }}>GÜÇLÜ ALAN</div>
                    <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '8px' }}>Doğruluk: %{d.accuracy}</div>
                    <p style={{ color: 'var(--color-muted)', fontSize: '13px', lineHeight: 1.6, marginBottom: '12px' }}>
                      Son testlerde %{d.accuracy} başarı oranı ile sınıf ortalamasında performans gösteriyor. Pratik yapması çok iyi.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '16px' }}>📈</span>
                      <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>Devam etmesini sağlayın</span>
                    </div>
                  </div>
                  <div className="glass-card" style={{ padding: '20px', borderTop: '2px solid #f59e0b' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#f59e0b', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', marginBottom: '12px' }}>ODAK GEREKEN</div>
                    <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '8px' }}>{d.twin_type}</div>
                    <p style={{ color: 'var(--color-muted)', fontSize: '13px', lineHeight: 1.6, marginBottom: '12px' }}>
                      Temel kavramlarda eksikler gözlemleniyor. Test tamamlama süresi beklenenden uzun sürüyor.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '16px' }}>⚠️</span>
                      <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 600 }}>Dikkat gerektiriyor</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Öneriler */}
              <div className="glass-card" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '17px', marginBottom: '4px' }}>Ne Yapılmalı? (Yapay Zeka Önerisi)</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>Kişiselleştirilmiş aksiyon planı</div>
                  </div>
                  <span style={{ fontSize: '22px' }}>🤖</span>
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

                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Detaylı Raporu İncele →
                </button>
              </div>

              <p style={{ textAlign: 'center', color: 'var(--color-muted)', fontSize: '12px', lineHeight: 1.7 }}>
                Bu rapor <strong style={{ color: 'var(--color-text)' }}>İşler LearnTwin AI</strong> tarafından {d.student_name}&apos;nin soru çözüm davranışından otomatik oluşturulmuştur.
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
