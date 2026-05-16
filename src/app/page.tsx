'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TopNav } from '@/components/layout/TopNav'

const SUBJECTS = [
  { label: 'Mathematics', icon: '∑', id: 'matematik', topic: 'Problemler' },
  { label: 'Physics', icon: '⚗', id: 'fizik', topic: 'Kuvvet ve Hareket' },
  { label: 'Biology', icon: '🧬', id: 'biyoloji', topic: 'Hücre' },
  { label: 'Literature', icon: '📖', id: 'edebiyat', topic: 'Paragraf' },
]

export default function LandingPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | 'parent'>('student')
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0])
  const [studentName, setStudentName] = useState('')

  function handleContinue() {
    if (selectedRole === 'teacher') {
      router.push('/teacher/class')
      return
    }
    if (selectedRole === 'parent') {
      router.push('/parent')
      return
    }
    
    // Student flow
    if (!studentName.trim()) return
    const id = `stu_${Date.now()}`
    localStorage.setItem('learntwin_student', JSON.stringify({ id, name: studentName.trim() }))
    localStorage.setItem('learntwin_subject', JSON.stringify({ subject: selectedSubject.label, topic: selectedSubject.topic }))
    router.push('/student/session')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNav />
      
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '64px 20px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border-highlight)', borderRadius: '999px', padding: '4px 12px', marginBottom: '24px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--color-muted)' }}>
          NEXT-GENERATION LEARNING
        </div>
        
        <h1 style={{ fontSize: 'clamp(40px, 5vw, 56px)', fontWeight: 800, textAlign: 'center', lineHeight: 1.1, marginBottom: '16px' }}>
          Precision Education,<br />
          Powered <span style={{ color: 'var(--color-accent)' }}>by AI.</span>
        </h1>
        
        <p style={{ color: 'var(--color-muted)', fontSize: '16px', textAlign: 'center', maxWidth: '580px', lineHeight: 1.6, marginBottom: '48px' }}>
          Accelerate learning outcomes with adaptive, data-driven intelligence. Choose your path to begin the intelligent onboarding process.
        </p>

        {/* Roles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', width: '100%', maxWidth: '960px', marginBottom: '48px' }}>
          {[
            { id: 'student', title: 'Student', desc: 'Personalized learning paths and adaptive testing.', icon: '🎓' },
            { id: 'teacher', title: 'Teacher', desc: 'Advanced analytics and automated curriculum generation.', icon: '👨‍🏫' },
            { id: 'parent', title: 'Parent', desc: 'Real-time progress tracking and performance insights.', icon: '👨‍👩‍👧' },
          ].map(role => (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role.id as any)}
              className="glass-card"
              style={{
                padding: '24px', cursor: 'pointer',
                borderColor: selectedRole === role.id ? 'var(--color-accent)' : 'var(--border-subtle)',
                background: selectedRole === role.id ? 'var(--bg-card-hover)' : 'var(--bg-card)',
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--color-muted)' }}>{role.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>{role.title}</div>
              <div style={{ color: 'var(--color-muted)', fontSize: '14px', lineHeight: 1.5 }}>{role.desc}</div>
            </div>
          ))}
        </div>

        {/* Setup Card */}
        <div className="glass-card fade-in" style={{ width: '100%', maxWidth: '800px', padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-accent-dim)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>1</div>
              <div style={{ fontSize: '12px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>Profile</div>
            </div>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)', margin: '0 16px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-card-hover)', border: '1px solid var(--border-subtle)', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>2</div>
              <div style={{ fontSize: '12px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>Subject</div>
            </div>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)', margin: '0 16px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-card-hover)', border: '1px solid var(--border-subtle)', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>3</div>
              <div style={{ fontSize: '12px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>Details</div>
            </div>
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Select Primary Subject</h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '14px', marginBottom: '24px' }}>Choose the focus area for the initial AI assessment.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {SUBJECTS.map(sub => (
              <div
                key={sub.id}
                onClick={() => setSelectedSubject(sub)}
                style={{
                  border: `1px solid ${selectedSubject.id === sub.id ? 'var(--color-accent)' : 'var(--border-subtle)'}`,
                  background: selectedSubject.id === sub.id ? 'var(--color-accent-dim)' : 'var(--bg-card-hover)',
                  borderRadius: '8px', padding: '20px', textAlign: 'center', cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '12px', color: selectedSubject.id === sub.id ? 'var(--color-text)' : 'var(--color-muted)' }}>{sub.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: selectedSubject.id === sub.id ? 'var(--color-text)' : 'var(--color-muted)' }}>{sub.label}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--color-muted)', letterSpacing: '0.05em', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>FULL NAME</label>
            <input
              type="text"
              value={studentName}
              onChange={e => setStudentName(e.target.value)}
              placeholder="Enter your name"
              style={{
                width: '100%', padding: '16px', borderRadius: '8px',
                border: '1px solid var(--border-subtle)', background: '#070D1A',
                color: 'var(--color-text)', fontSize: '15px', outline: 'none',
                fontFamily: 'var(--font-inter)'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-primary" onClick={handleContinue} disabled={selectedRole === 'student' && !studentName.trim()}>
              Continue Setup →
            </button>
          </div>
        </div>
      </main>
      
      <footer style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-primary)' }}>
        <div style={{ fontWeight: 800, fontSize: '18px' }}>İşler LearnTwin AI</div>
        <div style={{ display: 'flex', gap: '24px', fontSize: '12px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
          <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
          <span style={{ cursor: 'pointer' }}>Terms of Service</span>
          <span style={{ cursor: 'pointer' }}>Help Center</span>
          <span style={{ cursor: 'pointer' }}>API Status</span>
          <span>© 2024 İşler LearnTwin AI. Precision in Education.</span>
        </div>
      </footer>
    </div>
  )
}
