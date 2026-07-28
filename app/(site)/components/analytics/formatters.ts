export function formatPercentage(
  value: number | null,
): string {
  if (value === null) {
    return "-";
  }

  return `${value.toLocaleString("en-GB", {
    maximumFractionDigits: 1,
  })}%`;
}

export function formatNumber(
  value: number | null,
): string {
  if (value === null) {
    return "-";
  }

  return value.toLocaleString("en-GB", {
    maximumFractionDigits: 1,
  });
}

export function formatLanguage(
  language: string,
): string {
  switch (language.toLowerCase()) {
    case "python":
    case "python3":
      return "Python";

    case "javascript":
    case "nodejs":
      return "JavaScript";

    case "java":
      return "Java";

    case "c#":
    case "csharp":
      return "C#";

    default:
      return language;
  }
}

export function formatSolvedDate(
  value: string,
): string {
  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatMinutes(
  value: number | null,
): string {
  if (
    value === null ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    return "-";
  }

  if (value > 0 && value < 1) {
    return "<1 min";
  }

  return `${value.toLocaleString("en-GB", {
    maximumFractionDigits: 1,
  })} min`;
}