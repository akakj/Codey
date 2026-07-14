"use client";

import { executeCode } from "./api";
import type { CaseRun } from "./ConsoleOutput";
import type { Lang, StarterMap } from "@/lib/languages";
import type {
  EditableTestCase,
  EntryPointByLang,
  JsonValue,
} from "@/lib/problem";
import { getCaseOutput, stringifyOutputValue } from "@/lib/outputFormatting";

const RESULT_PREFIX = "@@RESULT@@";

type RunCodeArgs = {
  sourceCode: string;
  language: Lang;
  liveCases: EditableTestCase[];
  initialCases?: EditableTestCase[];
  entryPointByLang?: EntryPointByLang;
  starterCodeByLang?: StarterMap;
};

type SubmitCodeArgs = {
  sourceCode: string;
  language: Lang;
  problemSlug: string;
};

type RunCodeResult = {
  caseRuns: CaseRun[];
  isError: boolean;
  memory?: string;
  cpuTime?: string;
  statusCode?: number;
  compilationStatus?: string | number;
};

export type SubmitCodeResult = RunCodeResult & {
  submissionId?: number;
  accepted: boolean;
  status: "accepted" | "failed";
  passedCases: number;
  totalCases: number;
  failedCase?: SubmitFailedCase;
};

export type SubmitFailedCase = {
  caseNum: number;
  input: JsonValue;
  output?: string;
  expectedOutput?: string;
  error?: string;
  logs?: string;
};

type ComparableOutput =
  | {
      parsed: true;
      value: JsonValue;
    }
  | {
      parsed: false;
      value: string;
    };

type RunnerMessage = {
  case?: number;
  ok?: boolean;
  output?: string;
  outputText?: string;
  outputJson?: string;
  error?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
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

function isOptionalString(value: unknown): boolean {
  return value === undefined || typeof value === "string";
}

function isOptionalNumber(value: unknown): boolean {
  return value === undefined || typeof value === "number";
}

function isOptionalBoolean(value: unknown): boolean {
  return value === undefined || typeof value === "boolean";
}

function isRunnerMessage(value: unknown): value is RunnerMessage {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isOptionalNumber(value.case) &&
    isOptionalBoolean(value.ok) &&
    isOptionalString(value.output) &&
    isOptionalString(value.outputText) &&
    isOptionalString(value.outputJson) &&
    isOptionalString(value.error)
  );
}

function isCaseRun(value: unknown): value is CaseRun {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.caseNum === "number" &&
    typeof value.ok === "boolean" &&
    isOptionalString(value.output) &&
    isOptionalString(value.outputText) &&
    isOptionalString(value.outputJson) &&
    isOptionalString(value.error) &&
    isOptionalString(value.logs) &&
    isOptionalString(value.expectedOutput) &&
    isOptionalBoolean(value.passed) &&
    isOptionalBoolean(value.isDefaultCase)
  );
}

function isSubmitFailedCase(value: unknown): value is SubmitFailedCase {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.caseNum === "number" &&
    isJsonValue(value.input) &&
    isOptionalString(value.output) &&
    isOptionalString(value.expectedOutput) &&
    isOptionalString(value.error) &&
    isOptionalString(value.logs)
  );
}

function isSubmitCodeResult(value: unknown): value is SubmitCodeResult {
  if (!isRecord(value)) {
    return false;
  }

  const hasValidStatus =
    value.status === "accepted" || value.status === "failed";

  const hasValidFailedCase =
    value.failedCase === undefined || isSubmitFailedCase(value.failedCase);

  const hasValidCompilationStatus =
    value.compilationStatus === undefined ||
    typeof value.compilationStatus === "string" ||
    typeof value.compilationStatus === "number";

  return (
    Array.isArray(value.caseRuns) &&
    value.caseRuns.every(isCaseRun) &&
    typeof value.isError === "boolean" &&
    typeof value.accepted === "boolean" &&
    hasValidStatus &&
    typeof value.passedCases === "number" &&
    typeof value.totalCases === "number" &&
    isOptionalNumber(value.submissionId) &&
    isOptionalString(value.memory) &&
    isOptionalString(value.cpuTime) &&
    isOptionalNumber(value.statusCode) &&
    hasValidCompilationStatus &&
    hasValidFailedCase
  );
}

function getResponseError(value: unknown): string | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  return typeof value.error === "string" ? value.error : undefined;
}

function hasExpectedOutput(
  testCase: EditableTestCase | undefined,
): testCase is EditableTestCase & { expectedOutput: JsonValue } {
  return testCase !== undefined && testCase.expectedOutput !== undefined;
}

function deepEqual(
  first: JsonValue | undefined,
  second: JsonValue | undefined,
): boolean {
  try {
    return JSON.stringify(first) === JSON.stringify(second);
  } catch {
    return false;
  }
}

function formatExpectedOutput(value: JsonValue, language: Lang): string {
  if (language === "python3" && typeof value === "boolean") {
    return value ? "True" : "False";
  }

  return stringifyOutputValue(value);
}

function outputForComparison(run: CaseRun): string {
  return getCaseOutput(run);
}

function normalizePythonLiterals(value: string): string {
  const trimmed = value.trim();

  if (trimmed === "True") return "true";
  if (trimmed === "False") return "false";
  if (trimmed === "None") return "null";

  return trimmed;
}

function parseComparableOutput(value: string): ComparableOutput {
  const normalized = normalizePythonLiterals(value);

  try {
    const parsed: unknown = JSON.parse(normalized);

    if (isJsonValue(parsed)) {
      return {
        parsed: true,
        value: parsed,
      };
    }
  } catch {
    // Fall through and compare the original output as plain text.
  }

  return {
    parsed: false,
    value: value.replace(/\r\n/g, "\n").trim(),
  };
}

function outputsEqual(actualOutput: string, expectedOutput: string): boolean {
  const actual = parseComparableOutput(actualOutput);
  const expected = parseComparableOutput(expectedOutput);

  if (actual.parsed && expected.parsed) {
    return deepEqual(actual.value, expected.value);
  }

  return String(actual.value).trim() === String(expected.value).trim();
}

function attachExpectedOutputs(
  runs: CaseRun[],
  currentCases: EditableTestCase[],
  sourceCases: EditableTestCase[] | undefined,
  language: Lang,
): CaseRun[] {
  if (!sourceCases?.length) {
    return runs.map((run) => ({
      ...run,
      expectedOutput: undefined,
      passed: undefined,
      isDefaultCase: false,
    }));
  }

  return runs.map((run, runIndex) => {
    const caseIndex =
      run.caseNum > 0 && currentCases[run.caseNum - 1]
        ? run.caseNum - 1
        : runIndex;

    const currentInput = currentCases[caseIndex]?.input;
    const sourceCaseAtSameIndex = sourceCases[caseIndex];

    const isDefaultCase =
      sourceCaseAtSameIndex !== undefined &&
      hasExpectedOutput(sourceCaseAtSameIndex) &&
      deepEqual(sourceCaseAtSameIndex.input, currentInput);

    const matchingSourceCase = sourceCases.find(
      (
        testCase,
      ): testCase is EditableTestCase & { expectedOutput: JsonValue } =>
        hasExpectedOutput(testCase) &&
        deepEqual(testCase.input, currentInput),
    );

    if (!matchingSourceCase) {
      return {
        ...run,
        expectedOutput: undefined,
        passed: undefined,
        isDefaultCase: false,
      };
    }

    const expectedOutput = formatExpectedOutput(
      matchingSourceCase.expectedOutput,
      language,
    );

    const actualOutput = outputForComparison(run);

    return {
      ...run,
      expectedOutput,
      isDefaultCase,
      passed: isDefaultCase
        ? run.ok && outputsEqual(actualOutput, expectedOutput)
        : undefined,
    };
  });
}

function parseStdoutByCase(stdout: string): CaseRun[] {
  const runs: CaseRun[] = [];
  let pendingLogs: string[] = [];

  for (const line of stdout.split("\n")) {
    if (!line.startsWith(RESULT_PREFIX)) {
      if (line.length) {
        pendingLogs.push(line);
      }

      continue;
    }

    const jsonPart = line.slice(RESULT_PREFIX.length);

    try {
      const parsed: unknown = JSON.parse(jsonPart);

      if (!isRunnerMessage(parsed)) {
        pendingLogs.push(line);
        continue;
      }

      runs.push({
        caseNum:
          typeof parsed.case === "number"
            ? parsed.case
            : runs.length + 1,
        ok: parsed.ok === true,
        output: parsed.output,
        outputText: parsed.outputText,
        outputJson: parsed.outputJson,
        error: parsed.error,
        logs: pendingLogs.join("\n").trimEnd(),
      });

      pendingLogs = [];
    } catch {
      pendingLogs.push(line);
    }
  }

  if (pendingLogs.length && runs.length) {
    const last = runs[runs.length - 1];

    last.logs = (
      `${(last.logs ?? "").trimEnd()}\n${pendingLogs.join("\n")}`
    ).trim();
  }

  runs.sort((first, second) => first.caseNum - second.caseNum);

  return runs;
}

export async function runCode({
  sourceCode,
  language,
  liveCases,
  initialCases,
  entryPointByLang,
  starterCodeByLang,
}: RunCodeArgs): Promise<RunCodeResult> {
  if (!sourceCode) {
    return {
      caseRuns: [],
      isError: false,
    };
  }

  try {
    const data = await executeCode(
      language,
      sourceCode,
      liveCases,
      entryPointByLang?.[language],
      starterCodeByLang?.[language],
    );

    const stdout = typeof data.output === "string" ? data.output : "";

    const stderr =
      typeof data.error === "string" && data.error.trim()
        ? data.error
        : typeof data.compilationStatus === "string" &&
            data.compilationStatus.trim()
          ? data.compilationStatus
          : "";

    const runs = parseStdoutByCase(stdout);

    if (stderr.trim()) {
      if (runs.length) {
        for (const run of runs) {
          run.logs = (
            `${(run.logs ?? "").trimEnd()}\n--- stderr ---\n${stderr}`
          ).trim();

          run.ok = false;
          run.error ??= "Runtime/Compile error";
        }
      } else {
        const fallbackCaseCount = Math.min(
          4,
          liveCases.length || initialCases?.length || 1,
        );

        const errorRuns: CaseRun[] = Array.from(
          { length: fallbackCaseCount },
          (_, index) => ({
            caseNum: index + 1,
            ok: false,
            error: "Runtime/Compile error",
            logs: `--- stderr ---\n${stderr}`.trim(),
          }),
        );

        runs.splice(0, runs.length, ...errorRuns);
      }
    }

    const parsedRuns: CaseRun[] =
      runs.length > 0
        ? runs
        : [
            {
              caseNum: 1,
              ok: !stderr.trim(),
              output: stdout.trim(),
              logs: "",
              error: stderr.trim() ? stderr : undefined,
            },
          ];

    const currentCases =
      liveCases.length > 0 ? liveCases : (initialCases ?? []);

    const finalRuns = attachExpectedOutputs(
      parsedRuns,
      currentCases,
      initialCases,
      language,
    );

    console.table(
      finalRuns.map((run) => ({
        caseNum: run.caseNum,
        ok: run.ok,
        output: outputForComparison(run),
        expectedOutput: run.expectedOutput,
        isDefaultCase: run.isDefaultCase,
        passed: run.passed,
      })),
    );

    return {
      caseRuns: finalRuns,
      isError:
        finalRuns.some((run) => !run.ok || run.passed === false) ||
        Boolean(stderr.trim()),
      memory:
        data.memory !== undefined ? String(data.memory) : undefined,
      cpuTime:
        data.cpuTime !== undefined ? String(data.cpuTime) : undefined,
      statusCode: data.statusCode,
      compilationStatus: data.compilationStatus,
    };
  } catch (error: unknown) {
    console.error("Error executing code:", error);

    return {
      isError: true,
      caseRuns: [
        {
          caseNum: 1,
          ok: false,
          error: "An error occurred while running your code.",
          logs: error instanceof Error ? error.message : String(error),
        },
      ],
    };
  }
}

export async function submitCode({
  sourceCode,
  language,
  problemSlug,
}: SubmitCodeArgs): Promise<SubmitCodeResult> {
  if (!sourceCode) {
    return {
      caseRuns: [],
      isError: false,
      accepted: false,
      status: "failed",
      passedCases: 0,
      totalCases: 0,
    };
  }

  try {
    const response = await fetch(
      `/api/submit/${encodeURIComponent(problemSlug)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceCode,
          language,
        }),
      },
    );

    const data: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        caseRuns: [
          {
            caseNum: 1,
            ok: false,
            error:
              getResponseError(data) ??
              `Submit failed with status ${response.status}`,
            logs: "",
          },
        ],
        isError: true,
        accepted: false,
        status: "failed",
        passedCases: 0,
        totalCases: 0,
      };
    }

    if (!isSubmitCodeResult(data)) {
      throw new Error("The submit endpoint returned an invalid response.");
    }

    return data;
  } catch (error: unknown) {
    return {
      caseRuns: [
        {
          caseNum: 1,
          ok: false,
          error: "An error occurred while submitting your code.",
          logs: error instanceof Error ? error.message : String(error),
        },
      ],
      isError: true,
      accepted: false,
      status: "failed",
      passedCases: 0,
      totalCases: 0,
    };
  }
}