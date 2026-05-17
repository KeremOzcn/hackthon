'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { questions } from '@/lib/questions'
import { questionsScience } from '@/lib/questions-science'
import { questionsTurkish } from '@/lib/questions-turkish'
import type { Answer, ConfidenceLevel, HintLevel, Question } from '@/types'

function getQuestions(subject: string): Question[] {
  if (subject === 'Fen Bilimleri') return questionsScience
  if (subject === 'Türkçe') return questionsTurkish
  return questions
}

const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = {
  low: 'Emin Değilim',
  medium: 'Biraz Eminim',
  high: 'Eminim',
}

const STEP_LABELS = ['Yanıtlar işlendi', 'Eksik kazanımlar belirlendi', 'Öğrenme modeli eğitiliyor...']

export default function SessionPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<{ id: string; email?: string; name?: string } | null>(null)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [confidence, setConfidence] = useState<ConfidenceLevel | null>(null)
  const [hintLevel, setHintLevel] = useState<HintLevel>(0)
  const [submitted, setSubmitted] = useState(false)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [startTime, setStartTime] = useState(Date.now())
  const [elapsed, setElapsed] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true)
  const [analyzeStep, setAnalyzeStep] = useState(0)
  const [subjectMeta, setSubjectMeta] = useState({ subject: 'Matematik', topic: 'Problemler' })
  const [questionSet, setQuestionSet] = useState<Question[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function safeParse<T>(value: string | null): T | null {
    if (!value) return null
    try { return JSON.parse(value) as T } catch { return null }
  }

  useEffect(() => {
    async function loadUser() {
      const isDemoStudent = document.cookie.includes('demo_auth=true') && document.cookie.includes('demo_role=student')
      if (isDemoStudent) {
        setUser({ id: 'demo-student', name: 'Demo Öğrenci' })
        return
      }

      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) { router.push('/auth/login'); return }
      const name = authUser.user_metadata?.full_name as string || authUser.email?.split('@')[0] || 'Öğrenci'
      setUser({ id: authUser.id, email: authUser.email, name })
    }
    loadUser()
  }, [router, supabase])

  useEffect(() => {
    const parsed = safeParse<{ subject?: string; topic?: string }>(localStorage.getItem('learntwin_subject'))
    if (parsed?.subject && parsed?.topic) setSubjectMeta({ subject: parsed.subject, topic: parsed.topic })
  }, [])

  useEffect(() => {
    let cancelled = false
    async function loadAdaptive() {
      if (!user) return
      setIsLoadingQuestions(true)
      try {
        const res = await fetch(`/api/questions?studentId=${encodeURIComponent(user.id)}&subject=${encodeURIComponent(subjectMeta.subject)}`)
        if (!res.ok) throw new Error('Adaptive load failed')
        const data = await res.json()
        if (!cancelled) setQuestionSet(data.questions ?? [])
      } catch {
        if (!cancelled) setQuestionSet(getQuestions(subjectMeta.subject))
      } finally {
        if (!cancelled) setIsLoadingQuestions(false)
      }
    }
    loadAdaptive()
    return () => { cancelled = true }
  }, [subjectMeta.subject, user])

  const question = questionSet[currentIdx]
  const progress = questionSet.length > 0 ? ((currentIdx + (submitted ? 1 : 0)) / questionSet.length) * 100 : 0

  useEffect(() => {
    setStartTime(Date.now())
    setElapsed(0)
    timerRef.current = setInterval(() => setElapsed(s => s + 1), 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [currentIdx])

  const handleHint = useCallback(() => {
    if (hintLevel < 4) setHintLevel(h => (h + 1) as HintLevel)
  }, [hintLevel])

  function handleSubmit() {
    if (!selectedAnswer || !confidence) return
    if (timerRef.current) clearInterval(timerRef.current)
    setSubmitted(true)
  }

  async function handleNext() {
    if (!user) return
    const timeSpent = Math.round((Date.now() - startTime) / 1000)
    const answer: Answer = {
      questionId: question.id,
      selectedAnswer,
      isCorrect: selectedAnswer === question.correctAnswer,
      timeSpentSeconds: timeSpent,
      confidence: confidence!,
      hintLevelUsed: hintLevel,
      studentReasoning: '',
    }
    const newAnswers = [...answers, answer]

    if (currentIdx < questionSet.length - 1) {
      setAnswers(newAnswers)
      setCurrentIdx(i => i + 1)
      setSelectedAnswer(null)
      setConfidence(null)
      setHintLevel(0)
      setSubmitted(false)
    } else {
      setIsAnalyzing(true)
      const stepInterval = setInterval(() => setAnalyzeStep(s => Math.min(s + 1, STEP_LABELS.length - 1)), 1200)
      const student = { id: user.id, name: user.name }
      try {
        const classInfo = safeParse<{ id?: string; name?: string; grade?: string }>(localStorage.getItem('learntwin_class')) ?? undefined
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student, subject: subjectMeta.subject, topic: subjectMeta.topic, answers: newAnswers, classInfo }),
        })
        const data = await res.json()
        clearInterval(stepInterval)
        localStorage.setItem('learntwin_result', JSON.stringify(data))
        router.push('/student/result')
      } catch {
        clearInterval(stepInterval)
        localStorage.setItem('learntwin_result', JSON.stringify({ error: true }))
        router.push('/student/result')
      }
    }
  }

  const timerStr = `${Math.floor(elapsed / 60).toString().padStart(2, '0')}:${(elapsed % 60).toString().padStart(2, '0')}`

  if (isAnalyzing) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div className="glass-card" style={{ padding: '48px 40px', width: '100%', maxWidth: '440px', textAlign: 'center' }}>
          {/* Spinner */}
          <div style={{ position: 'relative', width: '72px', height: '72px', margin: '0 auto 32px' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(128,131,255,0.15)' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid transparent', borderTopColor: 'var(--color-accent)', animation: 'spin 1s linear infinite' }} />
            <div style={{ position: 'absolute', inset: '20px', borderRadius: '50%', background: 'rgba(128,131,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🧠</div>
          </div>

          <div style={{ fontWeight: 700, fontSize: '20px', marginBottom: '10px' }}>Learning Twin analizi yapılıyor...</div>
          <div style={{ color: 'var(--color-muted)', fontSize: '14px', lineHeight: 1.7, marginBottom: '32px' }}>
            Claude AI cevaplarını inceliyor ve kişiselleştirilmiş öğrenme haritası oluşturuyor.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
            {STEP_LABELS.map((label, i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: i <= analyzeStep ? 'var(--color-text)' : 'var(--color-muted)' }}>
                <span style={{ fontSize: '16px' }}>{i < analyzeStep ? '✓' : i === analyzeStep ? '○' : '○'}</span>
                <span style={{ color: i < analyzeStep ? 'var(--color-emerald)' : i === analyzeStep ? 'var(--color-text)' : 'var(--color-muted)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    )
  }

  if (isLoadingQuestions) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-6">
          <div style={{ position: 'relative', width: '64px', height: '64px' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid rgba(99,102,241,0.2)' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid transparent', borderTopColor: '#6366f1', animation: 'spin 1s linear infinite' }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '20px', marginBottom: '8px' }}>Sorular hazırlanıyor...</div>
            <div style={{ color: 'var(--color-muted)', fontSize: '14px' }}>Adaptif soru motoru çalışıyor</div>
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    )
  }

  if (!question) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div style={{ fontWeight: 700, fontSize: '20px', marginBottom: '8px' }}>Soru yüklenemedi</div>
          <button className="btn-primary" onClick={() => router.push('/')} style={{ marginTop: '16px' }}>Ana Sayfaya Dön</button>
        </div>
      </main>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Session Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: '52px', borderBottom: '1px solid var(--border-subtle)' }}>
        <button
          onClick={() => router.push('/')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', fontSize: '18px', display: 'flex', alignItems: 'center', padding: '8px' }}
          aria-label="Çıkış"
        >
          ✕
        </button>
        <div style={{ fontWeight: 800, fontSize: '16px', fontFamily: 'var(--font-hanken)', letterSpacing: '-0.02em' }}>
          İşleyen
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '6px 12px', fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>
          ⏱ {timerStr}
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 20px 48px' }}>
        <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Progress row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
              SORU {currentIdx + 1} / {questionSet.length}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--color-muted)', background: 'rgba(255,255,255,0.06)', padding: '3px 10px', borderRadius: '999px' }}>
              {subjectMeta.subject} • {subjectMeta.topic}
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>

          {/* Question Card */}
          <div className="glass-card fade-in" style={{ padding: '28px' }} key={currentIdx}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <span style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
                {question.topic}
              </span>
              <span style={{
                padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, fontFamily: 'var(--font-mono)',
                background: question.difficulty === 'easy' ? 'rgba(16,185,129,0.12)' : question.difficulty === 'medium' ? 'rgba(245,158,11,0.12)' : 'rgba(244,63,94,0.12)',
                color: question.difficulty === 'easy' ? '#10b981' : question.difficulty === 'medium' ? '#f59e0b' : '#f43f5e',
              }}>
                {question.difficulty === 'easy' ? 'KOLAY' : question.difficulty === 'medium' ? 'ORTA' : 'ZOR'}
              </span>
            </div>

            <p style={{ fontSize: '17px', lineHeight: 1.7, marginBottom: '24px', fontWeight: 500 }}>{question.questionText}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {(Object.entries(question.options) as [string, string][]).map(([key, val]) => {
                let cls = 'option-btn'
                if (submitted) {
                  if (key === question.correctAnswer) cls += ' correct'
                  else if (key === selectedAnswer) cls += ' wrong'
                } else if (key === selectedAnswer) {
                  cls += ' selected'
                }
                return (
                  <button key={key} className={cls} onClick={() => !submitted && setSelectedAnswer(key)} disabled={submitted}>
                    <span style={{
                      width: '28px', height: '28px', borderRadius: '7px',
                      background: key === selectedAnswer && !submitted ? 'rgba(128,131,255,0.2)' : 'rgba(255,255,255,0.06)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 700, flexShrink: 0,
                      color: key === selectedAnswer && !submitted ? 'var(--color-accent)' : 'var(--color-muted)',
                    }}>
                      {key}
                    </span>
                    {val}
                  </button>
                )
              })}
            </div>

            {/* Hints */}
            {hintLevel > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {Array.from({ length: hintLevel }).map((_, i) => (
                  <div key={i} style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.18)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', lineHeight: 1.6 }}>
                    <span style={{ color: '#f59e0b', fontWeight: 600, fontSize: '11px', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>İPUCU {i + 1} </span>
                    {question.hints[i]}
                  </div>
                ))}
              </div>
            )}

            {/* Hint link */}
            {!submitted && hintLevel < 4 && (
              <button
                onClick={handleHint}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 }}
              >
                <span>📍</span> İpucu İste
              </button>
            )}
          </div>

          {/* Confidence Card */}
          {!submitted && (
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-muted)', letterSpacing: '0.07em', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>
                BU CEVAPTAN NE KADAR EMİNSİN?
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['low', 'medium', 'high'] as ConfidenceLevel[]).map(c => (
                  <button key={c} className={`confidence-btn${confidence === c ? ` active-${c}` : ''}`} onClick={() => setConfidence(c)}>
                    {CONFIDENCE_LABELS[c]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            className="btn-primary"
            onClick={submitted ? handleNext : handleSubmit}
            disabled={!submitted && (!selectedAnswer || !confidence)}
            style={{
              justifyContent: 'center', fontSize: '15px', padding: '14px',
              opacity: (!submitted && (!selectedAnswer || !confidence)) ? 0.45 : 1,
            }}
          >
            {submitted
              ? (currentIdx < questionSet.length - 1 ? 'Sonraki Soru →' : 'Analizi Gör →')
              : 'Cevapla'}
          </button>
        </div>
      </main>
    </div>
  )
}
