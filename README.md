# CIS practice site

Next.js app for CIS exam practice. Users can sign in with an email address and password, laying the groundwork for storing personal accuracy stats later. Quizzes remain accessible without signing in.

## Setup

1. Install dependencies.
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and fill in the values.
   ```bash
   cp .env.example .env.local
   ```
   - `NEXTAUTH_SECRET`: random 32+ character string (`npx auth secret` works).
   - `NEXTAUTH_URL`: `http://localhost:3000` during development, your production URL on Vercel.
   - `DATABASE_URL`: `file:./prisma/dev.db` for local SQLite, or a persistent Postgres URL (Vercel Postgres/Neon/etc.) for production.
3. Apply the Prisma migration to create the database schema.
   ```bash
   npx prisma migrate dev --name init-auth
   ```
4. Start the dev server and open `http://localhost:3000`.
   ```bash
   npm run dev
   ```

## Authentication

- `/login` provides forms to register and sign in. Passwords are hashed with `bcrypt` before storage.
- Once signed in, the header shows the active user and a sign-out button.
- Guests can still use all quiz features; signed-in users will later get accuracy tracking and saved-question features.

## Deployment

On Vercel, add these environment variables:

- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (e.g. `https://your-app.vercel.app`)
- `DATABASE_URL` (persistent database connection string)

Run `npx prisma migrate deploy` as part of your deployment workflow to apply schema changes to the production database.