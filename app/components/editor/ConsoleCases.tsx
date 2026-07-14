"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, RotateCcw, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type {
  EditableTestCase,
  JsonValue,
} from "@/lib/problem";

type CaseFields = Record<string, string>;
type JsonObject = Record<string, JsonValue>;

const CASES_NS = (slug: string) => `Codey:cases:${slug}`;

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function isJsonValue(value: unknown): value is JsonValue {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every(isJsonValue);
  }

  if (isRecord(value)) {
    return Object.values(value).every(isJsonValue);
  }

  return false;
}

function isJsonObject(
  value: JsonValue,
): value is JsonObject {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function isCaseFields(
  value: unknown,
): value is CaseFields {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every(
    (fieldValue) => typeof fieldValue === "string",
  );
}

function stringifyValue(value: unknown): string {
  try {
    const json = JSON.stringify(value);

    return json === undefined ? String(value) : json;
  } catch {
    return String(value);
  }
}

// Convert a test-case input into editable text fields.
function toFields(input: JsonValue): CaseFields {
  if (isJsonObject(input)) {
    const fields: CaseFields = {};

    for (const [key, value] of Object.entries(input)) {
      fields[key] = stringifyValue(value);
    }

    return fields;
  }

  return {
    input: stringifyValue(input),
  };
}

function loadFromStorage(
  slug: string,
): CaseFields[] | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(CASES_NS(slug));

  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (
      Array.isArray(parsed) &&
      parsed.every(isCaseFields)
    ) {
      return parsed;
    }

    return null;
  } catch {
    return null;
  }
}

function deepEqual(
  first: unknown,
  second: unknown,
): boolean {
  try {
    return JSON.stringify(first) === JSON.stringify(second);
  } catch {
    return false;
  }
}

function tryParseJson(text: string): JsonValue {
  const trimmed = text.trim();

  if (trimmed === "") {
    return "";
  }

  try {
    const parsed: unknown = JSON.parse(trimmed);

    return isJsonValue(parsed) ? parsed : text;
  } catch {
    // Preserve normal text when it is not valid JSON.
    return text;
  }
}

function fieldsToJsonCase(
  fields: CaseFields,
): EditableTestCase {
  const keys = Object.keys(fields);

  // A test case with one unnamed input.
  if (keys.length === 1 && keys[0] === "input") {
    return {
      input: tryParseJson(fields.input ?? ""),
    };
  }

  // A test case with multiple named inputs.
  const input: Record<string, JsonValue> = {};

  for (const key of keys) {
    input[key] = tryParseJson(fields[key] ?? "");
  }

  return { input };
}

function allFieldsToJsonCases(
  allFields: CaseFields[],
): EditableTestCase[] {
  return allFields.map(fieldsToJsonCase);
}

type ConsoleCasesProps = {
  problemSlug: string;
  initialCases?: EditableTestCase[];
  maxCases?: number;
  onCasesChange?: (
    cases: EditableTestCase[],
  ) => void;
};

export default function ConsoleCases({
  problemSlug,
  initialCases,
  maxCases = 4,
  onCasesChange,
}: ConsoleCasesProps) {
  const defaultCases = React.useMemo<CaseFields[]>(
    () => {
      if (initialCases?.length) {
        return initialCases.map((testCase) =>
          toFields(testCase.input),
        );
      }

      return [{ input: "" }];
    },
    [initialCases],
  );

  const [cases, setCases] =
    React.useState<CaseFields[]>(defaultCases);

  const [active, setActive] =
    React.useState(0);

  const [hydrated, setHydrated] =
    React.useState(false);

  // Load stored test cases whenever the problem changes.
  React.useEffect(() => {
    setHydrated(true);

    const storedCases =
      loadFromStorage(problemSlug);

    const nextCases =
      storedCases ?? defaultCases;

    setCases(nextCases);
    setActive(0);

    onCasesChange?.(
      allFieldsToJsonCases(nextCases),
    );
  }, [
    problemSlug,
    defaultCases,
    onCasesChange,
  ]);

  // Persist test cases after client hydration.
  React.useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      localStorage.setItem(
        CASES_NS(problemSlug),
        JSON.stringify(cases),
      );
    } catch {
      // The editor can continue working without localStorage.
    }

    onCasesChange?.(
      allFieldsToJsonCases(cases),
    );
  }, [
    cases,
    problemSlug,
    hydrated,
    onCasesChange,
  ]);

  const reachedLimit =
    hydrated && cases.length >= maxCases;

  const addCase = () => {
    if (cases.length >= maxCases) {
      return;
    }

    const source =
      cases[active] ??
      defaultCases[0] ??
      { input: "" };

    const clone: CaseFields = {
      ...source,
    };

    setCases((previousCases) => [
      ...previousCases,
      clone,
    ]);

    setActive(cases.length);
  };

  const removeAt = (index: number) => {
    setCases((previousCases) => {
      if (previousCases.length <= 1) {
        return previousCases;
      }

      const nextCases =
        previousCases.slice();

      nextCases.splice(index, 1);

      return nextCases;
    });

    setActive((currentActive) => {
      const nextLength =
        cases.length - 1;

      if (nextLength <= 0) {
        return 0;
      }

      if (index < currentActive) {
        return currentActive - 1;
      }

      if (currentActive >= nextLength) {
        return nextLength - 1;
      }

      return currentActive;
    });
  };

  const updateField = (
    name: string,
    value: string,
  ) => {
    setCases((previousCases) => {
      const nextCases =
        previousCases.slice();

      const current =
        nextCases[active] ?? {};

      nextCases[active] = {
        ...current,
        [name]: value,
      };

      return nextCases;
    });
  };

  const atDefault = deepEqual(
    cases,
    defaultCases,
  );

  const resetDisabled =
    !hydrated || atDefault;

  const resetCases = () => {
    setCases(defaultCases);
    setActive(0);

    try {
      localStorage.removeItem(
        CASES_NS(problemSlug),
      );
    } catch {
      // The component can still reset without localStorage.
    }
  };

  const fieldNames = Object.keys(
    cases[active] ?? { input: "" },
  );

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center">
        <Tabs
          value={`case-${active}`}
          onValueChange={(value) => {
            const nextActive = Number.parseInt(
              value.split("-")[1] ?? "0",
              10,
            );

            setActive(nextActive);
          }}
        >
          <TabsList className="h-9">
            {cases.map((_, index) => (
              <TabsTrigger
                key={index}
                value={`case-${index}`}
                className="group relative px-3 pr-4 hover:cursor-pointer"
              >
                {`Case ${index + 1}`}

                {cases.length > 1 && (
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={`Remove Case ${index + 1}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      event.preventDefault();
                      removeAt(index);
                    }}
                    className="
                      absolute -right-1 -top-2
                      flex h-4 w-4 items-center justify-center
                      rounded-full border border-border
                      bg-muted/70 opacity-0
                      hover:bg-muted/90
                      group-hover:opacity-100
                      data-[state=active]:opacity-100
                    "
                  >
                    <X className="h-3 w-3" />
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {!reachedLimit && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 hover:cursor-pointer"
                  onClick={addCase}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>

              <TooltipContent side="bottom">
                Clone current test case
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <div className="ml-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:cursor-pointer"
                  disabled={resetDisabled}
                  aria-label="Reset test cases to defaults"
                  onClick={resetCases}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>

              <TooltipContent side="left">
                Reset test cases to defaults
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="space-y-2">
        {fieldNames.map((name) => (
          <div
            key={name}
            className="space-y-1"
          >
            <div className="text-sm text-muted-foreground">
              {name} =
            </div>

            <Textarea
              rows={1}
              className="min-h-0! h-10 resize-none bg-muted/30 font-mono"
              value={
                cases[active]?.[name] ?? ""
              }
              onChange={(event) =>
                updateField(
                  name,
                  event.target.value,
                )
              }
              spellCheck={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}