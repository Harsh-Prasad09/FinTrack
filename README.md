# FinTrack 

A lightweight, Tailwind-styled React app for personal finance tracking. Built with Vite, Supabase (Auth + Postgres), and Recharts for visualizations.

## Quick overview

- Routes: `/` (Landing), `/login` (modal), `/signup` (modal), `/dashboard` (authenticated app)
- Auth: Supabase Auth (email/password). The app upserts a `profiles` row after sign-up/login to store `full_name` and `email`.
- Data: `transactions` table (stored in Supabase) powers recent transactions and charts.

## Tech stack

- React (via Vite)
- Tailwind CSS
- Supabase (Auth + Postgres)
- Recharts (charts)
- lucide-react (icons)

## Getting started (local)

Prerequisites:
- A Supabase project (free tier is fine)

1) Clone & install

```powershell
# from project root
npm install
```

2) Environment

Create a `.env` (or add to your system env) with the following keys:

- VITE_SUPABASE_URL - your Supabase project URL
- VITE_SUPABASE_ANON_KEY - your Supabase anon/public key

Example `.env` (Vite expects VITE_ prefix):

VITE_SUPABASE_URL=https://xyzcompany.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJI...

3) Run the app

```powershell
npm run dev
```

Open the printed local URL (usually http://localhost:5173).

4) Lint / Build / Preview

```powershell
npm run lint
npm run build
npm run preview
```

## Supabase setup (database)

You need two tables (typical names used by the app):

1) `profiles` - used by the auth/profile logic
- expected columns: id (uuid, primary key), full_name (text), email (text)
- The app upserts a profile record after sign-up/login using the Supabase Auth user id.

2) `transactions` - stores user transactions the dashboard reads
- example columns used by the app: id, user_id (uuid), type (text: 'income'|'expense'), topic (text), amount (numeric), currency (text), occurred_at (timestamp), metadata (jsonb), created_at

A minimal example SQL to create `transactions` (adjust types/policies to your needs):

```sql
create table transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null,
  type text not null,
  topic text,
  amount numeric not null,
  currency text default 'INR',
  occurred_at timestamp with time zone,
  metadata jsonb,
  created_at timestamp with time zone default now()
);
```

If you enable Row Level Security (RLS), add policies that allow authenticated users to insert/select rows for their own `user_id`.

NOTE: This repository does not include server-side migrations. Apply the SQL in the Supabase SQL editor or via your preferred migration process.

## Important files & components

- `package.json` - scripts & deps
- `vite.config.js`, `tailwind.config.js` - build & styling config
- `src/main.jsx` - app bootstrap
- `src/App.jsx` - routing and modal-route pattern (background location) used to show login/signup as overlays
- `src/lib/supabaseClient.js` - Supabase client instance (reads env vars)
- `src/context/AuthContext.jsx` - auth state provider; exposes `user`, `profile`, `loading`, and `signOut`
- `src/components/Header.jsx` - top navigation and auth links (shows user name on dashboard)
- `src/components/Footer.jsx` - footer / quick links
- `src/components/TransactionForm.jsx` - quick-add transaction form
- `src/components/Charts.jsx` - Recharts visualizations (monthly net, pies, etc.)
- `src/pages/landing.jsx` - marketing landing page and CTA
- `src/pages/Login.jsx`, `src/pages/Signup.jsx` - modal UIs that overlay the background route
- `src/pages/Dashboard.jsx` - authenticated dashboard; loads `transactions` and shows charts

## How auth & modal routing works

- Header links to `/login` and `/signup` set navigation state `{ background: location }`. `App.jsx` uses that to render the landing (background) route and then the modal route on top.
- After sign-up/sign-in, the app attempts an immediate sign-in and upserts the `profiles` row with the user's name/email.
- There is a local fallback key `ft_unconfirmed_auth` used to bypass Supabase email confirmation UI behavior (the app sets this when Supabase returns a confirmation-related message and navigates to `/dashboard`).

## Common commands & troubleshooting

- Dev server not starting: ensure Node version is compatible and `VITE_SUPABASE_*` are set. If Vite fails on port, try another port or check if another process is using it.
- Lint errors: run `npm run lint` and fix code warnings. Some warnings may come from config; the project already includes ESLint config in dev deps.
- Supabase inserts failing: confirm the `transactions` table exists and RLS policies allow authenticated users to insert/select. Check Supabase Logs for auth/row policy errors.

## Notes & TODOs

- Accessibility: modals have a close button and backdrop click-to-close. Consider adding focus trapping and ESC-to-close handlers for improved accessibility.
- Tests: there are no unit/integration tests included; adding a small set of Vitest tests for key components is recommended.
- Deploy: for static deploys (Netlify, Vercel), set the two VITE_SUPABASE_* env vars in the hosting settings.

## Mapping to UX

- Landing: `src/pages/landing.jsx` (hero, features, CTA)
- Modals: `src/pages/Login.jsx` and `src/pages/Signup.jsx` (both overlay background route)
- Dashboard: `src/pages/Dashboard.jsx` (charts, recent transactions, quick actions)

## Contact / license
This project was authored by the workspace owner.

License
-------

This project is intended to be licensed under the MIT License. Add a `LICENSE` file to the repository root with the MIT license text (replace YEAR and YOUR_NAME with the correct values).

You can create the `LICENSE` file from PowerShell with (replace YEAR and YOUR_NAME):

```powershell
@'
MIT License

Copyright (c) YEAR YOUR_NAME

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
'@ > LICENSE

git add LICENSE
git commit -m "Add MIT license"
```

If you'd like, I can add the `LICENSE` file for you and update the README to include the chosen copyright name and year.

---

If you want, I can:
- Add a SQL migration file in the repo for the `transactions` & `profiles` tables.
- Add a `.env.example` with placeholder env vars.
- Add a small checklist script to validate the Supabase connection from the app.

Tell me which of those you'd like next.
