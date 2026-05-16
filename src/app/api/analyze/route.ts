import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '@/lib/supabase'
import type { Answer, LearningTwinResult } from '@/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

interface RequestBody {
  student: { id: string; name: string }
  subject: string
  topic: string
  answers: Answer[]
}

function computeStats(answers: Answer[]) {
  const correct = answers.filter(a => a.isCorrect).length
  const accuracy = Math.round((correct / answers.length) * 100)
  const avgTime = Math.round(answers.reduce((s, a) => s + a.timeSpentSeconds, 0) / answers.length)
  const hintsUsed = answers.reduce((s, a) => s + a.hintLevelUsed, 0)
  const highConfidenceWrong = answers.filter(a => a.confidence === 'high' && !a.isCorrect).length
  return { accuracy, avgTimeSeconds: avgTime, hintsUsed, highConfidenceWrong }
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

  const prompt = `Sen İşler LearnTwin AI'ın eğitim analisti yapay zekasısın. TYT matematik problemleri bölümünde öğrenci çözüm davranışını analiz ediyorsun.

Öğrenci: ${student.name}
Ders: ${subject} - ${topic}
Doğruluk: ${stats.accuracy}% (${answers.filter(a => a.isCorrect).length}/${answers.length} doğru)
Ortalama çözüm süresi: ${stats.avgTimeSeconds} saniye
Toplam ipucu kullanımı: ${stats.hintsUsed}
Yüksek eminlikle yanlış: ${stats.highConfidenceWrong}

Soru detayları:
${answers.map((a, i) => `Soru ${i + 1}: ${a.isCorrect ? '✓ Doğru' : '✗ Yanlış'} | Süre: ${a.timeSpentSeconds}s | Eminlik: ${a.confidence} | İpucu: ${a.hintLevelUsed} | Düşünce: "${a.studentReasoning || '(yok)'}"`).join('\n')}

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
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in response')

    const analysis = JSON.parse(jsonMatch[0])
    const result: LearningTwinResult = { ...analysis, stats }

    supabase.from('learning_twin_results').insert({
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
      created_at: new Date().toISOString(),
    }).then(() => {})

    return NextResponse.json(result)
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error }, { status: 500 })
  }
}
