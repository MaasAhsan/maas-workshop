# MAAS Workshop

Single-page scroll portfolio + project workshop for **Makarim Ahsan**.

- **Homepage** — Hero / About / Featured Projects / Support / Contact (dark, scroll-reveal)
- **Workshop** — public project grid with direct downloads (GitHub Releases)
- **Admin** — owner-only (OTP email) full CRUD: upload, edit, delete, reorder, feature, thumbnails, download counts

## Stack

Next.js (App Router) + Tailwind CSS + Prisma (SQLite, Postgres-ready) + iron-session (owner-only OTP auth).

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in values
npx prisma db push           # create SQLite db + tables
npm run dev                  # http://localhost:3000
```

Required env (see `.env.example`):

| Var | Purpose |
| --- | --- |
| `DATABASE_URL` | `file:./dev.db` (SQLite) |
| `SESSION_PASSWORD` | 32+ char random string for iron-session |
| `OWNER_EMAIL` | the single email allowed to log in (default `makarimsusanto19@gmail.com`) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | Gmail/other SMTP for sending OTP. Leave blank in dev — OTP prints to console |
| `EMAIL_FROM` | sender shown in the OTP email |
| `NEXT_PUBLIC_SITE_URL` | used for OG/absolute links |

## OTP login

- Only `OWNER_EMAIL` can request a code (403 for anyone else).
- 6-digit code, expires in 10 minutes, single-use.
- Rate-limited to **5 requests/hour** per account (429 after that).
- Session cookie (`maas_session`) lasts 7 days, `httpOnly`, `secure` in production.

## Files & downloads

Projects store **metadata + a link only** — no self-hosted binaries.
- `downloadUrl` → a GitHub Release asset (or direct bucket) URL.
- Clicking **Download** hits `POST /api/projects/:id/download`, increments the anonymous counter, and sends the browser straight to the file. No intermediate page.

## Security model

- No visitor accounts exist. Public routes are read-only.
- Every admin mutation (`POST /api/projects`, `PATCH/DELETE /api/projects/:id`, `reorder`, `upload-thumbnail`) checks the iron-session cookie **server-side** — a public user hitting the endpoint directly gets `401`, regardless of what the frontend renders.

## Deploy (Vercel)

```bash
npm run build && npm run start
```

On Vercel, switch `DATABASE_URL` to Postgres later (same Prisma schema). Set all env vars in the dashboard.

## Scripts

```bash
npm run dev          # local dev
npm run build        # production build
npm run db:push      # push schema to db
npm run db:studio    # inspect data
npm run db:seed      # add demo projects
```
