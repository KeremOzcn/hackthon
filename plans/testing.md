---
version: 1.0.0
last_updated: 2026-05-20
domain: testing
scope: root
---

# Testing Plan

## E2E Tests (Playwright)

Located in `e2e/` directory.

| File | Coverage | Status |
|---|---|---|
| `auth.spec.ts` | Login, signup, demo login, demo signup, logout | ✅ Exists |
| `courses.spec.ts` | Course list navigation, topic slug pages | ✅ Exists |
| `landing.spec.ts` | Hero, role cards, subject picker, FAQ, testimonials, footer | ✅ Exists |
| `navigation.spec.ts` | Header nav links, auth-aware nav, mobile menu | ✅ Exists |
| `parent.spec.ts` | Parent report loading, child selector | ✅ Exists |
| `student.spec.ts` | Session flow, result page, history | ✅ Exists |
| `teacher.spec.ts` | Dashboard loading, analytics charts | ✅ Exists |

## Test Commands

```bash
npm run test:e2e          # Run all Playwright tests headless
npm run test:e2e:ui      # Run with UI mode (interactive)
npm run test:e2e:debug   # Run with debugger
npm run test:e2e:report  # Show HTML report
```

## Known Test Gaps

1. **No unit tests** for `lib/` modules (gamification, adaptive engine, auth helpers)
2. **No API tests** for `/api/*` routes (analyze, questions, sessions)
3. **No component tests** for charts, toasts, modals
4. **No visual regression** tests for glassmorphism UI
5. **No accessibility** tests (axe-core, Lighthouse)
6. **No load/performance** tests for Claude API integration

## Known Issues

### E2E Test Failures After `middleware.ts` (2026-05-20)

27 of 50 Playwright E2E tests fail after adding `src/middleware.ts`. These are **not regressions** — the middleware is correctly redirecting unauthenticated requests to `/auth/login`.

**Affected tests:** All tests that navigate to protected routes (`/teacher/*`, `/parent/*`, `/student/*`) without first logging in.

**Fix needed:** Update E2E test setup to authenticate before visiting protected pages. For Playwright, use `test.beforeEach` with a login helper or mock session cookies.

**Files to update:**
- `e2e/teacher.spec.ts`
- `e2e/parent.spec.ts`
- `e2e/student.spec.ts`
- `e2e/navigation.spec.ts`
- `e2e/courses.spec.ts`
- `e2e/auth.spec.ts`

## Recommended Additions

1. **Unit tests for `lib/gamification.ts`:** Test each achievement condition with boundary values.
2. **Unit tests for `lib/adaptive.ts`:** Test difficulty distribution for each twin type.
3. **API tests:** Test `/api/analyze` with mock Gemini responses. Test error handling.
4. **Auth flow tests:** Test protected route redirects with and without session.
5. **Cross-browser tests:** Currently default Chromium only. Add Firefox/WebKit.

## Type Safety

```bash
npx tsc --noEmit  # Run before committing
```

**Known Issue:** Not currently run in CI. Add to pre-commit hook or GitHub Actions.
