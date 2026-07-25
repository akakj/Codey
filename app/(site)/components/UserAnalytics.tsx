import AnalyticsCharts from "./AnalyticsCharts";

import {
  buildDashboardAnalytics,
} from "./analytics/server/buildDashboardAnalytics";

import {
  fetchAnalyticsData,
} from "./analytics/server/fetchAnalyticsData";

interface UserAnalyticsProps {
  userId: string;
}

export default async function UserAnalytics({
  userId,
}: UserAnalyticsProps) {
  try {
    const sourceData =
      await fetchAnalyticsData(userId);

    const analytics =
      buildDashboardAnalytics(sourceData);

    return (
      <AnalyticsCharts
        analytics={analytics}
      />
    );
  } catch (error: unknown) {
    console.error(
      "Unable to retrieve user analytics",
      error,
    );

    return (
      <section className="mt-8 rounded-xl border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Your analytics could not be loaded.
        </p>
      </section>
    );
  }
}