# ADR 0001: Pin stable toolchain versions

- **Status:** accepted
- **Date:** 2026-09-30

## Context

The pilot is a single home user with no ops team. Toolchain surprises cost more than missing new features. Newest releases (Erlang/OTP 29, Node 26) are very recent and Node 26 is not yet LTS.

## Options considered

- **Latest releases:** newest features, but less battle-tested and shorter support windows.
- **Stable / LTS releases:** slightly older, but proven with Phoenix and the ecosystem, with long security support.

## Decision

Pin stable versions in `.tool-versions` (mise/asdf): Erlang/OTP 28.5, Elixir 1.19.6 (OTP 28) and Node.js 24 LTS. PostgreSQL 17 in Docker Compose. Upgrade deliberately, through a new ADR, not by drift.

## Consequences

Reproducible setups for CI and any future contributor. Upgrades need a conscious step.
