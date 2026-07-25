import MetricCard from "./MetricCard";

import {
  formatNumber,
  formatPercentage,
} from "./formatters";

import type { DashboardAnalytics } from "./types";

interface SubmissionPerformanceProps {
  analytics: DashboardAnalytics;
}

export default function SubmissionPerformance({
  analytics,
}: SubmissionPerformanceProps) {
  return (
    <section>
      <h2 className="text-2xl font-semibold">
        Submission performance
      </h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          label="Average attempts per solved problem"
          value={formatNumber(
            analytics.averageAttemptsPerSolvedProblem,
          )}
          description="Average attempts needed to reach the first accepted submission"
        />

        <MetricCard
          label="First-attempt success rate"
          value={formatPercentage(
            analytics.firstAttemptSuccessRate,
          )}
          description="Attempted problems passed on their first submission"
        />

        <MetricCard
          label="Test-case pass rate"
          value={formatPercentage(
            analytics.testCasePassRate,
          )}
          description="Passed test cases across all saved submissions"
        />

        <MetricCard
          label="Nearly successful submissions"
          value={analytics.nearlySuccessfulSubmissions}
          description="Failed submissions that passed at least 80% of their test cases"
        />

        <MetricCard
          label="Active days"
          value={analytics.activeDaysLast30}
          description="Days with at least one submission during the last 30 days"
        />
      </div>
    </section>
  );
}