---
version: 1.0.0
last_updated: 2026-05-20
domain: security
scope: root
---

# Security Plan

## Auth Flow

1. **Supabase Auth**: Email/password signup creates `auth.users` row.
2. **Trigger**: `handle_new_user()` function auto-creates `profiles` row with `id`, `email`, `role`.
3. **Session**: Supabase SSR manages cookies. `supabase-server.ts` reads session server-side.
4. **Demo Mode**: Cookie-based bypass (`demo_auth`, `demo_role`) for presentations.

## Current Vulnerabilities

### 1. No Server-Side Route Protection
- **Risk:** MEDIUM
- **Issue:** No `middleware.ts` exists. Route protection is client-side (`useEffect` redirects). Unauthenticated users can download JS bundles for protected pages and make direct API calls.
- **Fix:** Implement `middleware.ts` with `createServerClient` to check session and redirect.

### 2. API Ownership Validation Missing
- **Risk:** MEDIUM
- **Issue:** `/api/sessions/[id]` returns data for any `id` without verifying the requester owns that ID. Relies solely on RLS, which may be misconfigured.
- **Fix:** Add `user.id === requestedId` check in route handlers.

### 3. Demo Session Persistence Failure
- **Risk:** LOW (demo data only)
- **Issue:** Demo users have `profile_id: "demo-student"` (string) violating `profiles.id` uuid constraint. Sessions silently fail to persist.
- **Fix:** Skip `profile_id` insert for demo users, or use `NULL`.

### 4. Parent Page Data Exposure
- **Risk:** MEDIUM
- **Issue:** Parent page loads latest 50 results globally. RLS policies restrict rows, but if misconfigured, all data is exposed. Also uses hardcoded child filtering logic that may not respect `parent_student_links`.
- **Fix:** Explicitly filter by linked `student_id`s in the query.

### 5. AI Model Retirement
- **Risk:** LOW
- **Issue:** `claude-sonnet-4-6` is retired. API calls will fail with 400/500 errors. Not a security issue but breaks functionality.
- **Fix:** Update to `claude-sonnet-4-7` or `claude-opus-4-7`.

## RLS Policies Summary

| Table | Policy | Effect |
|---|---|---|
| `profiles` | Users read own | ✅ Good |
| `learning_twin_results` | Public read | ⚠️ Too permissive? |
| `classes` | Teacher CRUD own | ✅ Good |
| `class_enrollments` | Teacher manage own | ✅ Good |

## Recommendations

1. **Priority 1:** Add `middleware.ts` for server-side auth.
2. **Priority 2:** Add ownership checks to all `/api/*` routes that accept IDs.
3. **Priority 3:** Review RLS policies for `learning_twin_results` — consider row-level ownership.
4. **Priority 4:** Sanitize all user inputs before Claude prompt construction (currently uses template literals).
