-- İşler LearnTwin AI — Supabase Schema
-- Supabase Dashboard > SQL Editor > New Query > Run

create table if not exists learning_twin_results (
  id                uuid primary key default gen_random_uuid(),
  student_id        text not null,
  student_name      text not null,
  class_id          text,
  class_name        text,
  class_grade       text,
  subject           text not null default 'Matematik',
  topic             text not null default 'Problemler',
  twin_type         text not null check (twin_type in ('Hızlı ama Dikkatsiz', 'Yavaş ama Sağlam', 'Konuyu Biliyor ama Modelleyemiyor', 'İpucu Bağımlısı', 'Sınav Panikçisi')),
  dominant_pattern  text,
  cognitive_issue   text,
  behavioral_issue  text,
  risk_level        text not null check (risk_level in ('low', 'medium', 'high')),
  next_best_action  text,
  student_message   text,
  teacher_action    text,
  parent_message    text,
  accuracy          integer not null check (accuracy >= 0 and accuracy <= 100),
  avg_time_seconds  integer,
  hints_used        integer default 0,
  raw_answers       jsonb,
  achievements      jsonb default '[]',
  created_at        timestamptz not null default now()
);

alter table learning_twin_results
  add column if not exists class_id text,
  add column if not exists class_name text,
  add column if not exists class_grade text;

create index if not exists idx_results_created_at on learning_twin_results(created_at desc);
create index if not exists idx_results_risk_level on learning_twin_results(risk_level);
create index if not exists idx_results_student_id on learning_twin_results(student_id);
create index if not exists idx_results_student_created_at on learning_twin_results(student_id, created_at desc);
create index if not exists idx_results_class_id on learning_twin_results(class_id);

alter table learning_twin_results enable row level security;

-- TODO: WARNING — This RLS policy is wide open for demo purposes only.
-- Must be restricted before production.
create policy "Allow all for demo"
  on learning_twin_results
  for all
  using (true)
  with check (true);
