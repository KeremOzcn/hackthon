# İşleyen

> AI-powered personalized learning analytics platform for the YKS 2026 exam preparation ecosystem.

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000)](https://learntwin-hackathon.vercel.app)

---

## Overview

İşleyen creates a digital learning twin for each student by analyzing their real-time exam behavior — speed, accuracy, hint usage, and confidence levels. Using Google Gemini AI, it identifies learning personas, detects cognitive and behavioral issues, and generates actionable micro-interventions for students, teachers, and parents.

### Key Features

- **5 Learning Personas** — AI classifies students into distinct behavioral profiles
- **Adaptive Question Engine** — Difficulty adjusts based on previous performance
- **Real-time Analytics** — Teacher dashboard with risk distribution, accuracy trends, and twin type breakdowns
- **Gamification** — XP-based achievement system with 8 unlockable badges
- **PDF Export** — Server-side generated student reports using `@react-pdf/renderer`
- **Multi-subject Support** — Mathematics, Science, Turkish, and Social Sciences

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.6 (App Router) |
| Language | TypeScript 5.0 |
| Styling | Tailwind CSS v4 + Custom CSS Variables |
| Database | Supabase PostgreSQL |
| AI | Google Gemini (gemini-2.0-flash) |
| Charts | Recharts 3.8 |
| PDF | @react-pdf/renderer 4.5 |
| Deployment | Vercel |

---

## Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account
- Google Gemini API key

### Installation

```bash
# Clone the repository
git clone https://github.com/KeremOzcn/hackthon.git
cd hackthon

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous API key |
| `GEMINI_API_KEY` | Yes | Google Gemini API key for AI analysis |

---

## Project Structure

```
├── plans/                      # Project plans (architecture, API, security, etc.)
│   ├── README.md              # How to use these plans
│   ├── roadmap.md             # Completed, in-progress, and pending tasks
│   ├── architecture.md        # Technical architecture & data flow
│   ├── api.md                 # API contracts & endpoints
│   ├── business-logic.md      # Domain rules, twin classification, gamification
│   ├── data-model.md          # Database schema & relationships
│   ├── security.md            # Auth, threats, known vulnerabilities
│   ├── ui-ux.md               # Design system & page specs
│   └── testing.md             # E2E tests & coverage gaps
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/              # API routes
│   │   │   ├── analyze/     # Gemini AI analysis endpoint
│   │   │   ├── export/      # PDF generation endpoint
│   │   │   ├── questions/   # Adaptive question engine
│   │   │   ├── sessions/    # Student session history
│   │   │   └── subjects/    # Subject list endpoint
│   │   ├── parent/          # Parent report page
│   │   ├── student/         # Student flow
│   │   │   ├── achievements/
│   │   │   ├── history/
│   │   │   ├── result/
│   │   │   └── session/
│   │   └── teacher/         # Teacher dashboard
│   │       ├── analytics/
│   │       └── class/
│   ├── components/
│   │   ├── charts/           # Recharts components
│   │   ├── layout/          # Layout components
│   │   └── ui/              # UI components
│   ├── lib/                  # Utilities & business logic
│   │   ├── adaptive.ts      # Adaptive question selection
│   │   ├── gamification.ts  # Achievement & XP logic
│   │   ├── pdf.tsx          # PDF generation helper
│   │   ├── questions*.ts    # Question banks (Math/Science/Turkish)
│   │   └── supabase.ts      # Database client
│   └── types/
│       └── index.ts          # TypeScript type definitions
├── scripts/
│   └── seed-demo.ts          # Demo data seeder
├── supabase/
│   └── schema.sql            # Database schema
└── package.json
```

---

## Database Schema

### `learning_twin_results`

Primary table storing all student session results and AI analysis.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `student_id` | text | Student identifier |
| `student_name` | text | Student display name |
| `class_id` | text | Class identifier (optional) |
| `class_name` | text | Class display name |
| `class_grade` | text | Grade level (e.g., 10, 11) |
| `subject` | text | Subject (Matematik/Fen Bilimleri/Türkçe) |
| `topic` | text | Specific topic |
| `twin_type` | text | AI-detected learning persona |
| `dominant_pattern` | text | Primary behavior pattern |
| `cognitive_issue` | text | Detected cognitive difficulty |
| `behavioral_issue` | text | Detected behavioral problem |
| `risk_level` | enum | `low` / `medium` / `high` |
| `next_best_action` | text | Recommended intervention |
| `student_message` | text | Personalized student message |
| `teacher_action` | text | Teacher intervention suggestion |
| `parent_message` | text | Parent report message |
| `accuracy` | int | Percentage correct |
| `avg_time_seconds` | int | Average time per question |
| `hints_used` | int | Total hints consumed |
| `raw_answers` | jsonb | Array of answer objects |
| `achievements` | jsonb | Earned badges array |
| `created_at` | timestamptz | Session timestamp |

### Indexes

- `idx_results_student_id` — Student lookups
- `idx_results_class_id` — Class-based filtering
- `idx_results_risk_level` — Risk-based queries
- `idx_results_twin_type` — Twin type analytics
- `idx_results_created_at` — Time-series queries

### RLS Policy

```sql
CREATE POLICY "Allow all for demo"
ON learning_twin_results
FOR ALL
USING (true)
WITH CHECK (true);
```

> **Note:** The current RLS policy is permissive for hackathon demo purposes. Production deployments should implement proper authentication.

---

## API Routes

### `POST /api/analyze`

Analyzes student answers using Google Gemini AI and persists results.

**Request:**
```json
{
  "student": { "id": "string", "name": "string" },
  "subject": "Matematik",
  "topic": "Türev",
  "answers": [
    {
      "questionId": "string",
      "selectedAnswer": "B",
      "isCorrect": true,
      "timeSpentSeconds": 45,
      "confidence": "high",
      "hintLevelUsed": 1,
      "studentReasoning": "string"
    }
  ],
  "classInfo": {
    "id": "string",
    "name": "10-A",
    "grade": "10"
  }
}
```

**Response:**
```json
{
  "twinType": "Hızlı ama Dikkatsiz",
  "dominantPattern": "Soruyu hızlı okuyor ama işlem hataları yapıyor",
  "cognitiveIssue": "Dikkat dağınıklığı",
  "behavioralIssue": "Aceleci davranış",
  "riskLevel": "medium",
  "nextBestAction": "Zamanlayıcı ile sınava simülasyonu yap...",
  "studentMessage": "Soruları çözerken daha sakin olmalısın...",
  "teacherAction": "Öğrenciye yavaşlatma tekniklerini öğret...",
  "parentMessage": "Ahmet evde çalışırken zamanlayıcı kullanın...",
  "stats": { "accuracy": 72, "avgTimeSeconds": 18, "hintsUsed": 0, "highConfidenceWrong": 1 },
  "gamification": {
    "earnedAchievements": [...],
    "totalXP": 450,
    "newBadgesCount": 2
  },
  "persisted": true
}
```

### `GET /api/questions`

Returns 5 adaptive questions based on subject and previous performance.

**Query Parameters:**
- `subject` — Matematik, Fen Bilimleri, or Türkçe
- `studentId` — Optional, for adaptive difficulty

### `GET /api/sessions/[id]`

Returns session history for a specific student.

### `GET /api/subjects`

Returns available subjects with metadata.

### `POST /api/export`

Generates a PDF report for a student session.

**Request:**
```json
{ "studentId": "string" }
// OR
{ "sessionId": "uuid" }
```

**Response:** `application/pdf` attachment

---

## Learning Personas (Twin Types)

| Persona | Icon | Description |
|---------|------|-------------|
| **Hızlı ama Dikkatsiz** | ⚡ | Fast solver, makes careless mistakes |
| **Yavaş ama Sağlam** | 🐢 | Accurate but slow, struggles with time |
| **Konuyu Biliyor ama Modelleyemiyor** | 🧩 | Knows content but can't model problems |
| **İpucu Bağımlısı** | 🔦 | High hint dependency, lacks independence |
| **Sınav Panikçisi** | 😰 | Panics under pressure despite knowledge |

---

## Gamification

### Achievements

| Badge | XP | Condition |
|-------|-----|-----------|
| Hızlı Başlangıç | 100 | First session completed |
| İlk 10 Doğru | 200 | 10 correct answers total |
| Çalışkan Öğrenci | 300 | 3 sessions in a week |
| İpucu Ustası | 250 | Complete session with 0 hints |
| Hız Canavarı | 300 | Avg time < 30s with >80% accuracy |
| Risk Alıcı | 400 | First high-risk session improved |
| Konu Ustası | 350 | 90%+ accuracy in single subject |
| Süper Öğrenci | 500 | 5 sessions with improving accuracy |

---

## Team

| Role | Name | Primary Focus |
|------|------|---------------|
| Frontend Lead | Kerem Özcan | Student flow, UI/UX |
| Backend / AI Lead | Yağız Efe Gökçe | API routes, Gemini integration, DB |
| Dashboard Dev | Çiğdem Gökdağ | Teacher + Parent pages |
| Full-stack Dev | Ezgi Turan | Features, integrations, bug hunt |
| PM + Demo | Murat Emre Doğan | Story, QA, presentation |

### File Ownership

See team notes in the project wiki for the complete file ownership matrix.

---

## Deployment

### Vercel (Production)

- **URL:** [https://learntwin-hackathon.vercel.app](https://learntwin-hackathon.vercel.app)
- **Project:** `learntwin-hackathon`
- **Framework:** Next.js

### Supabase

- **Project:** `learntwin-hackathon`
- **Region:** `eu-central-1`
- **Status:** Production schema deployed, demo data seeded

### Environment Setup on Vercel

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add GEMINI_API_KEY production
```

---

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |
| `npx tsc --noEmit` | TypeScript type check |
| `npx tsx scripts/seed-demo.ts` | Seed demo data |

---

## Sprint Status

| Sprint | Focus | Status |
|--------|-------|--------|
| S0 | MVP | ✅ Complete |
| S1 | Multi-subject + History | ✅ Complete |
| S2 | Analytics Dashboard | ✅ Complete |
| S3 | PDF + Gamification | ✅ Complete |
| S4 | Adaptive Questions + Class Management | ✅ Complete |
| S5 | Deploy + Polish | ✅ Deployed — post-hackathon bug fixes in progress |

---

## License

Private — Hackathon project for İşleyen.

---

## Acknowledgments

- Built with [Next.js](https://nextjs.org) and [Vercel](https://vercel.com)
- AI powered by [Google Gemini](https://gemini.google.com)
- Data layer by [Supabase](https://supabase.com)
