# Codey

A full-stack coding challenge platform for practising algorithms, executing code in the browser and analysing problem-solving progress.

Codey was built as a personal engineering project to explore the systems behind online coding judges: multi-language execution, test-case evaluation, authentication, submission persistence and user analytics.

## Features

### Coding problems

* 150 curated algorithm and data-structure problems
* Easy, Medium and Hard difficulty levels
* Search and difficulty filtering
* Sortable problem catalogue
* Structured descriptions, examples, hints and starter code
* Random unsolved-problem navigation

### Browser-based editor

* Monaco code editor
* Per-language starter code
* Automatic local draft persistence
* Light and dark editor themes
* Resizable editor and console panels
* Reset-to-starter-code functionality
* Retrieval of the user's latest submitted solution

### Supported languages

Codey currently supports:

* JavaScript
* Python 3
* Java
* C#

Each problem defines language-specific starter code and entry-point metadata so that user solutions can be executed through a shared judging flow.

### Run and Submit

**Run** allows users to test a solution against visible or custom test cases without creating a submission.

**Submit** evaluates a solution through the server-side submission route, records the result and updates the user's progress.

The execution system handles:

* Language-specific wrapper generation
* Structured test-case input
* Output serialisation
* JSON and plain-text output comparison
* Python literal normalisation
* Runtime and memory results
* Compilation and runtime errors
* Passed and total test-case counts
* Failed-case feedback

### Accounts and progress

Authenticated users can:

* Save submissions
* Track completed problems
* Review every attempt made for a problem
* Retrieve their most recently submitted code
* View runtime and memory results
* Access a complete submission history
* Delete their account and associated data

Authentication and application data are managed with Supabase.

### Analytics dashboard

The authenticated homepage provides a personal problem-solving dashboard with:

* Problems solved by difficulty
* Submission and acceptance trends
* Completion rate
* Problems attempted
* First-attempt success
* Average attempts per solved problem
* Language usage and acceptance rates
* Recently solved problems
* Frequently attempted unsolved problems
* Active practice days
* Submission performance insights
* Total active problem-solving time
* Average and median time per submission
* Average time to first accepted solution

## How code execution works

```text
User solution
    ↓
Monaco editor
    ↓
Language-specific runner wrapper
    ↓
Next.js execution or submission route
    ↓
JDoodle execution API
    ↓
Structured output parsing
    ↓
Expected-output comparison
    ↓
Result returned to the interface
    ↓
Submission and progress saved in Supabase
```

### Run flow

The client creates a runner script using the selected language, problem entry point and visible test cases.

The script is sent to:

```text
POST /api/execute
```

The API route forwards it to JDoodle and returns the execution response to the console.

### Submit flow

The editor sends the original source code, selected language and active-time measurement to:

```text
POST /api/submit/[slug]
```

The server then:

1. Verifies the authenticated user.
2. Loads the problem and its submission test cases.
3. Builds the appropriate language-specific script.
4. Executes the script through JDoodle.
5. Parses the structured result for each case.
6. Normalises and compares the actual and expected outputs.
7. Records the submission in Supabase.
8. Updates the user's completion status when accepted.
9. Returns the result and failed-case information to the editor.

Keeping submission evaluation in a server route prevents the client from deciding whether its own solution should be accepted.

## Engineering highlights

### Cross-language execution

JavaScript, Python, Java and C# require different approaches to:

* Calling the user's solution
* Constructing arrays, lists and objects
* Serialising return values
* Representing booleans and null values
* Capturing compilation and runtime errors

Codey uses language-specific wrappers while retaining a common result format for the rest of the application.

### Structured runner output

Runner scripts emit machine-readable result markers. The application separates these structured results from ordinary user logs before evaluating each test case.

This prevents normal console output from being mistaken for a judge result.

### Output normalisation

Outputs may arrive as JSON, language-specific literals or plain text. The comparison layer attempts structured parsing first and falls back to trimmed text comparison when necessary.

The comparison decision remains separate from how failed output is presented in the interface.

### Persistent editor state

Draft code is stored independently for each:

```text
problem + programming language
```

Switching languages or leaving a problem does not discard the user's work. Authenticated users can also retrieve their latest database-backed submission.

### Analytics architecture

The analytics implementation separates:

1. Database retrieval
2. Metric calculation
3. Chart and component presentation

This keeps Supabase queries, analytical logic and interface rendering independently maintainable.

### Data access

Supabase Row Level Security policies restrict users to their own:

* Profile
* Submissions
* Problem-completion records

Administrative operations use a separate server-only Supabase client.

## Technology stack

| Area                        | Technologies                      |
| --------------------------- | --------------------------------- |
| Framework                   | Next.js 15, React 19              |
| Language                    | TypeScript                        |
| Styling                     | Tailwind CSS, shadcn/ui, Radix UI |
| Editor                      | Monaco Editor                     |
| Authentication              | Supabase Auth                     |
| Database                    | Supabase, PostgreSQL              |
| Code execution              | JDoodle API                       |
| Charts                      | Recharts                          |
| Icons                       | Lucide React                      |
| Theme support               | next-themes                       |
| Validation and sanitisation | TypeScript guards, sanitize-html  |

## Project structure

```text
Codey/
├── app/
│   ├── (site)/                    # Public and authenticated pages
│   │   ├── problems/              # Problem catalogue and problem routes
│   │   ├── submission-history/    # Grouped submission history
│   │   ├── account/               # User account management
│   │   └── components/            # Landing page and analytics
│   ├── api/
│   │   ├── execute/               # Run-code API route
│   │   └── submit/[slug]/         # Server-side submission judge
│   ├── components/
│   │   ├── editor/                # Editor, runner and console logic
│   │   └── ProblemWorkspace/      # Problem interface and tabs
│   └── data/                      # Problem definitions and test cases
├── components/ui/                 # Shared shadcn UI components
├── lib/                           # Shared types and utilities
├── public/                        # Static assets
├── supabase/migrations/           # Database migrations
├── utils/supabase/                # Browser, server and admin clients
└── middleware.ts                  # Supabase session middleware
```

## Getting started

### Prerequisites

* Node.js 20 or later
* npm
* A Supabase project
* JDoodle API credentials

### 1. Clone the repository

```bash
git clone https://github.com/akakj/Codey.git
cd Codey
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-supabase-publishable-key"

SUPABASE_SECRET_KEY="your-supabase-secret-key"

JDOODLE_CLIENT_ID="your-jdoodle-client-id"
JDOODLE_CLIENT_SECRET="your-jdoodle-client-secret"
```

`SUPABASE_SECRET_KEY` and the JDoodle credentials must remain server-only. Do not prefix them with `NEXT_PUBLIC_`.

### 4. Configure Supabase

Apply the SQL migrations from:

```text
supabase/migrations/
```

The application expects the relevant Supabase tables, relationships and Row Level Security policies to be available.

The IDs stored in the database `problems` table must correspond to the `problemID` values in the problem catalogue because submissions and completion records reference those IDs.

### 5. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Available scripts

```bash
npm run dev
```

Starts the development server.

```bash
npm run build
```

Creates a production build.

```bash
npm start
```

Runs the production build.

## Current limitations

Codey is a personal learning project rather than a production code-execution service.

Current limitations include:

* Code execution depends on the JDoodle API.
* JDoodle request, output and usage limits apply.
* Large outputs may be truncated by the external execution service.
* The problem catalogue is curated rather than user-generated.
* Execution is not intended to provide the isolation guarantees of a dedicated container-based judge.
* Some earlier Prisma artefacts remain in the repository, while the active application data flow uses Supabase directly.

## Purpose

The project was created to develop practical experience with:

* Full-stack TypeScript development
* Next.js server and client boundaries
* Third-party execution APIs
* Cross-language code generation
* Authentication and authorisation
* Relational data modelling
* Row Level Security
* Stateful editor interfaces
* Responsive data visualisation
* Error handling across distributed application layers

## Acknowledgements

Codey is inspired by coding-practice platforms such as LeetCode and by the structured topic-based approach of NeetCode.

It is an independent personal learning project and is not affiliated with either platform.

## License

This repository currently has no open-source licence. Unless a licence is added, the source code is not automatically licensed for reuse, modification or distribution.
