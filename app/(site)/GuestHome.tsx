import Link from "next/link";
import {
  Braces,
  ChartNoAxesCombined,
  TestTube2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import CodePreview from "./CodePreview";

const features = [
  {
    title: "Solve coding problems",
    description:
      "Practise algorithms and data structures across a range of topics and difficulty levels.",
    icon: Braces,
    accent: "border-t-blue-500",
    iconStyle:
      "border-blue-500/30 bg-blue-500/10 text-blue-500 dark:text-blue-400",
  },
  {
    title: "Run and test your code",
    description:
      "Write code in the browser and test your solution using provided or custom test cases.",
    icon: TestTube2,
    accent: "border-t-orange-500",
    iconStyle:
      "border-orange-500/30 bg-orange-500/10 text-orange-500 dark:text-orange-400",
  },
  {
    title: "Track your progress",
    description:
      "Submit solutions, review previous attempts, and follow your progress over time.",
    icon: ChartNoAxesCombined,
    accent: "border-t-purple-500",
    iconStyle:
      "border-purple-500/30 bg-purple-500/10 text-purple-500 dark:text-purple-400",
  },
];

const stats = [
  {
    value: "150+",
    label: "Coding problems",
  },
  {
    value: "4",
    label: "Supported languages",
  },
  {
    value: "Instant",
    label: "Test feedback",
  },
];



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
            <AnimatedGradientText className="text-2xl font-bold">
              Codey
            </AnimatedGradientText>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl sm:leading-tight">
              Improve your coding through problem solving
            </h1>

            <p className="mt-6 leading-8 text-gray-700 dark:text-gray-200 sm:text-lg">
              Codey is a problem-solving platform where you can practise coding
              challenges, run and submit solutions, and improve your algorithmic
              thinking.
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
              <p className="text-3xl font-semibold">{value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-4 py-16 sm:py-20 md:grid-cols-3">
          {features.map(
            ({ title, description, icon: Icon, accent, iconStyle }) => (
              <article
                key={title}
                className={`rounded-xl border border-t-2 bg-white/2 p-6 transition duration-200 hover:-translate-y-1 hover:bg-black/2 dark:hover:bg-white/4 ${accent}`}
              >
                <div
                  className={`flex size-11 items-center justify-center rounded-lg border ${iconStyle}`}
                >
                  <Icon className="size-5" />
                </div>

                <h2 className="mt-5 text-lg font-semibold">{title}</h2>

                <p className="mt-2 leading-7 text-gray-700 dark:text-gray-200">
                  {description}
                </p>
              </article>
            ),
          )}
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
