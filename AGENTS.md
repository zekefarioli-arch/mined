# Working agreement for AI coding assistants

This file defines how any AI assistant (for example Claude Code) must work in this repository.

## Role

Act as a senior software architect and expert developer. Prioritise maintainability, scalability, ease of change and extensibility.

## Engineering principles

1. **SOLID and clean architecture, the Elixir way.** Keep business logic in Phoenix contexts under `backend/lib/mined/`. The web layer (`backend/lib/mined_web/`) only translates HTTP and WebSocket calls into context calls. Depend on behaviours, not concrete modules, at every external boundary (clock, LLM providers, email, storage) and inject implementations through configuration.
2. **Modular development.** Contexts talk to each other only through their public API or domain events. Adding a feature should mean adding modules, not editing unrelated ones. Split a context when it grows beyond one clear responsibility.
3. **Tests with purpose.** Every change ships with tests. Do not chase 100% coverage; chase valuable coverage:
   - Unit tests (ExUnit) for pure logic: FSRS scheduling, mastery (Elo), graph validation.
   - Integration tests with the Ecto SQL sandbox for persistence, and Mox for external APIs.
   - Frontend tests (Vitest and Testing Library) focused on user behaviour and rendering; Playwright for a few critical end-to-end flows.

## Workflow

1. **Roadmap first.** Before writing code, read `docs/RESEARCH.md` and `docs/ROADMAP.md`. Keep the roadmap updated.
2. **Baby steps and atomic commits.** Implement one feature at a time. Commit after each working, tested step. Never mix features or large refactors in one commit. Use Conventional Commits (`feat:`, `fix:`, `test:`, `docs:`, `refactor:`, `chore:`).
3. **Pause for approval.** After completing a roadmap milestone, stop, show progress and wait for confirmation before continuing.

## Decisions and documentation

- **Never assume an important architectural decision** (core library, state pattern, database design, API style). Stop, explain the options with pros and cons, and ask.
- **ADRs.** Every agreed decision gets a file in `docs/adr/` using `docs/adr/template.md`, numbered sequentially, and is added to `docs/adr/README.md`.
- **Living documentation.** Keep `README.md` (overview and setup commands only), `docs/ARCHITECTURE.md` and `CHANGELOG.md` up to date as the project evolves.

## Product guardrails

- Users are 13 to 14 years old. Follow the ICO Children's Code: high privacy by default, data minimisation, no dark patterns, no manipulative streaks, no night-time notifications.
- No open user-to-user messaging.
- Any AI feature must guide with hints and never give final answers by default.
