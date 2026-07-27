import BreakdownCharts from "./analytics/BreakdownCharts";
import Overview from "./analytics/Overview";
import PracticeProfile from "./analytics/PracticeProfile";
import ProblemInsights from "./analytics/ProblemInsights";
import ProgressCharts from "./analytics/ProgressCharts";
import SubmissionPerformance from "./analytics/SubmissionPerformance";

import type { DashboardAnalytics } from "./analytics/types";

interface AnalyticsChartsProps {
  analytics: DashboardAnalytics;
}

export default function AnalyticsCharts({
  analytics,
}: AnalyticsChartsProps) {
  return (
    <div className="mt-5 min-w-0 w-full max-w-full space-y-8 overflow-hidden">

      <PracticeProfile analytics={analytics} />

      <ProgressCharts analytics={analytics} />

      <BreakdownCharts analytics={analytics} />

      <ProblemInsights analytics={analytics} />

      <SubmissionPerformance analytics={analytics} />

      <Overview analytics={analytics} />

    </div>
  );
}