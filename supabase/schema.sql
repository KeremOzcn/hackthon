-- İşler LearnTwin AI — Supabase Schema
-- Supabase Dashboard > SQL Editor > New Query > Run

-- Core results table
 create table if not exists learning_twin_results (
  id                uuid primary key default gen_random_uuid(),
  student_id        text not null,
  student_name      text not null,
  profile_id        uuid references profiles(id),
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
  add column if not exists profile_id uuid references profiles(id);

create index if not exists idx_results_created_at on learning_twin_results(created_at desc);
create index if not exists idx_results_risk_level on learning_twin_results(risk_level);
create index if not exists idx_results_student_id on learning_twin_results(student_id);
create index if not exists idx_results_student_created_at on learning_twin_results(student_id, created_at desc);
create index if not exists idx_results_class_id on learning_twin_results(class_id);
create index if not exists idx_results_profile_id on learning_twin_results(profile_id);

-- Profiles (extends auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('student', 'teacher', 'parent')),
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

create policy "Public profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Trigger: auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Classes
create table if not exists classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  grade text,
  focus text,
  created_at timestamptz default now()
);

create policy "Teachers can manage their own classes"
  on classes for all using (auth.uid() = teacher_id);

create policy "Students can view classes they are enrolled in"
  on classes for select using (
    exists (
      select 1 from class_enrollments
      where class_enrollments.class_id = classes.id
        and class_enrollments.student_id = auth.uid()
    )
  );

-- Class Enrollments
create table if not exists class_enrollments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references classes(id) on delete cascade not null,
  student_id uuid references profiles(id) on delete cascade not null,
  enrolled_at timestamptz default now(),
  unique(class_id, student_id)
);

create policy "Teachers can manage enrollments for their classes"
  on class_enrollments for all using (
    exists (
      select 1 from classes
      where classes.id = class_enrollments.class_id
        and classes.teacher_id = auth.uid()
    )
  );

create policy "Students can view their own enrollments"
  on class_enrollments for select using (auth.uid() = student_id);

-- Parent-Student Links
create table if not exists parent_students (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references profiles(id) on delete cascade not null,
  student_id uuid references profiles(id) on delete cascade not null,
  linked_at timestamptz default now(),
  unique(parent_id, student_id)
);

create policy "Parents can manage their own links"
  on parent_students for all using (auth.uid() = parent_id);

create policy "Students can see who is linked to them"
  on parent_students for select using (auth.uid() = student_id);

-- Subjects
create table if not exists subjects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  color text,
  description text,
  icon text,
  created_at timestamptz default now()
);

-- Topics
create table if not exists topics (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid references subjects(id) on delete cascade not null,
  name text not null,
  order_index int default 0
);

-- Questions
create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid references topics(id) on delete set null,
  subject_id uuid references subjects(id) on delete cascade not null,
  difficulty text check (difficulty in ('easy', 'medium', 'hard')),
  question_text text not null,
  options jsonb not null,
  correct_answer text not null,
  hints jsonb default '[]',
  explanation text,
  created_at timestamptz default now()
);

create policy "Questions are viewable by everyone"
  on questions for select using (true);

-- RLS on learning_twin_results (replace wide-open policy)
alter table learning_twin_results enable row level security;

drop policy if exists "Allow all for demo" on learning_twin_results;

create policy "Students can view own results"
  on learning_twin_results for select
  using (auth.uid() = profile_id);

create policy "Teachers can view results for their class students"
  on learning_twin_results for select
  using (
    exists (
      select 1 from class_enrollments ce
      join classes c on c.id = ce.class_id
      where ce.student_id = learning_twin_results.profile_id
        and c.teacher_id = auth.uid()
    )
  );

create policy "Parents can view linked student results"
  on learning_twin_results for select
  using (
    exists (
      select 1 from parent_students ps
      where ps.student_id = learning_twin_results.profile_id
        and ps.parent_id = auth.uid()
    )
  );

create policy "Users can insert own results"
  on learning_twin_results for insert
  with check (auth.uid() = profile_id);
