'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TopNav } from '@/components/layout/TopNav'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase-client'

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


export default function TeacherPage() {
  const router = useRouter()
  const supabase = createClient()
  const [sessions, setSessions] = useState<SessionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [showPrintReport, setShowPrintReport] = useState(false)

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
        setSessions([])
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
  const avgAcc = sessions.length ? Math.round(sessions.reduce((s, r) => s + r.accuracy, 0) / sessions.length) : 0
  const pendingTasks = sessions.filter(s => s.risk_level !== 'low').length
  const attentionRequired = sessions.filter(s => s.risk_level === 'high' || s.risk_level === 'medium')

  const sortedSessions = [...sessions].sort((a, b) => {
    return (RISK_ORDER[a.risk_level] ?? 3) - (RISK_ORDER[b.risk_level] ?? 3)
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
              Sınıf Genel Bakışı
            </h1>
            <p style={{ color: 'var(--color-muted)', fontSize: '15px', lineHeight: 1.6, maxWidth: '520px' }}>
              Sınıf performansını izleyin, risk altındaki öğrencileri tespit edin ve yapay zeka önerili müdahaleleri uygulayın.
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
              { label: 'MÜDAHALE GEREKEN', icon: '⚠', value: highRisk, valueColor: '#f43f5e', desc: 'Son değerlendirme verilerine ve katılım metriklerine göre riskli olarak işaretlenen öğrenciler.' },
              { label: 'SINIF BAŞARISI', icon: '📊', value: `${avgAcc}%`, valueColor: '#10b981', desc: 'Tüm mevcut modüllerdeki ortalama aktif katılım oranı. Geçen haftaya göre +2%.' },
              { label: 'BEKLEYEN GÖREVLER', icon: '📋', value: pendingTasks, valueColor: '#f59e0b', desc: 'Manuel inceleme ve onayınızı bekleyen yapay zeka üretimi müdahaleler.' },
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

          {/* Attention Required */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontWeight: 700, fontSize: '20px' }}>Dikkat Gereken</h2>
              <button onClick={() => router.push('/teacher/analytics')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-accent)', fontSize: '13px', fontWeight: 600 }}>
                TÜMÜNÜ GÖR →
              </button>
            </div>

            {loading ? (
              <div className="glass-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-muted)' }}>Yükleniyor...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {attentionRequired.map(s => {
                  const riskColor = s.risk_level === 'high' ? '#f43f5e' : '#f59e0b'
                  const isApproved = approvedIds.has(s.id) || s.teacher_action.includes('[Onaylandı')
                  const isEditing = editingId === s.id
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
                            {s.risk_level === 'high' ? 'YÜKSEK RİSK' : 'ORTA RİSK'}
                          </span>
                        </div>
                      </div>

                      <div style={{ margin: '0 24px 20px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '10px', padding: '16px' }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: '#a5b4fc', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                          🤖 YAPAY ZEKA MÜDAHALE ÖNERİSİ
                        </div>
                        {isEditing ? (
                          <>
                            <textarea
                              value={editText}
                              onChange={e => setEditText(e.target.value)}
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '0.5px solid var(--border-highlight)',
                                background: 'rgba(255,255,255,0.04)',
                                color: 'var(--color-text)',
                                fontSize: '13px',
                                lineHeight: 1.6,
                                marginBottom: '12px',
                                outline: 'none',
                                resize: 'vertical',
                                minHeight: '80px',
                              }}
                            />
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                              <button
                                className="btn-primary"
                                style={{ fontSize: '12px', padding: '8px 16px' }}
                                onClick={async () => {
                                  await supabase.from('learning_twin_results').update({ teacher_action: editText }).eq('id', s.id)
                                  setSessions(prev => prev.map(row => row.id === s.id ? { ...row, teacher_action: editText } : row))
                                  setEditingId(null)
                                }}
                              >
                                KAYDET
                              </button>
                              <button
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', fontSize: '12px', fontWeight: 600 }}
                                onClick={() => setEditingId(null)}
                              >
                                İPTAL
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'var(--color-muted)', marginBottom: '14px' }}>
                              {s.student_name} için öneri: {s.teacher_action}
                            </p>
                            {isApproved ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  color: '#10b981',
                                  letterSpacing: '0.06em',
                                  fontFamily: 'var(--font-mono)',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  background: 'rgba(16,185,129,0.12)',
                                  border: '1px solid rgba(16,185,129,0.3)',
                                }}>
                                  ✓ ONAYLANDI
                                </span>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <button
                                  className="btn-primary"
                                  style={{ fontSize: '12px', padding: '8px 16px' }}
                                  onClick={async () => {
                                    const approvedText = `${s.teacher_action} [Onaylandı: ${new Date().toLocaleDateString('tr-TR')}]`
                                    await supabase.from('learning_twin_results').update({ teacher_action: approvedText }).eq('id', s.id)
                                    setSessions(prev => prev.map(row => row.id === s.id ? { ...row, teacher_action: approvedText } : row))
                                    setApprovedIds(prev => new Set(prev).add(s.id))
                                  }}
                                >
                                  ONAYLA VE ATA
                                </button>
                                <button
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', fontSize: '12px', fontWeight: 600 }}
                                  onClick={() => {
                                    setEditingId(s.id)
                                    setEditText(s.teacher_action)
                                  }}
                                >
                                  ÖNERİYİ DÜZENLE
                                </button>
                              </div>
                            )}
                          </>
                        )}
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
                  Henüz öğrenci verisi yok.
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
            onClick={() => {
              if (selectedCount === 0) {
                alert('Lütfen rapor almak için en az bir öğrenci seçin.')
                return
              }
              setShowPrintReport(true)
              setTimeout(() => {
                window.print()
                const handler = () => {
                  setShowPrintReport(false)
                  window.removeEventListener('afterprint', handler)
                }
                window.addEventListener('afterprint', handler)
              }, 300)
            }}
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

      {/* Print-only report overlay */}
      {showPrintReport && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: '#fff',
            color: '#000',
            padding: '40px',
            overflow: 'auto',
            display: 'none',
          }}
          className="print-only-report"
        >
          <style>{"@media print { .print-only-report { display: block !important; } }"}</style>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: '#000' }}>Öğrenci Raporu</h1>
            <p style={{ fontSize: '13px', color: '#555', marginBottom: '24px' }}>
              Tarih: {new Date().toLocaleDateString('tr-TR')}
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr>
                  {['Öğrenci', 'Twin Tipi', 'Başarı', 'Risk', 'Ders', 'Müdahale Önerisi'].map(h => (
                    <th key={h} style={{ borderBottom: '2px solid #000', padding: '10px 8px', textAlign: 'left', fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sessions.filter(s => selectedIds.has(s.id)).map(s => (
                  <tr key={s.id}>
                    <td style={{ borderBottom: '1px solid #ddd', padding: '10px 8px' }}>{s.student_name}</td>
                    <td style={{ borderBottom: '1px solid #ddd', padding: '10px 8px' }}>{s.twin_type}</td>
                    <td style={{ borderBottom: '1px solid #ddd', padding: '10px 8px' }}>{s.accuracy}%</td>
                    <td style={{ borderBottom: '1px solid #ddd', padding: '10px 8px' }}>{s.risk_level === 'high' ? 'Yüksek' : s.risk_level === 'medium' ? 'Orta' : 'Düşük'}</td>
                    <td style={{ borderBottom: '1px solid #ddd', padding: '10px 8px' }}>{s.subject}</td>
                    <td style={{ borderBottom: '1px solid #ddd', padding: '10px 8px', maxWidth: '300px' }}>{s.teacher_action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '11px', color: '#888' }}>
              İşleyen — Öğretmen Paneli Raporu
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
