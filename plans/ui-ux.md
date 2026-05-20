---
version: 1.0.0
last_updated: 2026-05-20
domain: ui-ux
scope: root
---

# UI/UX Plan

## Design System

### Color Tokens

| Token | Hex | Usage |
|---|---|---|
| `--bg-primary` | `#0b1120` | Page background |
| `--bg-card` | `rgba(255,255,255,0.03)` | Glass card surfaces |
| `--color-text` | `#f1f5f9` | Primary text |
| `--color-muted` | `#94a3b8` | Secondary text |
| `--color-accent` | `#6366f1` | Primary CTA, active states (indigo) |
| `--color-amber` | `#f59e0b` | Medium risk, hints |
| `--color-emerald` | `#10b981` | Low risk, success |
| `--color-rose` | `#f43f5e` | High risk, errors |
| `--color-violet` | `#a78bfa` | Achievements |

### Component Primitives

- **Glass Card**: `backdrop-blur-md bg-white/[0.03] border border-white/[0.06] rounded-2xl`
- **Primary Button**: `bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-xl`
- **Outline Button**: `bg-transparent border border-white/[0.08] hover:bg-white/[0.05]`
- **Risk Badges**: Pill shape with tinted background matching risk color
- **Answer Options**: Full-width buttons, selected = indigo border, correct = emerald, wrong = rose

### Typography

- System UI stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- Headings: 800 weight, tight tracking
- Body: 400-500 weight, 1.6 line-height
- Labels/Badges: 11-13px, 600 weight, 0.03-0.05em letter-spacing

## Pages

### Landing (`/`)
- Full-height centered column, max-width 896px
- Role selection cards (Student / Teacher / Parent)
- Subject selector with colored left borders
- Name entry with primary CTA
- **Known Issue:** Old branding "LearnTwin AI" still in FAQ and testimonials

### Student Session (`/student/session`)
- Max-width 672px, centered column
- Header bar: exit button, question counter, timer
- Progress bar: 4px indigo fill
- Question card with difficulty badge, 4 answer options
- Confidence + reasoning card (hidden after submission)
- Hint reveal: progressive amber-tinted boxes
- Analyzing screen: spinner + "Learning Twin analizi yapılıyor..."

### Student Result (`/student/result`)
- Twin hero card with colored border matching twin type
- 4-stat grid: accuracy, avg time, hints used, high-confidence wrong
- Micro-intervention banner (indigo tint)
- Tab switcher: Student / Teacher / Parent messages
- Achievement badges section (if earned)
- Action row: Geçmişim / Tekrar Çöz / Ana Sayfa

### Student History (`/student/history`)
- KPI cards: total tests, avg accuracy, highest score
- Streak banner (amber gradient, shown if streak ≥ 2)
- Session list with expandable detail panels
- Search and pagination

### Teacher Dashboard (`/teacher`)
- Max-width 768px
- Risk stats grid: high/medium risk counts, average accuracy
- Session list with expand detail
- Real-time Supabase updates
- **Known Issue:** Hardcoded `84` accuracy fallback when no data

### Teacher Analytics (`/teacher/analytics`)
- Recharts dashboards
- Risk distribution bar chart
- Accuracy trend over time
- Twin type pie chart

### Parent Report (`/parent`)
- Max-width 576px
- Child selector (if multiple children linked)
- Student profile card with accuracy and risk badge
- Parent message card
- Recommended action banner
- **Known Issue:** Hardcoded "10. Sınıf", loads latest 50 globally

## Responsive Notes

- Cards stack to single column on mobile
- Min tap target: 44px
- Font scales down below 400px viewport
- Dashboard layouts switch to flex-wrap on small screens

## Accessibility

- All interactive elements have focus states
- Color is not the sole indicator of meaning (badges have text labels)
- Form inputs have associated labels
- **Gap:** No formal a11y audit performed. Run axe-core or Lighthouse audit.
