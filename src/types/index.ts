export type ConfidenceLevel = 'low' | 'medium' | 'high'
export type HintLevel = 0 | 1 | 2 | 3 | 4
export type RiskLevel = 'low' | 'medium' | 'high'

export type TwinType =
  | 'Hızlı ama Dikkatsiz'
  | 'Yavaş ama Sağlam'
  | 'Konuyu Biliyor ama Modelleyemiyor'
  | 'İpucu Bağımlısı'
  | 'Sınav Panikçisi'

export interface Question {
  id: string
  subject: string
  topic: string
  difficulty: 'easy' | 'medium' | 'hard'
  questionText: string
  options: { A: string; B: string; C: string; D: string }
  correctAnswer: 'A' | 'B' | 'C' | 'D'
  hints: [string, string, string, string]
}

export interface Answer {
  questionId: string
  selectedAnswer: string | null
  isCorrect: boolean
  timeSpentSeconds: number
  confidence: ConfidenceLevel
  hintLevelUsed: HintLevel
  studentReasoning: string
}

export interface AnswerSession {
  id?: string
  studentId: string
  studentName: string
  classId?: string
  className?: string
  classGrade?: string
  subject: string
  topic: string
  answers: Answer[]
  startedAt: string
  completedAt?: string
}

export interface LearningTwinResult {
  twinType: TwinType
  dominantPattern: string
  cognitiveIssue: string
  behavioralIssue: string
  riskLevel: RiskLevel
  nextBestAction: string
  studentMessage: string
  teacherAction: string
  parentMessage: string
  stats: {
    accuracy: number
    avgTimeSeconds: number
    hintsUsed: number
    highConfidenceWrong: number
  }
}

export interface TeacherSession {
  id: string
  studentName: string
  twinType: TwinType
  riskLevel: RiskLevel
  accuracy: number
  completedAt: string
  dominantPattern: string
  teacherAction: string
}
