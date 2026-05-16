import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { questions } from '@/lib/questions'
import { questionsScience } from '@/lib/questions-science'
import { questionsTurkish } from '@/lib/questions-turkish'
import { selectAdaptiveQuestions } from '@/lib/adaptive'

function getQuestionPool(subject: string) {
  if (subject === 'Fen Bilimleri') return questionsScience
  if (subject === 'Türkçe') return questionsTurkish
  return questions
}

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
    const { data: prevSessions, error } = await supabase
      .from('learning_twin_results')
      .select('twin_type, accuracy')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) throw new Error(error.message)

    const lastSession = prevSessions?.[0]
    const config = {
      twinType: (lastSession?.twin_type as import('@/types').TwinType) ?? null,
      previousAccuracy: lastSession?.accuracy ?? null,
    }

    const pool = getQuestionPool(subject)
    const selected = selectAdaptiveQuestions(pool, config)

    return NextResponse.json({ questions: selected })
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error }, { status: 500 })
  }
}
