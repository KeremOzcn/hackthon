'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TopNav } from '@/components/layout/TopNav'
import { Footer } from '@/components/layout/Footer'
import { supabase } from '@/lib/supabase'

interface SessionRow {
  id: string
  student_name: string
  twin_type: string
  risk_level: string
  accuracy: number
  dominant_pattern: string
  teacher_action: string
  created_at: string
  subject: string
}

const RISK_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 }

const MOCK_SESSIONS: SessionRow[] = [
  { id: '1', student_name: 'Ahmet Yılmaz', twin_type: 'Konuyu Biliyor ama Modelleyemiyor', risk_level: 'high', accuracy: 42, dominant_pattern: 'Problem metnini denkleme çevirmede güçlük', teacher_action: 'Değişken seçimi egzersizi yaptırın ve "Belirli İntegral Hesabı" konusundaki dersleri tekrar edin.', created_at: new Date().toISOString(), subject: 'Matematik' },
  { id: '2', student_name: 'Elif Kaya', twin_type: 'Hızlı ama Dikkatsiz', risk_level: 'medium', accuracy: 68, dominant_pattern: 'Hızlı yanıt, kolay sorularda dikkat hatası', teacher_action: 'Cevap öncesi kontrol rutini önerin.', created_at: new Date().toISOString(), subject: 'Fen Bilimleri' },
  { id: '3', student_name: 'Can Demir', twin_type: 'İpucu Bağımlısı', risk_level: 'high', accuracy: 80, dominant_pattern: 'Yüksek ipucu kullanımı, bağımsız çözüm güçlüğü', teacher_action: 'Küçük yönlendirmeli pratik yapın.', created_at: new Date().toISOString(), subject: 'Matematik' },
  { id: '4', student_name: 'Ayşe Türk', twin_type: 'Yavaş ama Sağlam', risk_level: 'low', accuracy: 100, dominant_pattern: 'Yüksek doğruluk, uzun çözüm süresi', teacher_action: 'Süre kontrollü pratik önerin.', created_at: new Date().toISOString(), subject: 'Türkçe' },
  { id: '5', student_name: 'Mert Şahin', twin_type: 'Sınav Panikçisi', risk_level: 'medium', accuracy: 60, dominant_pattern: 'Baskı altında doğruluk düşüyor', teacher_action: 'Mikro sınav simülasyonu uygulayın.', created_at: new Date().toISOString(), subject: 'Matematik' },
]

type RiskFilter = 'all' | 'low' | 'medium' | 'high'
type SubjectFilter = 'all' | 'Matematik' | 'Fen Bilimleri' | 'Türkçe'
type SortBy = 'risk' | 'date' | 'accuracy'

const RISK_LABELS: Record<RiskFilter, string> = {
  all: 'Tümü',
  low: 'Düşük',
  medium: 'Orta',
  high: 'Yüksek',
}

const SUBJECT_LABELS: Record<SubjectFilter, string> = {
  all: 'Tüm Dersler',
  Matematik: 'Matematik',
  'Fen Bilimleri': 'Fen Bilimleri',
  Türkçe: 'Türkçe',
}

const SORT_LABELS: Record<SortBy, string> = {
  risk: 'Riske Göre',
  date: 'Tarihe Göre',
  accuracy: 'Başarıya Göre',
}

export default function TeacherPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<SessionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('all')
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>('all')
  const [sortBy, setSortBy] = useState<SortBy>('risk')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('learning_twin_results')
        .select('id,student_name,twin_type,risk_level,accuracy,dominant_pattern,teacher_action,created_at,subject')
        .order('created_at', { ascending: false })
        .limit(50)

      if (data && data.length > 0) {
        setSessions([...data].sort((a, b) => (RISK_ORDER[a.risk_level] ?? 3) - (RISK_ORDER[b.risk_level] ?? 3)))
      } else {
        setSessions(MOCK_SESSIONS)
      }
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('teacher-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'learning_twin_results' },
        (payload) => {
          const newRow = payload.new as SessionRow
          setSessions(prev => {
            if (prev.find(s => s.id === newRow.id)) return prev
            const next = [newRow, ...prev]
            return next.sort((a, b) => (RISK_ORDER[a.risk_level] ?? 3) - (RISK_ORDER[b.risk_level] ?? 3))
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const highRisk = sessions.filter(s => s.risk_level === 'high').length
  const avgAcc = sessions.length ? Math.round(sessions.reduce((s, r) => s + r.accuracy, 0) / sessions.length) : 84
  const pendingTasks = sessions.filter(s => s.risk_level !== 'low').length
  const attentionRequired = sessions.filter(s => s.risk_level === 'high' || s.risk_level === 'medium')

  const filteredSessions = sessions.filter(s => {
    if (riskFilter !== 'all' && s.risk_level !== riskFilter) return false
    if (subjectFilter !== 'all' && s.subject !== subjectFilter) return false
    return true
  })

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    if (sortBy === 'risk') {
      return (RISK_ORDER[a.risk_level] ?? 3) - (RISK_ORDER[b.risk_level] ?? 3)
    }
    if (sortBy === 'date') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
    if (sortBy === 'accuracy') {
      return b.accuracy - a.accuracy
    }
    return 0
  })

  const allFilteredSelected = sortedSessions.length > 0 && sortedSessions.every(s => selectedIds.has(s.id))

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    if (allFilteredSelected) {
      setSelectedIds(prev => {
        const next = new Set(prev)
        sortedSessions.forEach(s => next.delete(s.id))
        return next
      })
    } else {
      setSelectedIds(prev => {
        const next = new Set(prev)
        sortedSessions.forEach(s => next.add(s.id))
        return next
      })
    }
  }

  function getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  }

  const selectedCount = selectedIds.size

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNav active="dashboard" />

      <main style={{ flex: 1, padding: '48px 20px' }}>
        <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* Page header */}
          <div>
            <button onClick={() => router.push('/')} style={{ color: 'var(--color-muted)', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 }}>
              ← Geri
            </button>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '10px' }}>
              Cohort Overview
            </h1>
            <p style={{ color: 'var(--color-muted)', fontSize: '15px', lineHeight: 1.6, maxWidth: '520px' }}>
              Monitor class performance, identify at-risk students, and deploy AI-suggested interventions.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            <button
              onClick={() => router.push('/teacher/analytics')}
              className="btn-primary"
              style={{ fontSize: '13px', padding: '8px 16px', borderRadius: '8px' }}
            >
              📊 Analitik Paneli →
            </button>
            <div style={{ fontSize: '13px', color: 'var(--color-muted)' }}>{sessions.length} öğrenci analizi</div>
          </div>

          {/* 3 KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { label: 'ACTION REQUIRED', icon: '⚠', value: highRisk, valueColor: '#f43f5e', desc: 'Students flagged as at-risk based on recent assessment data and engagement metrics.' },
              { label: 'COHORT ENGAGEMENT', icon: '📊', value: `${avgAcc}%`, valueColor: '#10b981', desc: 'Average active participation rate across all current modules. +2% from last week.' },
              { label: 'PENDING TASKS', icon: '📋', value: pendingTasks, valueColor: '#f59e0b', desc: 'AI-generated interventions waiting for your manual review and approval.' },
            ].map(kpi => (
              <div key={kpi.label} className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: kpi.valueColor, letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>{kpi.label}</div>
                  <span style={{ fontSize: '14px', opacity: 0.7 }}>{kpi.icon}</span>
                </div>
                <div style={{ fontSize: '44px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '14px' }}>
                  {kpi.value}
                </div>
                <p style={{ color: 'var(--color-muted)', fontSize: '12px', lineHeight: 1.6 }}>{kpi.desc}</p>
              </div>
            ))}
          </div>

          {/* Filters & Sort */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {(Object.keys(RISK_LABELS) as RiskFilter[]).map(key => (
                <button
                  key={key}
                  onClick={() => setRiskFilter(key)}
                  className={riskFilter === key ? 'glass-card' : ''}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid var(--border-subtle)',
                    background: riskFilter === key ? 'rgba(99,102,241,0.12)' : 'transparent',
                    color: riskFilter === key ? '#a5b4fc' : 'var(--color-muted)',
                  }}
                >
                  {RISK_LABELS[key]}
                </button>
              ))}
            </div>
            <div style={{ width: '1px', height: '20px', background: 'var(--border-subtle)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {(Object.keys(SUBJECT_LABELS) as SubjectFilter[]).map(key => (
                <button
                  key={key}
                  onClick={() => setSubjectFilter(key)}
                  className={subjectFilter === key ? 'glass-card' : ''}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid var(--border-subtle)',
                    background: subjectFilter === key ? 'rgba(99,102,241,0.12)' : 'transparent',
                    color: subjectFilter === key ? '#a5b4fc' : 'var(--color-muted)',
                  }}
                >
                  {SUBJECT_LABELS[key]}
                </button>
              ))}
            </div>
            <div style={{ width: '1px', height: '20px', background: 'var(--border-subtle)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {(Object.keys(SORT_LABELS) as SortBy[]).map(key => (
                <button
                  key={key}
                  onClick={() => setSortBy(key)}
                  className={sortBy === key ? 'glass-card' : ''}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid var(--border-subtle)',
                    background: sortBy === key ? 'rgba(99,102,241,0.12)' : 'transparent',
                    color: sortBy === key ? '#a5b4fc' : 'var(--color-muted)',
                  }}
                >
                  {SORT_LABELS[key]}
                </button>
              ))}
            </div>
          </div>

          {/* Attention Required */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontWeight: 700, fontSize: '20px' }}>Attention Required</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-accent)', fontSize: '13px', fontWeight: 600 }}>
                VIEW ALL →
              </button>
            </div>

            {loading ? (
              <div className="glass-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-muted)' }}>Yükleniyor...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {attentionRequired.map(s => {
                  const riskColor = s.risk_level === 'high' ? '#f43f5e' : '#f59e0b'
                  return (
                    <div key={s.id} className="glass-card" style={{ borderLeft: `3px solid ${riskColor}`, overflow: 'hidden' }}>
                      <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `${riskColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', flexShrink: 0, color: riskColor }}>
                          {getInitials(s.student_name)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '15px' }}>{s.student_name}</div>
                          <div style={{ color: 'var(--color-muted)', fontSize: '12px', marginTop: '2px' }}>{s.twin_type}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div>
                            <div style={{ fontSize: '10px', color: 'var(--color-muted)', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>Performance</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '72px', height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                                <div style={{ width: `${s.accuracy}%`, height: '100%', background: riskColor, borderRadius: '999px' }} />
                              </div>
                              <span style={{ fontSize: '13px', fontWeight: 700 }}>{s.accuracy}%</span>
                            </div>
                          </div>
                          <span className={`badge badge-${s.risk_level}`}>
                            {s.risk_level === 'high' ? 'HIGH RISK' : 'MED RISK'}
                          </span>
                        </div>
                      </div>

                      <div style={{ margin: '0 24px 20px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '10px', padding: '16px' }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: '#a5b4fc', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                          🤖 AI INTERVENTION SUGGESTION
                        </div>
                        <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'var(--color-muted)', marginBottom: '14px' }}>
                          {s.student_name} için öneri: {s.teacher_action}
                        </p>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <button className="btn-primary" style={{ fontSize: '12px', padding: '8px 16px' }}>
                            APPROVE &amp; ASSIGN
                          </button>
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', fontSize: '12px', fontWeight: 600 }}>
                            EDIT SUGGESTION
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* All students */}
          <div>
            <h2 style={{ fontWeight: 700, fontSize: '20px', marginBottom: '16px' }}>Tüm Öğrenciler</h2>
            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 180px 90px 120px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={toggleSelectAll}
                    style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#6366f1' }}
                  />
                </div>
                {['ÖĞRENCİ ADI', 'TWİN TİPİ', 'BAŞARI', 'RİSK'].map(h => (
                  <div key={h} style={{ padding: '12px 20px', fontSize: '10px', fontWeight: 700, color: 'var(--color-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
                    {h}
                  </div>
                ))}
              </div>
              {sortedSessions.map((s, i) => (
                <div key={s.id} style={{
                  display: 'grid', gridTemplateColumns: '40px 1fr 180px 90px 120px',
                  borderBottom: i < sortedSessions.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                }}>
                  <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(s.id)}
                      onChange={() => toggleSelect(s.id)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#6366f1' }}
                    />
                  </div>
                  <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '11px', flexShrink: 0 }}>
                      {getInitials(s.student_name)}
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{s.student_name}</span>
                  </div>
                  <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.twin_type}</span>
                  </div>
                  <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '14px' }}>{s.accuracy}%</span>
                  </div>
                  <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center' }}>
                    <span className={`badge badge-${s.risk_level}`}>
                      {s.risk_level === 'low' ? 'Düşük' : s.risk_level === 'medium' ? 'Orta' : 'Yüksek'}
                    </span>
                  </div>
                </div>
              ))}
              {sortedSessions.length === 0 && !loading && (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-muted)', fontSize: '14px' }}>
                  Filtrelere uygun öğrenci bulunamadı.
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
      <Footer />

      {/* Floating action bar */}
      {selectedCount > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '12px 24px',
            borderRadius: '12px',
            background: 'rgba(15,23,42,0.9)',
            border: '1px solid var(--border-subtle)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          }}
        >
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-muted)' }}>
            {selectedCount} öğrenci seçildi
          </span>
          <button
            onClick={() => alert('PDF export coming soon')}
            style={{
              fontSize: '13px',
              fontWeight: 600,
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              background: '#6366f1',
              color: '#fff',
            }}
          >
            PDF Raporu Al
          </button>
        </div>
      )}
    </div>
  )
}
