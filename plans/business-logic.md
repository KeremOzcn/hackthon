---
version: 1.0.0
last_updated: 2026-05-20
domain: business-logic
scope: root
---

# Business Logic Plan

## Core Concept: Learning Twin

Each student gets a personalized "twin" profile after solving 5 questions. The twin captures their cognitive and behavioral learning patterns.

## Twin Classification (5 Types)

| Type | Icon | Color | Description |
|---|---|---|---|
| Hızlı ama Dikkatsiz | ⚡ | amber | Fast but careless |
| Yavaş ama Sağlam | 🐢 | emerald | Slow but thorough |
| Konuyu Biliyor ama Modelleyemiyor | 🧩 | indigo | Knows topic but can't model problems |
| İpucu Bağımlısı | 🔦 | violet | Heavy hint user |
| Sınav Panikçisi | 😰 | rose | Panics under time pressure |

**Invariant:** Twin type is always one of these five strings. No dynamic types are generated.

**Source:** Claude AI determines twin type based on accuracy, time per question, hint usage, and confidence patterns.

## Risk Scoring

| Level | DB Value | Criteria | Color |
|---|---|---|---|
| Low | `low` | accuracy ≥ 80%, low hint usage | emerald |
| Medium | `medium` | accuracy 50-79%, moderate hints | amber |
| High | `high` | accuracy < 50%, high hints, high-conf wrong answers | rose |

**Note:** Risk is computed by Claude AI, not by a deterministic formula. The stats are supplementary.

## Hint Ladder

Each question has 4 progressive hints:

| Level | Type | Description |
|---|---|---|
| 1 | Yönlendirme | General direction |
| 2 | Strateji | Problem-solving strategy |
| 3 | Kısmi Çözüm | Partial walkthrough |
| 4 | Tam Çözüm | Full solution |

**Rule:** Hints are consumed irreversibly. Once shown, they remain visible. `hintLevelUsed` ranges from 0 to 4.

## Gamification Engine

### Achievements (8 total)

| ID | Label | Description | Condition |
|---|---|---|---|
| `first-session` | 🎯 İlk Adım | İlk testi tamamla | accuracy ≥ 0 |
| `accuracy-80` | 🏆 Tam İsabet | %80+ doğruluk | accuracy ≥ 80 |
| `accuracy-100` | 💯 Mükemmel | %100 doğruluk | accuracy === 100 |
| `no-hints` | 🧠 Bağımsız Düşünür | Hiç ipucu kullanmadan tamamla | hintsUsed === 0 |
| `speed-demon` | ⚡ Hız Ustası | Ortalama süre < 30 sn/soru | avgTime < 30 |
| `high-confidence` | 💪 Kararlı Öğrenci | Tüm sorularda "Eminim" seç | all confidence === high |
| `streak-3` | 🔥 Seri Ustası | 3 oturum üst üste %60+ doğruluk | 3 consecutive sessions ≥ 60% |
| `balanced` | ✅ Dengeli Performans | Doğruluk 60-80, ipucu ≤ 2 | accuracy 60-80 && hintsUsed ≤ 2 |

### XP System

- Base XP: `accuracy * 10`
- Bonus: `+50` per achievement earned
- Level formula: `level = floor(xp / 500) + 1`

## Adaptive Question Engine

**Input:** Current twin type (or `null` for first session)
**Output:** 5 questions with difficulty distribution:

| Twin Type | Easy | Medium | Hard |
|---|---|---|---|
| First session | 2 | 2 | 1 |
| Hızlı ama Dikkatsiz | 1 | 2 | 2 |
| Yavaş ama Sağlam | 1 | 3 | 1 |
| Konuyu Biliyor ama Modelleyemiyor | 2 | 2 | 1 |
| İpucu Bağımlısı | 2 | 2 | 1 |
| Sınav Panikçisi | 2 | 2 | 1 |

**Rule:** Questions are selected randomly from the subject/topic pool matching the target difficulty distribution.

## Session State Machine

```
Landing → Selecting → Answering → Submitted → Next/Analyzing → Result
```

- **Selecting:** User picks answer. Can request hints. Can change answer.
- **Answering:** User picks confidence + reasoning. CTA is "Cevapla".
- **Submitted:** Answer locked. Correct option shown in emerald, wrong in rose.
- **Analyzing:** (only on question 5) Spinner while Claude API runs.
- **Result:** Display twin analysis.
