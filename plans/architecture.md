---
version: 1.0.0
last_updated: 2026-05-20
domain: architecture
scope: root
---

# Architecture Plan

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js App Router | 16.2.6 |
| Runtime | React | 19.2.4 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | ^4 |
| Database | Supabase PostgreSQL | — |
| Auth | Supabase Auth + SSR | ^0.10.3 |
| AI | Anthropic SDK | ^0.96.0 |
| Charts | Recharts | ^3.8.1 |
| PDF | @react-pdf/renderer | ^4.5.1 |
| E2E Tests | Playwright | ^1.60.0 |

## File Map

```
src/
├── app/
│   ├── layout.tsx              — Root layout, globals.css, ToastManager
│   ├── page.tsx                — Landing (role select, subject, auth-aware)
│   ├── globals.css             — CSS vars, glassmorphism, component classes
│   ├── middleware.ts           — MISSING: needs server-side auth guards
│   │
│   ├── student/
│   │   ├── page.tsx            — MISSING: 404 trap for auth redirects
│   │   ├── session/page.tsx    — Question flow (adaptive load, timer, hints)
│   │   ├── result/page.tsx     — Twin analysis, stats, tabs, PDF export
│   │   ├── history/page.tsx    — Past sessions, search, pagination, streaks
│   │   └── achievements/page.tsx — XP/level, badge grid, evolution chart
│   │
│   ├── teacher/
│   │   ├── page.tsx            — Session list, risk sort, real-time updates
│   │   ├── analytics/page.tsx  — Recharts dashboards
│   │   ├── class/page.tsx      — Class creation/management
│   │   └── class/[classId]/page.tsx — Class detail + analytics
│   │
│   ├── parent/
│   │   └── page.tsx            — Child selector, latest report, Recharts trend
│   │
│   ├── courses/
│   │   ├── page.tsx            — Course list with visual roadmap
│   │   └── [id]/[topicSlug]/page.tsx — Topic detail
│   │
│   ├── auth/
│   │   ├── login/page.tsx      — Login form
│   │   └── signup/page.tsx     — Signup form
│   │
│   └── api/
│       ├── analyze/route.ts    — Claude AI + gamification + persistence
│       ├── questions/route.ts  — Adaptive question selection
│       ├── sessions/[id]/route.ts — Fetch student history
│       ├── subjects/route.ts   — Subject/topic list
│       ├── classes/route.ts    — Class CRUD
│       ├── class-enrollments/route.ts — Enrollment management
│       ├── export/route.tsx    — PDF report generation
│       ├── demo-session/route.ts — Demo teacher auth
│       └── demo-session-student/route.ts — Demo student auth
│
├── components/
│   ├── charts/
│   │   ├── RiskBarChart.tsx
│   │   ├── AccuracyTrend.tsx
│   │   └── TwinDistribution.tsx
│   ├── ui/
│   │   ├── Skeleton.tsx
│   │   ├── Toast.tsx
│   │   └── ToastManager.tsx
│   └── layout/
│       ├── DashboardLayout.tsx
│       ├── Footer.tsx
│       ├── PageHeader.tsx
│       └── TopNav.tsx
│
├── lib/
│   ├── supabase.ts             — Legacy client (keep for compat)
│   ├── supabase-client.ts      — Browser client
│   ├── supabase-server.ts      — Server client (cookies)
│   ├── auth.ts                 — Auth helpers, profile creation
│   ├── gamification.ts         — Achievement rules, XP engine
│   ├── adaptive.ts             — Twin-based difficulty distribution
│   ├── pdf.tsx                 — PDF template components
│   ├── questions.ts            — Matematik questions
│   ├── questions-science.ts    — Fen Bilimleri questions
│   ├── questions-turkish.ts    — Türkçe questions
│   └── (Sosyal Bilimler questions inlined in route)
│
└── types/
    └── index.ts                — All TypeScript interfaces
```

## Data Flow (Student Session)

```
1. Landing → selects role + subject + enters name
   → localStorage: { id: uuid, name, subject, topic }

2. /student/session → calls /api/questions (adaptive selection)
   → loads 5 questions from subject-specific question bank

3. Per-question interaction:
   - selectedAnswer (A/B/C/D)
   - confidence (low/medium/high)
   - hintLevel 0→4 (progressive disclosure)
   - timeSpentSeconds (auto-counted)
   - reasoning textarea (optional)

4. Last question submit → POST /api/analyze:
   Body: { student: {id, name}, subject, topic, answers: Answer[] }

5. API server:
   a. computeStats(answers) → { accuracy, avgTime, hintsUsed, highConfWrong }
   b. buildPrompt(student, stats, answers) → Claude API
   c. Parse JSON response
   d. Check achievements via gamification engine
   e. Insert into Supabase (fire-and-forget)
   f. Return LearningTwinResult + achievements

6. Client:
   → localStorage: learntwin_result = JSON.stringify(result)
   → router.push('/student/result')

7. /student/result:
   → Reads localStorage result
   → Displays twin type, stats, tabbed messages, achievements
```

## Component Boundaries

- **Pages** (`app/*/page.tsx`): Data fetching, layout composition, client-side redirects. No reusable logic.
- **Components** (`components/`): Reusable UI — charts, toasts, skeletons, layout shells. Pure presentational where possible.
- **Lib** (`lib/`): Domain logic — auth, gamification, adaptive engine, PDF templates. No React hooks.
- **Types** (`types/`): Single source of truth for all interfaces. Must stay in sync with `supabase/schema.sql`.
