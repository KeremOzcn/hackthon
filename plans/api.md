---
version: 1.0.0
last_updated: 2026-05-20
domain: api
scope: root
---

# API Plan

## Endpoints

### `POST /api/analyze`
Analyzes student answers via Claude AI.

**Request:**
```json
{
  "student": { "id": "uuid", "name": "string" },
  "subject": "Matematik",
  "topic": "Problemler",
  "answers": [
    {
      "questionId": "string",
      "selectedAnswer": "A",
      "isCorrect": true,
      "timeSpentSeconds": 45,
      "confidence": "high",
      "hintLevelUsed": 2,
      "studentReasoning": "optional string"
    }
  ]
}
```

**Response:**
```json
{
  "twinType": "Hızlı ama Dikkatsiz",
  "dominantPattern": "string",
  "cognitiveIssue": "string",
  "behavioralIssue": "string",
  "riskLevel": "low|medium|high",
  "nextBestAction": "string",
  "studentMessage": "string",
  "teacherAction": "string",
  "parentMessage": "string",
  "stats": {
    "accuracy": 80,
    "avgTimeSeconds": 42,
    "hintsUsed": 3,
    "highConfidenceWrong": 1
  },
  "achievements": [{ "id": "string", "label": "string", "description": "string" }],
  "persisted": true
}
```

**Known Issue:** Uses `claude-sonnet-4-6` which is retired. Must update to a supported model (e.g. `claude-sonnet-4-7` or `claude-opus-4-7`).

**Known Issue:** For demo users, `profile_id` is set to `"demo-student"` (string) which violates the `uuid` FK constraint on `profiles(id)`, causing `persisted: false`.

---

### `GET /api/questions?subject=...&topic=...`
Returns adaptive question set.

**Response:** `Question[]` (5 items)

---

### `GET /api/sessions/[id]`
Returns student's session history.

**Response:** Array of `learning_twin_results` rows for `student_id = id`.

**Security Gap:** Does not verify that the requesting user owns `id`. Currently relies on RLS only.

---

### `GET /api/subjects`
Returns subject/topic tree.

**Response:** Array of `{ id, name, icon, topics: [...] }`.

---

### `POST /api/classes`
Create a new class.

**Body:** `{ name: "string", description?: "string" }`

---

### `POST /api/class-enrollments`
Enroll a student in a class.

**Body:** `{ class_id: "uuid", student_id: "uuid" }`

---

### `GET /api/export`
Generates PDF report.

**Query params:** `studentId`, `sessionId`

**Response:** PDF blob

---

### `POST /api/demo-session`
Sets demo teacher cookie.

**Known Issue:** Only sets `demo_auth` cookie, not `demo_role`.

---

### `POST /api/demo-session-student`
Sets demo student cookie.

---

## Auth Requirements

| Route | Auth Required | Current Enforcement |
|---|---|---|
| `/api/analyze` | No (student data in body) | None |
| `/api/sessions/[id]` | Yes (ownership) | Client-side only |
| `/api/classes` | Yes (teacher) | None |
| `/api/class-enrollments` | Yes (teacher) | None |
| `/api/export` | Yes | None |

**Decision:** Add explicit auth checks in each route handler until `middleware.ts` is implemented.
