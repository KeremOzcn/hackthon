-- İşler LearnTwin AI — Seed Subjects, Topics, and Questions
-- Uses explicit UUIDs to avoid cross-table SELECT complexity

-- Subjects
insert into subjects (id, slug, name, color, description, icon)
values
  ('11111111-1111-1111-1111-111111111111', 'matematik', 'Matematik', '#8083ff', 'Turev, integral, limitler ve olasilik konularini kapsayan kapsamli matematik programi.', '📐'),
  ('22222222-2222-2222-2222-222222222222', 'fen-bilimleri', 'Fen Bilimleri', '#10b981', 'Fizik, kimya ve biyoloji temellerini birlestiren disiplinler arasi bilim programi.', '🔬'),
  ('33333333-3333-3333-3333-333333333333', 'turkce', 'Türkçe', '#f59e0b', 'Dil bilgisi, paragraf analizi ve anlatim bozuklugu konularini iceren dil programi.', '📝')
on conflict (slug) do nothing;

-- Topics
insert into topics (id, subject_id, name, order_index)
values
  -- Matematik
  ('aaaaaaaa-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Problemler', 1),
  ('aaaaaaaa-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Turev', 2),
  ('aaaaaaaa-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Integral', 3),
  ('aaaaaaaa-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Trigonometri', 4),
  ('aaaaaaaa-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'Logaritma', 5),
  ('aaaaaaaa-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'Diziler', 6),
  ('aaaaaaaa-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 'Limitler', 7),
  ('aaaaaaaa-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', 'Olasilik', 8),
  -- Fen Bilimleri
  ('bbbbbbbb-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Fizik', 1),
  ('bbbbbbbb-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Kimya', 2),
  ('bbbbbbbb-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Biyoloji', 3),
  ('bbbbbbbb-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Astronomi', 4),
  ('bbbbbbbb-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'Jeoloji', 5),
  -- Türkçe
  ('cccccccc-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'Dil Bilgisi', 1),
  ('cccccccc-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'Paragraf', 2),
  ('cccccccc-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Siir', 3),
  ('cccccccc-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'Anlatim Bozuklugu', 4),
  ('cccccccc-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'Yazi Turleri', 5)
on conflict do nothing;

-- Questions: Matematik (topic = Problemler)
insert into questions (topic_id, subject_id, difficulty, question_text, options, correct_answer, hints)
values
  ('aaaaaaaa-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'medium', 'Ayşe''nin yaşı kardeşinin yaşının 3 katından 2 fazladır. İkisinin yaşları toplamı 30 ise Ayşe kaç yaşındadır?', '{"A": "20", "B": "22", "C": "23", "D": "24"}'::jsonb, 'C', '["Kardeşin yaşını x olarak tanımla. Ayşe''nin yaşını x cinsinden yaz.", "Ayşe''nin yaşı = 3x + 2 olarak kurulur. Toplamları 30 ise: x + (3x + 2) = 30", "4x + 2 = 30 → 4x = 28 → x = 7. Şimdi Ayşe''nin yaşını bul.", "Kardeş = 7, Ayşe = 3(7) + 2 = 23. Cevap: C"]'),
  ('aaaaaaaa-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'medium', 'Bir işi Ali 6 günde, Mehmet 4 günde yapabilmektedir. İkisi birlikte çalışırsa bu işi kaç günde bitirirler?', '{"A": "2", "B": "2,4", "C": "3", "D": "5"}'::jsonb, 'B', '["Ali''nin günlük iş payı 1/6, Mehmet''in 1/4. Birlikte günlük paylarını topla.", "Birlikte günlük pay = 1/6 + 1/4. Ortak paydaya getir: 2/12 + 3/12 = 5/12", "5/12 iş günde yapılırsa, tam iş = 12/5 = 2,4 günde yapılır.", "Cevap: B (2,4 gün)"]'),
  ('aaaaaaaa-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'hard', '%20 tuzlu 100 gr su ile %40 tuzlu 200 gr su karıştırılıyor. Oluşan karışımın tuz yüzdesi nedir?', '{"A": "%28", "B": "%30", "C": "%33", "D": "%35"}'::jsonb, 'C', '["Her karışımdaki tuz miktarını ayrı ayrı hesapla.", "1. karışım: 100 × 0,20 = 20 gr tuz. 2. karışım: 200 × 0,40 = 80 gr tuz.", "Toplam tuz = 100 gr. Toplam karışım = 300 gr. Yüzde = (100/300) × 100", "Yüzde = 33,3... ≈ %33. Cevap: C"]'),
  ('aaaaaaaa-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'easy', 'İki araç aynı anda iki şehirden birbirine doğru hareket ediyor. Birinin hızı 60 km/s, diğerinin 80 km/s. Şehirler arası mesafe 280 km ise kaç saatte karşılaşırlar?', '{"A": "1,5", "B": "2", "C": "2,5", "D": "3"}'::jsonb, 'B', '["Karşılıklı hareketlerde hızlar toplanır. Birleşik hız nedir?", "Birleşik hız = 60 + 80 = 140 km/s.", "Süre = Mesafe / Hız = 280 / 140", "Süre = 2 saat. Cevap: B"]'),
  ('aaaaaaaa-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'easy', 'Bir ürün 200 TL''ye alınıp %30 kâr ile satılıyor. Aynı ürün daha sonra %10 indirimle satışa çıkarılıyor. Son satış fiyatı nedir?', '{"A": "220 TL", "B": "234 TL", "C": "240 TL", "D": "250 TL"}'::jsonb, 'B', '["%30 kâr ile satış fiyatını hesapla.", "Kârlı satış = 200 × 1,30 = 260 TL.", "%10 indirim uygulanırsa: 260 × 0,90", "260 × 0,90 = 234 TL. Cevap: B"]'),
  ('aaaaaaaa-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'easy', 'Bir sınıfta 30 öğrenci vardır. Öğrencilerin beşte ikisi kız olduğuna göre, sınıfta kaç erkek öğrenci vardır?', '{"A": "10", "B": "12", "C": "16", "D": "18"}'::jsonb, 'D', '["Toplam öğrenci 30. Kız sayısını bulmak için 30 sayısının 2/5 ini hesapla.", "Kız sayısı = 30 × (2/5) = 12.", "Erkek sayısı = Toplam öğrenci - Kız sayısı = 30 - 12.", "30 - 12 = 18. Cevap: D (18)"]'),
  ('aaaaaaaa-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'medium', 'Bir öğrencinin 3 sınav notunun ortalaması 72 dir. 4. sınavdan 88 alırsa dört sınavın ortalaması kaç olur?', '{"A": "74", "B": "76", "C": "78", "D": "80"}'::jsonb, 'B', '["3 sınavın toplamını bul: Ortalama × Sayı = 72 × 3.", "Toplam = 216. 4 sınav toplamı = 216 + 88 = 304.", "Yeni ortalama = 304 ÷ 4.", "304 ÷ 4 = 76. Cevap: B (76)"]'),
  ('aaaaaaaa-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'hard', 'Anne ile kızının yaşları toplamı 44 tür. 4 yıl önce annenin yaşı kızının yaşının 5 katıymış. Buna göre anne kaç yaşındadır?', '{"A": "32", "B": "34", "C": "36", "D": "38"}'::jsonb, 'B', '["Şimdi anne x, kız y olsun. x + y = 44. 4 yıl önce: x - 4 = 5(y - 4).", "Denklemi aç: x - 4 = 5y - 20 → x = 5y - 16. Birinci denkleme yerleştir.", "5y - 16 + y = 44 → 6y = 60 → y = 10. Kız 10 yaşında.", "Anne = 44 - 10 = 34. Cevap: B (34)"]')
;

-- Questions: Fen Bilimleri
insert into questions (topic_id, subject_id, difficulty, question_text, options, correct_answer, hints)
values
  ('bbbbbbbb-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'medium', 'Düzgün doğrusal harekette 60 km/s hızla giden bir araç 2 saatte kaç km yol alır?', '{"A": "80", "B": "100", "C": "120", "D": "150"}'::jsonb, 'C', '["Düzgün doğrusal harekette yol = hız × zaman formülü kullanılır.", "Hız = 60 km/s, zaman = 2 saat. Bunları çarp.", "Yol = 60 × 2 = 120 km.", "Cevap: C (120 km)"]'),
  ('bbbbbbbb-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'hard', '2 mol H₂O kaç gram gelir? (H = 1, O = 16)', '{"A": "18 g", "B": "20 g", "C": "36 g", "D": "40 g"}'::jsonb, 'C', '["Önce 1 mol H₂O kaç gram olduğunu bul.", "H₂O molar kütlesi: 2×1 + 16 = 18 g/mol.", "2 mol H₂O = 2 × 18 = 36 g.", "Cevap: C (36 g)"]'),
  ('bbbbbbbb-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'medium', 'Mitoz bölünme sonunda oluşan hücre sayısı ve kromozom sayısı hakkında hangisi doğrudur?', '{"A": "4 hücre, 2n kromozom", "B": "2 hücre, 2n kromozom", "C": "4 hücre, n kromozom", "D": "2 hücre, n kromozom"}'::jsonb, 'B', '["Mitoz ve mayoz bölünmeyi karıştırma. Mitoz kaç hücre üretir?", "Mitoz bölünme 1 hücreden 2 hücre üretir.", "Mitoz diploid (2n) hücre üretir; kromozom sayısı korunur.", "Cevap: B (2 hücre, 2n)"]'),
  ('bbbbbbbb-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'easy', '220 V elektrik kaynağına bağlı 1100 W''lık fırın kaç amper akım çeker?', '{"A": "3 A", "B": "5 A", "C": "8 A", "D": "10 A"}'::jsonb, 'B', '["Güç, gerilim ve akım arasındaki formülü hatırla: P = V × I.", "I = P / V formülünü kullan.", "I = 1100 / 220 = 5 A.", "Cevap: B (5 A)"]'),
  ('bbbbbbbb-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'easy', 'pH = 7 olan bir çözeltinin özelliği nedir?', '{"A": "Asidik", "B": "Bazik", "C": "Nötr", "D": "Güçlü asit"}'::jsonb, 'C', '["pH skalasını hatırla: 0-14 arasındadır.", "pH < 7 asidik, pH > 7 bazik, pH = 7 nedir?", "pH = 7 tam nötr demektir.", "Cevap: C (Nötr)"]'),
  ('bbbbbbbb-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'easy', 'Fotosentez olayında bitkiler hangi gazı atmosfere verir?', '{"A": "Azot", "B": "Karbondioksit", "C": "Oksijen", "D": "Hidrojen"}'::jsonb, 'C', '["Fotosentezde bitkiler ışık enerjisini kullanarak hangi işlemi yapar?", "Klorofil ile ışığı absorbe ederler ve su ile karbondioksitten glikoz üretirler.", "Bu işlem sonucunda atmosfere oksijen salınır.", "Cevap: C (Oksijen)"]'),
  ('bbbbbbbb-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'medium', '10 kg kütleyi 2 m/s² ivmeyle hareket ettirmek için kaç newton kuvvet uygulanmalıdır?', '{"A": "5 N", "B": "8 N", "C": "12 N", "D": "20 N"}'::jsonb, 'D', '["Newton yasasını hatırla: F = m × a.", "Kütle m = 10 kg, ivme a = 2 m/s².", "F = 10 × 2 = 20 N.", "Cevap: D (20 N)"]'),
  ('bbbbbbbb-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'hard', '200 mL %10 NaCl çözeltisi ile 300 mL %20 NaCl çözeltisi karıştırılıyor. Oluşan karışımın kitlece yüzde konsantrasyonu yaklaşık kaçtır? (Yoğunlukları eşit kabul ediniz.)', '{"A": "%14", "B": "%15", "C": "%16", "D": "%18"}'::jsonb, 'C', '["Her çözeltideki tuz miktarını ayrı ayrı hesapla.", "1. çözelti: 200 × 0,10 = 20 g tuz. 2. çözelti: 300 × 0,20 = 60 g tuz.", "Toplam tuz = 80 g. Toplam çözelti = 200 + 300 = 500 mL (yaklaşık 500 g).", "Yüzde = (80/500) × 100 = %16. Cevap: C (%16)"]')
;

-- Questions: Türkçe
insert into questions (topic_id, subject_id, difficulty, question_text, options, correct_answer, hints)
values
  ('cccccccc-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'medium', 'Bu konuyu kökünden çözmeliyiz. cümlesinde altı çizili sözcük hangi anlamda kullanılmıştır?', '{"A": "Bitkinin kökü", "B": "Tamamen, tümüyle", "C": "Sayı kökü", "D": "Aile kökeni"}'::jsonb, 'B', '["Sözcüğün cümle içindeki bağlamını incele. Gerçek anlamı mı kullanılmış?", "Kökünden burada mecaz anlam taşıyor. Nasıl bir etki anlatılıyor?", "Tamamen, hiç bırakmadan anlamını düşün.", "Cevap: B (Tamamen, tümüyle)"]'),
  ('cccccccc-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'easy', 'Koşmak fiilinin mastar eki hangisidir?', '{"A": "-koş", "B": "-ak", "C": "-mak", "D": "-ış"}'::jsonb, 'C', '["Mastar eki fiile eklenerek isim görevli sözcük türetir.", "Türkçede mastar ekleri nelerdir?", "Mastar ekleri: -mak, -mek.", "Cevap: C (-mak)"]'),
  ('cccccccc-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'easy', 'Aşağıdakilerden hangisi doğru yazılmıştır?', '{"A": "herşey", "B": "her şey", "C": "Her Şey", "D": "herŞey"}'::jsonb, 'B', '["Her sözcüğünün yazımını düşün. Bitişik mi ayrı mı yazılır?", "Her belirteç görevinde kullanıldığında kendinden sonraki sözcükten ayrı yazılır.", "Her şey, her zaman, her yer — hepsi ayrı yazılır.", "Cevap: B (her şey)"]'),
  ('cccccccc-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'hard', 'Bir paragrafın ana fikrini bulmak için en doğru yöntem hangisidir?', '{"A": "İlk cümleyi ana fikir kabul etmek", "B": "En uzun cümleyi seçmek", "C": "Tüm cümleleri kapsayan ortak düşünceyi bulmak", "D": "Son cümleyi ana fikir kabul etmek"}'::jsonb, 'C', '["Ana fikir paragrafın genelini kapsar. Tek bir cümleyle sınırlı mı olur?", "Yardımcı fikirler ana fikri destekler. Ana fikir hangilerini kapsar?", "Doğru yöntem: tüm cümleleri oku, hepsinin ortak mesajını bul.", "Cevap: C"]'),
  ('cccccccc-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'medium', 'Güzel konuştu. cümlesinde güzel sözcüğü hangi görevde kullanılmıştır?', '{"A": "Sıfat", "B": "İsim", "C": "Zarf", "D": "Zamir"}'::jsonb, 'C', '["Güzel hangi sözcüğü nitelendiriyor? İsim mi fiil mi?", "Burada güzel fiili (konuştu) nitelendiriyor.", "Fiili niteleyen sözcükler zarf görevindedir.", "Cevap: C (Zarf)"]'),
  ('cccccccc-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'easy', 'Aşağıdakilerden hangisi yanlış yazılmıştır?', '{"A": "bugün", "B": "yarın", "C": "herkez", "D": "dün"}'::jsonb, 'C', '["Türkçede sık yapılan yazım hatalarını düşün.", "Herkes sözcüğü her ve kes birleşiminden oluşur.", "Bu sözcük z ile değil s ile yazılır.", "Cevap: C (herkez)"]'),
  ('cccccccc-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'medium', 'Çocuklar bahçede oynuyor. cümlesinde bahçede sözcüğü hangi görevdedir?', '{"A": "Yüklem", "B": "Özne", "C": "Zarf Tümleci", "D": "Dolaylı Tümleç"}'::jsonb, 'C', '["Yüklem oynuyor. Nerede oynuyorlar? sorusunu sor.", "Nerede? sorusuna cevap veren ögeye zarf tümleci denir.", "Bahçede cümlede nerede? sorusunu yanıtlar.", "Cevap: C (Zarf Tümleci)"]'),
  ('cccccccc-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'hard', 'İnsanlar tarih boyunca iletişim ihtiyaçlarını farklı yollarla karşılamıştır. Eski çağlarda duman ve ateş sinyalleri kullanılırken, sonraları yazı ve haberciler önem kazanmıştır. Günümüzde ise dijital teknolojiler anlık iletişimi mümkün kılmaktadır. Ancak tüm bu gelişmelere rağmen iletişimin temel amacı değişmemiştir: bilgi ve duyguların karşılıklı aktarımı.', '{"A": "İletişim teknikleri her dönemde aynı kalmıştır.", "B": "Dijital teknolojiler iletişimi olumsuz etkilemiştir.", "C": "İletişim araçları değişse de temel amaç değişmemiştir.", "D": "Eski çağlarda iletişim hiç yoktu."}'::jsonb, 'C', '["Paragrafın genel mesajını bulmak için ilk ve son cümlelere odaklan.", "İlk cümle: iletişim araçlarının değiştiğini söyler. Son cümle: temel amacın değişmediğini vurgular.", "Ancak bağlacına dikkat et; bu bağlaç karşıtlık kurar ve asıl vurguyu gösterir.", "Cevap: C"]')
;
