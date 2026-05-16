import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

// Polyfill WebSocket for Node.js < 22
// @ts-expect-error global WebSocket polyfill
globalThis.WebSocket = ws

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: { enabled: false },
  auth: { persistSession: false, autoRefreshToken: false },
})

function getPastDate(daysAgo: number): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString()
}

const rawAnswersTemplate = () => [
  { question: '1', answer: 'B', correct: true },
  { question: '2', answer: 'C', correct: false },
  { question: '3', answer: 'A', correct: true },
  { question: '4', answer: 'D', correct: false },
  { question: '5', answer: 'E', correct: true },
]

const achievementsTemplate = () => [
  { badge: 'Hızlı Başlangıç', earned_at: getPastDate(10) },
  { badge: 'İlk 10 Doğru', earned_at: getPastDate(7) },
  { badge: 'Çalışkan Öğrenci', earned_at: getPastDate(3) },
]

const rows = [
  {
    student_id: 'demo-1',
    student_name: 'Ahmet Yılmaz',
    class_id: 'demo-class-1',
    class_name: '10-A',
    class_grade: '10',
    subject: 'Matematik',
    topic: 'Türev',
    twin_type: 'Hızlı ama Dikkatsiz',
    dominant_pattern: 'Soruyu hızlı okuyor ama işlem hataları yapıyor',
    cognitive_issue: 'Dikkat dağınıklığı',
    behavioral_issue: 'Aceleci davranış',
    risk_level: 'medium',
    next_best_action: 'Zamanlayıcı ile sınava simülasyonu yap, işlemleri adım adım kontrol et',
    student_message: 'Soruları çözerken daha sakin olmalısın. Acele etmek yerine adım adım ilerle.',
    teacher_action: 'Öğrenciye yavaşlatma tekniklerini öğret, işlem basamaklarını kontrol ettir',
    parent_message: 'Ahmet evde çalışırken zamanlayıcı kullanın ve işlemleri sesli kontrol etsin.',
    accuracy: 72,
    avg_time_seconds: 18,
    hints_used: 0,
    raw_answers: rawAnswersTemplate(),
    achievements: achievementsTemplate().slice(0, 2),
    created_at: getPastDate(13),
  },
  {
    student_id: 'demo-2',
    student_name: 'Elif Kaya',
    class_id: 'demo-class-1',
    class_name: '10-A',
    class_grade: '10',
    subject: 'Fen Bilimleri',
    topic: 'Organik Kimya',
    twin_type: 'Yavaş ama Sağlam',
    dominant_pattern: 'Yavaş ama doğru çözüyor, zamana karşı zorlanıyor',
    cognitive_issue: 'İşlem hızı düşük',
    behavioral_issue: 'Aşırı temkinli davranış',
    risk_level: 'low',
    next_best_action: 'Zaman pratiği yap, basit sorularda hızlanmaya odaklan',
    student_message: 'Doğru çözüyorsun ama daha hızlı olabilirsin. Basit sorularda pratik yap.',
    teacher_action: 'Öğrenciye zamanlı mini testler ver, hız artırma stratejileri öğret',
    parent_message: 'Elif doğru çözüyor ancak hız konusunda pratik yapmalı. Mini testler uygulayın.',
    accuracy: 95,
    avg_time_seconds: 85,
    hints_used: 1,
    raw_answers: rawAnswersTemplate(),
    achievements: achievementsTemplate(),
    created_at: getPastDate(11),
  },
  {
    student_id: 'demo-3',
    student_name: 'Can Demir',
    class_id: 'demo-class-2',
    class_name: '11-B',
    class_grade: '11',
    subject: 'Türkçe',
    topic: 'Sözcükte Anlam',
    twin_type: 'Konuyu Biliyor ama Modelleyemiyor',
    dominant_pattern: 'Konu bilgisi var ama problemi modelleyemiyor',
    cognitive_issue: 'Sembolik düşünme zorluğu',
    behavioral_issue: 'Model kurma isteksizliği',
    risk_level: 'high',
    next_best_action: 'Görsel şema ve diyagram kullanarak modelleme pratiği yap',
    student_message: 'Konuyu biliyorsun ama soruya model kurmakta zorlanıyorsun. Şemalar kullan.',
    teacher_action: 'Öğrenciye görsel modelleme teknikleri göster, şablon sorularla pratik yaptır',
    parent_message: 'Can konuyu anlıyor ama modelleme konusunda desteğe ihtiyacı var. Görsel materyaller kullanın.',
    accuracy: 45,
    avg_time_seconds: 60,
    hints_used: 3,
    raw_answers: rawAnswersTemplate(),
    achievements: achievementsTemplate().slice(0, 1),
    created_at: getPastDate(10),
  },
  {
    student_id: 'demo-4',
    student_name: 'Ayşe Türk',
    class_id: 'demo-class-2',
    class_name: '11-B',
    class_grade: '11',
    subject: 'Matematik',
    topic: 'İntegral',
    twin_type: 'İpucu Bağımlısı',
    dominant_pattern: 'İpucu olmadan çözemiyor, bağımsız düşünemiyor',
    cognitive_issue: 'Bağımsız problem çözme eksikliği',
    behavioral_issue: 'İpucu talep etme alışkanlığı',
    risk_level: 'high',
    next_best_action: 'İpucusuz mini testler uygula, kendi kendine açıklama teknikleri geliştir',
    student_message: 'İpuçlarına çok bağımlısın. Kendi başına düşünmeye çalış, hata yapmak sorun değil.',
    teacher_action: 'Öğrenciye ipucu vermeden önce düşünme süresi tanı, kendi açıklamasını yaptır',
    parent_message: 'Ayşe evde çalışırken ipucu vermeden önce kendi düşünmesini bekleyin.',
    accuracy: 38,
    avg_time_seconds: 55,
    hints_used: 4,
    raw_answers: rawAnswersTemplate(),
    achievements: [],
    created_at: getPastDate(9),
  },
  {
    student_id: 'demo-5',
    student_name: 'Mert Şahin',
    class_id: 'demo-class-3',
    class_name: '9-C',
    class_grade: '9',
    subject: 'Fen Bilimleri',
    topic: 'Hücre Biyolojisi',
    twin_type: 'Sınav Panikçisi',
    dominant_pattern: 'Bildiği konularda bile panikle hata yapıyor',
    cognitive_issue: 'Performans kaygısı',
    behavioral_issue: 'Sınav kaynaklı kaçınma davranışı',
    risk_level: 'medium',
    next_best_action: 'Rahatlama teknikleri ve düşük riskli sınav simülasyonları yap',
    student_message: 'Sınavda panikleme. Önce derin nefes al, sonra sorulara başla.',
    teacher_action: 'Öğrenciye rahatlama teknikleri öğret, düşük baskılı sınav ortamları oluştur',
    parent_message: 'Mert sınavlarda panik yapıyor. Evde rahat ortamda pratik sınavlar yapın.',
    accuracy: 65,
    avg_time_seconds: 40,
    hints_used: 2,
    raw_answers: rawAnswersTemplate(),
    achievements: achievementsTemplate().slice(0, 2),
    created_at: getPastDate(8),
  },
  {
    student_id: 'demo-6',
    student_name: 'Ahmet Yılmaz',
    class_id: 'demo-class-1',
    class_name: '10-A',
    class_grade: '10',
    subject: 'Türkçe',
    topic: 'Cümlede Anlam',
    twin_type: 'Hızlı ama Dikkatsiz',
    dominant_pattern: 'Hızlı okuyor ama detayları kaçırıyor',
    cognitive_issue: 'Dikkat dağınıklığı',
    behavioral_issue: 'Aceleci davranış',
    risk_level: 'high',
    next_best_action: 'Soruyu iki kez okuma alışkanlığı kazandır, önemli kelimeleri altını çiz',
    student_message: 'Soruyu bir kez okuyup hemen cevap veriyorsun. Önce anlamaya odaklan.',
    teacher_action: 'Öğrenciye soru okuma stratejileri öğret, detaylara dikkat çek',
    parent_message: 'Ahmet Türkçe sorularını okurken acele ediyor. Sakin ve dikkatli okumasını sağlayın.',
    accuracy: 55,
    avg_time_seconds: 20,
    hints_used: 1,
    raw_answers: rawAnswersTemplate(),
    achievements: achievementsTemplate().slice(0, 1),
    created_at: getPastDate(7),
  },
  {
    student_id: 'demo-7',
    student_name: 'Elif Kaya',
    class_id: 'demo-class-1',
    class_name: '10-A',
    class_grade: '10',
    subject: 'Matematik',
    topic: 'Problemler',
    twin_type: 'Yavaş ama Sağlam',
    dominant_pattern: 'Her adımı kontrol ediyor, çok yavaş ilerliyor',
    cognitive_issue: 'İşlem hızı düşük',
    behavioral_issue: 'Aşırı temkinli davranış',
    risk_level: 'low',
    next_best_action: 'Adım adım hızlandırma hedefleri koy, zaman basit testler yap',
    student_message: 'Doğru çözüyorsun ama zaman konusunda pratik yapman lazım.',
    teacher_action: 'Öğrenciye zaman hedefleri koy, kademeli hız artırma çalışmaları yaptır',
    parent_message: 'Elif doğru çözüyor, zamana karşı pratik yaparak hızlanabilir.',
    accuracy: 92,
    avg_time_seconds: 88,
    hints_used: 0,
    raw_answers: rawAnswersTemplate(),
    achievements: achievementsTemplate(),
    created_at: getPastDate(6),
  },
  {
    student_id: 'demo-8',
    student_name: 'Can Demir',
    class_id: 'demo-class-2',
    class_name: '11-B',
    class_grade: '11',
    subject: 'Fen Bilimleri',
    topic: 'Fizik - Kuvvet ve Hareket',
    twin_type: 'Konuyu Biliyor ama Modelleyemiyor',
    dominant_pattern: 'Formülü biliyor ama uygulayamıyor',
    cognitive_issue: 'Sembolik düşünme zorluğu',
    behavioral_issue: 'Model kurma isteksizliği',
    risk_level: 'medium',
    next_best_action: 'Görsel şemalar ve adım adım modelleme rehberleri kullan',
    student_message: 'Formülü hatırlıyorsun ama soruya uygulamada zorlanıyorsun. Şema çiz.',
    teacher_action: 'Öğrenciye problem tiplerine göre şema şablonları sun',
    parent_message: 'Can formülleri biliyor ama uygulamada zorlanıyor. Şema çizme pratiği yaptırın.',
    accuracy: 68,
    avg_time_seconds: 72,
    hints_used: 2,
    raw_answers: rawAnswersTemplate(),
    achievements: achievementsTemplate().slice(0, 2),
    created_at: getPastDate(5),
  },
  {
    student_id: 'demo-9',
    student_name: 'Ayşe Türk',
    class_id: 'demo-class-2',
    class_name: '11-B',
    class_grade: '11',
    subject: 'Türkçe',
    topic: 'Paragraf',
    twin_type: 'İpucu Bağımlısı',
    dominant_pattern: 'İpucu verilmeden ana fikri bulamıyor',
    cognitive_issue: 'Bağımsız problem çözme eksikliği',
    behavioral_issue: 'İpucu talep etme alışkanlığı',
    risk_level: 'medium',
    next_best_action: 'Kendi kendine soru sorma teknikleri geliştir, ipucusuz pratik yap',
    student_message: 'İpucu istemeden önce kendine "Ana fikir nedir?" diye sor.',
    teacher_action: 'Öğrenciye metin analizi teknikleri öğret, kendi kendine soru sorma alışkanlığı kazandır',
    parent_message: 'Ayşe paragraf çalışırken ipucu istemeden önce kendi düşünsün.',
    accuracy: 70,
    avg_time_seconds: 48,
    hints_used: 3,
    raw_answers: rawAnswersTemplate(),
    achievements: achievementsTemplate().slice(0, 2),
    created_at: getPastDate(4),
  },
  {
    student_id: 'demo-10',
    student_name: 'Mert Şahin',
    class_id: 'demo-class-3',
    class_name: '9-C',
    class_grade: '9',
    subject: 'Matematik',
    topic: 'Geometri - Üçgenler',
    twin_type: 'Sınav Panikçisi',
    dominant_pattern: 'Zaman baskısı altında bildiği konularda hata yapıyor',
    cognitive_issue: 'Performans kaygısı',
    behavioral_issue: 'Sınav kaynaklı kaçınma davranışı',
    risk_level: 'high',
    next_best_action: 'Zaman baskısı olmadan pratik yap, sonra kademeli zaman kısıtlaması ekle',
    student_message: 'Önce zaman limiti olmadan çöz, sonra yavaş yavaş zaman kısıtla.',
    teacher_action: 'Öğrenciye zaman baskısı olmayan ortamlarda pratik yaptır, sonra simülasyon ekle',
    parent_message: 'Mert zamana karşı panik yapıyor. Önce rahat ortamda pratik yaptırın.',
    accuracy: 42,
    avg_time_seconds: 35,
    hints_used: 2,
    raw_answers: rawAnswersTemplate(),
    achievements: achievementsTemplate().slice(0, 1),
    created_at: getPastDate(3),
  },
  {
    student_id: 'demo-11',
    student_name: 'Ahmet Yılmaz',
    class_id: 'demo-class-1',
    class_name: '10-A',
    class_grade: '10',
    subject: 'Fen Bilimleri',
    topic: 'Ekoloji',
    twin_type: 'Hızlı ama Dikkatsiz',
    dominant_pattern: 'Konuyu biliyor ama dikkatsizlikle basit hatalar yapıyor',
    cognitive_issue: 'Dikkat dağınıklığı',
    behavioral_issue: 'Aceleci davranış',
    risk_level: 'low',
    next_best_action: 'Soruyu tekrar okuma ve cevabı kontrol etme alışkanlığı kazandır',
    student_message: 'Konuyu biliyorsun ama dikkatsizlikle hata yapıyorsun. Kontrol et.',
    teacher_action: 'Öğrenciye cevap kontrol listesi ver, her soruda kontrol adımı ekle',
    parent_message: 'Ahmet konuyu biliyor ama dikkatsizlikle hata yapıyor. Cevapları kontrol etmesini sağlayın.',
    accuracy: 88,
    avg_time_seconds: 22,
    hints_used: 0,
    raw_answers: rawAnswersTemplate(),
    achievements: achievementsTemplate().slice(0, 3),
    created_at: getPastDate(2),
  },
  {
    student_id: 'demo-12',
    student_name: 'Elif Kaya',
    class_id: 'demo-class-1',
    class_name: '10-A',
    class_grade: '10',
    subject: 'Türkçe',
    topic: 'Dil Bilgisi',
    twin_type: 'Yavaş ama Sağlam',
    dominant_pattern: 'Yavaş ama doğru çözüyor, zaman yönetimi iyileşiyor',
    cognitive_issue: 'İşlem hızı düşük',
    behavioral_issue: 'Aşırı temkinli davranış',
    risk_level: 'low',
    next_best_action: 'Hız artırma pratiği yap, zaman hedefleri koy',
    student_message: 'Doğru çözüyorsun, zaman yönetimini geliştirerek daha da iyi olabilirsin.',
    teacher_action: 'Öğrenciye zaman hedefli pratikler ver, başarısını takip et',
    parent_message: 'Elif doğru çözüyor, zaman konusunda da gelişiyor. Pratik yapmaya devam edin.',
    accuracy: 96,
    avg_time_seconds: 75,
    hints_used: 0,
    raw_answers: rawAnswersTemplate(),
    achievements: achievementsTemplate(),
    created_at: getPastDate(1),
  },
]

async function seed() {
  console.log('Deleting existing demo rows...')
  const { error: deleteError } = await supabase
    .from('learning_twin_results')
    .delete()
    .like('student_id', 'demo-%')

  if (deleteError) {
    console.error('Delete error:', deleteError)
    process.exit(1)
  }
  console.log('Deleted existing demo rows.')

  console.log(`Inserting ${rows.length} demo rows...`)
  const { error: insertError } = await supabase
    .from('learning_twin_results')
    .insert(rows)

  if (insertError) {
    console.error('Insert error:', insertError)
    process.exit(1)
  }

  console.log(`Successfully inserted ${rows.length} demo rows.`)
  process.exit(0)
}

seed()
