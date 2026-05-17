'use client'

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  pdf,
} from '@react-pdf/renderer'
import type { LearningTwinResult, Achievement } from '@/types'

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

interface ResultPDFProps {
  result: LearningTwinResult
  studentName: string
  achievements?: Achievement[]
}

function ResultPDF({ result, studentName, achievements }: ResultPDFProps) {
  const dateStr = new Date().toLocaleDateString('tr-TR')
  const twinIcon = TWIN_ICONS[result.twinType] ?? '🧠'
  const riskColor = RISK_COLORS[result.riskLevel] ?? '#6366f1'

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>İşleyen - Öğrenci Raporu</Text>
          <Text style={styles.headerMeta}>{studentName} • {dateStr}</Text>
        </View>

        {/* Risk Badge */}
        <View style={[styles.badge, { backgroundColor: riskColor }]}>
          <Text style={styles.badgeText}>{RISK_LABEL[result.riskLevel] ?? result.riskLevel}</Text>
        </View>

        {/* Twin Type */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>LearnTwin Persona</Text>
          <Text style={styles.twinTitle}>{twinIcon}  {result.twinType}</Text>
          <Text style={styles.textMuted}>{result.dominantPattern}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Doğruluk Oranı</Text>
            <Text style={styles.statValue}>%{result.stats.accuracy}</Text>
            <Text style={styles.statSub}>Başarı: %60+</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Ortalama Süre</Text>
            <Text style={styles.statValue}>{result.stats.avgTimeSeconds}sn</Text>
            <Text style={styles.statSub}>Sınıf Ortalaması: 42sn</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>İpucu Kullanımı</Text>
            <Text style={styles.statValue}>{result.stats.hintsUsed}</Text>
            <Text style={styles.statSub}>Kritik sorularda 1.5</Text>
          </View>
        </View>

        {/* Student Message */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Öğrenci Mesajı</Text>
          <Text style={styles.blockTitle}>Merhaba, {studentName}!</Text>
          <Text style={styles.textBody}>{result.studentMessage}</Text>
          <View style={styles.issueBlock}>
            <Text style={styles.issueLabel}>BİLİŞSEL SORUN</Text>
            <Text style={styles.textMuted}>{result.cognitiveIssue}</Text>
          </View>
          <View style={styles.issueBlock}>
            <Text style={styles.issueLabel}>DAVRANIŞSAL SORUN</Text>
            <Text style={styles.textMuted}>{result.behavioralIssue}</Text>
          </View>
        </View>

        {/* Teacher Action */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Öğretmen Aksiyonu</Text>
          <Text style={styles.blockTitle}>Öğretmen Notu</Text>
          <Text style={styles.textBody}>{result.teacherAction}</Text>
        </View>

        {/* Parent Report */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Veli Raporu</Text>
          <Text style={styles.blockTitle}>Veli Raporu</Text>
          <Text style={styles.textBody}>{result.parentMessage}</Text>
        </View>

        {/* Achievements */}
        {achievements && achievements.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Kazanılan Rozetler</Text>
            {achievements.map((ach) => (
              <View key={ach.id} style={styles.achievementRow}>
                <Text style={styles.achievementIcon}>{ach.icon}</Text>
                <View>
                  <Text style={styles.achievementName}>{ach.name} (+{ach.xp} XP)</Text>
                  <Text style={styles.achievementDesc}>{ach.description}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>Bu rapor Claude AI tarafından otomatik oluşturulmuştur.</Text>
      </Page>
    </Document>
  )
}

export async function generateStudentPDF(
  result: LearningTwinResult,
  studentName: string,
  achievements?: Achievement[]
): Promise<string> {
  const blob = await pdf(
    <ResultPDF result={result} studentName={studentName} achievements={achievements} />
  ).toBlob()
  return URL.createObjectURL(blob)
}
