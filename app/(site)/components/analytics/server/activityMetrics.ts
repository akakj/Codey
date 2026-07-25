// Handles streaks, active days and recent performance

import type {
  DashboardAnalytics,
} from "../types";

import type {
  SubmissionRow,
} from "./types";

import {
  addUtcDays,
  getUtcDayNumber,
  percentage,
  roundToOneDecimal,
  startOfUtcDay,
} from "./utils";

type ActivityMetrics = Pick<
  DashboardAnalytics,
  | "currentActivityStreak"
  | "activeDaysLast30"
  | "recentSuccessTrend"
>;

function calculateCurrentStreak(
  submissions: SubmissionRow[],
  now: Date,
): number {
  const activeDays = new Set<number>();

  for (const submission of submissions) {
    const date = new Date(
      submission.createdAt,
    );

    if (Number.isFinite(date.getTime())) {
      activeDays.add(
        getUtcDayNumber(date),
      );
    }
  }

  const today = getUtcDayNumber(now);

  // A streak remains active until the end of
  // the day following the last active day.
  let cursor = activeDays.has(today)
    ? today
    : today - 1;

  if (!activeDays.has(cursor)) {
    return 0;
  }

  let streak = 0;

  while (activeDays.has(cursor)) {
    streak += 1;
    cursor -= 1;
  }

  return streak;
}

export function calculateActivityMetrics(
  submissions: SubmissionRow[],
  now: Date,
): ActivityMetrics {
  const currentPeriodStart =
    addUtcDays(
      startOfUtcDay(now),
      -29,
    ).getTime();

  const previousPeriodStart =
    addUtcDays(
      startOfUtcDay(now),
      -59,
    ).getTime();

  const currentPeriod: SubmissionRow[] = [];
  const previousPeriod: SubmissionRow[] = [];

  const activeDaysLast30 =
    new Set<number>();

  for (const submission of submissions) {
    const submittedAt = new Date(
      submission.createdAt,
    );

    const submittedAtTime =
      submittedAt.getTime();

    if (
      !Number.isFinite(submittedAtTime)
    ) {
      continue;
    }

    if (
      submittedAtTime >=
        currentPeriodStart &&
      submittedAtTime <= now.getTime()
    ) {
      currentPeriod.push(submission);

      activeDaysLast30.add(
        getUtcDayNumber(submittedAt),
      );

      continue;
    }

    if (
      submittedAtTime >=
        previousPeriodStart &&
      submittedAtTime <
        currentPeriodStart
    ) {
      previousPeriod.push(submission);
    }
  }

  const currentPassed =
    currentPeriod.filter(
      (submission) => submission.passed,
    ).length;

  const previousPassed =
    previousPeriod.filter(
      (submission) => submission.passed,
    ).length;

  const currentRate = percentage(
    currentPassed,
    currentPeriod.length,
  );

  const previousRate = percentage(
    previousPassed,
    previousPeriod.length,
  );

  const change =
    currentRate === null ||
    previousRate === null
      ? null
      : roundToOneDecimal(
          currentRate - previousRate,
        );

  return {
    currentActivityStreak:
      calculateCurrentStreak(
        submissions,
        now,
      ),

    activeDaysLast30:
      activeDaysLast30.size,

    recentSuccessTrend: {
      currentRate,
      previousRate,
      change,
    },
  };
}