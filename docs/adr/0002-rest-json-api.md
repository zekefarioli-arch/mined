# ADR 0002: REST JSON API

- **Status:** accepted
- **Date:** 2026-09-30

## Context

The React SPA needs an API to a Phoenix backend. Screens are few and well known (practice session, knowledge map, parent dashboard).

## Options considered

- **REST JSON:** Phoenix default, simple, cacheable, easy to test with ExUnit and to type on the frontend. Risk of over- or under-fetching.
- **GraphQL (Absinthe):** flexible queries, but more moving parts, a larger surface to secure and more to learn, with little benefit at this scale.

## Decision

REST JSON under `/api`. Real-time needs, if any, use Phoenix Channels.

## Consequences

Endpoints are shaped per screen. We can revisit GraphQL if clients multiply.
