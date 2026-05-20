import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { selectAdaptiveQuestions } from '@/lib/adaptive'
import type { Question } from '@/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const studentId = searchParams.get('studentId')
  const subject = searchParams.get('subject')

  if (!studentId || !subject) {
    return NextResponse.json(
      { error: 'Missing studentId or subject' },
      { status: 400 }
    )
  }

  try {
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(studentId)

    const prevSessions = isValidUUID ? await supabase
      .from('learning_twin_results')
      .select('twin_type, accuracy')
      .eq('profile_id', studentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .then(({ data, error }) => { if (error) throw new Error(error.message); return data })
      : []

    const lastSession = (prevSessions as any[])?.[0]
    const config = {
      twinType: (lastSession?.twin_type as import('@/types').TwinType) ?? null,
      previousAccuracy: lastSession?.accuracy ?? null,
    }

    // Fetch subject id first
    const { data: subjectRow } = await supabase
      .from('subjects')
      .select('id')
      .eq('name', subject)
      .single()

    if (!subjectRow) {
      return NextResponse.json({ questions: [] })
    }

    // Fetch questions from DB by subject
    const { data: questionRows, error: qError } = await supabase
      .from('questions')
      .select('id, difficulty, question_text, options, correct_answer, hints, topic_id, topics(name)')
      .eq('subject_id', subjectRow.id)

    if (qError) throw new Error(qError.message)

    const pool: Question[] = (questionRows ?? []).map(row => ({
      id: row.id,
      subject,
      topic: (row as any).topics?.name ?? '',
      difficulty: row.difficulty as 'easy' | 'medium' | 'hard',
      questionText: row.question_text,
      options: row.options as { A: string; B: string; C: string; D: string },
      correctAnswer: row.correct_answer as 'A' | 'B' | 'C' | 'D',
      hints: (Array.isArray(row.hints) ? row.hints : []) as [string, string, string, string],
    }))

    const selected = selectAdaptiveQuestions(pool, config)

    return NextResponse.json({ questions: selected })
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error }, { status: 500 })
  }
}
