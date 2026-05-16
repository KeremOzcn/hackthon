'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { LearningTwinResult, TwinType } from '@/types'

const TWIN_ICONS: Record<TwinType, string> = {
  'Hızlı ama Dikkatsiz': '⚡',
  'Yavaş ama Sağlam': '🐢',
  'Konuyu Biliyor ama Modelleyemiyor': '🧩',
  'İpucu Bağımlısı': '🔦',
  'Sınav Panikçisi': '😰',
}

const TWIN_COLORS: Record<TwinType, string> = {
  'Hızlı ama Dikkatsiz': '#f59e0b',
  'Yavaş ama Sağlam': '#10b981',
  'Konuyu Biliyor ama Modelleyemiyor': '#6366f1',
  'İpucu Bağımlısı': '#a78bfa',
  'Sınav Panikçisi': '#f43f5e',
}

const RISK_LABEL: Record<string, string> = { low: 'Düşük Risk', medium: 'Orta Risk', high: 'Yüksek Risk' }

export default function ResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<LearningTwinResult | { error: true } | null>(null)
  const [studentName, setStudentName] = useState('Öğrenci')
  const [tab, setTab] = useState<'student' | 'teacher' | 'parent'>('student')

  function safeParse<T>(value: string | null): T | null {
    if (!value) return null
    try {
      return JSON.parse(value) as T
    } catch {
      return null
    }
  }

  useEffect(() => {
    const raw = safeParse<LearningTwinResult | { error?: boolean }>(localStorage.getItem('learntwin_result'))
    if (raw && 'error' in raw) {
      setResult({ error: true })
    } else if (raw) {
      setResult(raw as LearningTwinResult)
    }
    const st = safeParse<{ name?: string }>(localStorage.getItem('learntwin_student'))
    if (st?.name) setStudentName(st.name)
  }, [])

  if (!result) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div style={{ color: 'var(--color-muted)' }}>Sonuç yükleniyor...</div>
      </main>
    )
  }

  if ('error' in result) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="glass-card" style={{ padding: '32px', textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>Analiz başarısız oldu</div>
          <div style={{ color: 'var(--color-muted)', fontSize: '14px', marginBottom: '20px' }}>API anahtarınızı kontrol edin.</div>
          <button className="btn-primary" onClick={() => router.push('/')} style={{ justifyContent: 'center' }}>Ana Sayfaya Dön</button>
        </div>
      </main>
    )
  }

  const twinColor = TWIN_COLORS[result.twinType] ?? '#6366f1'
  const twinIcon = TWIN_ICONS[result.twinType] ?? '🧠'

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => router.push('/')} style={{ color: 'var(--color-muted)', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}>
            ← Ana Sayfa
          </button>
          <span className={`badge badge-${result.riskLevel}`}>{RISK_LABEL[result.riskLevel]}</span>
        </div>

        <div className="glass-card fade-in" style={{ padding: '32px', textAlign: 'center', borderColor: `${twinColor}30`, background: `${twinColor}08` }}>
          <div style={{ fontSize: '56px', marginBottom: '12px' }}>{twinIcon}</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: twinColor, marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Learning Twin Tipin
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px', color: twinColor }}>
            {result.twinType}
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '15px', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto' }}>
            {result.dominantPattern}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {[
            { label: 'Doğruluk', value: `%${result.stats.accuracy}` },
            { label: 'Ort. Süre', value: `${result.stats.avgTimeSeconds}s` },
            { label: 'İpucu', value: `${result.stats.hintsUsed}` },
            { label: 'Eminken Yanlış', value: `${result.stats.highConfidenceWrong}` },
          ].map(s => (
            <div key={s.label} className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>{s.value}</div>
              <div style={{ color: 'var(--color-muted)', fontSize: '11px', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '14px', padding: '20px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '24px', flexShrink: 0 }}>🎯</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '6px', color: '#a5b4fc' }}>ÖNERİLEN MİKRO MÜDAHALE</div>
            <div style={{ fontSize: '15px', lineHeight: 1.6 }}>{result.nextBestAction}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '4px' }}>
          {([
            { key: 'student', label: '🎓 Öğrenci' },
            { key: 'teacher', label: '📊 Öğretmen' },
            { key: 'parent', label: '👨‍👩‍👧 Veli' },
          ] as const).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: '13px',
              background: tab === t.key ? 'rgba(99,102,241,0.2)' : 'transparent',
              color: tab === t.key ? '#a5b4fc' : 'var(--color-muted)',
              transition: 'all 150ms ease',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="glass-card fade-in" style={{ padding: '24px' }} key={tab}>
          {tab === 'student' && (
            <>
              <div style={{ fontWeight: 700, marginBottom: '12px', fontSize: '15px' }}>Merhaba, {studentName}!</div>
              <p style={{ color: 'var(--color-muted)', fontSize: '15px', lineHeight: 1.7 }}>{result.studentMessage}</p>
              <div style={{ marginTop: '16px', padding: '14px', background: 'rgba(99,102,241,0.08)', borderRadius: '10px', fontSize: '13px', color: '#a5b4fc' }}>
                <strong>Bilişsel Sorun:</strong> {result.cognitiveIssue}<br />
                <strong style={{ marginTop: '4px', display: 'block' }}>Davranışsal Sorun:</strong> {result.behavioralIssue}
              </div>
            </>
          )}
          {tab === 'teacher' && (
            <>
              <div style={{ fontWeight: 700, marginBottom: '12px', fontSize: '15px' }}>Öğretmen Notu</div>
              <p style={{ color: 'var(--color-muted)', fontSize: '15px', lineHeight: 1.7 }}>{result.teacherAction}</p>
            </>
          )}
          {tab === 'parent' && (
            <>
              <div style={{ fontWeight: 700, marginBottom: '12px', fontSize: '15px' }}>Veli Raporu</div>
              <p style={{ color: 'var(--color-muted)', fontSize: '15px', lineHeight: 1.7 }}>{result.parentMessage}</p>
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-outline" onClick={() => router.push('/student/history')} style={{ flex: 1, justifyContent: 'center' }}>Geçmişim</button>
          <button className="btn-outline" onClick={() => router.push('/')} style={{ flex: 1, justifyContent: 'center' }}>Tekrar Çöz</button>
          <button className="btn-primary" onClick={() => router.push('/')} style={{ flex: 1, justifyContent: 'center' }}>Ana Sayfa</button>
        </div>
      </div>
    </main>
  )
}
