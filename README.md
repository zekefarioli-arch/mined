# Mined

> **Every mind has gold in it.**

Mined is an adaptive learning web app for Key Stage 3 students in England (Year 8 and Year 9). It combines spaced retrieval practice with a curriculum knowledge graph so that learners can see, and grow, what they really know over time.

**Status:** pre-alpha. Planning phase; no source code yet.

## What it does (planned MVP)

- Initial adaptive diagnostic that finds real gaps, including Year 7 and Year 8 prerequisites.
- Short daily sessions driven by spaced repetition (FSRS).
- A visual knowledge map that lights up as concepts are mastered.
- Self-paced practice plus weekly assignments with due dates set by a parent.
- A parent dashboard focused on retention and mastery, not grades.

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Elixir, Phoenix (JSON API and Channels), Ecto, Oban |
| Database | PostgreSQL |
| Frontend | React, TypeScript, Vite |
| Testing | ExUnit, Mox, Vitest, Testing Library, Playwright |
| Infra | Docker Compose (development), GitHub Actions (CI) |

See [`docs/adr/`](docs/adr/) for the reasoning behind each choice.

## Repository layout

```
mined/
├── backend/     # Phoenix JSON API (created in M0)
├── frontend/    # React + Vite app (created in M0)
├── content/     # Curriculum graph and question items as YAML (created in M1)
├── tools/       # Authoring scripts
├── infra/       # Docker Compose and deployment
└── docs/        # Research, roadmap, architecture and ADRs
```

## Getting started

Setup instructions will be added when milestone M0 is complete.

## Documentation

- [Research report](docs/RESEARCH.md)
- [Roadmap](docs/ROADMAP.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Architecture Decision Records](docs/adr/README.md)
- [Changelog](CHANGELOG.md)

## License

Proprietary. All rights reserved.
