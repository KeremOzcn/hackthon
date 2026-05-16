import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '@/lib/supabase'
import { computeAchievements } from '@/lib/gamification'
import type { Answer, LearningTwinResult } from '@/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

interface RequestBody {
  student: { id: string; name: string }
  subject: string
  topic: string
  answers: Answer[]
}

function computeStats(answers: Answer[]) {
  if (answers.length === 0) {
    return { accuracy: 0, avgTimeSeconds: 0, hintsUsed: 0, highConfidenceWrong: 0 }
  }
  const correct = answers.filter(a => a.isCorrect).length
  const accuracy = Math.round((correct / answers.length) * 100)
  const avgTime = Math.round(answers.reduce((s, a) => s + a.timeSpentSeconds, 0) / answers.length)
  const hintsUsed = answers.reduce((s, a) => s + a.hintLevelUsed, 0)
  const highConfidenceWrong = answers.filter(a => a.confidence === 'high' && !a.isCorrect).length
  return { accuracy, avgTimeSeconds: avgTime, hintsUsed, highConfidenceWrong }
}

function sanitizeForPrompt(text: string): string {
  return text.replace(/[`{}]/g, '')
}

export async function POST(req: NextRequest) {
  let body: RequestBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { student, subject, topic, answers } = body
  const stats = computeStats(answers)

  const safeSubject = sanitizeForPrompt(subject)
  const safeTopic = sanitizeForPrompt(topic)
  const safeStudentName = sanitizeForPrompt(student.name)

  const prompt = `Sen İşler LearnTwin AI'ın eğitim analisti yapay zekasısın. ${safeSubject} - ${safeTopic} bölümünde öğrenci çözüm davranışını analiz ediyorsun.

Öğrenci: ${safeStudentName}
Ders: ${safeSubject} - ${safeTopic}
Doğruluk: ${stats.accuracy}% (${answers.filter(a => a.isCorrect).length}/${answers.length} doğru)
Ortalama çözüm süresi: ${stats.avgTimeSeconds} saniye
Toplam ipucu kullanımı: ${stats.hintsUsed}
Yüksek eminlikle yanlış: ${stats.highConfidenceWrong}

Soru detayları:
${answers.map((a, i) => `Soru ${i + 1}: ${a.isCorrect ? '✓ Doğru' : '✗ Yanlış'} | Süre: ${a.timeSpentSeconds}s | Eminlik: ${a.confidence} | İpucu: ${a.hintLevelUsed} | Düşünce: "${sanitizeForPrompt(a.studentReasoning || '(yok)')}"`).join('\n')}

5 Learning Twin tipi:
1. "Hızlı ama Dikkatsiz" - Hızlı çözüyor, kolay sorularda hata yapıyor, yüksek eminlikle yanlış yapıyor
2. "Yavaş ama Sağlam" - Doğruluk iyi ama çok uzun süre harcıyor
3. "Konuyu Biliyor ama Modelleyemiyor" - Problem kurma/denklem oluşturma aşamasında takılıyor
4. "İpucu Bağımlısı" - Yüksek ipucu kullanımı, bağımsız çözüm güçlüğü
5. "Sınav Panikçisi" - Bilgi var ama baskı altında hata yapıyor

JSON formatında yanıt ver (sadece JSON, başka hiçbir şey yazma):

{
  "twinType": "Beş tipten biri",
  "dominantPattern": "En belirgin öğrenme davranışı kalıbı (1 cümle)",
  "cognitiveIssue": "Tespit edilen bilişsel zorluk (1 cümle)",
  "behavioralIssue": "Tespit edilen davranışsal sorun (1 cümle)",
  "riskLevel": "low veya medium veya high",
  "nextBestAction": "Önerilen spesifik mikro müdahale (1 cümle, çok somut)",
  "studentMessage": "Öğrenciye destekleyici mesaj, ismini kullan (2-3 cümle)",
  "teacherAction": "Öğretmene somut müdahale önerisi (2-3 cümle)",
  "parentMessage": "Veliye sade destekleyici mesaj (2-3 cümle)"
}`

  try {
    const [message, { data: prevSessions }] = await Promise.all([
      client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
      supabase
        .from('learning_twin_results')
        .select('subject, accuracy, created_at')
        .eq('student_id', student.id)
        .order('created_at', { ascending: false }),
    ])

    const raw = message.content[0].type === 'text' ? message.content[0].text : ''
    let analysis: any
    try {
      analysis = JSON.parse(raw)
    } catch {
      // Fallback: find the first top-level JSON object without the 's' flag (ES2018)
      const match = raw.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/)
      if (!match) throw new Error('No JSON in response')
      analysis = JSON.parse(match[0])
    }
    const result: LearningTwinResult = { ...analysis, stats }

    const gamification = computeAchievements(
      prevSessions || [],
      subject,
      answers,
      result
    )

    const { error: insertError } = await supabase.from('learning_twin_results').insert({
      student_id: student.id,
      student_name: student.name,
      subject,
      topic,
      twin_type: result.twinType,
      dominant_pattern: result.dominantPattern,
      risk_level: result.riskLevel,
      next_best_action: result.nextBestAction,
      student_message: result.studentMessage,
      teacher_action: result.teacherAction,
      parent_message: result.parentMessage,
      accuracy: stats.accuracy,
      avg_time_seconds: stats.avgTimeSeconds,
      hints_used: stats.hintsUsed,
      raw_answers: answers,
      achievements: gamification.earnedAchievements.map(a => ({ id: a.id, name: a.name, xp: a.xp })),
      created_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error('Failed to persist learning twin result:', insertError)
      return NextResponse.json({ ...result, gamification, persisted: false })
    }

    return NextResponse.json({ ...result, gamification, persisted: true })
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error }, { status: 500 })
  }
}
