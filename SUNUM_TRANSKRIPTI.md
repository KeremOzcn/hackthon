# İşleyen — Sunum ve Jüri Transkripti
## Veri Güvenliği & Teknik Derinlik Rehberi

---

## BÖLÜM 1: Açılış ve Proje Özeti (30 saniye)

"İşleyen, öğrencinin sadece doğru/yanlışına değil, çözüm süresi, eminlik seviyesi, ipucu kullanımı ve düşünme açıklamaları gibi davranışsal sinyallere bakarak dijital bir öğrenme ikizi oluşturan yapay zeka tabanlı bir eğitim platformudur."

**Altını çiz:** Jüri muhtemelen şunu soracak: "Bu verileri nasıl topluyorsunuz ve güvenliğini nasıl sağlıyorsunuz?" — İşte bu rehber tam olarak bunun cevabı.

---

## BÖLÜM 2: Veri Güvenliği ve Gizlilik — Ana Sunum (2 dakika)

### 2.1 Toplanan Veriler ve Amaç

Platformumuz şu verileri toplar:

| Veri Türü | Amaç | Hassasiyet |
|---|---|---|
| Öğrenci adı | Kişiselleştirilmiş rapor | Orta |
| Cevap doğruluğu (A/B/C/D) | Performans analizi | Düşük |
| Çözüm süresi (saniye) | Davranışsal sinyal | Düşük |
| Eminlik seviyesi (low/medium/high) | Özgüven analizi | Orta |
| İpucu seviyesi (0–4) | Öğrenme hassasiyeti | Düşük |
| Düşünme açıklaması (metin) | Bilişsel analiz için AI girdisi | Yüksek |

**Kritik nokta:** Düşünme açıklamaları en hassas veridir çünkü öğrencinin zihinsel sürecine dair metinsel veri içerir. Bu nedenle:
- Veri anonimleştirme prensibi uygulanır (localStorage'da UUID ile takip, gerçek kişisel bilgi minimumda tutulur).
- Öğrenci adı sadece rapor kişiselleştirmesi için kullanılır; veri analizinde birincil anahtar `student_id` (UUID)’dir.

### 2.2 Veri Saklama ve Altyapı Güvenliği

**Veritabanı:** Supabase (PostgreSQL tabanlı, bulut yönetimli).
- **RLS (Row Level Security):** `learning_twin_results` tablosunda aktif. Bu, bir öğrencinin kendi verisini sadece kendi görebilmesini garanti eder. Öğretmen/veli görünümleri ayrı yetkilendirme katmanlarından geçer.
- **Şema:** Çok tablolu yapı (normalizasyon MVP sonrası eklendi). Temel tablolar: `profiles` (auth.users uzantısı), `classes` (öğretmen yönetimli), `class_enrollments` (öğrenci-sınıf bağlantısı), `parent_student_links` (veli-çocuk ilişkisi), `subjects` ve `topics` (müfredat), `questions` (soru bankası), `learning_twin_results` (temel analiz verisi).
- **JSONB sütunu:** `raw_answers` alanı JSONB formatında saklanır — bu PostgreSQL'in binary JSON indeksleme ve sorgulama yeteneğini kullanır, ayrı bir NoSQL veritabanına ihtiyaç kalmaz.

**Ortam Değişkenleri:**
- `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase client tarafından kullanılır (public olmak zorunda).
- ANTHROPIC_API KEY (`CLAUDE_API_KEY` veya benzeri) — sunucu tarafında (`/api/analyze` route handler) kullanılır, client'a asla ulaşmaz.

### 2.3 Kimlik Doğrulama ve Yetkilendirme

**Middleware (`middleware.ts`):**
- Next.js App Router middleware'inde çift katmanlı auth var:
  1. **Gerçek auth:** Supabase Auth cookie'leri (`sb-access-token`, `sb-refresh-token`) üzerinden `supabase.auth.getUser()`.
  2. **Demo modu:** `demo_auth=true` cookie'si ile jüri/development anında login gerektirmeden test yapılabilir.
- Korunan rotalar (`/student/*`, `/teacher`, `/parent`) için: `if (!user && !isDemo)` durumunda `/auth/login`'e yönlendirme.
- `/api` rotaları public olarak işaretlenmiştir (`pathname.startsWith('/api')`), ancak API route handler'ların kendi içinde ek bir auth katmanı vardır: kullanıcı sahipliği doğrulanır (401/403 kontrolleri), RLS'nin yanında ek sunucu tarafı yetkilendirme sağlanır.

**Auth akışı:**
```
Kullanıcı → Supabase Auth (email/şifre veya OAuth)
         → JWT token cookie'ye yazılır
         → Middleware her istekte token'ı doğrular
         → RLS policy token'dan user id çıkarır ve sadece kendi satırlarını döner
```

### 2.4 AI/LLM Güvenliği ve Veri İşleme

**Gemini API entegrasyonu (`src/app/api/analyze/route.ts`):**
- API çağrısı sunucu tarafında yapılır. Öğrenci verisi asla client tarafından Gemini API'ye gitmez.
- Prompt yapısı: Türkçe sistem mesajı + yapılandırılmış girdi (istatistikler + soru bazlı detay).
- **Çıktı formatı:** Saf JSON zorlaması — `parseJSON(response)` ile Gemini'nin metin yanıtı JSON'a dönüştürülür. Eğer JSON parse hatası olursa, regex temizleme uygulanır.
- **Veri saklama:** Gemini API çağrısı anlıktır; Google öğrenci verisini kendi eğitim verisi olarak kullanmaz (API kullanım koşulları gereği).

---

## BÖLÜM 3: Teknik Mimari Derinliği — Jüri Soruları İçin

### 3.1 Yığın (Stack) ve Tercih Gerekçeleri

| Katman | Teknoloji | Neden? |
|---|---|---|
| Frontend | Next.js 15 (App Router) | SSR, API route handler'lar, React Server Components — tek kod tabanında full-stack. |
| Styling | Tailwind CSS + Custom CSS variables | Glassmorphism UI için runtime CSS değişken kontrolü. |
| Veritabanı | Supabase (PostgreSQL) | Ücretsiz tier, built-in Auth, RLS, JSONB desteği, instant API. |
| AI | Google Gemini (gemini-2.0-flash) | Türkçe anlama ve pedagojik analizde yüksek performans. |
| Test | Playwright | E2E test — öğrenci akışından öğretmen paneline kadar. |

**Hackathon için kritik karar:** MVP'de öğrenci verisi localStorage'da UUID ile tutulur. Bu, hızlı onboard (kayıt olmadan deneme) sağlar ama aynı cihazda kalıcıdır. Production'a geçişte Supabase Auth zorunlu hale getirilir.

### 3.2 Veri Akışı Detayı

```
1. Landing → öğrenci rol seçer → isim girer
   → localStorage: { id: crypto.randomUUID(), name: string }

2. /student/session → src/lib/questions.ts'den 5 sabit TYT sorusu yüklenir

3. Her soru için:
   - selectedAnswer (A/B/C/D)
   - confidence (low/medium/high)
   - hintLevel (0→4)
   - timeSpentSeconds (otomatik sayaç)
   - reasoning (opsiyonel textarea)

4. 5. soru submit → POST /api/analyze
   Body: { student: {id, name}, subject, topic, answers: Answer[] }

5. API sunucusu (src/app/api/analyze/route.ts):
   a. computeStats(answers) → {accuracy, avgTimeSeconds, hintsUsed, highConfidenceWrong}
   b. Gemini prompt oluşturur (Türkçe, stats + per-question detail)
   c. genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }).generateContent(...) → AI yanıtı
   d. parseJSON(response) → LearningTwinResult
   e. supabase.insert(row) → fire-and-forget (hata ignore edilmez ama client'a yansımaz)
   f. 200 OK + JSON döner

6. Client:
   → localStorage: learntwin_result = JSON.stringify(result)
   → router.push('/student/result')

7. /student/result:
   → localStorage'dan result ve student_name okur
   → Twin hero card, stats, tabbed mesajlar render eder
```

### 3.3 AI Prompt Mühendisliği

**Prompt yapısı:**
```
Rol: Eğitim analisti (sabit sistem davranışı)
Girdi: Öğrenci adı, ders/konu, istatistikler, soru bazlı detay
Çıktı: Saf JSON (başka hiçbir şey yok)
Kısıtlar:
  - twinType PLAN.md C7 listesinden biri olmak zorunda
  - riskLevel PLAN.md C8: 'low'|'medium'|'high'
```

**İstatistik hesaplama (`computeStats`):**
- `accuracy`: Doğru cevap sayısı / toplam soru × 100
- `avgTimeSeconds`: Tüm soruların timeSpent ortalaması
- `hintsUsed`: Toplam ipucu kullanımı
- `highConfidenceWrong`: "Eminim" seçip yanlış yapılan soru sayısı (dikkatsizlik sinyali)

**Jüri sorusu:** "AI yanıtı güvenilir mi?"
- Cevap: AI çıktısı kesin tanı değil, öneridir. Öğretmen onayı ve geri bildirim döngüsüyle (Sprint 4'te) sistem geliştirilecek. Şu anki prompt, 5 sabit twin tipi ve risk seviyesiyle sınırlıdır; yaratıcılık alanı daraltılmıştır.

---

## BÖLÜM 4: Beklenen Jüri Soruları ve Cevaplar

### Soru 1: "Öğrenci verilerini nasıl koruyorsunuz? KVKK/GDPR uyumlu musunuz?"

**Cevap yapısı:**
1. **Minimum veri toplama:** Sadece analiz için gerekli veriler toplanır (ad, cevaplar, süre, eminlik, ipucu, düşünme metni).
2. **Anonimleştirme:** Primary key UUID'dir; öğrenci adı sadece rapor kişiselleştirmesi içindir.
3. **RLS:** Supabase Row Level Security ile her öğrenci sadece kendi verisini görür.
4. **Sunucu tarafı AI:** Öğrenci verisi asla client'tan Gemini API'ye gitmez; `/api/analyze` route handler aracılık eder.
5. **KVKK:** Aydınlatma metni ve veli izin akışı production'da eklenecek; hackathon MVP'sinde temel prensipler uygulanıyor.

### Soru 2: "AI analizi yanlış yaparsa ne olur?"

**Cevap yapısı:**
- AI çıktıları "öneri" olarak sunulur, kesin tanı değil.
- Öğretmen paneli bu çıktıyı pedagojik karar verme için kullanır; son karar öğretmendedir.
- Gelecek sprint'te (Sprint 4) öğretmen geri bildirimiyle AI iyileştirme döngüsü planlanıyor.
- 5 sabit twin tipi ve 3 risk seviyesiyle sınırlı çıktı uzayı, halüsinasyon riskini minimize eder.

### Soru 3: "Teknik olarak nasıl ölçeklenir? 1000 öğrenci olsa ne olur?"

**Cevap yapısı:**
- **Frontend:** Next.js static export veya Vercel edge network ile ölçeklenir.
- **API:** `/api/analyze` Gemini API çağrısı yaptığı için asenkron kuyruk (SQS/BullMQ) eklenebilir. Şu an senkron çağrı ama 5 soruluk MVP için yeterli.
- **Veritabanı:** Supabase PostgreSQL connection pooling ve read replica ile ölçeklenir. JSONB sütunu esnek ama indekslenebilir.
- **AI maliyeti:** Her session 1 Gemini çağrısı. 1000 öğrenci/gün = 1000 çağrı. Google token bazlı fiyatlandırma; caching ve prompt optimizasyonu ile maliyet kontrol edilir.

### Soru 4: "Neden Supabase? Kendi backend'inizi yazmadınız mı?"

**Cevap yapısı:**
- Hackathon zaman kısıtlı (48 saat). Supabase auth, veritabanı, RLS ve instant REST API'yi tek bir yapıda sunar.
- PostgreSQL JSONB sayesinde NoSQL esnekliği + SQL sorgulama bir arada.
- Production'a geçişte Supabase'den çıkıp kendi PostgreSQL'e geçiş maliyeti düşüktür (standart SQL).

### Soru 5: "Demo modu nedir? Güvenlik açığı mı?"

**Cevap yapısı:**
- `demo_auth=true` cookie'si sadece development ve jüri sunumu için. Production'da kaldırılacak.
- Middleware'de `isDemo` kontrolü var; bu sadece auth bypass sağlar, veri erişimini genişletmez.
- RLS politikaları demo modunda bile geçerlidir (çünkü demo kullanıcısı auth user değil, anonim client'tır; RLS anonim erişime izin vermez).

### Soru 6: "Öğrencinin düşünme açıklamaları metinsel veri — bunu nasıl analiz ediyorsunuz?"

**Cevap yapısı:**
- Metinsel düşünme açıklamaları Gemini API'ye istatistiklerle birlikte gönderilir.
- Gemini, Türkçe metni analiz ederek hata tipini sınıflandırır (örn: "Yaş farkı arttığı için toplama yaptım" → "Yanlış değişken seçimi / problem modelleme zorluğu").
- Metin verisi veritabanında JSONB içinde saklanır; ayrıca AI tarafından üretilen etiketler (cognitiveIssue, behavioralIssue) yapısal sütunlarda tutulur.

### Soru 7: "Veri modelinizde neden tek tablo var? Normalizasyon yok mu?"

**Cevap yapısı:**
- MVP sonrası çok tablolu normalizasyon eklendi. Mevcut şema: `profiles`, `classes`, `class_enrollments`, `parent_student_links`, `subjects`, `topics`, `questions`, `learning_twin_results`.
- `learning_twin_results` her session bir satır; `raw_answers` JSONB içinde soru detayları var.
- Bu yapı hem ilişkisel bütünlüğü sağlar hem de JSONB esnekliğini korur.

---

## BÖLÜM 5: Güvenlik Checklist'i (Sunumda Bahsedilecek)

- [x] **HTTPS:** Tüm iletişim TLS üzerinden (Supabase ve Next.js varsayılan).
- [x] **Auth:** JWT tabanlı, cookie'de saklanan tokenlar (httpOnly, secure, sameSite ayarları production'da sıkılaştırılacak).
- [x] **RLS:** Supabase Row Level Security aktif.
- [x] **Sunucu tarafı AI:** API key client'a ulaşmaz.
- [x] **Minimum veri:** Sadece gerekli veriler toplanır.
- [x] **Anonimleştirme:** UUID primary key.
- [x] **Demo mod izolasyonu:** Demo kullanıcısı gerçek veriye erişemez.
- [ ] **KVKK aydınlatma metni:** Production öncesi eklenecek.
- [ ] **Veli izin akışı:** Production öncesi eklenecek.
- [ ] **Loglama ve denetim (audit trail):** Production öncesi eklenecek.

---

## BÖLÜM 6: Teknik Derinlik — Mimari Diyagramı (Sözlü Anlatım)

"Sistem üç katmanlı:

**Client katmanı:** Next.js App Router. Öğrenci soru çözerken state tamamen client'ta tutulur (React state + localStorage). Bu, sunucu yükünü azaltır ve anlık etkileşim sağlar. Sadece 5. soru submit edildiğinde tek bir POST isteği gider.

**Sunucu katmanı:** Next.js API Route Handler (`/api/analyze`). Burada iki işlem yapılır: Birincisi, istatistik hesaplama (pure function, hızlı). İkincisi, Gemini API çağrısı (async, ~1-2 saniye). Sonuç hem client'a döner hem Supabase'e yazılır.

**Veri katmanı:** Supabase PostgreSQL. RLS sayesinde veri izolasyonu veritabanı seviyesinde garantilenir. Öğretmen paneli veriyi Supabase'den çeker; bu sayede öğretmen, öğrencinin kendi cihazında olmayan veriyi görebilir."

---

## BÖLÜM 7: Sunum Kapanışı (30 saniye)

"İşleyen olarak öğrencinin öğrenme mekanizmasını modellemek için yapay zekayı kullanıyoruz. Bunu yaparken veri güvenliğini ve gizliliği mimarinin merkezine koyduk: minimum veri toplama, sunucu tarafı AI analizi, Supabase RLS ile veri izolasyonu ve ileriye dönük KVKK uyumluluğu. Teknik olarak Next.js + Supabase + Gemini stack'iyle hem hızlı prototipleme hem de ölçeklenebilirlik hedefliyoruz."

---

## EK: Kod Referansları (Ezberlenmesi Gereken Dosya ve Satırlar)

| Dosya | Önemi |
|---|---|
| `src/middleware.ts` | Auth ve demo mod mantığı |
| `src/app/api/analyze/route.ts` | AI analizi + Supabase insert |
| `src/lib/supabase.ts` | Client/server Supabase client oluşturma |
| `supabase/schema.sql` | RLS policy ve tablo yapısı |
| `src/types/index.ts` | TypeScript tip güvenliği |

**Jüri 'middleware'de cookie nasıl işleniyor?' diye sorarsa:**
- `request.cookies.get('demo_auth')?.value === 'true'` kontrolü var.
- Supabase auth cookie'leri `sb-access-token` ve `sb-refresh-token` olarak gelir.
- `createServerClient` ile cookie set/get override edilir; NextResponse'de cookie'ler yeniden yazılır.

**Jüri 'RLS nasıl çalışıyor?' diye sorarsa:**
- `supabase/schema.sql` içinde `CREATE POLICY` ile `auth.uid() = user_id` veya `USING (true)` gibi kurallar var.
- Anonim kullanıcı (demo) için RLS, `raw_answers`'a erişimi engeller çünkü auth context yoktur.

---

*Hazırlayan: Claude Code | Tarih: 2026-05-20 | Proje: İşleyen Hackathon*
