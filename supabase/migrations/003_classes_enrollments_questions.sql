-- İşler LearnTwin AI — Classes, Enrollments, Subjects, Topics, Questions

-- Classes (created by teachers)
create table if not exists classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  grade text,
  focus text,
  created_at timestamptz default now()
);

alter table classes enable row level security;

create policy "Teachers can manage their own classes"
  on classes for all
  using (auth.uid() = teacher_id);

create policy "Students can view classes they are enrolled in"
  on classes for select
  using (
    exists (
      select 1 from class_enrollments
      where class_enrollments.class_id = classes.id
        and class_enrollments.student_id = auth.uid()
    )
  );

-- Class Enrollments (students in classes)
create table if not exists class_enrollments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references classes(id) on delete cascade not null,
  student_id uuid references profiles(id) on delete cascade not null,
  enrolled_at timestamptz default now(),
  unique(class_id, student_id)
);

alter table class_enrollments enable row level security;

create policy "Teachers can manage enrollments for their classes"
  on class_enrollments for all
  using (
    exists (
      select 1 from classes
      where classes.id = class_enrollments.class_id
        and classes.teacher_id = auth.uid()
    )
  );

create policy "Students can view their own enrollments"
  on class_enrollments for select
  using (auth.uid() = student_id);

-- Parent-Student Links
create table if not exists parent_students (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references profiles(id) on delete cascade not null,
  student_id uuid references profiles(id) on delete cascade not null,
  linked_at timestamptz default now(),
  unique(parent_id, student_id)
);

alter table parent_students enable row level security;

create policy "Parents can manage their own links"
  on parent_students for all
  using (auth.uid() = parent_id);

create policy "Students can see who is linked to them"
  on parent_students for select
  using (auth.uid() = student_id);

-- Subjects (replace hardcoded list)
create table if not exists subjects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  color text,
  description text,
  icon text,
  created_at timestamptz default now()
);

-- Topics within subjects
create table if not exists topics (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid references subjects(id) on delete cascade not null,
  name text not null,
  order_index int default 0
);

-- Questions (move from .ts files to DB)
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

alter table questions enable row level security;

create policy "Questions are viewable by everyone"
  on questions for select
  using (true);
