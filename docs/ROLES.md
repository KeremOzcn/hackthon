# İşler LearnTwin AI — Ekip Rolleri

> Bu belge kimin neye sahip olduğunu tanımlar.
> Çakışma durumunda önce buraya bak, çözüm bulamazsan PM'e danış.

---

## Ekip Yapısı

| Kişi | Unvan | Birincil alan |
|------|-------|---------------|
| Dev 1 | Frontend Lead | Öğrenci akışı, UI/UX, animasyon | Kerem Özcan
| Dev 2 | Backend / AI Lead | API route'ları, Claude entegrasyonu, DB | Yağız Efe Gökçe
| Dev 3 | Dashboard Dev | Öğretmen + Veli sayfaları | Çiğdem Gökdağ
| Dev 4 | Full-stack Dev | Yeni özellikler, entegrasyonlar, bug hunt | Ezgi Turan
| PM | Product Manager + Sunum | Hikaye, QA koordinasyonu, sunum hazırlığı | Murat Emre Doğan

---

## Dosya Sahipliği

Her dosyanın bir primary sahibi var. Değişiklik yapmadan önce sahibine haber ver.
Ortak dosyalarda conflict önlemek için aynı anda en fazla 1 kişi düzenler.

### Dev 1 — Frontend Lead

```
src/app/page.tsx                         — landing (nav + rol kartları + isim giriş)
src/app/student/session/page.tsx         — soru akışı UI
src/app/student/result/page.tsx          — sonuç sayfası UI
src/app/student/history/page.tsx         — geçmiş listesi (S1)
src/app/student/achievements/page.tsx    — rozetler (S3)
src/components/ui/Modal.tsx              — modal component (S2)
src/components/layout/PageHeader.tsx     — header component (S1)
src/app/globals.css                      — ORTAK (koordineli düzenlenir)
```

### Dev 2 — Backend / AI Lead

```
src/app/api/analyze/route.ts             — Claude analiz endpoint
src/app/api/subjects/route.ts            — konu listesi (S1)
src/app/api/sessions/[studentId]/route.ts — öğrenci geçmişi (S1)
src/app/api/export/route.ts              — PDF export (S3)
src/lib/supabase.ts                      — DB client singleton
src/lib/questions.ts                     — matematik soruları
src/lib/questions-science.ts             — fen soruları (S1)
src/lib/questions-turkish.ts             — türkçe soruları (S1)
src/lib/gamification.ts                  — rozet mantığı (S3)
src/lib/pdf.ts                           — PDF helper (S3)
src/types/index.ts                       — TypeScript tipleri (ORTAK, PR gerekir)
supabase/schema.sql                      — DB şeması
.env.local                               — secrets (asla commit etme)
```

### Dev 3 — Dashboard Dev

```
src/app/teacher/page.tsx                 — öğretmen dashboard
src/app/teacher/analytics/page.tsx       — analitik sayfası (S2)
src/app/teacher/class/[classId]/page.tsx — sınıf detay (S2-S4)
src/app/parent/page.tsx                  — veli raporu
src/components/charts/RiskBarChart.tsx   — risk bar chart (S2)
src/components/charts/AccuracyTrend.tsx  — doğruluk trendi (S2)
src/components/charts/TwinDistribution.tsx — twin dağılımı (S2)
```

### Dev 4 — Full-stack Dev

```
src/components/ui/Skeleton.tsx           — skeleton loader (S1)
src/components/ui/Toast.tsx              — toast notification (S1)
src/app/teacher/class/page.tsx           — sınıf yönetim sayfası (S4)
```

### PM — Ortak (okuma erişimi her yerde)

```
docs/PLAN.md                             — GÜNCELLEME YETKİSİ VAR
docs/SPRINTS.md                          — GÜNCELLEME YETKİSİ VAR
docs/ROLES.md                            — GÜNCELLEME YETKİSİ VAR
```

---

## Sorumluluk Matrisi (RACI)

R = Responsible (yapan), A = Accountable (karar veren), C = Consulted, I = Informed

| Alan | Dev 1 | Dev 2 | Dev 3 | Dev 4 | PM |
|------|-------|-------|-------|-------|-----|
| Student UI/UX | R | I | I | C | A |
| AI prompt + analiz | I | R,A | I | C | C |
| Teacher dashboard | C | C | R,A | I | I |
| Parent raporu | I | C | R,A | I | I |
| DB schema değişikliği | I | R,A | I | C | I |
| Yeni dependency ekleme | C | R | C | C | A |
| Deployment | C | R,A | I | C | I |
| Demo senaryosu | I | I | I | I | R,A |
| TypeScript tipleri | C | R,A | C | C | I |
| CSS design tokens | R,A | I | C | C | I |

---

## İletişim Protokolü

### Çakışma Çözümü

1. Aynı dosyayı iki kişi düzenliyorsa: merge conflict oluşmadan önce haber ver
2. Yeni route veya API endpoint eklemeden önce: Dev 2'ye danış (schema etkisi?)
3. `src/types/index.ts` değişikliği: PR + tüm devlerin review'u gerekir
4. `globals.css` değişikliği: Dev 1'e haber ver

### Sprint Geçişi

- Sprint biterken PM checkbox'ları kontrol eder
- Eksik görevler bir sonraki sprint'e taşınır (SPRINTS.md güncellenir)
- PLAN.md Decision Log güncellenir

### AI (Claude) Session Protokolü

Her yeni Claude session açıldığında:
1. `docs/PLAN.md` oku — canonical kararlar
2. `docs/ARCHITECTURE.md` oku — dosya haritası
3. `docs/SPRINTS.md`'de aktif sprint'i bul
4. Sadece sahip olunan dosyalarda çalış

---

## Zaman Yönetimi (24 Saat)

```
Saat 00-04   Sprint 1 — paralel geliştirme
Saat 04-10   Sprint 2 — analytics + dashboard
Saat 10-16   Sprint 3 — PDF + gamification
Saat 16-20   Sprint 4 — adaptive + sınıf mgmt
Saat 20-22   Sprint 5 — deploy + final QA
Saat 22-24   Sunum hazırlığı + prova
```

Kural: Saat 22'den sonra YENİ özellik yok. Sadece bug fix ve polish.

---

## Bağımlılık Haritası

```
Dev 2 (API) blockluyorsa    → Dev 1 ve Dev 3 mock data ile devam eder
Dev 1 (Student UI) blocklu  → Dev 4 eksik sayfaları üstlenir
Dev 3 (Dashboard) blocklu   → Dev 4 eksik sayfaları üstlenir
PM sorun bulursa            → Sahibi olan Dev'e bildir + SPRINTS.md'ye yaz
```

---

_Son güncelleme: 2026-05-16_
