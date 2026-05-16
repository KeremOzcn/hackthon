import type { Answer, LearningTwinResult, Achievement, GamificationResult } from '@/types'

interface SessionSummary {
  subject: string
  accuracy: number
  created_at: string
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_step',
    name: 'İlk Adım',
    description: 'İlk LearnTwin oturumunu tamamladın.',
    icon: '🚀',
    xp: 50,
  },
  {
    id: 'perfect_score',
    name: 'Mükemmel',
    description: 'Bir oturumda %100 doğruluk elde ettin.',
    icon: '💯',
    xp: 200,
  },
  {
    id: 'speed_demon',
    name: 'Hızlı Düşünür',
    description: 'Ortalama soru çözüm süren 30 saniyenin altında.',
    icon: '⚡',
    xp: 150,
  },
  {
    id: 'independent',
    name: 'Bağımsız Çalışan',
    description: 'Hiç ipucu kullanmadan bir oturum tamamladın.',
    icon: '🧠',
    xp: 150,
  },
  {
    id: 'streak_3',
    name: 'Seri Yapıcı',
    description: 'Toplam 3 oturum tamamladın.',
    icon: '🔥',
    xp: 100,
  },
  {
    id: 'multi_subject',
    name: 'Çok Yönlü Öğrenci',
    description: '2 farklı derste LearnTwin analizi aldın.',
    icon: '📚',
    xp: 150,
  },
  {
    id: 'high_confidence',
    name: 'Güven Yolcusu',
    description: 'Bir oturumda tüm sorulara yüksek eminlikle cevap verdin.',
    icon: '💪',
    xp: 100,
  },
  {
    id: 'improving',
    name: 'İyileşen Performans',
    description: 'Bir önceki oturumuna göre doğruluğunu artırdın.',
    icon: '📈',
    xp: 100,
  },
]

function checkFirstStep(prevSessions: SessionSummary[]): boolean {
  return prevSessions.length === 0
}

function checkPerfectScore(stats: LearningTwinResult['stats']): boolean {
  return stats.accuracy === 100
}

function checkSpeedDemon(stats: LearningTwinResult['stats']): boolean {
  return typeof stats.avgTimeSeconds === 'number' && stats.avgTimeSeconds < 30
}

function checkIndependent(stats: LearningTwinResult['stats']): boolean {
  return stats.hintsUsed === 0
}

function checkStreak3(prevSessions: SessionSummary[]): boolean {
  return prevSessions.length + 1 === 3
}

function checkMultiSubject(
  prevSessions: SessionSummary[],
  currentSubject: string
): boolean {
  const subjects = new Set(prevSessions.map(s => s.subject))
  subjects.add(currentSubject)
  return subjects.size >= 2
}

function checkHighConfidence(answers: Answer[]): boolean {
  return answers.length > 0 && answers.every(a => a.confidence === 'high')
}

function checkImproving(
  prevSessions: SessionSummary[],
  currentAccuracy: number
): boolean {
  if (prevSessions.length === 0) return false
  const sorted = [...prevSessions].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  const last = sorted[0]
  return currentAccuracy > last.accuracy
}

export function computeAchievements(
  prevSessions: SessionSummary[],
  currentSubject: string,
  answers: Answer[],
  result: LearningTwinResult
): GamificationResult {
  const earned: Achievement[] = []

  const checks: Record<string, boolean> = {
    first_step: checkFirstStep(prevSessions),
    perfect_score: checkPerfectScore(result.stats),
    speed_demon: checkSpeedDemon(result.stats),
    independent: checkIndependent(result.stats),
    streak_3: checkStreak3(prevSessions),
    multi_subject: checkMultiSubject(prevSessions, currentSubject),
    high_confidence: checkHighConfidence(answers),
    improving: checkImproving(prevSessions, result.stats.accuracy),
  }

  for (const ach of ACHIEVEMENTS) {
    if (checks[ach.id]) {
      earned.push(ach)
    }
  }

  const totalXP = earned.reduce((sum, a) => sum + a.xp, 0)

  return {
    earnedAchievements: earned,
    totalXP,
    newBadgesCount: earned.length,
  }
}
