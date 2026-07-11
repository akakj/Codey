export type CaseOutput = {
  output?: string | null;
  outputText?: string | null;
  outputJson?: string | null;
};

export function stringifyOutputValue(value: unknown): string {
  if (value === undefined || value === null) {
    return "";
  }

  if (typeof value !== "string") {
    try {
      const json = JSON.stringify(value);
      return json === undefined ? String(value) : json;
    } catch {
      return String(value);
    }
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  // Convert a JSON string containing an array/object into compact JSON.
  try {
    return JSON.stringify(JSON.parse(trimmed));
  } catch {
    // Normal strings, errors and other non-JSON output stay unchanged.
    return value;
  }
}

export function getCaseOutput(run: CaseOutput): string {
  if (run.outputJson?.trim()) {
    return stringifyOutputValue(run.outputJson);
  }

  if (run.outputText !== undefined && run.outputText !== null) {
    return stringifyOutputValue(run.outputText);
  }

  if (run.output !== undefined && run.output !== null) {
    return stringifyOutputValue(run.output);
  }

  return "";
}

export function formatInputValue(value: unknown): string {
  if (value === undefined) {
    return "undefined";
  }

  try {
    const json = JSON.stringify(value);
    return json === undefined ? String(value) : json;
  } catch {
    return String(value);
  }
}

export function formatInputFields(input: unknown): Array<{
  name: string;
  value: string;
}> {
  if (input && typeof input === "object" && !Array.isArray(input)) {
    return Object.entries(input as Record<string, unknown>).map(
      ([name, value]) => ({
        name,
        value: formatInputValue(value),
      }),
    );
  }

  return [
    {
      name: "input",
      value: formatInputValue(input),
    },
  ];
}