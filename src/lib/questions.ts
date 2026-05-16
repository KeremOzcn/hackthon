import { Question } from '@/types'

export const questions: Question[] = [
  {
    id: 'q1',
    subject: 'Matematik',
    topic: 'Problemler',
    difficulty: 'medium',
    questionText:
      "Ayşe'nin yaşı kardeşinin yaşının 3 katından 2 fazladır. İkisinin yaşları toplamı 30 ise Ayşe kaç yaşındadır?",
    options: {
      A: '20',
      B: '22',
      C: '23',
      D: '24',
    },
    correctAnswer: 'C',
    hints: [
      "Kardeşin yaşını x olarak tanımla. Ayşe'nin yaşını x cinsinden yaz.",
      "Ayşe'nin yaşı = 3x + 2 olarak kurulur. Toplamları 30 ise: x + (3x + 2) = 30",
      "4x + 2 = 30 → 4x = 28 → x = 7. Şimdi Ayşe'nin yaşını bul.",
      "Kardeş = 7, Ayşe = 3(7) + 2 = 23. Cevap: C",
    ],
  },
  {
    id: 'q2',
    subject: 'Matematik',
    topic: 'Problemler',
    difficulty: 'medium',
    questionText:
      'Bir işi Ali 6 günde, Mehmet 4 günde yapabilmektedir. İkisi birlikte çalışırsa bu işi kaç günde bitirirler?',
    options: {
      A: '2',
      B: '2,4',
      C: '3',
      D: '5',
    },
    correctAnswer: 'B',
    hints: [
      "Ali'nin günlük iş payı 1/6, Mehmet'in 1/4. Birlikte günlük paylarını topla.",
      "Birlikte günlük pay = 1/6 + 1/4. Ortak paydaya getir: 2/12 + 3/12 = 5/12",
      "5/12 iş günde yapılırsa, tam iş = 12/5 = 2,4 günde yapılır.",
      'Cevap: B (2,4 gün)',
    ],
  },
  {
    id: 'q3',
    subject: 'Matematik',
    topic: 'Problemler',
    difficulty: 'hard',
    questionText:
      '%20 tuzlu 100 gr su ile %40 tuzlu 200 gr su karıştırılıyor. Oluşan karışımın tuz yüzdesi nedir?',
    options: {
      A: '%28',
      B: '%30',
      C: '%33',
      D: '%35',
    },
    correctAnswer: 'C',
    hints: [
      'Her karışımdaki tuz miktarını ayrı ayrı hesapla.',
      '1. karışım: 100 × 0,20 = 20 gr tuz. 2. karışım: 200 × 0,40 = 80 gr tuz.',
      'Toplam tuz = 100 gr. Toplam karışım = 300 gr. Yüzde = (100/300) × 100',
      'Yüzde = 33,3... ≈ %33. Cevap: C',
    ],
  },
  {
    id: 'q4',
    subject: 'Matematik',
    topic: 'Problemler',
    difficulty: 'easy',
    questionText:
      'İki araç aynı anda iki şehirden birbirine doğru hareket ediyor. Birinin hızı 60 km/s, diğerinin 80 km/s. Şehirler arası mesafe 280 km ise kaç saatte karşılaşırlar?',
    options: {
      A: '1,5',
      B: '2',
      C: '2,5',
      D: '3',
    },
    correctAnswer: 'B',
    hints: [
      'Karşılıklı hareketlerde hızlar toplanır. Birleşik hız nedir?',
      'Birleşik hız = 60 + 80 = 140 km/s.',
      'Süre = Mesafe / Hız = 280 / 140',
      'Süre = 2 saat. Cevap: B',
    ],
  },
  {
    id: 'q5',
    subject: 'Matematik',
    topic: 'Problemler',
    difficulty: 'easy',
    questionText:
      "Bir ürün 200 TL'ye alınıp %30 kâr ile satılıyor. Aynı ürün daha sonra %10 indirimle satışa çıkarılıyor. Son satış fiyatı nedir?",
    options: {
      A: '220 TL',
      B: '234 TL',
      C: '240 TL',
      D: '250 TL',
    },
    correctAnswer: 'B',
    hints: [
      '%30 kâr ile satış fiyatını hesapla.',
      'Kârlı satış = 200 × 1,30 = 260 TL.',
      '%10 indirim uygulanırsa: 260 × 0,90',
      '260 × 0,90 = 234 TL. Cevap: B',
    ],
  },
]
