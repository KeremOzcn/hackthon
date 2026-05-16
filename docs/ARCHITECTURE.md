# İşler LearnTwin AI — Teknik Mimari

> Canonical kararlar için her zaman `PLAN.md`'e bak. Bu dosya NASIL sorusunu cevaplar.

---

## Sistem Mimarisi

```
┌─────────────────────────────────────────────────────────┐
│                     BROWSER (Client)                     │
│                                                         │
│  /               /student/session    /student/result    │
│  Landing         Question flow       Twin result        │
│                  Timer + hints       Tabs: S/T/P        │
│                  Confidence vote     Stats panel        │
│                                                         │
│  /teacher        /parent                                │
│  Dashboard       Veli raporu                            │
│  Risk sorted     Latest session                         │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP POST /api/analyze
                     │ (Next.js Route Handler)
┌────────────────────▼────────────────────────────────────┐
│                  NEXT.JS SERVER                          │
│                                                         │
│  src/app/api/analyze/route.ts                           │
│  1. computeStats(answers)                               │
│  2. buildPrompt(student, stats, answers)                │
│  3. claude.messages.create(...)   ──────────────────┐  │
│  4. parseJSON(response)                              │  │
│  5. supabase.insert(row)  ──────────────────────┐   │  │
│  6. return LearningTwinResult                   │   │  │
└─────────────────────────────────────────────────┼───┼──┘
                                                  │   │
                    ┌─────────────────────────────┘   │
                    ▼                                 ▼
         ┌──────────────────┐             ┌──────────────────┐
         │   SUPABASE DB    │             │  ANTHROPIC API   │
         │  learning_twin   │             │ claude-sonnet-4-6 │
         │  _results table  │             │  Turkish prompt  │
         └──────────────────┘             └──────────────────┘
```

---

## Dosya Haritası (Mevcut — Sprint 0)

```
learntwin/
├── src/
│   ├── app/
│   │   ├── layout.tsx              — Root layout, lang="tr", globals.css import
│   │   ├── page.tsx                — Landing: 3 rol kartı, isim girişi
│   │   ├── globals.css             — Design system: CSS vars, glass-card, badge, btn-*
│   │   │
│   │   ├── student/
│   │   │   ├── session/
│   │   │   │   └── page.tsx        — Soru akışı (timer, hint, confidence, reasoning)
│   │   │   └── result/
│   │   │       └── page.tsx        — Twin sonuç (hero card, stats, tabbed msgs)
│   │   │
│   │   ├── teacher/
│   │   │   └── page.tsx            — Öğretmen paneli (risk listesi, expand detail)
│   │   │
│   │   ├── parent/
│   │   │   └── page.tsx            — Veli raporu (en son session)
│   │   │
│   │   └── api/
│   │       └── analyze/
│   │           └── route.ts        — POST: Claude AI analizi + Supabase insert
│   │
│   ├── lib/
│   │   ├── supabase.ts             — createClient singleton
│   │   └── questions.ts            — 5 sabit TYT soru (hints dahil)
│   │
│   └── types/
│       └── index.ts                — Tüm TypeScript tipleri
│
├── supabase/
│   └── schema.sql                  — DB şeması (tek tablo, RLS policy)
│
├── docs/                           — Bu klasör
│   ├── PLAN.md
│   ├── ARCHITECTURE.md
│   ├── SPRINTS.md
│   └── ROLES.md
│
├── .env.local                      — SECRET (gitignored)
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Dosya Haritası (Planlanan — Sprint 1-5)

```
src/
├── app/
│   ├── student/
│   │   ├── history/
│   │   │   └── page.tsx            — S1: Geçmiş session listesi
│   │   └── achievements/
│   │       └── page.tsx            — S3: Rozetler + streak
│   │
│   ├── teacher/
│   │   ├── class/
│   │   │   └── [classId]/
│   │   │       └── page.tsx        — S4: Sınıf detay sayfası
│   │   └── analytics/
│   │       └── page.tsx            — S2: Grafik dashboard
│   │
│   └── api/
│       ├── subjects/
│       │   └── route.ts            — S1: Konu listesi endpoint
│       ├── sessions/
│       │   └── [studentId]/
│       │       └── route.ts        — S1: Öğrenci geçmişi
│       └── export/
│           └── route.ts            — S3: PDF rapor export
│
├── lib/
│   ├── questions-science.ts        — S1: Fen bilimleri soruları
│   ├── questions-turkish.ts        — S1: Türkçe soruları
│   └── pdf.ts                      — S3: PDF generation helper
│
└── components/                     — S2: Ortak component'lar
    ├── charts/
    │   ├── RiskBarChart.tsx         — Recharts bar chart
    │   ├── AccuracyTrend.tsx        — Zaman serisi
    │   └── TwinDistribution.tsx     — Pasta grafik
    ├── ui/
    │   ├── Modal.tsx
    │   ├── Toast.tsx
    │   └── Skeleton.tsx
    └── layout/
        └── PageHeader.tsx
```

---

## Veri Akışı (Student Session)

```
1. Landing → öğrenci isim girer
   → localStorage: { id: crypto.randomUUID(), name: string }

2. /student/session → questions.ts'den 5 soru yüklenir

3. Her soru için kullanıcı:
   - selectedAnswer (A/B/C/D) seçer
   - confidence (low/medium/high) seçer
   - hintLevel 0'dan başlar, "ipucu iste" butonuyla +1 artar (max 4)
   - timeSpentSeconds otomatik sayılır
   - reasoning textarea (opsiyonel)

4. 5. soru submit → POST /api/analyze:
   Body: { student: {id, name}, subject, topic, answers: Answer[] }

5. API sunucusu:
   a. computeStats(answers) → {accuracy, avgTimeSeconds, hintsUsed, highConfidenceWrong}
   b. Claude prompt oluşturur (Türkçe, stats + per-question detail)
   c. claude-sonnet-4-6 çağırır, JSON parse eder
   d. Supabase'e insert eder (fire-and-forget, hata ignore)
   e. LearningTwinResult döner

6. Client:
   → localStorage: learntwin_result = JSON.stringify(result)
   → router.push('/student/result')

7. /student/result:
   → localStorage'dan result ve student_name okur
   → Twin hero card, 4 stats, tabbed mesajlar gösterir
```

---

## Veri Modeli (Supabase)

```
learning_twin_results
─────────────────────────────────────────────
id                uuid PRIMARY KEY
student_id        text          localStorage uuid
student_name      text
subject           text          Şimdi: 'Matematik' | S1'de genişler
topic             text          Şimdi: 'Problemler'
twin_type         text          PLAN.md C7 listesinden biri
dominant_pattern  text          1 cümle (Claude üretir)
cognitive_issue   text          1 cümle (Claude üretir)
behavioral_issue  text          1 cümle (Claude üretir)
risk_level        text          'low' | 'medium' | 'high'
next_best_action  text          Somut mikro müdahale
student_message   text          2-3 cümle, destekleyici
teacher_action    text          2-3 cümle, pedagojik
parent_message    text          2-3 cümle, sade
accuracy          integer       0-100 (%)
avg_time_seconds  integer
hints_used        integer
raw_answers       jsonb         Answer[] array
created_at        timestamptz
```

---

## TypeScript Tipleri (src/types/index.ts)

```
ConfidenceLevel    = 'low' | 'medium' | 'high'
HintLevel          = 0 | 1 | 2 | 3 | 4
RiskLevel          = 'low' | 'medium' | 'high'
TwinType           = C7'deki 5 string literal union

Question {
  id, subject, topic, difficulty,
  questionText, options: {A,B,C,D},
  correctAnswer: 'A'|'B'|'C'|'D',
  hints: [string, string, string, string]
}

Answer {
  questionId, selectedAnswer, isCorrect,
  timeSpentSeconds, confidence, hintLevelUsed,
  studentReasoning?
}

LearningTwinResult {
  twinType, dominantPattern, cognitiveIssue, behavioralIssue,
  riskLevel, nextBestAction, studentMessage, teacherAction, parentMessage,
  stats: { accuracy, avgTimeSeconds, hintsUsed, highConfidenceWrong }
}
```

---

## Claude Prompt Yapısı

```
Rol:    Eğitim analisti (sabit sistem davranışı)
Girdi:  Öğrenci adı, ders/konu, istatistikler, soru bazlı detay
Çıktı:  Saf JSON (başka hiçbir şey yok)
        {twinType, dominantPattern, cognitiveIssue, behavioralIssue,
         riskLevel, nextBestAction, studentMessage, teacherAction, parentMessage}
Kısıt:  twinType PLAN.md C7 listesinden biri olmak zorunda
        riskLevel PLAN.md C8: 'low'|'medium'|'high'
```

---

## CSS Token Referansı (globals.css'den)

```
--bg-primary:      #0b1120
--bg-secondary:    #111827
--bg-card:         rgba(255,255,255,0.03)
--color-text:      #f1f5f9
--color-muted:     #94a3b8
--color-accent:    #6366f1   (indigo — primary)
--color-amber:     #f59e0b
--color-emerald:   #10b981
--color-rose:      #f43f5e
--color-violet:    #a78bfa
--border-subtle:   rgba(255,255,255,0.06)

Component sınıfları:
  .glass-card      — backdrop-blur, bg-card, border-subtle
  .btn-primary     — accent arka plan, flex, gap
  .btn-outline     — şeffaf, border-subtle
  .badge           — küçük pill
  .badge-low       — emerald
  .badge-medium    — amber
  .badge-high      — rose
  .fade-in         — opacity 0→1 animasyon
```

---

_Son güncelleme: 2026-05-16_
