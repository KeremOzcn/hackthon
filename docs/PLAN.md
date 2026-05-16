# İşler LearnTwin AI — Master Plan

> **ANTI-HALLUCINATION CONTRACT**: Bu dosya projenin tek gerçek kaynağıdır.
> Yeni bir Claude session açıldığında ÖNCE bu dosyayı oku, sonra kod yaz.
> Canonical Decisions bölümündeki hiçbir karar tartışılmadan değiştirilemez.

---

## Hızlı Başvuru

| Dosya | İçerik |
|-------|--------|
| `docs/PLAN.md` | **Bu dosya** — master index, canonical kararlar, decision log |
| `docs/ARCHITECTURE.md` | Teknik mimari, dosya haritası, data flow |
| `docs/SPRINTS.md` | Sprint planı, görevler, sahiplik matrisi |
| `docs/ROLES.md` | Ekip rolleri, sorumluluk sınırları |

---

## Proje Kimliği

```
Proje adı  : İşler LearnTwin AI
Etkinlik   : Hackathon (yaklaşık 24 saat)
Tarih      : 2026-05-16
Repo       : https://github.com/KeremOzcn/hackthon
Dizin      : /learntwin  (monorepo içinde)
Deploy     : Vercel (hedef)
```

---

## CANONICAL DECISIONS — KILITLI, DEĞİŞTİRİLEMEZ

> Bu kararlar ekip tarafından onaylanmış, Claude her session başında bunları
> referans alır. Değiştirmek için önce ekip içinde karar al, sonra
> Decision Log'a yaz ve bu listeyi güncelle.

| # | Karar | Detay |
|---|-------|-------|
| C1 | **Framework** | Next.js App Router (TypeScript, `src/` dir) |
| C2 | **Stil** | Tailwind utility + custom CSS vars (globals.css), glassmorphism dark tema |
| C3 | **DB** | Supabase PostgreSQL — tek tablo: `learning_twin_results` |
| C4 | **AI** | Anthropic `claude-sonnet-4-6` — sadece `/api/analyze` route'undan çağrılır |
| C5 | **Session state** | localStorage (client), Supabase (persisted) |
| C6 | **Dil** | UI tamamen Türkçe, kod + comment İngilizce |
| C7 | **Twin tipleri** | 5 tip — isim değişmez: Hızlı ama Dikkatsiz, Yavaş ama Sağlam, Konuyu Biliyor ama Modelleyemiyor, İpucu Bağımlısı, Sınav Panikçisi |
| C8 | **Risk seviyeleri** | 3 seviye — `low` / `medium` / `high` (DB'de İngilizce) |
| C9 | **Renk sistemi** | `--color-accent: #6366f1`, amber `#f59e0b`, emerald `#10b981`, rose `#f43f5e`, violet `#a78bfa` |
| C10 | **Route yapısı** | `/` landing, `/student/session`, `/student/result`, `/teacher`, `/parent`, `/api/analyze` |
| C11 | **Hint ladder** | 4 seviye: yönlendirme → strateji → kısmi çözüm → tam çözüm |
| C12 | **Mock fallback** | DB boşsa teacher/parent mock data gösterir, uygulama çökmez |

---

## Ekip

| Kişi | Rol | Birincil alan |
|------|-----|---------------|
| Dev 1 | Frontend Lead | Student flow, UI/UX |
| Dev 2 | Backend/AI | API routes, Claude entegrasyonu |
| Dev 3 | Dashboard | Teacher + Parent sayfaları |
| Dev 4 | Full-stack | Yeni özellikler, entegrasyonlar |
| PM | Product + Demo | Sunum, QA, içerik |

Detay: `docs/ROLES.md`

---

## Mevcut Durum (Sprint 0 — TAMAMLANDI)

```
[x] Next.js projesi oluşturuldu
[x] Supabase bağlantısı kuruldu
[x] 5 TYT Matematik sorusu (questions.ts)
[x] Student session flow (timer + hint ladder + confidence)
[x] /api/analyze — Claude AI analizi
[x] Student result sayfası (twin tipi + stats + tabbed mesajlar)
[x] Teacher dashboard (risk sıralama + expand panel)
[x] Parent report sayfası
[x] GitHub'a push edildi
[x] TypeScript hatası yok
```

---

## Sprint Özeti

| Sprint | Süre | Odak | Detay |
|--------|------|------|-------|
| S0 | DONE | MVP | Yukarıda |
| S1 | 0-4h | Çok konu + geçmiş | `SPRINTS.md` S1 |
| S2 | 4-10h | Gelişmiş dashboard + analytics | `SPRINTS.md` S2 |
| S3 | 10-16h | PDF + bildirim + gamification | `SPRINTS.md` S3 |
| S4 | 16-20h | Adaptif sorular + sınıf yönetimi | `SPRINTS.md` S4 |
| S5 | 20-24h | Polish + deploy + sunum | `SPRINTS.md` S5 |

---

## Güncel Engeller

Yeni engel eklemek için: `[BLOKAJ] açıklama — @sahip — tarih`

- Supabase URL/KEY değerleri `.env.local`'a elle girilmeli (gitignored)
- `ANTHROPIC_API_KEY` değeri elle girilmeli

---

## Decision Log

Her oturum başında burayı güncelle. Format: `[TARİH] Karar — Gerekçe`

| Tarih | Karar | Gerekçe |
|-------|-------|---------|
| 2026-05-16 | Claude sonnet-4-6 modeli seçildi | Türkçe NLG kalitesi + hız dengesi |
| 2026-05-16 | localStorage + Supabase hibrit state | Session anında, history kalıcı |
| 2026-05-16 | Mock fallback stratejisi | Demo güvenilirliği için |
| 2026-05-16 | 5 twin tipi sabit tutuldu | Prompt tutarlılığı (C7) |

---

_Son güncelleme: 2026-05-16_
