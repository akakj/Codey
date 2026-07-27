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
      await fetchAnalyticsData(userId); // retrieve raw database rows

    const analytics =
      buildDashboardAnalytics(sourceData); // calculate analytics from raw data

    return (
      <AnalyticsCharts
        analytics={analytics} // pass calculated analytics to the charts component
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