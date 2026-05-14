# 🐦 Chirpy

> A RESTful social media backend built with TypeScript and Express — featuring JWT authentication, Argon2 password hashing, and a PostgreSQL database managed with Drizzle ORM.

---

## What is Chirpy?

Chirpy is a full backend for a Twitter-like microblogging platform. Users register, log in, post short messages ("chirps"), and browse feeds by author or chronology. The focus is on doing auth *right*: proper password hashing with Argon2, JWT access tokens, and clean REST semantics throughout.

Built to understand how production web backends are actually structured — from database schema design to secure authentication flows to RESTful API conventions.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| Authentication | JWT (JSON Web Tokens) |
| Password hashing | Argon2 |
| Runtime | Node.js 21.7.0+ |

---

## Features

- **User registration & login** — email/password auth with Argon2 hashing (safer than bcrypt, memory-hard)
- **JWT access tokens** — issued on login, required for protected routes
- **Chirps** — create, read, and delete short posts (≤ 140 chars, enforced server-side)
- **Feed filtering** — query chirps by author ID and sort by `asc` or `desc`
- **Profanity filter** — server-side content moderation on post creation
- **Type-safe database layer** — Drizzle ORM with full TypeScript inference
- **Clean REST semantics** — proper status codes (201, 204, 401, 403, etc.)

---

## API Reference

```
POST   /api/users            Register (email + password → user object, password omitted from response)
POST   /api/login            Authenticate (email + password → JWT)
GET    /api/chirps            Get all chirps (?author_id=&sort=asc|desc)
POST   /api/chirps            Post a chirp (JWT required, body ≤ 140 chars)
DELETE /api/chirps/:chirpId   Delete your chirp (JWT required, must be author)
```

---

## Architecture

```
Client (HTTP)
    │
    ▼
Express.js Router
    ├── /api/users     → registration, profile updates
    ├── /api/login     → JWT issuance
    └── /api/chirps    → CRUD, feed queries
          │
          ▼
    Drizzle ORM (type-safe queries)
          │
          ▼
    PostgreSQL
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
# Add your DATABASE_URL and JWT_SECRET

# Run database migrations
npm run db:migrate

# Start the dev server
npm run dev
```

---

## What I Learned

- Why Argon2 is preferred over bcrypt — memory-hard by design, resistant to GPU cracking
- How JWT authentication works end-to-end: signing, verification, expiry, and protecting routes with middleware
- Drizzle ORM's type inference — writing SQL-like queries with full TypeScript safety, no magic strings
- RESTful API design: when to use 201 vs 200, why DELETE returns 204, how to structure routes cleanly
- Express middleware chains: how auth, validation, and error handling layer together

---

## What's Next

- [ ] Refresh token rotation
- [ ] Follow/unfollow + personalized feed
- [ ] Rate limiting per user
- [ ] React frontend client
- [ ] Docker + CI/CD pipeline