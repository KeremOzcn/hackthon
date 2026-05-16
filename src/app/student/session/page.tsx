'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
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

export default function SessionPage() {
  const router = useRouter()
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [confidence, setConfidence] = useState<ConfidenceLevel | null>(null)
  const [hintLevel, setHintLevel] = useState<HintLevel>(0)
  const [reasoning, setReasoning] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [startTime, setStartTime] = useState(Date.now())
  const [elapsed, setElapsed] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [subjectMeta, setSubjectMeta] = useState({ subject: 'Matematik', topic: 'Problemler' })
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function safeParse<T>(value: string | null): T | null {
    if (!value) return null
    try {
      return JSON.parse(value) as T
    } catch {
      return null
    }
  }

  useEffect(() => {
    const raw = localStorage.getItem('learntwin_subject')
    const parsed = safeParse<{ subject?: string; topic?: string }>(raw)
    if (parsed?.subject && parsed?.topic) setSubjectMeta({ subject: parsed.subject, topic: parsed.topic })
  }, [])

  const questionSet = getQuestions(subjectMeta.subject)
  const question = questionSet[currentIdx]
  const progress = (currentIdx / questionSet.length) * 100

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
    const timeSpent = Math.round((Date.now() - startTime) / 1000)
    const answer: Answer = {
      questionId: question.id,
      selectedAnswer,
      isCorrect: selectedAnswer === question.correctAnswer,
      timeSpentSeconds: timeSpent,
      confidence: confidence!,
      hintLevelUsed: hintLevel,
      studentReasoning: reasoning,
    }
    const newAnswers = [...answers, answer]

    if (currentIdx < questionSet.length - 1) {
      setAnswers(newAnswers)
      setCurrentIdx(i => i + 1)
      setSelectedAnswer(null)
      setConfidence(null)
      setHintLevel(0)
      setReasoning('')
      setSubmitted(false)
    } else {
      setIsAnalyzing(true)
      const student = safeParse<{ id?: string; name?: string }>(localStorage.getItem('learntwin_student')) ?? { id: 'demo', name: 'Öğrenci' }

      try {
        const classInfo = safeParse<{ id?: string; name?: string; grade?: string }>(localStorage.getItem('learntwin_class')) ?? undefined
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student, subject: subjectMeta.subject, topic: subjectMeta.topic, answers: newAnswers, classInfo }),
        })
        const data = await res.json()
        localStorage.setItem('learntwin_result', JSON.stringify(data))
        router.push('/student/result')
      } catch {
        localStorage.setItem('learntwin_result', JSON.stringify({ error: true }))
        router.push('/student/result')
      }
    }
  }

  if (isAnalyzing) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-6">
          <div style={{ position: 'relative', width: '64px', height: '64px' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid rgba(99,102,241,0.2)' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid transparent', borderTopColor: '#6366f1', animation: 'spin 1s linear infinite' }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '20px', marginBottom: '8px' }}>Learning Twin analizi yapılıyor...</div>
            <div style={{ color: 'var(--color-muted)', fontSize: '14px' }}>Claude AI cevaplarını inceliyor</div>
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => router.push('/')} style={{ color: 'var(--color-muted)', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}>
            ← Çıkış
          </button>
          <div style={{ fontSize: '13px', color: 'var(--color-muted)', fontWeight: 600 }}>{currentIdx + 1} / {questionSet.length}</div>
          <div style={{ fontSize: '13px', color: 'var(--color-muted)', fontFamily: 'monospace' }}>
            {Math.floor(elapsed / 60).toString().padStart(2, '0')}:{(elapsed % 60).toString().padStart(2, '0')}
          </div>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="glass-card fade-in" style={{ padding: '28px' }} key={currentIdx}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
              {question.topic}
            </span>
            <span style={{
              background: question.difficulty === 'easy' ? 'rgba(16,185,129,0.12)' : question.difficulty === 'medium' ? 'rgba(245,158,11,0.12)' : 'rgba(244,63,94,0.12)',
              color: question.difficulty === 'easy' ? '#10b981' : question.difficulty === 'medium' ? '#f59e0b' : '#f43f5e',
              padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
            }}>
              {question.difficulty === 'easy' ? 'Kolay' : question.difficulty === 'medium' ? 'Orta' : 'Zor'}
            </span>
          </div>

          <p style={{ fontSize: '17px', lineHeight: 1.7, marginBottom: '20px', fontWeight: 500 }}>{question.questionText}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
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
                  <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>
                    {key}
                  </span>
                  {val}
                </button>
              )
            })}
          </div>

          {hintLevel > 0 && (
            <div style={{ marginBottom: '16px' }}>
              {Array.from({ length: hintLevel }).map((_, i) => (
                <div key={i} style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '10px', padding: '12px 14px', marginBottom: '8px', fontSize: '14px', lineHeight: 1.5 }}>
                  <span style={{ color: '#f59e0b', fontWeight: 600, fontSize: '12px' }}>İpucu {i + 1} </span>
                  {question.hints[i]}
                </div>
              ))}
            </div>
          )}

          {!submitted && hintLevel < 4 && (
            <button className="btn-outline" onClick={handleHint} style={{ fontSize: '13px', padding: '8px 16px', marginBottom: '16px' }}>
              💡 İpucu Al ({hintLevel}/4)
            </button>
          )}
        </div>

        {!submitted && (
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-muted)', marginBottom: '8px' }}>Cevabından ne kadar eminsin?</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['low', 'medium', 'high'] as ConfidenceLevel[]).map(c => (
                  <button key={c} className={`confidence-btn${confidence === c ? ` active-${c}` : ''}`} onClick={() => setConfidence(c)}>
                    {CONFIDENCE_LABELS[c]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-muted)', marginBottom: '8px' }}>
                Bu soruyu çözerken ne düşündün? <span style={{ fontWeight: 400 }}>(isteğe bağlı)</span>
              </div>
              <textarea
                value={reasoning}
                onChange={e => setReasoning(e.target.value)}
                placeholder="Kısa bir açıklama yaz..."
                rows={2}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-text)', fontSize: '14px', outline: 'none', resize: 'none' }}
              />
            </div>
          </div>
        )}

        <button
          className="btn-primary"
          onClick={submitted ? handleNext : handleSubmit}
          disabled={!submitted && (!selectedAnswer || !confidence)}
          style={{ justifyContent: 'center', fontSize: '16px', padding: '14px', opacity: (!submitted && (!selectedAnswer || !confidence)) ? 0.5 : 1 }}
        >
          {submitted
            ? (currentIdx < questionSet.length - 1 ? 'Sonraki Soru →' : 'Analizi Gör →')
            : 'Cevapla'}
        </button>
      </div>
    </main>
  )
}
