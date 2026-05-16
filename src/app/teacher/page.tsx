'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
}

const RISK_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 }
const RISK_LABEL: Record<string, string> = { low: 'Düşük', medium: 'Orta', high: 'Yüksek' }

const MOCK_SESSIONS: SessionRow[] = [
  { id: '1', student_name: 'Deniz K.', twin_type: 'Konuyu Biliyor ama Modelleyemiyor', risk_level: 'medium', accuracy: 40, dominant_pattern: 'Problem metnini denkleme çevirmede güçlük', teacher_action: 'Değişken seçimi egzersizi yaptırın.', created_at: new Date().toISOString() },
  { id: '2', student_name: 'Elif S.', twin_type: 'Hızlı ama Dikkatsiz', risk_level: 'high', accuracy: 60, dominant_pattern: 'Hızlı yanıt, kolay sorularda dikkat hatası', teacher_action: 'Cevap öncesi kontrol rutini önerin.', created_at: new Date().toISOString() },
  { id: '3', student_name: 'Mert A.', twin_type: 'İpucu Bağımlısı', risk_level: 'high', accuracy: 80, dominant_pattern: 'Yüksek ipucu kullanımı, bağımsız çözüm güçlüğü', teacher_action: 'Küçük yönlendirmeli pratik yapın.', created_at: new Date().toISOString() },
  { id: '4', student_name: 'Ayşe T.', twin_type: 'Yavaş ama Sağlam', risk_level: 'low', accuracy: 100, dominant_pattern: 'Yüksek doğruluk, uzun çözüm süresi', teacher_action: 'Süre kontrollü pratik önerin.', created_at: new Date().toISOString() },
  { id: '5', student_name: 'Can Ö.', twin_type: 'Sınav Panikçisi', risk_level: 'medium', accuracy: 60, dominant_pattern: 'Baskı altında doğruluk düşüyor', teacher_action: 'Mikro sınav simülasyonu uygulayın.', created_at: new Date().toISOString() },
]

export default function TeacherPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<SessionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<SessionRow | null>(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('learning_twin_results')
        .select('id,student_name,twin_type,risk_level,accuracy,dominant_pattern,teacher_action,created_at')
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

  const highRisk = sessions.filter(s => s.risk_level === 'high').length
  const medRisk = sessions.filter(s => s.risk_level === 'medium').length
  const avgAcc = sessions.length ? Math.round(sessions.reduce((s, r) => s + r.accuracy, 0) / sessions.length) : 0

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <button onClick={() => router.push('/')} style={{ color: 'var(--color-muted)', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '8px', display: 'block' }}>← Ana Sayfa</button>
            <h1 style={{ fontWeight: 800, fontSize: '24px' }}>Öğretmen Paneli</h1>
            <div style={{ color: 'var(--color-muted)', fontSize: '14px' }}>TYT Matematik — Problemler</div>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--color-muted)' }}>{sessions.length} öğrenci analizi</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { val: highRisk, label: 'Yüksek Riskli', color: '#f43f5e' },
            { val: medRisk, label: 'Orta Riskli', color: '#f59e0b' },
            { val: `%${avgAcc}`, label: 'Ort. Doğruluk', color: '#10b981' },
          ].map(s => (
            <div key={s.label} className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: s.color }}>{s.val}</div>
              <div style={{ color: 'var(--color-muted)', fontSize: '12px', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', fontWeight: 700, fontSize: '14px' }}>
            Öğrenci Listesi
          </div>
          {loading ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-muted)' }}>Yükleniyor...</div>
          ) : (
            sessions.map(s => (
              <button
                key={s.id}
                onClick={() => setSelected(selected?.id === s.id ? null : s)}
                style={{
                  width: '100%', textAlign: 'left', padding: '16px 20px', border: 'none', cursor: 'pointer',
                  borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '16px',
                  background: selected?.id === s.id ? 'rgba(99,102,241,0.06)' : 'transparent',
                  transition: 'background 150ms ease',
                }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
                  {s.student_name[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>{s.student_name}</div>
                  <div style={{ color: 'var(--color-muted)', fontSize: '12px' }}>{s.twin_type}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>%{s.accuracy}</div>
                  <span className={`badge badge-${s.risk_level}`}>{RISK_LABEL[s.risk_level]}</span>
                </div>
              </button>
            ))
          )}
        </div>

        {selected && (
          <div className="glass-card fade-in" style={{ padding: '24px' }} key={selected.id}>
            <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>{selected.student_name}</div>
            <div style={{ color: 'var(--color-muted)', fontSize: '13px', marginBottom: '16px' }}>{selected.twin_type}</div>
            <div style={{ fontSize: '14px', lineHeight: 1.7, marginBottom: '12px' }}>
              <strong>Dominant Kalıp:</strong> <span style={{ color: 'var(--color-muted)' }}>{selected.dominant_pattern}</span>
            </div>
            <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '10px', padding: '14px', fontSize: '14px', lineHeight: 1.6 }}>
              <div style={{ fontWeight: 600, color: '#f59e0b', fontSize: '12px', marginBottom: '4px' }}>ÖNERİLEN MÜDAHALE</div>
              {selected.teacher_action}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
