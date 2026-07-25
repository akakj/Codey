import MetricCard from "./MetricCard";

import { formatPercentage } from "./formatters";
import type { DashboardAnalytics } from "./types";

interface OverviewProps {
  analytics: DashboardAnalytics;
}

function RecentSuccessTrendCard({
  trend,
}: {
  trend: DashboardAnalytics["recentSuccessTrend"];
}) {
  const changeText =
    trend.change === null
      ? "Not enough data to compare the periods."
      : `${trend.change > 0 ? "+" : ""}${trend.change.toLocaleString(
          "en-GB",
          {
            maximumFractionDigits: 1,
          },
        )} percentage points`;

  const changeClassName =
    trend.change === null || trend.change === 0
      ? "text-muted-foreground"
      : trend.change > 0
        ? "text-green-700 dark:text-green-500"
        : "text-red-700 dark:text-red-400";

  return (
    <article className="rounded-xl border bg-card p-5 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">
        Recent success trend
      </p>

      <p className="mt-2 text-3xl font-semibold tabular-nums">
        {formatPercentage(trend.currentRate)}
      </p>

      <p className="mt-2 text-sm text-muted-foreground">
        Acceptance rate during the last 30 days.
      </p>

      <div className="mt-4 border-t pt-4 text-sm">
        <p className="text-muted-foreground">
          Previous 30 days:{" "}
          <span className="font-medium text-foreground">
            {formatPercentage(trend.previousRate)}
          </span>
        </p>

        <p className={`mt-1 font-medium ${changeClassName}`}>
          {changeText}
        </p>
      </div>
    </article>
  );
}

export default function Overview({
  analytics,
}: OverviewProps) {
  return (
    <section>
      <h2 className="text-2xl font-semibold">
        Overview
      </h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          label="Problems solved"
          value={analytics.solvedProblems}
          description="Unique problems successfully completed"
        />

        <MetricCard
          label="Problems attempted"
          value={analytics.problemsAttempted}
          description="Unique problems with at least one submission"
        />

        <MetricCard
          label="Acceptance rate"
          value={formatPercentage(
            analytics.acceptanceRate,
          )}
          description="Successful submissions as a percentage of all attempts"
        />

        <MetricCard
          label="Completion rate"
          value={formatPercentage(
            analytics.completionRate,
          )}
          description="Attempted problems that were eventually solved"
        />

        <MetricCard
          label="Current activity streak"
          value={`${analytics.currentActivityStreak} ${
            analytics.currentActivityStreak === 1
              ? "day"
              : "days"
          }`}
          description="Consecutive active calendar days"
        />

        <MetricCard
          label="Problems started but not solved"
          value={analytics.problemsStartedNotSolved}
          description="Attempted problems that are still in progress"
        />

        <RecentSuccessTrendCard
          trend={analytics.recentSuccessTrend}
        />
      </div>
    </section>
  );
}