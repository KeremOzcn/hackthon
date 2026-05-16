import { Question } from '@/types'

export const questionsTurkish: Question[] = [
  {
    id: 'tr1',
    subject: 'Türkçe',
    topic: 'Anlam Bilgisi',
    difficulty: 'medium',
    questionText:
      '"Bu konuyu kökünden çözmeliyiz." cümlesinde altı çizili sözcük hangi anlamda kullanılmıştır?',
    options: {
      A: 'Bitkinin kökü',
      B: 'Tamamen, tümüyle',
      C: 'Sayı kökü',
      D: 'Aile kökeni',
    },
    correctAnswer: 'B',
    hints: [
      'Sözcüğün cümle içindeki bağlamını incele. Gerçek anlamı mı kullanılmış?',
      '"Kökünden" burada mecaz anlam taşıyor. Nasıl bir etki anlatılıyor?',
      '"Tamamen, hiç bırakmadan" anlamını düşün.',
      'Cevap: B (Tamamen, tümüyle)',
    ],
  },
  {
    id: 'tr2',
    subject: 'Türkçe',
    topic: 'Dil Bilgisi',
    difficulty: 'easy',
    questionText:
      '"Koşmak" fiilinin mastar eki hangisidir?',
    options: {
      A: '-koş',
      B: '-ak',
      C: '-mak',
      D: '-ış',
    },
    correctAnswer: 'C',
    hints: [
      'Mastar eki fiile eklenerek isim görevli sözcük türetir.',
      'Türkçede mastar ekleri nelerdir?',
      'Mastar ekleri: -mak, -mek.',
      'Cevap: C (-mak)',
    ],
  },
  {
    id: 'tr3',
    subject: 'Türkçe',
    topic: 'Yazım Kuralları',
    difficulty: 'easy',
    questionText:
      'Aşağıdakilerden hangisi doğru yazılmıştır?',
    options: {
      A: 'herşey',
      B: 'her şey',
      C: 'Her Şey',
      D: 'herŞey',
    },
    correctAnswer: 'B',
    hints: [
      '"Her" sözcüğünün yazımını düşün. Bitişik mi ayrı mı yazılır?',
      '"Her" belirteç görevinde kullanıldığında kendinden sonraki sözcükten ayrı yazılır.',
      '"Her şey", "her zaman", "her yer" — hepsi ayrı yazılır.',
      'Cevap: B (her şey)',
    ],
  },
  {
    id: 'tr4',
    subject: 'Türkçe',
    topic: 'Paragraf',
    difficulty: 'hard',
    questionText:
      'Bir paragrafın ana fikrini bulmak için en doğru yöntem hangisidir?',
    options: {
      A: 'İlk cümleyi ana fikir kabul etmek',
      B: 'En uzun cümleyi seçmek',
      C: 'Tüm cümleleri kapsayan ortak düşünceyi bulmak',
      D: 'Son cümleyi ana fikir kabul etmek',
    },
    correctAnswer: 'C',
    hints: [
      'Ana fikir paragrafın genelini kapsar. Tek bir cümleyle sınırlı mı olur?',
      'Yardımcı fikirler ana fikri destekler. Ana fikir hangilerini kapsar?',
      'Doğru yöntem: tüm cümleleri oku, hepsinin ortak mesajını bul.',
      'Cevap: C',
    ],
  },
  {
    id: 'tr5',
    subject: 'Türkçe',
    topic: 'Sözcük Türleri',
    difficulty: 'medium',
    questionText:
      '"Güzel konuştu." cümlesinde "güzel" sözcüğü hangi görevde kullanılmıştır?',
    options: {
      A: 'Sıfat',
      B: 'İsim',
      C: 'Zarf',
      D: 'Zamir',
    },
    correctAnswer: 'C',
    hints: [
      '"Güzel" hangi sözcüğü nitelendiriyor? İsim mi fiil mi?',
      'Burada "güzel" fiili (konuştu) nitelendiriyor.',
      'Fiili niteleyen sözcükler zarf görevindedir.',
      'Cevap: C (Zarf)',
    ],
  },
]
