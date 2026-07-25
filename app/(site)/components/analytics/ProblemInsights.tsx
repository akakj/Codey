import Link from "next/link";

import { formatSolvedDate } from "./formatters";
import type { DashboardAnalytics } from "./types";

interface ProblemInsightsProps {
  analytics: DashboardAnalytics;
}

export default function ProblemInsights({
  analytics,
}: ProblemInsightsProps) {
  return (
    <section className="grid gap-6 md:grid-cols-2">
      <article className="rounded-xl border bg-card p-5 shadow-sm">
        <p className="text-sm font-medium text-muted-foreground">
          Most attempted unsolved problem
        </p>

        {analytics.mostAttemptedUnsolved ? (
          <>
            <Link
              href={`/problems/${analytics.mostAttemptedUnsolved.slug}`}
              className="mt-2 block text-xl font-semibold hover:cursor-pointer"
            >
              {analytics.mostAttemptedUnsolved.title}
            </Link>

            <p className="mt-2 text-sm text-muted-foreground">
              {analytics.mostAttemptedUnsolved.attempts}{" "}
              {analytics.mostAttemptedUnsolved
                .attempts === 1
                ? "attempt"
                : "attempts"}
            </p>
          </>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            There are no attempted unsolved problems.
          </p>
        )}
      </article>

      <article className="rounded-xl border bg-card p-5 shadow-sm">
        <p className="text-sm font-medium text-muted-foreground">
          Recently solved problem
        </p>

        {analytics.recentlySolved ? (
          <>
            <Link
              href={`/problems/${analytics.recentlySolved.slug}`}
              className="mt-2 block text-xl font-semibold hover:cursor-pointer"
            >
              {analytics.recentlySolved.title}
            </Link>

            <p className="mt-2 text-sm text-muted-foreground">
              First solved on{" "}
              {formatSolvedDate(
                analytics.recentlySolved.solvedAt,
              )}
            </p>
          </>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            No problems have been solved yet.
          </p>
        )}
      </article>
    </section>
  );
}