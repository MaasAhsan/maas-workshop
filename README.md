# MAAS Workshop

Single-page scroll portfolio + project workshop for **Makarim Ahsan**.

- **Homepage** — Hero / About / Featured Projects / Support / Contact (dark, scroll-reveal)
- **Workshop** — public project grid with direct downloads (GitHub Releases)
- **Admin** — owner-only (OTP email) full CRUD: upload, edit, delete, reorder, feature, thumbnails, download counts

## Stack

Next.js (App Router) + Tailwind CSS + Prisma (Postgres) + iron-session (owner-only OTP auth).

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in a Postgres URL (e.g. a free Neon DB — dev and prod share the schema)
npx prisma db push           # create tables
npm run dev                  # http://localhost:3000
```

Required env (see `.env.example`):

| Var | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (Prisma). Dev: `file:./dev.db` (SQLite); prod: Neon/Postgres |
| `SESSION_PASSWORD` | 32+ char random string for iron-session |
| `OWNER_EMAIL` | the single email allowed to log in (default `makarimsusanto19@gmail.com`) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | Gmail/other SMTP for sending OTP. Leave blank in dev — OTP prints to console |
| `EMAIL_FROM` | sender shown in the OTP email |
| `NEXT_PUBLIC_SITE_URL` | used for OG/absolute links |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token for thumbnail uploads (auto-injected on Vercel; store token for local dev) |

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

The app is production-ready for Vercel's serverless platform: the DB is Postgres
(via Prisma) and thumbnails upload to Vercel Blob — no writable filesystem needed.

```bash
npm run build && npm run start   # local production check
```

On Vercel, set all env vars in the dashboard (or `vercel env add`):

- `DATABASE_URL` — a Postgres connection string (e.g. free Neon). After setting
  it, push the schema once: `npx prisma db push`.
- `SESSION_PASSWORD` — a fresh 32+ char random string (must differ from local dev).
- `SMTP_USER` / `SMTP_PASS` (Gmail App Password) for OTP email.
- `NEXT_PUBLIC_SITE_URL` — the deployed origin, e.g. `https://maasworkshop.net`.
- `BLOB_READ_WRITE_TOKEN` — auto-injected by Vercel when Blob is enabled.

Deploy: connect the GitHub repo in the Vercel dashboard, or `vercel --prod` from
the CLI. Attach your custom domain under **Settings → Domains** (Vercel provides
automatic DNS/SSL for `*.vercel.app` and your own domain).

## Scripts

```bash
npm run dev          # local dev
npm run build        # production build
npm run db:push      # push schema to db
npm run db:studio    # inspect data
npm run db:seed      # add demo projects
```
