import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  renderToBuffer,
} from '@react-pdf/renderer'

Font.register({
  family: 'Inter',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/npm/inter-font@3/ttf/Inter-Regular.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/inter-font@3/ttf/Inter-Bold.ttf',
      fontWeight: 700,
    },
  ],
})

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#0b1120',
    padding: 24,
    fontFamily: 'Inter',
  },
  header: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    borderBottomStyle: 'solid',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: 4,
  },
  headerMeta: {
    fontSize: 11,
    color: '#94a3b8',
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 700,
    color: '#ffffff',
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    borderStyle: 'solid',
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: '#6366f1',
    letterSpacing: 0.5,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  twinTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: 6,
  },
  textMuted: {
    fontSize: 11,
    color: '#94a3b8',
    lineHeight: 1.6,
  },
  textBody: {
    fontSize: 11,
    color: '#e2e8f0',
    lineHeight: 1.6,
  },
  blockTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: 8,
  },
  issueBlock: {
    marginTop: 10,
  },
  issueLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: '#a5b4fc',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    borderStyle: 'solid',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: '#94a3b8',
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: 4,
  },
  statSub: {
    fontSize: 9,
    color: '#64748b',
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  achievementIcon: {
    fontSize: 16,
  },
  achievementName: {
    fontSize: 11,
    fontWeight: 700,
    color: '#ffffff',
  },
  achievementDesc: {
    fontSize: 9,
    color: '#94a3b8',
  },
  footer: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 9,
    color: '#64748b',
  },
})

const RISK_LABEL: Record<string, string> = {
  low: 'Düşük Risk',
  medium: 'Orta Risk',
  high: 'Yüksek Risk',
}

const RISK_COLORS: Record<string, string> = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#f43f5e',
}

const TWIN_ICONS: Record<string, string> = {
  'Hızlı ama Dikkatsiz': '⚡',
  'Yavaş ama Sağlam': '🐢',
  'Konuyu Biliyor ama Modelleyemiyor': '🧩',
  'İpucu Bağımlısı': '🔦',
  'Sınav Panikçisi': '😰',
}

interface PDFSession {
  student_name: string
  twin_type: string
  dominant_pattern: string
  cognitive_issue: string
  behavioral_issue: string
  risk_level: string
  next_best_action: string
  student_message: string
  teacher_action: string
  parent_message: string
  accuracy: number
  avg_time_seconds: number
  hints_used: number
  subject: string
  topic: string
  achievements: Array<{ id: string; name: string; xp: number; icon?: string; description?: string }>
  raw_answers: Array<{ question: string; answer: string; correct: boolean }>
  created_at: string
}

function SessionPDF({ session }: { session: PDFSession }) {
  const dateStr = session.created_at
    ? new Date(session.created_at).toLocaleDateString('tr-TR')
    : new Date().toLocaleDateString('tr-TR')
  const twinIcon = TWIN_ICONS[session.twin_type] ?? '🧠'
  const riskColor = RISK_COLORS[session.risk_level] ?? '#6366f1'

  const stats = {
    accuracy: session.accuracy ?? 0,
    avgTimeSeconds: session.avg_time_seconds ?? 0,
    hintsUsed: session.hints_used ?? 0,
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>İşler LearnTwin AI - Öğrenci Raporu</Text>
          <Text style={styles.headerMeta}>
            {session.student_name} • {session.subject} / {session.topic} • {dateStr}
          </Text>
        </View>

        <View style={[styles.badge, { backgroundColor: riskColor }]}>
          <Text style={styles.badgeText}>{RISK_LABEL[session.risk_level] ?? session.risk_level}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>LearnTwin Persona</Text>
          <Text style={styles.twinTitle}>
            {twinIcon}  {session.twin_type}
          </Text>
          <Text style={styles.textMuted}>{session.dominant_pattern}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Doğruluk Oranı</Text>
            <Text style={styles.statValue}>%{stats.accuracy}</Text>
            <Text style={styles.statSub}>Ortalama başarı ölçütü</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Ortalama Süre</Text>
            <Text style={styles.statValue}>{stats.avgTimeSeconds}sn</Text>
            <Text style={styles.statSub}>Soru başına</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>İpucu Kullanımı</Text>
            <Text style={styles.statValue}>{stats.hintsUsed}</Text>
            <Text style={styles.statSub}>Toplam</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Öğrenci Mesajı</Text>
          <Text style={styles.blockTitle}>Merhaba, {session.student_name}!</Text>
          <Text style={styles.textBody}>{session.student_message}</Text>
          <View style={styles.issueBlock}>
            <Text style={styles.issueLabel}>BİLİŞSEL SORUN</Text>
            <Text style={styles.textMuted}>{session.cognitive_issue}</Text>
          </View>
          <View style={styles.issueBlock}>
            <Text style={styles.issueLabel}>DAVRANIŞSAL SORUN</Text>
            <Text style={styles.textMuted}>{session.behavioral_issue}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Öğretmen Aksiyonu</Text>
          <Text style={styles.blockTitle}>Öğretmen Notu</Text>
          <Text style={styles.textBody}>{session.teacher_action}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Veli Raporu</Text>
          <Text style={styles.blockTitle}>Veli Raporu</Text>
          <Text style={styles.textBody}>{session.parent_message}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Sonraki Adım</Text>
          <Text style={styles.textBody}>{session.next_best_action}</Text>
        </View>

        {session.achievements && session.achievements.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Kazanılan Rozetler</Text>
            {session.achievements.map((ach) => (
              <View key={ach.id} style={styles.achievementRow}>
                <Text style={styles.achievementIcon}>{ach.icon ?? '🏅'}</Text>
                <View>
                  <Text style={styles.achievementName}>
                    {ach.name} (+{ach.xp} XP)
                  </Text>
                  {ach.description && (
                    <Text style={styles.achievementDesc}>{ach.description}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.footer}>Bu rapor Claude AI tarafından otomatik oluşturulmuştur.</Text>
      </Page>
    </Document>
  )
}

export async function POST(req: NextRequest) {
  let body: { studentId?: string; sessionId?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { studentId, sessionId } = body

  if (!studentId && !sessionId) {
    return NextResponse.json({ error: 'studentId or sessionId required' }, { status: 400 })
  }

  let query = supabase
    .from('learning_twin_results')
    .select(
      'student_name,twin_type,dominant_pattern,cognitive_issue,behavioral_issue,risk_level,next_best_action,student_message,teacher_action,parent_message,accuracy,avg_time_seconds,hints_used,subject,topic,achievements,raw_answers,created_at'
    )
    .limit(1)

  if (sessionId) {
    query = query.eq('id', sessionId)
  } else {
    query = query.eq('student_id', studentId).order('created_at', { ascending: false })
  }

  const { data, error } = await query.single()

  if (error || !data) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  try {
    const buffer = await renderToBuffer(<SessionPDF session={data as PDFSession} />)
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ogrenci-raporu-${data.student_name?.replace(/\s+/g, '_') ?? 'learntwin'}.pdf"`,
      },
    })
  } catch (err) {
    console.error('PDF render error:', err)
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 })
  }
}
