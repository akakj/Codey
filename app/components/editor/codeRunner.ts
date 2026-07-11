"use client";

import { executeCode } from "./api";
import type { CaseRun } from "./ConsoleOutput";
import type { Lang, StarterMap } from "@/lib/languages";
import type { EntryPointByLang } from "@/lib/problem";
import { getCaseOutput, stringifyOutputValue } from "@/lib/outputFormatting";

export type JsonCase = {
  input: any;
  expectedOutput?: any;
  isUser?: boolean;
};

const RESULT_PREFIX = "@@RESULT@@";

type RunCodeArgs = {
  sourceCode: string;
  language: Lang;
  liveCases: JsonCase[];
  initialCases?: JsonCase[];
  entryPointByLang?: EntryPointByLang;
  starterCodeByLang?: StarterMap;
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
  input: any;
  output?: string;
  expectedOutput?: string;
  error?: string;
  logs?: string;
};

function hasExpectedOutput(
  testCase: JsonCase | undefined,
): testCase is JsonCase & { expectedOutput: any } {
  return (
    !!testCase &&
    Object.prototype.hasOwnProperty.call(testCase, "expectedOutput")
  );
}

function deepEqual(a: any, b: any) {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

function formatExpectedOutput(value: unknown, language: Lang): string {
  const isPython = language === "python3";

  if (isPython && typeof value === "boolean") {
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

function parseComparableOutput(
  value: string,
): { parsed: true; value: any } | { parsed: false; value: string } {
  const normalized = normalizePythonLiterals(value);

  try {
    return {
      parsed: true,
      value: JSON.parse(normalized),
    };
  } catch {
    return {
      parsed: false,
      value: value.replace(/\r\n/g, "\n").trim(),
    };
  }
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
  currentCases: JsonCase[],
  sourceCases: JsonCase[] | undefined,
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
      !!sourceCaseAtSameIndex &&
      hasExpectedOutput(sourceCaseAtSameIndex) &&
      deepEqual(sourceCaseAtSameIndex.input, currentInput);

    const matchingSourceCase = sourceCases.find(
      (tc) => hasExpectedOutput(tc) && deepEqual(tc.input, currentInput),
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

  for (const rawLine of stdout.split("\n")) {
    const line = rawLine;

    if (line.startsWith(RESULT_PREFIX)) {
      const jsonPart = line.slice(RESULT_PREFIX.length);

      try {
        const obj = JSON.parse(jsonPart);

        runs.push({
          caseNum: typeof obj.case === "number" ? obj.case : runs.length + 1,
          ok: !!obj.ok,
          output: typeof obj.output === "string" ? obj.output : undefined,
          outputText:
            typeof obj.outputText === "string" ? obj.outputText : undefined,
          outputJson:
            typeof obj.outputJson === "string" ? obj.outputJson : undefined,
          error: typeof obj.error === "string" ? obj.error : undefined,
          logs: pendingLogs.join("\n").trimEnd(),
        });
      } catch {
        pendingLogs.push(line);
      }

      pendingLogs = [];
    } else if (line.length) {
      pendingLogs.push(line);
    }
  }

  if (pendingLogs.length && runs.length) {
    const last = runs[runs.length - 1];

    last.logs = (
      (last.logs ?? "").trimEnd() +
      "\n" +
      pendingLogs.join("\n")
    ).trim();
  }

  runs.sort((a, b) => a.caseNum - b.caseNum);

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
      liveCases ?? [],
      entryPointByLang?.[language],
      starterCodeByLang?.[language],
    );

    const stdout: string = typeof data?.output === "string" ? data.output : "";

    const stderr: string =
      typeof data?.error === "string" && data.error.trim()
        ? data.error
        : typeof data?.compilationStatus === "string" &&
            data.compilationStatus.trim()
          ? data.compilationStatus
          : "";

    const runs = parseStdoutByCase(stdout);

    if (stderr.trim()) {
      if (runs.length) {
        for (const run of runs) {
          run.logs = (
            (run.logs ?? "").trimEnd() +
            "\n--- stderr ---\n" +
            stderr
          ).trim();

          run.ok = false;

          if (!run.error) {
            run.error = "Runtime/Compile error";
          }
        }
      } else {
        const fallbackCaseCount = Math.min(
          4,
          (liveCases?.length ?? 0) || (initialCases?.length ?? 0) || 1,
        );

        const errRuns: CaseRun[] = Array.from(
          { length: fallbackCaseCount },
          (_, index) => ({
            caseNum: index + 1,
            ok: false,
            error: "Runtime/Compile error",
            logs: `--- stderr ---\n${stderr}`.trim(),
          }),
        );

        runs.splice(0, runs.length, ...errRuns);
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
      liveCases?.length > 0 ? liveCases : (initialCases ?? []);

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
        data?.memory !== undefined && data?.memory !== null
          ? String(data.memory)
          : undefined,
      cpuTime:
        data?.cpuTime !== undefined && data?.cpuTime !== null
          ? String(data.cpuTime)
          : undefined,
      statusCode:
        typeof data?.statusCode === "number" ? data.statusCode : undefined,
      compilationStatus:
        data?.compilationStatus !== undefined &&
        data?.compilationStatus !== null
          ? data.compilationStatus
          : undefined,
    };
  } catch (error) {
    console.error("Error executing code:", error);

    return {
      isError: true,
      caseRuns: [
        {
          caseNum: 1,
          ok: false,
          error: "An error occurred while running your code.",
          logs: "",
        },
      ],
    };
  }
}

export async function submitCode({
  sourceCode,
  language,
  problemSlug,
}: {
  sourceCode: string;
  language: Lang;
  problemSlug: string;
}): Promise<SubmitCodeResult> {
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
    const res = await fetch(`/api/submit/${encodeURIComponent(problemSlug)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sourceCode,
        language,
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        caseRuns: [
          {
            caseNum: 1,
            ok: false,
            error: data?.error ?? `Submit failed with status ${res.status}`,
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

    return data as SubmitCodeResult;
  } catch (error) {
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
