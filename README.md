# 🐦 Chirpy

> A RESTful social media backend built with TypeScript and Express — featuring JWT authentication, refresh-token rotation, Argon2 password hashing, and a PostgreSQL database managed with Drizzle ORM.

---

## What is Chirpy?

Chirpy is a full backend for a Twitter-like microblogging platform. Users register, log in, post short messages ("chirps"), and browse feeds by author or chronology. The focus is on doing auth *right*: proper password hashing with Argon2, short-lived JWT access tokens backed by long-lived revocable refresh tokens, and clean REST semantics throughout.

Built to understand how production web backends are actually structured — from database schema design to secure authentication flows to RESTful API conventions.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| Authentication | JWT access tokens + DB-backed refresh tokens |
| Password hashing | Argon2 |
| Runtime | Node.js 21.7.0+ |

---

## Features

- **User registration & credential updates** — email/password auth with Argon2 hashing (safer than bcrypt, memory-hard)
- **JWT access tokens** — short-lived (1 hour), required for protected routes
- **Refresh tokens** — 60-day, DB-backed, revocable independently of the access token
- **Chirps** — create, read, and delete short posts (≤ 140 chars, enforced server-side)
- **Feed filtering** — query chirps by author ID and sort by `asc` or `desc`
- **Profanity filter** — server-side content moderation on post creation
- **Chirpy Red** — premium flag on a user, upgradeable via an authenticated webhook (e.g. from a payment provider like Polka)
- **Admin endpoints** — request-count metrics and a dev-only full data reset
- **Type-safe database layer** — Drizzle ORM with full TypeScript inference, migrations run automatically on boot
- **Clean REST semantics** — proper status codes (200, 201, 204, 401, 403, 404)

---

## API Reference

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET`    | `/api/healthz`            | –                | Liveness check, returns `OK` |
| `POST`   | `/api/users`               | –                | Register (email + password → user, password omitted) |
| `PUT`    | `/api/users`               | Bearer (access)  | Update the caller's email/password |
| `POST`   | `/api/login`               | –                | Authenticate → access token + refresh token |
| `POST`   | `/api/refresh`             | Bearer (refresh) | Exchange a valid refresh token for a new access token |
| `POST`   | `/api/revoke`              | Bearer (refresh) | Revoke a refresh token |
| `GET`    | `/api/chirps`              | –                | List chirps (`?authorId=&sort=asc|desc`) |
| `GET`    | `/api/chirps/:chirpId`     | –                | Get a single chirp |
| `POST`   | `/api/chirps`              | Bearer (access)  | Post a chirp (body ≤ 140 chars) |
| `DELETE` | `/api/chirps/:chirpId`     | Bearer (access)  | Delete your own chirp |
| `POST`   | `/api/polka/webhooks`      | Bearer (API key) | Upgrade a user to Chirpy Red (`event: "user.upgraded"`) |
| `GET`    | `/admin/metrics`           | –                | HTML page showing total requests served |
| `POST`   | `/admin/reset`             | –                | Wipe all users (dev platform only) |

---

## Architecture

```
Client (HTTP)
    │
    ▼
Express.js (middleware: request logging, JSON body parsing, hit metrics)
    │
    ├── /api/healthz              → liveness
    ├── /api/users                → register, update credentials (Argon2)
    ├── /api/login                → issues access + refresh tokens
    ├── /api/refresh, /api/revoke → refresh-token lifecycle
    ├── /api/chirps               → create / list / get / delete (JWT-protected writes)
    ├── /api/polka/webhooks       → Chirpy Red upgrades (API-key protected)
    └── /admin/*                  → metrics + dev-only reset
          │
          ▼
    Drizzle ORM (type-safe queries, auto-migrated on startup)
          │
          ▼
    PostgreSQL (users, chirps, refresh_tokens)
```

---

## Getting Started

**Prerequisites:** Node.js 21.7.0+, PostgreSQL

```bash
# Clone the repo
git clone https://github.com/VladV1999/Chirpy
cd Chirpy

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Fill in DB_URL, SECRET, and POLKA_KEY

# Start the dev server
# (compiles TypeScript and runs pending Drizzle migrations automatically on boot)
npm run dev
```

The server listens on `http://localhost:$PORT` (see `.env`).

### Running tests

```bash
npm test
```

---

## What I Learned

- Why Argon2 is preferred over bcrypt — memory-hard by design, resistant to GPU cracking
- How JWT authentication works end-to-end: signing, verification, expiry, and protecting routes with middleware
- Why access + refresh tokens are split — short-lived JWTs limit blast radius, DB-backed refresh tokens let you revoke a session without changing the signing secret
- Drizzle ORM's type inference — writing SQL-like queries with full TypeScript safety, no magic strings
- RESTful API design: when to use 201 vs 200, why DELETE returns 204, how to structure routes cleanly
- Express middleware chains: how auth, validation, and error handling layer together

---

## What's Next

- [ ] Follow/unfollow + personalized feed
- [ ] Rate limiting per user
- [ ] React frontend client
- [ ] Docker + CI/CD pipeline
- [ ] A simple frontend for interaction
