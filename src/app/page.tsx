'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [studentName, setStudentName] = useState('')
  const [showNameInput, setShowNameInput] = useState(false)

  function handleStartSession() {
    if (!studentName.trim()) return
    const id = `stu_${Date.now()}`
    localStorage.setItem('learntwin_student', JSON.stringify({ id, name: studentName.trim() }))
    router.push('/student/session')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}
      >
        <div style={{
          position: 'absolute', top: '-20%', left: '10%',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', right: '5%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
        }} />
      </div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-12">
        <div className="text-center flex flex-col items-center gap-4">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: '999px', padding: '6px 16px', fontSize: '13px', fontWeight: 600,
            color: '#a5b4fc', marginBottom: '8px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', display: 'inline-block' }} />
            İşler Kitabevi × LearnTwin AI
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            Her öğrencinin
            <span style={{ display: 'block', background: 'linear-gradient(135deg, #6366f1, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              öğrenme biçimi
            </span>
            görünür olsun.
          </h1>

          <p style={{ color: 'var(--color-muted)', fontSize: '17px', lineHeight: 1.6, maxWidth: '520px' }}>
            Soru çözüm sürecindeki sinyalleri analiz ederek her öğrenci için
            dijital bir <strong style={{ color: 'var(--color-text)' }}>Learning Twin</strong> oluşturuyoruz.
          </p>
        </div>

        {!showNameInput ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', width: '100%' }}>
            <button
              onClick={() => setShowNameInput(true)}
              className="glass-card"
              style={{ padding: '28px 24px', textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '12px', border: 'none' }}
            >
              <div style={{ fontSize: '36px' }}>🎓</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '17px', marginBottom: '6px' }}>Öğrenci</div>
                <div style={{ color: 'var(--color-muted)', fontSize: '14px', lineHeight: 1.5 }}>
                  5 soruluk mini test çöz, kendi öğrenme ikizini keşfet.
                </div>
              </div>
              <div style={{ marginTop: 'auto', fontSize: '13px', color: '#6366f1', fontWeight: 600 }}>Başla →</div>
            </button>

            <button
              onClick={() => router.push('/teacher')}
              className="glass-card"
              style={{ padding: '28px 24px', textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '12px', border: 'none' }}
            >
              <div style={{ fontSize: '36px' }}>📊</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '17px', marginBottom: '6px' }}>Öğretmen</div>
                <div style={{ color: 'var(--color-muted)', fontSize: '14px', lineHeight: 1.5 }}>
                  Sınıfının öğrenme haritasını gör, riskli öğrencileri tespit et.
                </div>
              </div>
              <div style={{ marginTop: 'auto', fontSize: '13px', color: '#f59e0b', fontWeight: 600 }}>Paneli Aç →</div>
            </button>

            <button
              onClick={() => router.push('/parent')}
              className="glass-card"
              style={{ padding: '28px 24px', textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '12px', border: 'none' }}
            >
              <div style={{ fontSize: '36px' }}>👨‍👩‍👧</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '17px', marginBottom: '6px' }}>Veli</div>
                <div style={{ color: 'var(--color-muted)', fontSize: '14px', lineHeight: 1.5 }}>
                  Çocuğunun nasıl desteklenmesi gerektiğini sade dille anla.
                </div>
              </div>
              <div style={{ marginTop: 'auto', fontSize: '13px', color: '#10b981', fontWeight: 600 }}>Raporu Gör →</div>
            </button>
          </div>
        ) : (
          <div className="glass-card fade-in" style={{ padding: '36px', width: '100%', maxWidth: '480px' }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontWeight: 700, fontSize: '20px', marginBottom: '8px' }}>Merhaba! Adın ne?</div>
              <div style={{ color: 'var(--color-muted)', fontSize: '14px' }}>TYT Matematik • Problemler • 5 Soru</div>
            </div>
            <input
              autoFocus
              type="text"
              placeholder="Adını yaz..."
              value={studentName}
              onChange={e => setStudentName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleStartSession()}
              style={{
                width: '100%', padding: '14px 16px', borderRadius: '12px',
                border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.05)',
                color: 'var(--color-text)', fontSize: '16px', outline: 'none', marginBottom: '16px',
              }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-outline" onClick={() => setShowNameInput(false)} style={{ flex: 1 }}>Geri</button>
              <button
                className="btn-primary"
                onClick={handleStartSession}
                style={{ flex: 2, justifyContent: 'center', opacity: studentName.trim() ? 1 : 0.5 }}
                disabled={!studentName.trim()}
              >
                Teste Başla
              </button>
            </div>
          </div>
        )}

        <div style={{
          display: 'flex', gap: '32px', paddingTop: '16px',
          borderTop: '1px solid var(--border-subtle)', width: '100%', justifyContent: 'center',
        }}>
          {[
            { label: 'Öğrenme Sinyali', value: '6 Boyut' },
            { label: 'Müdahale Tipi', value: 'Mikro' },
            { label: 'Analiz Motoru', value: 'Claude AI' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '18px' }}>{s.value}</div>
              <div style={{ color: 'var(--color-muted)', fontSize: '12px', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
