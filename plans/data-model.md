---
version: 1.0.0
last_updated: 2026-05-20
domain: data-model
scope: root
---

# Data Model Plan

## Tables

### `profiles`
Extends Supabase Auth users.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK, references `auth.users` |
| `email` | text | From auth |
| `role` | text | `student` / `teacher` / `parent` |
| `full_name` | text | Nullable |
| `grade` | text | Nullable (e.g. "10. Sınıf") |
| `created_at` | timestamptz | Auto |

### `classes`
Teacher-managed classes.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `name` | text | |
| `description` | text | Nullable |
| `teacher_id` | uuid | FK → profiles |
| `created_at` | timestamptz | |

### `class_enrollments`
Student-class links.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `class_id` | uuid | FK → classes |
| `student_id` | uuid | FK → profiles |
| `enrolled_at` | timestamptz | |

### `parent_student_links`
Parent-child relationships.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `parent_id` | uuid | FK → profiles |
| `student_id` | uuid | FK → profiles |
| `created_at` | timestamptz | |

### `subjects`
Curriculum subjects.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `name` | text | (Matematik, Fen Bilimleri, ...) |
| `icon` | text | Emoji or icon name |
| `description` | text | |
| `created_at` | timestamptz | |

### `topics`
Subject subdivisions.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `subject_id` | uuid | FK → subjects |
| `name` | text | (Problemler, Fizik, ...) |
| `slug` | text | URL-safe |
| `order` | int | Display order |
| `created_at` | timestamptz | |

### `questions`
Question bank (populated via seed scripts, not user-facing CRUD).

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `subject_id` | uuid | FK → subjects |
| `topic_id` | uuid | FK → topics |
| `difficulty` | text | `easy` / `medium` / `hard` |
| `question_text` | text | |
| `options` | jsonb | `{A, B, C, D}` |
| `correct_answer` | text | `A`/`B`/`C`/`D` |
| `hints` | jsonb | String array of 4 hints |
| `created_at` | timestamptz | |

### `learning_twin_results`
Core analysis results.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `student_id` | text | localStorage UUID (NOT FK to profiles) |
| `profile_id` | uuid | Nullable, FK → profiles |
| `student_name` | text | |
| `subject` | text | |
| `topic` | text | |
| `twin_type` | text | C7 list |
| `dominant_pattern` | text | |
| `cognitive_issue` | text | |
| `behavioral_issue` | text | |
| `risk_level` | text | `low`/`medium`/`high` |
| `next_best_action` | text | |
| `student_message` | text | |
| `teacher_action` | text | |
| `parent_message` | text | |
| `accuracy` | int | 0-100 |
| `avg_time_seconds` | int | |
| `hints_used` | int | |
| `high_confidence_wrong` | int | |
| `raw_answers` | jsonb | `Answer[]` |
| `achievements` | jsonb | Array of earned badge IDs |
| `created_at` | timestamptz | |

## Key Relationships

```
profiles (teacher) ──1:N──► classes
profiles (student) ──N:M──► classes (via class_enrollments)
profiles (parent) ──N:M──► profiles (student) (via parent_student_links)
subjects ──1:N──► topics ──1:N──► questions
profiles ──1:N──► learning_twin_results (via profile_id)
```

## RLS Policies

- `profiles`: Users can read own profile. Service role can create.
- `learning_twin_results`: Public read (for demo), authenticated users can insert. **This may be too permissive for production.**
- `classes`: Teachers can CRUD own classes. Students can read enrolled classes.
- `class_enrollments`: Teachers can manage enrollments for their classes.
