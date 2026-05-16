import { Question } from '@/types'

export const questionsScience: Question[] = [
  {
    id: 'sci1',
    subject: 'Fen Bilimleri',
    topic: 'Fizik',
    difficulty: 'medium',
    questionText:
      'Düzgün doğrusal harekette 60 km/s hızla giden bir araç 2 saatte kaç km yol alır?',
    options: {
      A: '80',
      B: '100',
      C: '120',
      D: '150',
    },
    correctAnswer: 'C',
    hints: [
      'Düzgün doğrusal harekette yol = hız × zaman formülü kullanılır.',
      'Hız = 60 km/s, zaman = 2 saat. Bunları çarp.',
      'Yol = 60 × 2 = 120 km.',
      'Cevap: C (120 km)',
    ],
  },
  {
    id: 'sci2',
    subject: 'Fen Bilimleri',
    topic: 'Kimya',
    difficulty: 'hard',
    questionText:
      '2 mol H₂O kaç gram gelir? (H = 1, O = 16)',
    options: {
      A: '18 g',
      B: '20 g',
      C: '36 g',
      D: '40 g',
    },
    correctAnswer: 'C',
    hints: [
      'Önce 1 mol H₂O kaç gram olduğunu bul.',
      'H₂O molar kütlesi: 2×1 + 16 = 18 g/mol.',
      '2 mol H₂O = 2 × 18 = 36 g.',
      'Cevap: C (36 g)',
    ],
  },
  {
    id: 'sci3',
    subject: 'Fen Bilimleri',
    topic: 'Biyoloji',
    difficulty: 'medium',
    questionText:
      'Mitoz bölünme sonunda oluşan hücre sayısı ve kromozom sayısı hakkında hangisi doğrudur?',
    options: {
      A: '4 hücre, 2n kromozom',
      B: '2 hücre, 2n kromozom',
      C: '4 hücre, n kromozom',
      D: '2 hücre, n kromozom',
    },
    correctAnswer: 'B',
    hints: [
      'Mitoz ve mayoz bölünmeyi karıştırma. Mitoz kaç hücre üretir?',
      'Mitoz bölünme 1 hücreden 2 hücre üretir.',
      'Mitoz diploid (2n) hücre üretir; kromozom sayısı korunur.',
      'Cevap: B (2 hücre, 2n)',
    ],
  },
  {
    id: 'sci4',
    subject: 'Fen Bilimleri',
    topic: 'Fizik',
    difficulty: 'easy',
    questionText:
      "220 V elektrik kaynağına bağlı 1100 W'lık fırın kaç amper akım çeker?",
    options: {
      A: '3 A',
      B: '5 A',
      C: '8 A',
      D: '10 A',
    },
    correctAnswer: 'B',
    hints: [
      'Güç, gerilim ve akım arasındaki formülü hatırla: P = V × I.',
      'I = P / V formülünü kullan.',
      'I = 1100 / 220 = 5 A.',
      'Cevap: B (5 A)',
    ],
  },
  {
    id: 'sci5',
    subject: 'Fen Bilimleri',
    topic: 'Kimya',
    difficulty: 'easy',
    questionText:
      'pH = 7 olan bir çözeltinin özelliği nedir?',
    options: {
      A: 'Asidik',
      B: 'Bazik',
      C: 'Nötr',
      D: 'Güçlü asit',
    },
    correctAnswer: 'C',
    hints: [
      'pH skalasını hatırla: 0-14 arasındadır.',
      'pH < 7 asidik, pH > 7 bazik, pH = 7 nedir?',
      'pH = 7 tam nötr demektir.',
      'Cevap: C (Nötr)',
    ],
  },
  {
    id: 'sci6',
    subject: 'Fen Bilimleri',
    topic: 'Biyoloji',
    difficulty: 'easy',
    questionText:
      'Fotosentez olayında bitkiler hangi gazı atmosfere verir?',
    options: {
      A: 'Azot',
      B: 'Karbondioksit',
      C: 'Oksijen',
      D: 'Hidrojen',
    },
    correctAnswer: 'C',
    hints: [
      'Fotosentezde bitkiler ışık enerjisini kullanarak hangi işlemi yapar?',
      'Klorofil ile ışığı absorbe ederler ve su ile karbondioksitten glikoz üretirler.',
      'Bu işlem sonucunda atmosfere oksijen salınır.',
      'Cevap: C (Oksijen)',
    ],
  },
  {
    id: 'sci7',
    subject: 'Fen Bilimleri',
    topic: 'Fizik',
    difficulty: 'medium',
    questionText:
      '10 kg kütleyi 2 m/s² ivmeyle hareket ettirmek için kaç newton kuvvet uygulanmalıdır?',
    options: {
      A: '5 N',
      B: '8 N',
      C: '12 N',
      D: '20 N',
    },
    correctAnswer: 'D',
    hints: [
      'Newton yasasını hatırla: F = m × a.',
      'Kütle m = 10 kg, ivme a = 2 m/s².',
      'F = 10 × 2 = 20 N.',
      'Cevap: D (20 N)',
    ],
  },
  {
    id: 'sci8',
    subject: 'Fen Bilimleri',
    topic: 'Kimya',
    difficulty: 'hard',
    questionText:
      '200 mL %10 NaCl çözeltisi ile 300 mL %20 NaCl çözeltisi karıştırılıyor. Oluşan karışımın kitlece yüzde konsantrasyonu yaklaşık kaçtır? (Yoğunlukları eşit kabul ediniz.)',
    options: {
      A: '%14',
      B: '%15',
      C: '%16',
      D: '%18',
    },
    correctAnswer: 'C',
    hints: [
      'Her çözeltideki tuz miktarını ayrı ayrı hesapla.',
      '1. çözelti: 200 × 0,10 = 20 g tuz. 2. çözelti: 300 × 0,20 = 60 g tuz.',
      'Toplam tuz = 80 g. Toplam çözelti = 200 + 300 = 500 mL (yaklaşık 500 g).',
      'Yüzde = (80/500) × 100 = %16. Cevap: C (%16)',
    ],
  },
]
