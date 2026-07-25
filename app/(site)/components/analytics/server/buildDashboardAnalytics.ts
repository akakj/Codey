// Combines the smaller calculation modules

import type {
  DashboardAnalytics,
} from "../types";

import {
  calculateActivityMetrics,
} from "./activityMetrics";

import {
  calculateFrequencyMetrics,
} from "./frequencyMetrics";

import {
  buildProblemContext,
} from "./problemContext";

import {
  calculateProblemMetrics,
} from "./problemMetrics";

import {
  calculateSubmissionMetrics,
} from "./submissionMetrics";

import type {
  AnalyticsSourceData,
} from "./types";

export function buildDashboardAnalytics(
  data: AnalyticsSourceData,
  now = new Date(),
): DashboardAnalytics {
  const context =
    buildProblemContext(data);

  const problemMetrics =
    calculateProblemMetrics(context);

  const submissionMetrics =
    calculateSubmissionMetrics(
      data.submissions,
      context,
    );

  const activityMetrics =
    calculateActivityMetrics(
      data.submissions,
      now,
    );

  const frequencyMetrics =
    calculateFrequencyMetrics(
      data.submissions,
      context.difficultyByProblem,
      now,
    );

  return {
    ...problemMetrics,
    ...submissionMetrics,
    ...activityMetrics,
    ...frequencyMetrics,
  };
}