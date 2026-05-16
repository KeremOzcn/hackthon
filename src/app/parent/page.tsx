'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

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
  student_name: 'Deniz',
  twin_type: 'Konuyu Biliyor ama Modelleyemiyor',
  accuracy: 40,
  parent_message: 'Deniz düzenli çalışıyor ancak uzun problem sorularında ilk adımı kurmakta zorlanıyor. Daha fazla soru çözmek yerine kısa soru anlama egzersizleri daha etkili olacaktır.',
  next_best_action: '3 adet değişken seçimi mikro egzersizi yap.',
  risk_level: 'medium',
  created_at: new Date().toISOString(),
}

export default function ParentPage() {
  const router = useRouter()
  const [data, setData] = useState<ParentData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: row } = await supabase
        .from('learning_twin_results')
        .select('student_name,twin_type,accuracy,parent_message,next_best_action,risk_level,created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      setData((row as ParentData | null) ?? MOCK_DATA)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-xl flex flex-col gap-6">
        <div>
          <button onClick={() => router.push('/')} style={{ color: 'var(--color-muted)', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '8px', display: 'block' }}>← Ana Sayfa</button>
          <h1 style={{ fontWeight: 800, fontSize: '24px' }}>Veli Raporu</h1>
          <div style={{ color: 'var(--color-muted)', fontSize: '14px' }}>En güncel öğrenme analizi</div>
        </div>

        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-muted)' }}>Yükleniyor...</div>
        ) : data ? (
          <>
            <div className="glass-card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '20px' }}>
                  {data.student_name[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '18px' }}>{data.student_name}</div>
                  <div style={{ color: 'var(--color-muted)', fontSize: '13px' }}>TYT Matematik — Problemler</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 800 }}>%{data.accuracy}</div>
                  <div style={{ color: 'var(--color-muted)', fontSize: '12px', marginTop: '2px' }}>Doğruluk Oranı</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                  <span className={`badge badge-${data.risk_level}`} style={{ fontSize: '14px', padding: '6px 14px' }}>
                    {data.risk_level === 'low' ? 'Düşük Risk' : data.risk_level === 'medium' ? 'Orta Risk' : 'Yüksek Risk'}
                  </span>
                  <div style={{ color: 'var(--color-muted)', fontSize: '12px', marginTop: '6px' }}>Risk Seviyesi</div>
                </div>
              </div>

              <div style={{ fontSize: '13px', color: '#a5b4fc', fontWeight: 600, marginBottom: '8px' }}>ÖĞRENİM PROFİLİ</div>
              <div style={{ fontWeight: 600, fontSize: '15px' }}>{data.twin_type}</div>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#10b981', marginBottom: '12px' }}>ÇOCUĞUNUZ HAKKINDA</div>
              <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--color-muted)' }}>{data.parent_message}</p>
            </div>

            <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '14px', padding: '20px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '24px', flexShrink: 0 }}>💡</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '6px', color: '#a5b4fc' }}>NE YAPILMALI?</div>
                <div style={{ fontSize: '15px', lineHeight: 1.6 }}>{data.next_best_action}</div>
              </div>
            </div>

            <div style={{ textAlign: 'center', color: 'var(--color-muted)', fontSize: '13px', lineHeight: 1.7, padding: '0 16px' }}>
              Bu analiz <strong style={{ color: 'var(--color-text)' }}>İşler LearnTwin AI</strong> tarafından {data.student_name}&apos;in soru çözüm davranışından otomatik oluşturulmuştur.
            </div>
          </>
        ) : null}
      </div>
    </main>
  )
}
