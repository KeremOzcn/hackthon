import { Question, TwinType } from '@/types'

export interface AdaptiveConfig {
  twinType: TwinType | null
  previousAccuracy: number | null
}

export interface DifficultyDistribution {
  easy: number
  medium: number
  hard: number
}

function getBaseDistribution(twinType: TwinType | null): DifficultyDistribution {
  switch (twinType) {
    case 'Hızlı ama Dikkatsiz':
      return { easy: 0, medium: 3, hard: 2 }
    case 'Yavaş ama Sağlam':
      return { easy: 0, medium: 1, hard: 4 }
    case 'Konuyu Biliyor ama Modelleyemiyor':
      return { easy: 1, medium: 2, hard: 2 }
    case 'İpucu Bağımlısı':
      return { easy: 1, medium: 3, hard: 1 }
    case 'Sınav Panikçisi':
      return { easy: 2, medium: 2, hard: 1 }
    default:
      return { easy: 1, medium: 2, hard: 2 }
  }
}

function adjustDistribution(
  dist: DifficultyDistribution,
  accuracy: number | null
): DifficultyDistribution {
  if (accuracy == null) return dist
  let { easy, medium, hard } = dist

  if (accuracy < 40) {
    easy = Math.min(easy + 1, 5)
    hard = Math.max(hard - 1, 0)
  } else if (accuracy > 80) {
    easy = Math.max(easy - 1, 0)
    hard = Math.min(hard + 1, 5)
  }

  const total = easy + medium + hard
  if (total < 5) {
    medium += 5 - total
  } else if (total > 5) {
    medium -= total - 5
    if (medium < 0) {
      easy += medium
      medium = 0
      if (easy < 0) {
        hard += easy
        easy = 0
      }
    }
  }

  return { easy: Math.max(0, easy), medium: Math.max(0, medium), hard: Math.max(0, hard) }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickQuestions(pool: Question[], dist: DifficultyDistribution): Question[] {
  const byDifficulty = {
    easy: shuffle(pool.filter(q => q.difficulty === 'easy')),
    medium: shuffle(pool.filter(q => q.difficulty === 'medium')),
    hard: shuffle(pool.filter(q => q.difficulty === 'hard')),
  }

  const selected: Question[] = []
  const counts = { ...dist }

  ;(['easy', 'medium', 'hard'] as const).forEach(diff => {
    const available = byDifficulty[diff]
    const take = Math.min(counts[diff], available.length)
    selected.push(...available.slice(0, take))
    counts[diff] -= take
  })

  const remaining = counts.easy + counts.medium + counts.hard
  if (remaining > 0) {
    const leftovers = shuffle([
      ...byDifficulty.easy.filter(q => !selected.some(s => s.id === q.id)),
      ...byDifficulty.medium.filter(q => !selected.some(s => s.id === q.id)),
      ...byDifficulty.hard.filter(q => !selected.some(s => s.id === q.id)),
    ])
    selected.push(...leftovers.slice(0, remaining))
  }

  return selected
}

function orderForTwinType(questions: Question[], twinType: TwinType | null): Question[] {
  const sorted = [...questions]
  if (!twinType) {
    return sorted.sort((a, b) => {
      const order = { easy: 0, medium: 1, hard: 2 }
      return order[a.difficulty] - order[b.difficulty]
    })
  }

  switch (twinType) {
    case 'Hızlı ama Dikkatsiz':
      return sorted.sort((a, b) => {
        const order = { easy: 2, medium: 0, hard: 1 }
        return order[a.difficulty] - order[b.difficulty]
      })
    case 'Yavaş ama Sağlam':
      return sorted.sort((a, b) => {
        const order = { easy: 2, medium: 1, hard: 0 }
        return order[a.difficulty] - order[b.difficulty]
      })
    case 'Sınav Panikçisi':
      return sorted.sort((a, b) => {
        const order = { easy: 0, medium: 1, hard: 2 }
        return order[a.difficulty] - order[b.difficulty]
      })
    default:
      return sorted.sort((a, b) => {
        const order = { easy: 0, medium: 1, hard: 2 }
        return order[a.difficulty] - order[b.difficulty]
      })
  }
}

export function selectAdaptiveQuestions(
  pool: Question[],
  config: AdaptiveConfig
): Question[] {
  const base = getBaseDistribution(config.twinType)
  const adjusted = adjustDistribution(base, config.previousAccuracy)
  const picked = pickQuestions(pool, adjusted)
  return orderForTwinType(picked, config.twinType).slice(0, 5)
}
