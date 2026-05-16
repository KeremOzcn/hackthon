'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TopNav } from '@/components/layout/TopNav'
import { Footer } from '@/components/layout/Footer'

const SUBJECTS = [
  { label: 'Mathematics', displaySubject: 'Matematik', icon: '∑', id: 'matematik', topic: 'Sayılar' },
  { label: 'Physics', displaySubject: 'Fen Bilimleri', icon: '⚗', id: 'fizik', topic: 'Kuvvet ve Hareket' },
  { label: 'Biology', displaySubject: 'Fen Bilimleri', icon: '🧬', id: 'biyoloji', topic: 'Hücre' },
  { label: 'Literature', displaySubject: 'Türkçe', icon: '📖', id: 'edebiyat', topic: 'Paragraf' },
]

export default function LandingPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | 'parent'>('student')
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0])
  const [studentName, setStudentName] = useState('')

  function handleContinue() {
    if (selectedRole === 'teacher') { router.push('/teacher'); return }
    if (selectedRole === 'parent') { router.push('/parent'); return }
    if (!studentName.trim()) return
    const id = `stu_${Date.now()}`
    localStorage.setItem('learntwin_student', JSON.stringify({ id, name: studentName.trim() }))
    localStorage.setItem('learntwin_subject', JSON.stringify({ subject: selectedSubject.displaySubject, topic: selectedSubject.topic }))
    router.push('/student/session')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNav active="dashboard" />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '64px 20px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border-highlight)', borderRadius: '999px', padding: '4px 14px', marginBottom: '24px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
          NEXT-GENERATION LEARNING
        </div>

        <h1 style={{ fontSize: 'clamp(40px, 5vw, 56px)', fontWeight: 800, textAlign: 'center', lineHeight: 1.1, marginBottom: '16px', letterSpacing: '-0.03em' }}>
          Precision Education,<br />
          Powered <span style={{ color: 'var(--color-accent)' }}>by AI.</span>
        </h1>

        <p style={{ color: 'var(--color-muted)', fontSize: '16px', textAlign: 'center', maxWidth: '560px', lineHeight: 1.7, marginBottom: '56px' }}>
          Accelerate learning outcomes with adaptive, data-driven intelligence. Choose your path to begin the intelligent onboarding process.
        </p>

        {/* Role Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', width: '100%', maxWidth: '900px', marginBottom: '48px' }}>
          {[
            { id: 'student', title: 'Student', desc: 'Personalized learning paths and adaptive testing.', icon: '🎓' },
            { id: 'teacher', title: 'Teacher', desc: 'Advanced analytics and automated curriculum generation.', icon: '👨‍🏫' },
            { id: 'parent', title: 'Parent', desc: 'Real-time progress tracking and performance insights.', icon: '👨‍👩‍👧' },
          ].map(role => (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role.id as 'student' | 'teacher' | 'parent')}
              className="glass-card"
              style={{
                padding: '24px', cursor: 'pointer',
                borderColor: selectedRole === role.id ? 'var(--color-accent)' : 'var(--border-subtle)',
                background: selectedRole === role.id ? 'rgba(128,131,255,0.06)' : 'var(--bg-card)',
              }}
            >
              <div style={{ fontSize: '22px', marginBottom: '14px' }}>{role.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '17px', marginBottom: '8px' }}>{role.title}</div>
              <div style={{ color: 'var(--color-muted)', fontSize: '14px', lineHeight: 1.6 }}>{role.desc}</div>
            </div>
          ))}
        </div>

        {/* Setup Card */}
        <div className="glass-card fade-in" style={{ width: '100%', maxWidth: '820px', padding: '40px' }}>
          {/* Step indicators */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
            {['Profile', 'Subject', 'Details'].map((step, i) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : undefined }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: i === 0 ? 'var(--color-accent-dim)' : 'rgba(255,255,255,0.05)',
                    border: i === 0 ? '1px solid var(--color-accent)' : '1px solid var(--border-subtle)',
                    color: i === 0 ? 'var(--color-accent)' : 'var(--color-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 700,
                  }}>{i + 1}</div>
                  <span style={{ fontSize: '12px', color: i === 0 ? 'var(--color-text)' : 'var(--color-muted)', fontFamily: 'var(--font-mono)', fontWeight: i === 0 ? 600 : 400 }}>{step}</span>
                </div>
                {i < 2 && <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)', margin: '0 16px' }} />}
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '6px' }}>Select Primary Subject</h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '14px', marginBottom: '28px' }}>Choose the focus area for the initial AI assessment.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '32px' }}>
            {SUBJECTS.map(sub => (
              <div
                key={sub.id}
                onClick={() => setSelectedSubject(sub)}
                style={{
                  border: `1px solid ${selectedSubject.id === sub.id ? 'var(--color-accent)' : 'var(--border-subtle)'}`,
                  background: selectedSubject.id === sub.id ? 'var(--color-accent-dim)' : 'rgba(255,255,255,0.03)',
                  borderRadius: '8px', padding: '20px 12px', textAlign: 'center', cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
              >
                <div style={{ fontSize: '22px', marginBottom: '10px', color: selectedSubject.id === sub.id ? 'var(--color-text)' : 'var(--color-muted)' }}>{sub.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: selectedSubject.id === sub.id ? 'var(--color-text)' : 'var(--color-muted)' }}>{sub.label}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: 'var(--color-muted)', letterSpacing: '0.08em', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>FULL NAME</label>
            <input
              type="text"
              value={studentName}
              onChange={e => setStudentName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleContinue()}
              placeholder="Enter your name"
              style={{
                width: '100%', padding: '14px 16px', borderRadius: '8px',
                border: '1px solid var(--border-subtle)', background: '#070D1A',
                color: 'var(--color-text)', fontSize: '15px', outline: 'none',
                fontFamily: 'var(--font-inter)', transition: 'border-color 150ms ease',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn-primary"
              onClick={handleContinue}
              disabled={selectedRole === 'student' && !studentName.trim()}
              style={{ opacity: selectedRole === 'student' && !studentName.trim() ? 0.5 : 1 }}
            >
              Continue Setup →
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
