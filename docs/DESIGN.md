# İşler LearnTwin AI — Design Brief for Stitch.ai

## Project Overview

**İşler LearnTwin AI** is an AI-powered Turkish education platform that builds a personalized "Learning Twin" for each student by analyzing their problem-solving behavior (answer accuracy, time spent, confidence level, hint usage, and written reasoning). The platform serves three user roles: **Student**, **Teacher**, and **Parent**.

The visual language is a **premium dark glassmorphism UI** — deep navy backgrounds, frosted glass cards, indigo accent system, and subtle glow effects. Think: modern edtech meets AI dashboard.

---

## Design System

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| Background Primary | `#0b1120` | Page background |
| Background Card | `rgba(255,255,255,0.04)` | Glass card surfaces |
| Card Hover | `rgba(255,255,255,0.07)` | Card hover state |
| Border Subtle | `rgba(255,255,255,0.08)` | Card borders |
| Text Primary | `#f1f5f9` | Main text |
| Text Muted | `#94a3b8` | Secondary/label text |
| Accent Indigo | `#6366f1` | Primary CTA, active states |
| Indigo Light | `#a5b4fc` | Accent labels, links |
| Amber | `#f59e0b` | Medium risk, hints, warnings |
| Emerald | `#10b981` | Low risk, success, correct answers |
| Rose | `#f43f5e` | High risk, errors, wrong answers |
| Violet | `#a78bfa` | Achievements, secondary accent |

### Typography

- **Font**: System UI stack (Inter-like) — `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **Heading XL**: 32–56px, weight 800, letter-spacing -0.02em
- **Heading L**: 24px, weight 800
- **Heading M**: 18–20px, weight 700
- **Body**: 14–15px, weight 400–500, line-height 1.6
- **Label / Badge**: 11–13px, weight 600, letter-spacing 0.03–0.05em

### Component System

#### Glass Card `.glass-card`
- Background: `rgba(255,255,255,0.04)`
- Border: `1px solid rgba(255,255,255,0.08)`
- Border Radius: 16px
- Backdrop Blur: 12px
- Hover: background shifts to `rgba(255,255,255,0.07)`

#### Primary Button `.btn-primary`
- Background: `#6366f1`
- Border Radius: 12px
- Padding: 12px 28px
- Font: 600, 15px, white
- Hover: opacity 0.9, translateY(-1px)

#### Outline Button `.btn-outline`
- Background: transparent
- Border: `1px solid rgba(255,255,255,0.08)`
- Hover: background `rgba(255,255,255,0.07)`

#### Risk Badges
- Low: emerald pill — `rgba(16,185,129,.15)` bg, `#10b981` text
- Medium: amber pill — `rgba(245,158,11,.15)` bg, `#f59e0b` text
- High: rose pill — `rgba(244,63,94,.15)` bg, `#f43f5e` text

#### Answer Options `.option-btn`
- Default: glass card with subtle border
- Selected: indigo border + indigo tint background
- Correct (after submit): emerald border + emerald tint
- Wrong (after submit): rose border + rose tint

#### Confidence Buttons
Three segments: "Emin Değilim" (rose) / "Biraz Eminim" (amber) / "Eminim" (emerald)
Active state highlights with colored border and tinted background.

#### Progress Bar
- Track: `rgba(255,255,255,0.08)`, height 4px, fully rounded
- Fill: indigo `#6366f1`, animated width transition

#### Skeleton Loader
- Shimmer gradient animation: dark → slightly lighter → dark, left to right
- Used in list rows (avatar + lines + badge shape)

---

## Pages

---

### 1. Landing Page `/`

**Purpose**: Entry point. User selects their role, then picks a subject, then enters their name.

**Layout**: Full-height centered column, max-width 896px

**Background FX**:
- Large radial gradient blob top-left: indigo `rgba(99,102,241,0.12)`, 600×600px
- Smaller radial gradient blob bottom-right: amber `rgba(245,158,11,0.08)`, 500×500px

**Step 1 — Role Selection**:
- Branded pill badge at top: "İşler Kitabevi × LearnTwin AI" — indigo border, indigo dot pulse
- Hero headline (3 lines, large): "Her öğrencinin / **öğrenme biçimi** (indigo gradient) / görünür olsun."
- Subheading in muted text
- 3-column grid of glass cards (role cards):
  - 🎓 Öğrenci — "Başla →" in indigo
  - 📊 Öğretmen — "Paneli Aç →" in amber
  - 👨‍👩‍👧 Veli — "Raporu Gör →" in emerald
- Each card: large emoji, bold title, description, action link at bottom
- Footer stats strip: "6 Boyut | Mikro | Claude AI" — 3 centered metrics

**Step 2 — Subject Selection** (fade-in glass card, max-width 480px):
- Title: "Hangi dersten test çözmek istiyorsun?"
- Subtitle: "5 soru · AI analizi · Kişisel rapor"
- 3 subject rows with colored left border:
  - 📐 Matematik (indigo) — "Problemler"
  - 🔬 Fen Bilimleri (emerald) — "Fizik & Kimya & Biyoloji"
  - 📖 Türkçe (amber) — "Dil ve Anlam"
- Each row: colored icon + subject name (colored) + topic (muted) + arrow right

**Step 3 — Name Entry** (fade-in glass card):
- Subject icon + "Merhaba! Adın ne?"
- Large text input field with placeholder
- Two buttons row: "Geri" (outline) + "Teste Başla" (primary, disabled if empty)

---

### 2. Student Session Page `/student/session`

**Purpose**: 5-question test flow with timer, hints, confidence rating, and reasoning.

**Layout**: Centered column, max-width 672px, top padding

**Header Bar** (space-between row):
- Left: "← Çıkış" button (muted)
- Center: "3 / 5" question counter
- Right: MM:SS timer in monospace font

**Progress Bar**: Full-width, 4px, indigo fill — animates with each question advance

**Question Card** (glass card, key-animated for fade-in on each new question):
- Topic badge (indigo tint) + Difficulty badge (easy=emerald / medium=amber / hard=rose)
- Question text: 17px, line-height 1.7, weight 500
- 4 answer options (A B C D) — each a full-width button
  - Letter key in small rounded square (dark background)
  - After submission: correct option turns emerald, wrong selection turns rose
- Hint reveal section (if hints requested):
  - Each hint: amber-tinted box with "İpucu N" label and hint text
- "💡 İpucu Al (N/4)" outline button — disappears at level 4 or after submission

**Confidence + Reasoning Card** (glass card, below question, hidden after submission):
- "Cevabından ne kadar eminsin?" label
- 3 confidence buttons: "Emin Değilim" / "Biraz Eminim" / "Eminim" (colored when active)
- "Bu soruyu çözerken ne düşündün?" label + textarea (2 rows, ghost style)

**Main CTA Button** (full-width, primary, large — 14px padding):
- Before answer: "Cevapla" (disabled if no answer or confidence selected, 50% opacity)
- After submission, not last: "Sonraki Soru →"
- After submission, last question: "Analizi Gör →"

**Analyzing Screen** (full-height centered, shown while Claude API is called):
- Spinning ring animation (indigo, 64px)
- "Learning Twin analizi yapılıyor..." bold
- "Claude AI cevaplarını inceliyor" muted subtitle

---

### 3. Student Result Page `/student/result`

**Purpose**: Shows the AI-generated Learning Twin analysis with stats, tabbed messages, and earned badges.

**Layout**: Centered column, max-width 672px

**Header Row**: "← Ana Sayfa" left / Risk badge (low/medium/high pill) right

**Twin Hero Card** (glass card, colored border and tint matching twin type):
- Large twin icon (emoji, 56px)
- "LEARNING TWIN TİPİN" small uppercase colored label
- Twin type name: 28px, weight 800, twin color
- Dominant pattern description: muted, 15px

**Twin Types & Colors**:
| Type | Icon | Color |
|---|---|---|
| Hızlı ama Dikkatsiz | ⚡ | amber `#f59e0b` |
| Yavaş ama Sağlam | 🐢 | emerald `#10b981` |
| Konuyu Biliyor ama Modelleyemiyor | 🧩 | indigo `#6366f1` |
| İpucu Bağımlısı | 🔦 | violet `#a78bfa` |
| Sınav Panikçisi | 😰 | rose `#f43f5e` |

**4 Stats Grid** (2×2 or 4 columns of glass cards):
- Doğruluk (%N)
- Ort. Süre (Ns)
- İpucu (N)
- Eminken Yanlış (N)

**Micro-Intervention Banner** (indigo-tinted box with 🎯 icon):
- "ÖNERİLEN MİKRO MÜDAHALE" label (indigo, small uppercase)
- Action text

**Tab Switcher** (pill-style tabs inside glass pill container):
- 🎓 Öğrenci | 📊 Öğretmen | 👨‍👩‍👧 Veli
- Active: indigo tint background, indigo-light text
- Inactive: transparent, muted text

**Tab Content** (glass card, fade-in on switch):
- Student tab: greeting + message + cognitive/behavioral issue box (indigo tint)
- Teacher tab: teacher action message
- Parent tab: parent message

**Achievement Badges Section** (glass card, only shown when badges exist):
- "🏅 Kazanılan Rozetler" header + "N/7" count pill (indigo)
- 2-column grid of badge cards:
  - Earned: indigo tint background, full opacity, emoji + label + description + ✨
  - Unearned: dark, 40% opacity
- Badges: 🎯 Keskin Nişancı / ⚡ Hız Ustası / 🧠 Bağımsız Düşünür / 🏆 Tam İsabet / 🔥 Ateş Hattı / 💪 Kararlı Öğrenci / ✅ Güvenli Atış

**Bottom Action Row**:
- "Geçmişim" (outline, flex 1)
- "Tekrar Çöz" (outline, flex 1)
- "Ana Sayfa" (primary, flex 1)

---

### 4. Student History Page `/student/history`

**Purpose**: Lists all past sessions with stats, streak indicator, and expandable detail panels.

**Layout**: Centered column, max-width 672px

**Page Header** (PageHeader component):
- "← Ana Sayfa" back link
- Title: "Geçmiş Testlerim"
- Subtitle: "AdSoyad · N oturum"
- Right: "+ Yeni Test" primary button (small)

**3-Column Summary Grid** (glass cards):
- 📋 Toplam Test — indigo value
- 🎯 Ort. Doğruluk — emerald/amber value depending on score
- 🏆 En Yüksek — violet value

**Streak Banner** (only shown when streak ≥ 2, amber gradient bg):
- 🔥 large emoji
- "N oturumluk seri!" — amber bold
- Subtitle: "Son N testinde %60+ doğruluk — harika gidiyorsun!"

**Session List** (glass card with overflow hidden):
- Table header: "Oturum Geçmişi" / "N kayıt" muted right
- Rows (skeleton during loading, `SkeletonRow` shimmer):
  - Twin icon in colored rounded-square avatar (44px)
  - Twin type name (colored) + subject pill (dark, 11px) + date
  - Accuracy progress bar (3px, colored: green≥80 / amber≥50 / rose<50)
  - Right: accuracy % bold + risk badge
  - Expand chevron (▶, rotates 90° when open)
- Expanded detail panel (fade-in):
  - 3-column mini stat row: Ort. Süre / İpucu / Konu
  - Dominant pattern box (dark glass)
  - Recommended action box (indigo tint)
  - "Bu konuyu tekrar çöz →" outline button

**Empty State**: 48px 📋 emoji, title, subtitle, "Teste Başla →" CTA

---

### 5. Teacher Dashboard `/teacher`

**Purpose**: Shows all student sessions sorted by risk level with expandable detail.

**Layout**: Centered column, max-width 768px, left-aligned

**Page Header**:
- "← Ana Sayfa" back
- "Öğretmen Paneli" H1
- "TYT Matematik — Problemler" subtitle
- Right: "N öğrenci analizi" muted

**3-Column Stats Grid**:
- Yüksek Riskli (rose number)
- Orta Riskli (amber number)
- Ort. Doğruluk (emerald %)

**Student List** (glass card, overflow hidden):
- Header: "Öğrenci Listesi"
- Loading: skeleton rows
- Each row (button, full-width):
  - Avatar circle with first letter initial (36px, dark bg)
  - Name (600, 14px) + twin type (muted, 12px)
  - Right: accuracy % + risk badge
  - Active row: indigo-tinted background
- Expanded detail (below row):
  - Student name + twin type
  - "Dominant Kalıp:" + pattern text
  - Amber-tinted box: "ÖNERİLEN MÜDAHALE" label + teacher_action text

---

### 6. Parent Report Page `/parent`

**Purpose**: Simplified parent-facing report showing child's learning profile and what to do.

**Layout**: Centered column, max-width 576px

**Page Header**: "← Ana Sayfa" / "Veli Raporu" / "En güncel öğrenme analizi"

**Student Profile Card** (glass card):
- Gradient avatar circle (indigo→violet, 52px) with first initial
- Name (700, 18px) + "TYT Matematik — Problemler"
- 2-column grid:
  - Accuracy % (large, bold)
  - Risk badge (large pill, colored)
- "ÖĞRENİM PROFİLİ" small colored label + twin type name

**Parent Message Card** (glass card):
- "ÇOCUĞUNUZ HAKKINDA" emerald label
- Message text (15px, 1.8 line-height, muted)

**Action Banner** (indigo-tinted with 💡 icon):
- "NE YAPILMALI?" label
- next_best_action text

**Footer Note**: "Bu analiz İşler LearnTwin AI tarafından [Name]'in soru çözüm davranışından otomatik oluşturulmuştur."

---

## User Flows

### Student Flow
```
Landing (role select)
  → Subject select (fade-in card)
    → Name entry (fade-in card)
      → /student/session (5-question test)
        → Analyzing screen (spinner)
          → /student/result (twin result)
            → /student/history (past sessions)
```

### Teacher Flow
```
Landing → /teacher (auto-loads from Supabase, mock fallback if empty)
```

### Parent Flow
```
Landing → /parent (auto-loads latest session from Supabase, mock fallback)
```

---

## Key Interaction Patterns

1. **Fade-in animation** on every page/card transition — `opacity 0→1 + translateY 8px→0`, 300ms ease-out-expo
2. **Glass card hover** — background opacity shifts subtly, no harsh borders
3. **Answer selection** — instant color feedback, disabled after submission
4. **Hint reveal** — progressive disclosure, amber-tinted boxes stack vertically
5. **Expand/collapse** — chevron rotates 90°, content fades in, row tints lightly
6. **Tab switching** — fade-in on content area, smooth pill background slide
7. **Risk badges** — consistently colored across all views (low=emerald, medium=amber, high=rose)
8. **Skeleton shimmer** — gradient sweeps left to right at 1.6s interval during loading

---

## Responsive Notes

- Max content width: 672px (student pages), 768px (teacher), 576px (parent)
- Cards stack to single column on mobile
- Grid → flex-wrap for small screens
- Minimum tap target: 44px height on all buttons
- Font scales down gracefully below 400px viewport

---

## Tone & Personality

- **Student-facing**: Warm, encouraging, never judgmental. "Harika gidiyorsun!" not "Başarısız"
- **Teacher-facing**: Professional, data-forward, actionable
- **Parent-facing**: Simple, plain language, supportive — no edu-jargon
- **Visual**: Premium dark, trustworthy AI tool — not playful/cartoon, not cold/corporate

---

*Last updated: 2026-05-16 | İşler LearnTwin AI Hackathon*
