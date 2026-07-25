// Shared numerical and date utilities

export const MILLISECONDS_PER_DAY =
  24 * 60 * 60 * 1000;

export const MILLISECONDS_PER_WEEK =
  7 * MILLISECONDS_PER_DAY;

export function roundToOneDecimal(
  value: number,
): number {
  return Math.round(value * 10) / 10;
}

export function percentage(
  numerator: number,
  denominator: number,
): number | null {
  if (denominator <= 0) {
    return null;
  }

  return roundToOneDecimal(
    (numerator / denominator) * 100,
  );
}

export function startOfUtcDay(
  date: Date,
): Date {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
    ),
  );
}

export function addUtcDays(
  date: Date,
  days: number,
): Date {
  return new Date(
    date.getTime() +
      days * MILLISECONDS_PER_DAY,
  );
}

export function getUtcDayNumber(
  date: Date,
): number {
  return Math.floor(
    startOfUtcDay(date).getTime() /
      MILLISECONDS_PER_DAY,
  );
}

export function getLastTwelveMonthsStart(
  now: Date,
): Date {
  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth() - 11,
      1,
    ),
  );
}