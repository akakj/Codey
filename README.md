# Codey

A **LeetCode-like** website for coding challenges. *I started grinding LeetCode so I decided to create my own version.*

**Status: The website is still in progress.**

---

## 🧠 What is this?

Codey is a practice platform where you can browse problems, read statements, and (soon) write and run code in-browser. It’s built to be fast, clean, and easy to extend.

> Repo tech highlights: Next.js (App Router) + TypeScript, Tailwind CSS, shadcn/ui components, Prisma, and Supabase utilities.

---

## ✨ Features (WIP)

* Problem listing & detail pages
* Difficulty tags and metadata
* In-browser editor & runner (planned)
* Submissions history, results, and leaderboards (planned)
* Auth & profiles

---

## 🚀 Getting Started

### Prerequisites

* Node.js LTS
* A PostgreSQL database (for Prisma)

### 1) Install

```bash
npm install
# or
yarn install
```

### 2) Configure env vars

Create a `.env` file in the project root. Example:

```bash
# Database (Prisma)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME?schema=public"

# Supabase (if used)
NEXT_PUBLIC_SUPABASE_URL="https://YOUR-PROJECT.ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_ANON_KEY"
```

### 3) Set up the database

```bash
npx prisma generate
npx prisma migrate dev
```

### 4) Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🗂️ Project Structure (overview)

```
Codey/
├─ app/                 # Next.js (App Router) pages/layouts
├─ components/ui/       # shadcn/ui components
├─ lib/                 # Helpers & configs
├─ prisma/              # Prisma schema & migrations
├─ public/              # Static assets
├─ utils/supabase/      # Supabase client/utilities
├─ middleware.ts        # Middleware (auth/rules)
└─ package.json         # Scripts & dependencies
```

---

## 🔧 Available Scripts

* `npm run dev` — Start dev server
* `npm run build` — Build for production
* `npm start` — Run production build
* `npm run lint` — Lint code (if configured)

---

## 🗺️ Roadmap

* [ ] Code execution sandbox & test cases
* [ ] Submissions, verdicts, and leaderboards
* [ ] User Progress on Home page displayed

---

## 🤝 Contributing

Open an issue or PR with suggestions. This is a personal learning project inspired by LeetCode.

---

## 📄 License

No license added yet.

---

> **Note:** This README will evolve as core features land. If you spot something missing or have ideas, feel free to file an issue.
