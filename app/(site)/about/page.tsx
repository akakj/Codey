import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Database } from "lucide-react";

import { Button } from "@/components/ui/button";

import { features, questions, technologies } from "./about-data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Codey, a full-stack coding challenge platform for practising algorithms, running code and tracking progress.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-8 sm:py-16">
      <section className="mx-auto max-w-3xl text-center">
        <p className="font-bold uppercase tracking-wider text-[#1918FF] dark:text-[#B4BFFF]">
          About Codey
        </p>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
          A coding platform for practising problems and testing solutions
        </h1>

        <p className="mt-6 text-base leading-8 sm:text-lg">
          Codey is a full-stack coding challenge platform where users can
          practise algorithmic problems, execute code in the browser, submit
          solutions and analyse their progress over time.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="hover:cursor-pointer">
            <Link href="/problems">Browse problems</Link>
          </Button>

          <Button asChild size="lg" variant="outline">
            <a
              href="https://github.com/akakj/Codey"
              target="_blank"
              rel="noreferrer"
            >
              View source code
            </a>
          </Button>
        </div>
      </section>

      <section className="mt-20 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="font-semibold text-[#1918FF] dark:text-[#B4BFFF]">
            Why I built it
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            More than a static list of coding questions
          </h2>
        </div>

        <div className="space-y-5 leading-8">
          <p>
            I started building Codey while preparing for technical interviews. I
            wanted to understand not only how to solve coding problems, but also
            how platforms such as online judges execute code, evaluate outputs,
            store submissions and measure user progress.
          </p>

          <p>
            The project developed into a complete coding-practice application
            with authentication, multi-language execution, public and hidden
            test cases, persistent submissions, progress tracking and a personal
            analytics dashboard.
          </p>

          <p>
            Codey is inspired by platforms such as{" "}
            <Link
              href="https://leetcode.com"
              target="_blank"
              rel="noreferrer"
              className="underline hover:no-underline"
            >
              LeetCode
            </Link>{" "}
            and by the structured topic-based approach of{" "}
            <Link
              href="https://neetcode.io"
              target="_blank"
              rel="noreferrer"
              className="underline hover:no-underline"
            >
              NeetCode
            </Link>
            . It is an independent personal learning project and is not
            affiliated with either platform.
          </p>
        </div>
      </section>

      <section className="mt-20">
        <div className="max-w-2xl">
          <p className="font-semibold text-[#1918FF] dark:text-[#B4BFFF]">
            What you can do
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Practise, submit and understand your progress
          </h2>

          <p className="mt-4 leading-7">
            Codey combines a coding workspace with persistent progress and
            performance insights.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="rounded-xl border bg-card p-6 shadow-sm"
            >
              <div className="flex size-11 items-center justify-center rounded-lg border bg-muted/70">
                <Icon className="size-5 text-[#1918FF] dark:text-[#B4BFFF]" />
              </div>

              <h3 className="mt-5 font-semibold">{title}</h3>

              <p className="mt-2 text-sm leading-6">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20 overflow-hidden rounded-2xl border bg-muted/20">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <div className="border-b p-8 lg:border-r lg:border-b-0 sm:p-10">
            <div className="flex size-12 items-center justify-center rounded-xl border bg-background">
              <Database className="size-6 text-[#1918FF] dark:text-[#B4BFFF]" />
            </div>

            <h2 className="mt-6 text-2xl font-semibold tracking-tight">
              How submissions work
            </h2>

            <p className="mt-4 leading-7 ">
              Submission evaluation is handled by the server rather than being
              decided by the browser.
            </p>
          </div>

          <ol className="space-y-6 p-8 sm:p-10">
            {[
              "The editor sends the source code, selected language and problem identifier to the submission route.",
              "The server verifies the authenticated user and loads the problem test cases.",
              "A language-specific wrapper calls the submitted solution and produces structured output.",
              "The generated script is executed through the JDoodle API.",
              "The server parses and normalises the returned output before comparing it with the expected result.",
              "The submission is saved in Supabase and the user's completion status is updated when accepted.",
            ].map((step, index) => (
              <li key={step} className="flex gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border bg-background text-sm font-semibold">
                  {index + 1}
                </span>

                <p className="pt-1 text-sm leading-6 sm:text-base">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mt-20 grid gap-10 lg:grid-cols-2">
        <div>
          <p className="font-semibold text-[#1918FF] dark:text-[#B4BFFF]">
            Engineering challenges
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Problems explored while building Codey
          </h2>

          <div className="mt-8 space-y-6">
            <div>
              <h3 className="font-semibold">Cross-language execution</h3>

              <p className="mt-2 leading-7 ">
                JavaScript, Python, Java and C# each require different handling
                for method calls, data structures, return values, booleans, null
                values and runtime errors.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Reliable output comparison</h3>

              <p className="mt-2 leading-7 ">
                Execution results may be returned as JSON, language-specific
                literals or plain text. Codey normalises these formats before
                comparing them with expected outputs.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Separating Run from Submit</h3>

              <p className="mt-2 leading-7">
                Run is designed for visible and custom test cases, while Submit
                performs authenticated evaluation, records the result and
                updates user progress.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Turning submissions into analytics
              </h3>

              <p className="mt-2 leading-7 ">
                Raw submission and completion records are transformed into
                metrics that describe consistency, language performance, problem
                difficulty and active practice time.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-8 sm:p-10">
          <p className="font-semibold text-[#1918FF] dark:text-[#B4BFFF]">
            Technology
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            Tools used to build the platform
          </h2>

          <div className="mt-8 flex flex-wrap gap-3">
            {technologies.map(({ name, className, dotClassName }) => (
              <span
                key={name}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${className}`}
              >
                <span
                  aria-hidden="true"
                  className={`size-2 rounded-full ${dotClassName}`}
                />
                {name}
              </span>
            ))}
          </div>

          <div className="mt-10 border-t pt-8">
            <h3 className="font-semibold">Current limitations</h3>

            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 ">
              <li>Code execution depends on the JDoodle API.</li>
              <li>External usage, request and output limits apply.</li>
              <li>
                The execution environment does not provide the same isolation as
                a dedicated container-based judge.
              </li>
              <li>
                The problem catalogue is curated rather than user-generated.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-3xl">
        <div className="text-center">
          <p className="font-semibold text-[#1918FF] dark:text-[#B4BFFF]">
            Frequently asked questions
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            How Codey works
          </h2>
        </div>

        <div className="mt-8 divide-y rounded-xl border">
          {questions.map(({ question, answer }) => (
            <details key={question} className="group p-6">
              <summary className="cursor-pointer list-none font-semibold">
                <span className="flex items-center justify-between gap-4">
                  {question}

                  <span
                    aria-hidden="true"
                    className="text-xl font-normal transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </span>
              </summary>

              <p className="mt-4 pr-8 text-sm leading-7 ">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-20 rounded-2xl border bg-muted/20 px-6 py-12 text-center sm:px-12">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Explore the project
        </h2>

        <p className="mx-auto mt-4 max-w-2xl leading-7 ">
          Browse the problem catalogue, try the editor or review the source code
          to see how the application is structured.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/problems">
              Open problem catalogue
              <ArrowRight className="size-4" />
            </Link>
          </Button>

          <Button asChild size="lg" variant="outline">
            <a
              href="https://github.com/akakj/Codey"
              target="_blank"
              rel="noreferrer"
            >
              GitHub repository
            </a>
          </Button>
        </div>
      </section>
    </main>
  );
}
