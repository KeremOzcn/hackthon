'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { PageHeader } from '@/components/layout/PageHeader'
import { SkeletonCard } from '@/components/ui/Skeleton'

interface HistoryRow {
  id: string
  twin_type: string
  risk_level: string
  accuracy: number
  subject: string
  topic: string
  created_at: string
}

const RISK_LABEL: Record<string, string> = { low: 'Düşük', medium: 'Orta', high: 'Yüksek' }

const TWIN_ICON: Record<string, string> = {
  'Hızlı ama Dikkatsiz': '⚡',
  'Yavaş ama Sağlam': '🐢',
  'Konuyu Biliyor ama Modelleyemiyor': '🧩',
  'İpucu Bağımlısı': '🔦',
  'Sınav Panikçisi': '😰',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
  })
}

export default function HistoryPage() {
  const router = useRouter()
  const [rows, setRows] = useState<HistoryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [studentName, setStudentName] = useState('')

  useEffect(() => {
    const raw = localStorage.getItem('learntwin_student')
    if (!raw) { router.push('/'); return }
    const student = JSON.parse(raw)
    setStudentName(student.name)

    supabase
      .from('learning_twin_results')
      .select('id,twin_type,risk_level,accuracy,subject,topic,created_at')
      .eq('student_id', student.id)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setRows((data as HistoryRow[]) ?? [])
        setLoading(false)
      })
  }, [router])

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
        <PageHeader
          title="Geçmişim"
          subtitle={studentName ? `${studentName} · Tüm testler` : 'Tüm testler'}
        />

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <SkeletonCard lines={3} />
            <SkeletonCard lines={3} />
            <SkeletonCard lines={3} />
          </div>
        ) : rows.length === 0 ? (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>📭</div>
            <div style={{ fontWeight: 600, marginBottom: '8px' }}>Henüz test çözmedin</div>
            <div style={{ color: 'var(--color-muted)', fontSize: '14px', marginBottom: '20px' }}>
              İlk testini çözerek öğrenme ikizini keşfet.
            </div>
            <button className="btn-primary" onClick={() => router.push('/')} style={{ justifyContent: 'center' }}>
              Test Çöz
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 800 }}>{rows.length}</div>
                <div style={{ color: 'var(--color-muted)', fontSize: '12px', marginTop: '2px' }}>Toplam Test</div>
              </div>
              <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 800 }}>
                  %{Math.round(rows.reduce((s, r) => s + r.accuracy, 0) / rows.length)}
                </div>
                <div style={{ color: 'var(--color-muted)', fontSize: '12px', marginTop: '2px' }}>Ort. Doğruluk</div>
              </div>
            </div>

            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', fontWeight: 700, fontSize: '14px' }}>
                Test Geçmişi
              </div>
              {rows.map(row => (
                <div
                  key={row.id}
                  style={{
                    padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex', alignItems: 'center', gap: '14px',
                  }}
                >
                  <div style={{ fontSize: '28px', flexShrink: 0 }}>
                    {TWIN_ICON[row.twin_type] ?? '🧠'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>{row.twin_type}</div>
                    <div style={{ color: 'var(--color-muted)', fontSize: '12px' }}>
                      {row.subject} · {row.topic} · {formatDate(row.created_at)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>%{row.accuracy}</div>
                    <span className={`badge badge-${row.risk_level}`}>{RISK_LABEL[row.risk_level]}</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="btn-primary" onClick={() => router.push('/')} style={{ justifyContent: 'center' }}>
              Yeni Test Çöz
            </button>
          </>
        )}
      </div>
    </main>
  )
}
