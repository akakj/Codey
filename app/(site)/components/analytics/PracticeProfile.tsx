import MetricCard from "./MetricCard";

import { formatLanguage } from "./formatters";
import type { DashboardAnalytics } from "./types";

interface PracticeProfileProps {
  analytics: DashboardAnalytics;
}

export default function PracticeProfile({
  analytics,
}: PracticeProfileProps) {
  return (
    <section>
      <h2 className="text-2xl font-semibold">
        Practice profile
      </h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <MetricCard
          label="Most-practised difficulty"
          value={
            analytics.mostPractisedDifficulty ?? "-"
          }
          description="Difficulty with the highest number of submission attempts"
        />

        <MetricCard
          label="Most-used language"
          value={
            analytics.mostUsedLanguage
              ? formatLanguage(
                  analytics.mostUsedLanguage,
                )
              : "-"
          }
          description="Programming language used for the most submissions"
        />
      </div>
    </section>
  );
}