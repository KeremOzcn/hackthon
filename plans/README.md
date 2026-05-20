# Plan Documentation

This directory contains the canonical implementation plans for the İşleyen project. These documents replace the legacy `docs/` folder and reflect the actual post-hackathon codebase state.

## Plan Files

| File | Domain | Scope |
|---|---|---|
| `roadmap.md` | Project timeline | root |
| `architecture.md` | Tech stack, data flow, file map | root |
| `api.md` | API contracts, routes, auth requirements | root |
| `business-logic.md` | Twin classification, gamification, adaptive engine | root |
| `data-model.md` | Supabase schema, relations, RLS | root |
| `security.md` | Auth, threats, vulnerabilities | root |
| `ui-ux.md` | Design system, pages, components | root |
| `testing.md` | E2E tests, coverage, gaps | root |

## How to Use

- Each plan has YAML frontmatter with `version`, `last_updated`, `domain`, and `scope`.
- Root-scoped plans apply project-wide. If a module-scoped plan existed, it would override root for that module.
- Before writing code against any system, read the relevant plan file first.
- When specs change, update the plan file **before** updating the code. The plan is the source of truth.
- To query plans during implementation, use `plan_query` (see plan-guard skill) or search this directory.
