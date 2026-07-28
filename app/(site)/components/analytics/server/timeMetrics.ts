import type { TimeAnalytics } from "../types";
import type { SubmissionRow } from "./types";

const SECONDS_PER_MINUTE = 60;

function isValidDuration(
  value: number | null,
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0
  );
}

function calculateAverage(
  values: number[],
): number | null {
  if (values.length === 0) {
    return null;
  }

  const total = values.reduce(
    (sum, value) => sum + value,
    0,
  );

  return total / values.length;
}

function calculateMedian(
  values: number[],
): number | null {
  if (values.length === 0) {
    return null;
  }

  const sortedValues = [...values].sort(
    (first, second) => first - second,
  );

  const middleIndex = Math.floor(
    sortedValues.length / 2,
  );

  if (sortedValues.length % 2 === 1) {
    return sortedValues[middleIndex];
  }

  return (
    sortedValues[middleIndex - 1] +
    sortedValues[middleIndex]
  ) / 2;
}

function convertSecondsToMinutes(
  seconds: number,
): number {
  return seconds / SECONDS_PER_MINUTE;
}

function sortSubmissions(
  submissions: SubmissionRow[],
): SubmissionRow[] {
  return [...submissions].sort(
    (first, second) => {
      const firstTimestamp = Date.parse(
        first.createdAt,
      );

      const secondTimestamp = Date.parse(
        second.createdAt,
      );

      if (
        Number.isFinite(firstTimestamp) &&
        Number.isFinite(secondTimestamp) &&
        firstTimestamp !== secondTimestamp
      ) {
        return firstTimestamp - secondTimestamp;
      }

      return first.id - second.id;
    },
  );
}

function calculateAverageTimeToFirstAccepted(
  submissions: SubmissionRow[],
): number | null {
  const stateByProblem = new Map<
    number,
    {
      accumulatedSeconds: number;
      hasMissingDuration: boolean;
      accepted: boolean;
    }
  >();

  const firstAcceptedTimes: number[] = [];

  for (const submission of sortSubmissions(submissions)) {
    const existingState = stateByProblem.get(
      submission.problemId,
    );

    const state =
      existingState ?? {
        accumulatedSeconds: 0,
        hasMissingDuration: false,
        accepted: false,
      };

    // Submissions after the first accepted result should not
    // affect time to first acceptance.
    if (state.accepted) {
      continue;
    }

    if (
      isValidDuration(
        submission.activeTimeSeconds,
      )
    ) {
      state.accumulatedSeconds +=
        submission.activeTimeSeconds;
    } else {
      /*
       * A missing interval means that the complete solving
       * time for this problem is unknown.
       */
      state.hasMissingDuration = true;
    }

    if (submission.passed) {
      state.accepted = true;

      if (!state.hasMissingDuration) {
        firstAcceptedTimes.push(
          state.accumulatedSeconds,
        );
      }
    }

    stateByProblem.set(
      submission.problemId,
      state,
    );
  }

  const averageSeconds = calculateAverage(
    firstAcceptedTimes,
  );

  return averageSeconds === null
    ? null
    : convertSecondsToMinutes(
        averageSeconds,
      );
}

export function calculateTimeMetrics(
  submissions: SubmissionRow[],
): TimeAnalytics {
  const recordedDurations = submissions
    .map(
      (submission) =>
        submission.activeTimeSeconds,
    )
    .filter(isValidDuration);

  const totalSeconds = recordedDurations.reduce(
    (total, duration) => total + duration,
    0,
  );

  const averageSeconds = calculateAverage(
    recordedDurations,
  );

  const medianSeconds = calculateMedian(
    recordedDurations,
  );

  return {
    totalActiveTime:
      convertSecondsToMinutes(totalSeconds),

    averageTimePerSubmission:
      averageSeconds === null
        ? null
        : convertSecondsToMinutes(
            averageSeconds,
          ),

    medianTimePerSubmission:
      medianSeconds === null
        ? null
        : convertSecondsToMinutes(
            medianSeconds,
          ),

    averageTimeToFirstAccepted:
      calculateAverageTimeToFirstAccepted(
        submissions,
      ),
  };
}