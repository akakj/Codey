import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import CodePreview from "./CodePreview";
import { features, stats } from "./guestHomeData";
import { CheckCircle2 } from "lucide-react";
import CodeEditorPreview from "./CodeEditorPreview";

export default function GuestHome() {
  return (
    <div className="relative min-h-[calc(100dvh-4rem)] overflow-hidden px-6 sm:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[4%] top-20 size-80 rounded-full bg-blue-500/10 blur-[110px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[3%] top-48 size-80 rounded-full bg-purple-500/10 blur-[110px]"
      />

      <div
        aria-hidden="true"
        className="
    pointer-events-none absolute inset-0
    bg-[linear-gradient(to_right,rgba(100,116,139,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.10)_1px,transparent_1px)]
    dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)]
    bg-size-[42px_42px]
  "
      />

      <div className="relative mx-auto max-w-6xl">
        <section className="grid items-center gap-14 py-16 sm:py-20 lg:min-h-162.5 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
          <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
            <AnimatedGradientText
              colorFrom="var(--gradient-from)"
              colorTo="var(--gradient-to)"
              className="
    text-2xl font-bold
    [--gradient-from:#2563eb]
    [--gradient-to:#7e22ce]
    dark:[--gradient-from:#ffaa40]
    dark:[--gradient-to:#9c40ff]
  "
            >
              Codey
            </AnimatedGradientText>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl sm:leading-tight">
              Improve your coding through problem solving
            </h1>

            <p className="mt-6 leading-8 text-gray-700 dark:text-gray-200 sm:text-lg">
              Practise algorithms and data structures, test your solutions in
              the browser and track your progress over time.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/login">Get started</Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Link href="/problems">Browse problems</Link>
              </Button>
            </div>
          </div>

          <CodePreview />
        </section>

        <section
          aria-label="Platform statistics"
          className="grid overflow-hidden rounded-xl border bg-background/25 backdrop-blur-sm md:grid-cols-3"
        >
          {stats.map(({ value, label }, index) => (
            <div
              key={label}
              className={`p-6 text-center ${
                index > 0 ? "border-t md:border-l md:border-t-0" : ""
              }`}
            >
              <p className="text-2xl font-semibold">{value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </section>

       

        <section className="py-6 sm:py-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#1918FF] dark:text-[#B4BFFF]">
              How Codey works
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              From problem to accepted solution
            </h2>
            <p className="mt-4 leading-7 text-gray-700 dark:text-gray-200">
              Choose a challenge, test your approach, then submit your solution
              and keep track of what you have solved.
            </p>
          </div>

          <div className="mt-12 space-y-8 sm:mt-14 sm:space-y-10">
            <article className="grid items-center gap-8 rounded-2xl border bg-background/20 p-6 backdrop-blur-sm sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
              <div>
                <p className="text-sm font-semibold text-[#1918FF] dark:text-[#B4BFFF]">
                  01
                </p>
                <h3 className="mt-2 text-xl font-semibold">Choose a problem</h3>
                <p className="mt-3 max-w-md leading-7 text-gray-700 dark:text-gray-200">
                  Pick from problems across different topics and difficulty
                  levels, then work through the description and examples.
                </p>
              </div>

              <div className="overflow-hidden rounded-xl border bg-background/70">
                <div className="flex items-center justify-between border-b px-5 py-4">
                  <div>
                    <p className="font-medium text-c">Two Sum</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Arrays · Hash Table
                    </p>
                  </div>

                  <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-green-700 dark:text-green-500">
                    Easy
                  </span>
                </div>

                <div className="space-y-4 px-5 py-5 text-sm leading-6 text-gray-800 dark:text-gray-200">
                  <p>
                    Given an array of integers{" "}
                    <code className="rounded bg-muted px-1 py-0.5">nums</code>{" "}
                    and an integer{" "}
                    <code className="rounded bg-muted px-1 py-0.5">target</code>
                    , return the indices of the two numbers that add up to the
                    target.
                  </p>

                  <div className="rounded-lg border bg-muted/40 p-3 font-mono text-xs">
                    <p>nums = [2, 7, 11, 15]</p>
                    <p>target = 9</p>
                  </div>
                </div>
              </div>
            </article>

            <article className="grid items-center gap-8 rounded-2xl border bg-background/20 p-6 backdrop-blur-sm sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
              <CodeEditorPreview />
              <div className="lg:order-2">
                <p className="text-sm font-semibold text-[#1918FF] dark:text-[#B4BFFF]">
                  02
                </p>
                <h3 className="mt-2 text-xl font-semibold">
                  Write and test your solution
                </h3>
                <p className="mt-3 max-w-md leading-7 text-gray-700 dark:text-gray-200">
                  Write code directly in the browser and check it against
                  provided or custom test cases before submitting.
                </p>
              </div>
            </article>

            <article className="grid items-center gap-8 rounded-xl border bg-background/20 p-6 backdrop-blur-sm sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
              <div>
                <p className="text-sm font-semibold text-[#1918FF] dark:text-[#B4BFFF]">
                  03
                </p>
                <h3 className="mt-2 text-xl font-semibold">
                  Submit and track your progress
                </h3>
                <p className="mt-3 max-w-md leading-7 text-gray-700 dark:text-gray-200">
                  Submit against the larger number of test cases, revisit previous attempts
                  and see your progress build over time.
                </p>
              </div>

              <div className="overflow-hidden rounded-xl border bg-background/70">
                <div className="flex items-center gap-3 border-b px-5 py-4">
                  <div className="flex size-9 items-center justify-center rounded-full bg-emerald-500/10 text-green-800 dark:text-green-400">
                    <CheckCircle2 className="size-5" />
                  </div>

                  <div>
                    <p className="font-semibold text-green-800 dark:text-green-400">
                      Accepted
                    </p>
                    <p className="text-xs text-muted-foreground">
                      25 / 25 test cases passed
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 p-5 sm:grid-cols-3">
                  <div className="rounded-lg border bg-muted/30 dark:bg-muted/20 p-4">
                    <p className="text-xs text-muted-foreground">
                      Problems solved
                    </p>
                    <p className="mt-1 text-xl font-semibold">47</p>
                  </div>

                  <div className="rounded-lg border bg-muted/30 dark:bg-muted/20 p-4">
                    <p className="text-xs text-muted-foreground">Submissions</p>
                    <p className="mt-1 text-xl font-semibold">86</p>
                  </div>

                  <div className="rounded-lg border bg-muted/30 dark:bg-muted/20 p-4">
                    <p className="text-xs text-muted-foreground">
                      Acceptance rate
                    </p>
                    <p className="mt-1 text-xl font-semibold">54.7%</p>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="mx-auto mb-16 max-w-3xl rounded-2xl border bg-background/35 px-6 py-12 text-center backdrop-blur-sm sm:mb-20 sm:px-12">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Ready to solve your first problem?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-gray-700 dark:text-gray-200">
            Create an account to save submissions, revisit your solutions and
            track your progress.
          </p>

          <Button asChild size="lg" className="mt-6">
            <Link href="/login">Log in or sign up</Link>
          </Button>
        </section>
      </div>
    </div>
  );
}