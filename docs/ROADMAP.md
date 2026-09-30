# Roadmap

Each milestone ends with a review and explicit approval before the next one starts. Tasks are small enough to be delivered as atomic, tested commits.

## Open questions

- [ ] Main device for the pilot user (phone, tablet or laptop). Decides how early PWA and mobile-first work happens.
- [ ] Pilot hosting: homelab or UK cloud region.
- [ ] First subject confirmed as Maths.

## Pending decisions (each becomes an ADR)

- [ ] Exact versions of Elixir, Erlang/OTP and Node, pinned in the repo.
- [ ] API style: REST JSON or GraphQL (Absinthe).
- [ ] Authentication for the SPA: Phoenix session cookies (same origin) or tokens.
- [ ] Module boundary enforcement in Elixir (for example the `boundary` library).
- [ ] FSRS: use an existing Hex package or port it ourselves.
- [ ] Knowledge map rendering: PixiJS, react-force-graph or D3.
- [ ] UI foundations: Tailwind with Radix/shadcn, animation with Motion.

## M0. Foundations
- [ ] Phoenix JSON API skeleton in `backend/` (no HTML, no assets).
- [ ] React + TypeScript + Vite skeleton in `frontend/`.
- [ ] PostgreSQL via Docker Compose in `infra/`.
- [ ] Health endpoint and a frontend page that calls it.
- [ ] CI: format check, Credo, backend tests, frontend lint and tests.
- [ ] README setup commands.

## M1. Curriculum as data
- [ ] YAML format for concepts and prerequisite edges in `content/`.
- [ ] Importer with validation (unique ids, no cycles, missing references).
- [ ] 40 to 60 Maths concepts spanning Year 7 to Year 9.
- [ ] Read API for the curriculum graph.

## M2. First practice loop
- [ ] Minimal accounts with two roles: learner and parent.
- [ ] Item types: multiple choice and numeric answer.
- [ ] Practice session endpoint and screen.
- [ ] Attempts stored as immutable, idempotent learning events.
- [ ] Deterministic marking.

## M3. Memory engine
- [ ] FSRS scheduling with tests against reference vectors.
- [ ] Daily review queue (Oban job).
- [ ] Confidence rating on every answer.

## M4. Mastery and knowledge map
- [ ] Elo-based mastery per concept.
- [ ] Evidence propagation to prerequisites.
- [ ] Visual knowledge map ("gold veins" that light up).

## M5. Initial diagnostic
- [ ] Adaptive placement test that detects Year 7 and Year 8 gaps.

## M6. Assignments
- [ ] Parent creates weekly assignments with a due date.
- [ ] Learner chooses when to complete them within the week.
- [ ] Assignment items blend into daily sessions.

## M7. Experience
- [ ] Graduated hints (hand-written, no AI yet).
- [ ] Dark theme with gold accents, accessibility settings (font size, read aloud).
- [ ] Installable PWA and one configurable reminder with quiet hours.

## M8. Home pilot
- [ ] Parent dashboard: mastery, 7 and 30 day retention, calibration.
- [ ] Data export and deletion.
- [ ] Deployment to the pilot environment.

## After the pilot
- AI-assisted item generation in `tools/`, always human reviewed.
- AI hints that guide without giving answers.
- More subjects, then multi-family support.
