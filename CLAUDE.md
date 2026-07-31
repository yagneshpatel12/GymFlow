@AGENTS.md

# GymFlow — project guide for AI sessions

Read this first. It's the context for continuing work in a new chat.

## What this is

A **portfolio proof-of-work** by Yagnesh Patel (yagneshpateldev.com): a production-quality
**gym management SaaS**, built to show employers/agencies a complete full-stack app.
It is a single repo with a **marketing landing site + real auth + an admin dashboard**.

- **Live:** https://getgymflow.vercel.app/
- **Demo login:** `demo@gymflow.app` / `demo1234` (or click **View demo dashboard** — one-click, no signup)

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind v4** — CSS-first tokens live in `src/app/globals.css` (`@theme`), no tailwind.config
- **MongoDB Atlas** via **Mongoose**
- **Custom JWT auth** (`jose` + `bcryptjs`, httpOnly cookie) — NOT NextAuth
- **Recharts**, **Zod**, **date-fns**, **lucide-react**

## Structure (route groups)

```
src/app/(marketing)   public landing page (nav + footer layout)
src/app/(auth)        login / signup (split-screen; left panel loops a video + a
                      desktop-monitor screenshot of the real dashboard)
src/app/(dashboard)   the app — auth-guarded in its layout via requireUser()
src/app/api           route handlers (auth, members, classes, attendance, photos, seed…)
src/components/ui     primitives: Button, Card, Input, Dropdown, Modal, Avatar, Badge, Skeleton
src/components/*      per-feature components
src/lib/data          DB reads (get*PageData) + *-mutations (writes)
src/lib/auth.ts       session (createSession/getSession/requireUser)
src/models            Mongoose models (User, Member, Plan, Trainer, GymClass, Attendance, MemberPhoto)
```

## Modules (all live, DB-backed, scoped to the logged-in owner)

Dashboard (KPIs + charts), Members (searchable table, CRUD, rich profile, **progress photos**),
Class Schedule (interactive weekly calendar), Attendance (front-desk check-in), Trainers,
Membership Plans, **Before & After** (member transformation photos, dynamic).

## Conventions & decisions (don't undo without a reason)

- **Brand = emerald** (`--color-brand-*`). Light theme, **dark (`slate-900`) sidebar** with an
  emerald active pill. Favicon is `src/app/icon.svg`.
- **NO em/en dashes (— –) anywhere** in UI text, comments, or docs — the user considers them an
  "AI tell." Use plain hyphens. (There was a full sweep; keep it clean.)
- **All dropdowns use the custom `<Dropdown>`** (`components/ui/dropdown.tsx`, portal-rendered so it
  works inside modals), never native `<select>`.
- **Members pagination is client-side** (fetch all rows once, filter/paginate in the browser) —
  intentional and correct for the target scale (50–200 members). Do not "fix" to server-side.
- **Forms** validate with the shared Zod schemas via `lib/form.ts` (`validateForm`), show inline
  `<FieldError>`, and mark required labels with `*` (`<Label required>`).
- **Photos**: compressed in the browser (`lib/image.ts`), stored as a **Buffer in MongoDB**
  (`MemberPhoto`), served via the **auth-protected** `/api/photos/[id]`. Self-contained, no S3.
  A new member's registration photo is set as **both profile and Before** by default.
- **Auth panel dashboard image** = a **static screenshot** at `public/auth/dashboard.png`.
  If the dashboard UI changes, **re-capture it** (playwright-core is installed; log in as demo,
  screenshot `/dashboard`).
- **Commits**: the user does NOT want AI attribution — do **not** add `Co-Authored-By` trailers.

## Run / seed

- `npm run dev` (Next 16 enforces one dev instance; if it says "already running", kill the process
  holding port 3000 and restart).
- Seed / reset the demo data: `curl -X POST "http://localhost:3000/api/seed?secret=let-me-seed"`.
- `.env.local` (gitignored) holds `MONGODB_URI`, `JWT_SECRET`, `DEMO_EMAIL/PASSWORD`, `SEED_SECRET`.
  `.env.example` is the committed template.

## Gotchas (learned the hard way — save yourself the pain)

- **Next 16 is async**: `params`, `searchParams`, `cookies()`, `headers()` are Promises — `await`
  them. Dynamic route handlers: `{ params }: { params: Promise<{ id: string }> }`.
- **Mongoose stale model**: after adding a **field to a schema**, you MUST **restart the dev server**
  — hot-reload keeps the old cached schema and silently strips new fields on write.
- **Serving image bytes**: fetch the photo **without `.lean()`** — lean returns a BSON `Binary`
  (serializes to 0 bytes); the hydrated doc gives a real `Buffer`.
- **Flaky DNS on `mongodb+srv`** (`querySrv ECONNREFUSED`): `lib/db.ts` sets `dns.setServers` +
  retries. Cold requests may need a retry.
- Never commit `.env.local`.

## Deploy

- **Vercel**, deploys from GitHub `main`. Env vars are set in the Vercel dashboard (same keys as
  `.env.local`); **redeploy after changing env vars** (they don't apply to an existing build).
- Local and prod point at the **same Atlas cluster**, so the seeded demo data is shared.
