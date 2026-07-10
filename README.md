# Codey

A platform for practicing and analysing problem-solving coding challenges, designed with a focus on performance, scalability, and developer experience.

**Status:** Active development — **Run** and **custom user test cases** are implemented. **Submit** and **Solutions** features are in progress.

---

## Overview

Codey is a browser-based coding challenge platform that allows users to write, run, and evaluate solutions against structured test cases, while laying the groundwork for meaningful progress tracking and performance insights.

The project is built using production-style practices, with an emphasis on API-driven design, frontend–backend coordination, and maintainability.

---

## Core features

### Implemented
- Problem catalogue with metadata and categorisation
- **150 curated coding problems** across multiple topics
- In-browser code editor
- **Code execution pipeline (Run)**
- **Custom user-defined test cases**

### In progress
- **User statistics and analytics page**
- **About section**

---

## Technical highlights

- API-first and modular architecture
- Strong separation of concerns between UI, execution, and data layers
- Performance-focused UX (optimistic updates, caching)
- Secure authentication and execution boundaries
- Structured to support future features without major refactors

---

## Tech stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend / Data:** Supabase, PostgreSQL (Removed Prisma for better database migrations)
- **Tooling & DevOps:** GitHub Actions (CI/CD), ESLint, Prettier
- **Deployment:** Vercel

---

## Getting started

### Prerequisites
- Node.js (LTS)
- PostgreSQL database

### Install dependencies
```bash
npm install


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

## 🤝 Contributing

Open an issue or PR with suggestions. This is a personal learning project inspired by LeetCode.

---

## 📄 License

No license added yet.

---

> **Note:** This README will evolve as core features land. If you spot something missing or have ideas, feel free to file an issue.
