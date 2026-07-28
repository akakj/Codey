import MetricCard from "./MetricCard";

import  { formatMinutes } from "./formatters";

import type { DashboardAnalytics } from "./types";

interface TimeInsightsProps {
  analytics: DashboardAnalytics;
}

export default function TimeInsights({
  analytics,
}: TimeInsightsProps) {
  return (
    <section>
      <h2 className="text-2xl font-semibold">
        Time insights
      </h2>

      <div className="mt-4 grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total active time"
          value={formatMinutes(
            analytics.totalActiveTime,
          )}
          description="Active problem-solving time recorded across all timed submissions"
        />

        <MetricCard
          label="Average time per submission"
          value={formatMinutes(
            analytics.averageTimePerSubmission,
          )}
          description="Average active time recorded before each submission"
        />

        <MetricCard
          label="Median time per submission"
          value={formatMinutes(
            analytics.medianTimePerSubmission,
          )}
          description="Typical submission time with less influence from unusually long attempts"
        />

        <MetricCard
          label="Average time to first accepted"
          value={formatMinutes(
            analytics.averageTimeToFirstAccepted,
          )}
          description="Average accumulated active time before first solving a problem"
        />
      </div>
    </section>
  );
}