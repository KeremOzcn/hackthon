'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { TopNav } from '@/components/layout/TopNav'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase-client'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell,
} from 'recharts'

interface Question {
  id: string
  question_text: string
  difficulty: string
  correct_answer: string
}

interface StudentPerf {
  student_name: string
  accuracy: number
  risk_level: string
  twin_type: string
  teacher_action: string
}

interface RoadmapStep {
  title: string
  description: string
  status: 'completed' | 'current' | 'upcoming'
}

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Kolay',
  medium: 'Orta',
  hard: 'Zor',
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: '#10b981',
  medium: '#f59e0b',
  hard: '#f43f5e',
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

const ROADMAP_DATA: Record<string, RoadmapStep[]> = {
  default: [
    { title: 'Temel Kavramlar', description: 'Konunun temel tanımları ve ilkeleri', status: 'completed' },
    { title: 'Örnek Çözümler', description: 'Adım adım çözümlü örnek sorular', status: 'current' },
    { title: 'Pratik Uygulama', description: 'Öğrenci kendi başına çözer', status: 'upcoming' },
    { title: 'Zorlayıcı Sorular', description: 'Yüksek zorluk seviyesi', status: 'upcoming' },
    { title: 'Değerlendirme', description: 'Konu sonu testi ve AI analizi', status: 'upcoming' },
  ],
}

export default function TopicDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const courseSlug = (params?.id as string) ?? 'matematik'
  const topicSlug = (params?.topicSlug as string) ?? ''

  const [subjectName, setSubjectName] = useState('')
  const [topicName, setTopicName] = useState('')
  const [topicId, setTopicId] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [studentPerf, setStudentPerf] = useState<StudentPerf[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        // Fetch subject
        const { data: subjectRow } = await supabase
          .from('subjects')
          .select('id, name')
          .eq('slug', courseSlug)
          .single()

        if (!subjectRow) {
          setLoading(false)
          return
        }
        setSubjectName(subjectRow.name)

        // Fetch topics for this subject to find matching topic
        const { data: topicRows } = await supabase
          .from('topics')
          .select('id, name')
          .eq('subject_id', subjectRow.id)

        const matchedTopic = (topicRows ?? []).find(t => slugify(t.name) === topicSlug)
        if (!matchedTopic) {
          setLoading(false)
          return
        }
        setTopicName(matchedTopic.name)
        setTopicId(matchedTopic.id)

        // Fetch questions for this topic
        const { data: questionRows } = await supabase
          .from('questions')
          .select('id, question_text, difficulty, correct_answer')
          .eq('topic_id', matchedTopic.id)
          .order('difficulty', { ascending: true })

        setQuestions(questionRows ?? [])

        // Fetch student performance for this topic
        const { data: resultRows } = await supabase
          .from('learning_twin_results')
          .select('student_name, accuracy, risk_level, twin_type, teacher_action')
          .eq('subject', subjectRow.name)
          .ilike('topic', `%${matchedTopic.name}%`)

        setStudentPerf(resultRows ?? [])
      } catch {
        // keep defaults
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [courseSlug, topicSlug])

  const roadmapSteps = ROADMAP_DATA.default
  const avgAcc = studentPerf.length
    ? Math.round(studentPerf.reduce((s, r) => s + r.accuracy, 0) / studentPerf.length)
    : 0
  const perfData = studentPerf.map(s => ({
    name: s.student_name.split(' ')[0],
    accuracy: s.accuracy,
    color: s.risk_level === 'high' ? '#f43f5e' : s.risk_level === 'medium' ? '#f59e0b' : '#10b981',
  }))

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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNav active="courses" />

      <main style={{ flex: 1, padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
            <span style={{ cursor: 'pointer', opacity: 0.6 }} onClick={() => router.push('/courses')}>DERSLER</span>
            <span style={{ opacity: 0.4 }}>/</span>
            <span style={{ cursor: 'pointer', opacity: 0.6 }} onClick={() => router.push(`/courses/${courseSlug}`)}>{subjectName.toUpperCase()}</span>
            <span style={{ opacity: 0.4 }}>/</span>
            <span style={{ color: 'var(--color-text)', textTransform: 'uppercase' }}>{topicName}</span>
          </div>

          {/* Page header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
                {topicName}
              </h1>
              <p style={{ color: 'var(--color-muted)', fontSize: '14px', lineHeight: 1.6, maxWidth: '480px' }}>
                Konu detayları, öğrenme yol haritası ve öğrenci performansı.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
              <button className="btn-ghost" onClick={() => router.push(`/courses/${courseSlug}`)} style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                ← Konulara Dön
              </button>
            </div>
          </div>

          {/* Roadmap + Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '16px' }}>

            {/* Roadmap */}
            <div className="glass-card" style={{ padding: '28px' }}>
              <div style={{ fontWeight: 700, fontSize: '17px', marginBottom: '24px' }}>Öğrenme Yol Haritası</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', position: 'relative' }}>
                {/* Vertical line */}
                <div style={{
                  position: 'absolute',
                  left: '15px',
                  top: '12px',
                  bottom: '12px',
                  width: '2px',
                  background: 'linear-gradient(to bottom, rgba(99,102,241,0.4), rgba(99,102,241,0.1))',
                  borderRadius: '1px',
                }} />

                {roadmapSteps.map((step, i) => {
                  const statusColor = step.status === 'completed' ? '#10b981' : step.status === 'current' ? '#6366f1' : 'rgba(255,255,255,0.2)'
                  const statusBg = step.status === 'completed' ? 'rgba(16,185,129,0.12)' : step.status === 'current' ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)'
                  const statusBorder = step.status === 'completed' ? '1px solid rgba(16,185,129,0.3)' : step.status === 'current' ? '1px solid rgba(99,102,241,0.3)' : '0.5px solid rgba(255,255,255,0.06)'

                  return (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                      padding: '14px 0',
                      position: 'relative',
                    }}>
                      {/* Dot */}
                      <div style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        background: statusColor,
                        border: `2px solid ${statusColor}`,
                        flexShrink: 0,
                        marginTop: '4px',
                        zIndex: 2,
                        boxShadow: step.status === 'current' ? `0 0 12px ${statusColor}` : 'none',
                      }} />

                      <div style={{
                        flex: 1,
                        padding: '12px 16px',
                        borderRadius: '10px',
                        background: statusBg,
                        border: statusBorder,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            fontFamily: 'var(--font-mono)',
                            color: statusColor,
                          }}>
                            ADIM {i + 1}
                          </span>
                          {step.status === 'completed' && (
                            <span style={{ fontSize: '11px', color: '#10b981' }}>✓ Tamamlandı</span>
                          )}
                          {step.status === 'current' && (
                            <span style={{ fontSize: '11px', color: '#6366f1' }}>● Devam Ediyor</span>
                          )}
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{step.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-muted)', lineHeight: 1.5 }}>{step.description}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ fontWeight: 700, fontSize: '17px', marginBottom: '16px' }}>Konu Özeti</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: 'var(--color-muted)' }}>Soru Sayısı</span>
                    <span style={{ fontSize: '15px', fontWeight: 700 }}>{questions.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: 'var(--color-muted)' }}>Ortalama Başarı</span>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: avgAcc >= 70 ? '#10b981' : avgAcc >= 50 ? '#f59e0b' : '#f43f5e' }}>
                      {avgAcc}%
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: 'var(--color-muted)' }}>Öğrenci Sayısı</span>
                    <span style={{ fontSize: '15px', fontWeight: 700 }}>{studentPerf.length}</span>
                  </div>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ fontWeight: 700, fontSize: '17px', marginBottom: '16px' }}>Zorluk Dağılımı</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['easy', 'medium', 'hard'].map(diff => {
                    const count = questions.filter(q => q.difficulty === diff).length
                    const pct = questions.length ? Math.round((count / questions.length) * 100) : 0
                    return (
                      <div key={diff}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                          <span style={{ color: DIFFICULTY_COLORS[diff] }}>{DIFFICULTY_LABELS[diff]}</span>
                          <span style={{ color: 'var(--color-muted)' }}>{count}</span>
                        </div>
                        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: DIFFICULTY_COLORS[diff], borderRadius: '999px' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ fontWeight: 700, fontSize: '17px', marginBottom: '20px' }}>Konu Soruları</div>
            {questions.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-muted)', fontSize: '13px' }}>
                Bu konu için henüz soru eklenmemiş.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {questions.map((q, i) => (
                  <div key={q.id} style={{
                    padding: '16px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '0.5px solid rgba(255,255,255,0.06)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        fontFamily: 'var(--font-mono)',
                        color: DIFFICULTY_COLORS[q.difficulty] ?? '#6366f1',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: `${DIFFICULTY_COLORS[q.difficulty] ?? '#6366f1'}18`,
                      }}>
                        {DIFFICULTY_LABELS[q.difficulty] ?? q.difficulty}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--color-muted)' }}>Soru {i + 1}</span>
                    </div>
                    <p style={{ fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{q.question_text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Student performance chart */}
          {studentPerf.length > 0 && (
            <div className="glass-card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ fontWeight: 700, fontSize: '17px' }}>Öğrenci Performansı</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-muted)' }}>
                  <span style={{ width: '10px', height: '2px', background: '#f59e0b', display: 'inline-block', borderRadius: '1px' }} />
                  Sınıf Ort. {avgAcc}%
                </div>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-muted)', marginBottom: '20px' }}>{topicName} konusundaki öğrenci başarıları</div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={perfData} barCategoryGap="30%">
                  <XAxis
                    dataKey="name"
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
                    formatter={(v) => [`${v}%`, 'Başarı']}
                  />
                  <ReferenceLine y={avgAcc} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.6} />
                  <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
                    {perfData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  )
}
