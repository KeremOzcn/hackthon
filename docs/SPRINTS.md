# İşler LearnTwin AI — Sprint Planı

> Görev sahipliği için `ROLES.md`'e bak. Canonical kararlar için `PLAN.md`'e bak.
> Her sprint başında ilgili bölümü oku, bitirince checkbox'ları güncelle.

---

## Durum Göstergeleri

```
[x] Tamamlandı
[>] Devam ediyor
[ ] Henüz başlanmadı
[!] Bloke / engel var
```

---

## Sprint 0 — MVP (TAMAMLANDI)

**Süre:** Önceki session  
**Odak:** Çalışan demo

| Görev | Dosya | Sahip | Durum |
|-------|-------|-------|-------|
| Next.js kurulumu | package.json, tsconfig | Dev 2 | [x] |
| Design system | globals.css | Dev 1 | [x] |
| TypeScript tipleri | src/types/index.ts | Dev 2 | [x] |
| Supabase client | src/lib/supabase.ts | Dev 2 | [x] |
| Soru bankası (5 soru) | src/lib/questions.ts | Dev 2 | [x] |
| Landing sayfası | src/app/page.tsx | Dev 1 | [x] |
| Student session | src/app/student/session/page.tsx | Dev 1 | [x] |
| AI analyze API | src/app/api/analyze/route.ts | Dev 2 | [x] |
| Student result | src/app/student/result/page.tsx | Dev 1 | [x] |
| Teacher dashboard | src/app/teacher/page.tsx | Dev 3 | [x] |
| Parent report | src/app/parent/page.tsx | Dev 3 | [x] |
| DB schema | supabase/schema.sql | Dev 2 | [x] |
| GitHub push | — | Dev 2 | [x] |

---

## Sprint 1 — Çok Konu + Öğrenci Geçmişi (0-4h)

**Odak:** Tek ders sınırını kır, öğrencinin tekrar gelmesini sağla  
**Öncelik:** Yüksek (demo değeri büyük)

### Dev 1 — Student History UI

| Görev | Dosya | Durum |
|-------|-------|-------|
| Geçmiş session listesi sayfası | src/app/student/history/page.tsx | [ ] |
| Landing'de "Geçmişim" butonu | src/app/page.tsx | [ ] |
| Session kart component | src/components/ui/SessionCard.tsx | [ ] |
| Result sayfasında "Geçmişi Gör" linki | src/app/student/result/page.tsx | [ ] |

### Dev 2 — Multi-Subject API + Soru Bankası

| Görev | Dosya | Durum |
|-------|-------|-------|
| Fen bilimleri soruları (5 soru) | src/lib/questions-science.ts | [ ] |
| Türkçe soruları (5 soru) | src/lib/questions-turkish.ts | [ ] |
| Konu listesi endpoint | src/app/api/subjects/route.ts | [ ] |
| Öğrenci geçmişi endpoint | src/app/api/sessions/[studentId]/route.ts | [ ] |
| analyze route: subject/topic dinamik | src/app/api/analyze/route.ts | [ ] |

### Dev 3 — Subject Selector UI

| Görev | Dosya | Durum |
|-------|-------|-------|
| Landing'de ders seçici (Matematik/Fen/Türkçe) | src/app/page.tsx | [ ] |
| Seçili dersi localStorage'a kaydet | src/app/page.tsx | [ ] |
| Session sayfasına doğru soru setini aktar | src/app/student/session/page.tsx | [ ] |

### Dev 4 — Ortak Components

| Görev | Dosya | Durum |
|-------|-------|-------|
| Skeleton loader component | src/components/ui/Skeleton.tsx | [ ] |
| Toast notification | src/components/ui/Toast.tsx | [ ] |
| PageHeader component | src/components/layout/PageHeader.tsx | [ ] |
| Tüm sayfalarda PageHeader kullan | birden fazla page.tsx | [ ] |

### PM — Sprint 1 QA

| Görev | Durum |
|-------|-------|
| 3 dersle uçtan uca test | [ ] |
| Geçmiş akışı test (2. oturum) | [ ] |
| Mobil görünüm kontrolü | [ ] |

---

## Sprint 2 — Gelişmiş Teacher Dashboard + Analytics (4-10h)

**Odak:** Öğretmeni gerçek bir araçla donat  
**Öncelik:** Demo etkisi için kritik

### Dev 3 — Analytics Dashboard

| Görev | Dosya | Durum |
|-------|-------|-------|
| Recharts kur | package.json | [ ] |
| Risk dağılımı bar chart | src/components/charts/RiskBarChart.tsx | [ ] |
| Doğruluk trendi (zaman serisi) | src/components/charts/AccuracyTrend.tsx | [ ] |
| Twin tipi dağılımı (pasta) | src/components/charts/TwinDistribution.tsx | [ ] |
| Analytics sayfası | src/app/teacher/analytics/page.tsx | [ ] |
| Teacher nav'a Analytics linki | src/app/teacher/page.tsx | [ ] |

### Dev 1 — Teacher Dashboard Yenileme

| Görev | Dosya | Durum |
|-------|-------|-------|
| Filtre: ders, tarih, risk seviyesi | src/app/teacher/page.tsx | [ ] |
| Sıralama: risk / tarih / doğruluk | src/app/teacher/page.tsx | [ ] |
| Toplu seçim + "PDF al" | src/app/teacher/page.tsx | [ ] |
| Öğrenci detay modal | src/components/ui/Modal.tsx | [ ] |

### Dev 2 — Realtime (opsiyonel, süreye göre)

| Görev | Dosya | Durum |
|-------|-------|-------|
| Supabase realtime subscription | src/app/teacher/page.tsx | [ ] |
| Yeni session gelince liste güncellenir | src/app/teacher/page.tsx | [ ] |

### Dev 4 — Sınıf Yönetimi Temeli

| Görev | Dosya | Durum |
|-------|-------|-------|
| class_id alanı DB migration | supabase/schema.sql | [ ] |
| Teacher landing: sınıf seçici | src/app/teacher/page.tsx | [ ] |
| Sınıf detay sayfası iskeleti | src/app/teacher/class/[classId]/page.tsx | [ ] |

### PM — Sprint 2 QA

| Görev | Durum |
|-------|-------|
| 10+ mock öğrenci verisiyle dashboard test | [ ] |
| Grafiklerin doğru veri gösterdiğini doğrula | [ ] |
| Öğretmen demo senaryosu hazırla | [ ] |

---

## Sprint 3 — PDF + Gamification (10-16h)

**Odak:** Paylaşılabilir output + kullanıcı bağlılığı  
**Öncelik:** Orta (demo wow factor)

### Dev 4 — PDF Export

| Görev | Dosya | Durum |
|-------|-------|-------|
| @react-pdf/renderer kur | package.json | [ ] |
| PDF template (öğrenci raporu) | src/lib/pdf.ts | [ ] |
| Export API endpoint | src/app/api/export/route.ts | [ ] |
| Result sayfasında "PDF İndir" butonu | src/app/student/result/page.tsx | [ ] |
| Teacher dashboard toplu PDF | src/app/teacher/page.tsx | [ ] |

### Dev 1 — Gamification UI

| Görev | Dosya | Durum |
|-------|-------|-------|
| Achievement/rozet sayfası | src/app/student/achievements/page.tsx | [ ] |
| Streak göstergesi | src/app/student/history/page.tsx | [ ] |
| Result sayfasında rozet kutlaması | src/app/student/result/page.tsx | [ ] |
| XP sistemi | src/lib/gamification.ts | [ ] |

### Dev 2 — Achievement Mantığı

| Görev | Dosya | Durum |
|-------|-------|-------|
| Rozet kuralları tanımla | src/lib/gamification.ts | [ ] |
| Achievement kontrolü analyze sonrası | src/app/api/analyze/route.ts | [ ] |
| DB'ye achievements alanı (jsonb migration) | supabase/schema.sql | [ ] |

### Dev 3 — Parent Portal Geliştirme

| Görev | Dosya | Durum |
|-------|-------|-------|
| Birden fazla çocuk seçeneği | src/app/parent/page.tsx | [ ] |
| Haftalık trend göster | src/app/parent/page.tsx | [ ] |
| "PDF Raporu Al" butonu | src/app/parent/page.tsx | [ ] |

### PM — Sprint 3 QA

| Görev | Durum |
|-------|-------|
| PDF'in tarayıcıda açıldığını test et | [ ] |
| Rozet kazanım senaryolarını test et | [ ] |
| Veli demo senaryosu hazırla | [ ] |

---

## Sprint 4 — Adaptif Sorular + Sınıf Yönetimi (16-20h)

**Odak:** AI'yı daha akıllı yap, öğretmene sınıf yönetimi ver  
**Öncelik:** Orta (teknik derinlik)

### Dev 2 — Adaptif Soru Motoru

| Görev | Dosya | Durum |
|-------|-------|-------|
| Twin tipine göre soru seç | src/app/api/analyze/route.ts | [ ] |
| Zorluk adaptasyonu (önceki accuracy'e göre) | src/lib/questions.ts | [ ] |
| Soru bankası: zorluk seviyeleri ekle | tüm questions-*.ts | [ ] |

### Dev 4 — Sınıf Yönetimi

| Görev | Dosya | Durum |
|-------|-------|-------|
| Sınıf oluştur / düzenle | src/app/teacher/class/page.tsx | [ ] |
| Öğrenci-sınıf bağlantısı (supabase) | supabase migration | [ ] |
| Sınıf bazlı analytics | src/app/teacher/class/[classId]/page.tsx | [ ] |

### Dev 1 — UX Polishing

| Görev | Dosya | Durum |
|-------|-------|-------|
| Loading skeleton her yerde | tüm page.tsx'ler | [ ] |
| Error boundary global | src/app/layout.tsx | [ ] |
| Mobile responsive düzeltmeler | globals.css | [ ] |

### Dev 3 — Öğretmen Uyarı Merkezi

| Görev | Dosya | Durum |
|-------|-------|-------|
| Yüksek riskli öğrenci banner | src/app/teacher/page.tsx | [ ] |
| "Bu hafta müdahale gereken" listesi | src/app/teacher/page.tsx | [ ] |

---

## Sprint 5 — Polish + Deploy + Sunum (20-24h)

**Odak:** Demo hazır, deploy, sıfır bug  
**Öncelik:** EN YÜKSEK

### Dev 2 — Deploy

| Görev | Durum |
|-------|-------|
| Vercel project oluştur | [ ] |
| Environment variables Vercel'e ekle | [ ] |
| Production build doğrula (npm run build) | [ ] |
| Supabase production instance kontrol | [ ] |

### Dev 1 — Son UI Düzeltmeleri

| Görev | Durum |
|-------|-------|
| Tüm sayfalar mobilde test | [ ] |
| Dark mode tutarlılığı kontrol | [ ] |
| Loading state'ler her yerde mevcut mu? | [ ] |

### Dev 3 — Demo Verisi

| Görev | Durum |
|-------|-------|
| 10 farklı öğrenci demo session'ı üret | [ ] |
| Her twin tipinden en az 2 örnek | [ ] |
| Teacher dashboard dolu görünümü test et | [ ] |

### Dev 4 — Bug Hunt

| Görev | Durum |
|-------|-------|
| Student session uçtan uca 3 kez test | [ ] |
| API hata durumlarını test | [ ] |
| localStorage temizlenince ne olur? | [ ] |
| TypeScript check: npx tsc --noEmit | [ ] |

### PM — Sunum Hazırlığı

| Görev | Durum |
|-------|-------|
| Sunum slaytları (max 10 slayt) | [ ] |
| Canlı demo senaryosu yaz (3 dakika) | [ ] |
| Öğrenci → Öğretmen → Veli hikayesi | [ ] |
| Teknik Q&A hazırlığı | [ ] |
| Demo URL paylaş (Vercel linki) | [ ] |

---

## Kritik Yol

```
S1 (multi-subject) ──┐
S2 (analytics) ──────┤──► S5 (deploy + demo)
S3 (PDF + gamif.) ───┤
S4 (adaptive) ───────┘

S1 ve S2 paralel başlayabilir.
S3, S1'in subject seçiciyi bitirmesini bekler.
S4 tamamen bağımsız, S2 ile paralel gidebilir.
S5 herkesi bekler.
```

---

_Son güncelleme: 2026-05-16_
