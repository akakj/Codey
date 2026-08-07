import { NextResponse } from "next/server";
import rawData from "@/app/data/neetcode_150_problems_with_entry.json";
import type { JsonValue, ProblemsFile, TestCase } from "@/lib/problem";
import type { Lang } from "@/lib/languages";
import { isLang } from "@/lib/languages";
import { createClient } from "@/utils/supabase/server";
import {
  RESULT_PREFIX,
  buildJDoodleScript,
  toJDoodleLanguage,
  type JDoodleResponse,
} from "@/app/components/editor/api";

export const runtime = "nodejs";

const MAX_CASES_PER_BATCH = 16;
const EXPECTED_OUTPUT_BUDGET = 20_000;

type CaseRun = {
  caseNum: number;
  ok: boolean;
  output?: string;
  outputText?: string;
  outputJson?: string;
  error?: string;
  logs?: string;
  expectedOutput?: string;
  passed?: boolean;
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

type SubmitRequest = {
  sourceCode: string;
  language: Lang;
  activeTimeSeconds: number;
};

type FailedCase = {
  caseNum: number;
  input: JsonValue;
  output?: string;
  expectedOutput?: string;
  error?: string;
  logs?: string;
};

type SubmissionMetrics = {
  runtime: number;
  memory: number | null;
};

type JudgeState = {
  passedCases: number;
  failedCase?: FailedCase;
  judgeError?: string;
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

function isSubmitRequest(value: unknown): value is SubmitRequest {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.sourceCode === "string" &&
    value.sourceCode.length > 0 &&
    typeof value.language === "string" &&
    isLang(value.language) &&
    typeof value.activeTimeSeconds === "number" &&
    Number.isFinite(value.activeTimeSeconds) &&
    value.activeTimeSeconds >= 0
  );
}

function parseJDoodleResponse(value: unknown): JDoodleResponse {
  if (!isRecord(value)) {
    throw new Error("JDoodle returned an invalid response.");
  }

  return {
    output: typeof value.output === "string" ? value.output : undefined,
    error: typeof value.error === "string" ? value.error : undefined,
    memory:
      typeof value.memory === "string" || typeof value.memory === "number"
        ? value.memory
        : undefined,
    cpuTime:
      typeof value.cpuTime === "string" || typeof value.cpuTime === "number"
        ? value.cpuTime
        : undefined,
    statusCode:
      typeof value.statusCode === "number" ? value.statusCode : undefined,
    compilationStatus:
      typeof value.compilationStatus === "string" ||
      typeof value.compilationStatus === "number"
        ? value.compilationStatus
        : undefined,
  };
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Code execution failed";
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
          typeof parsed.case === "number" ? parsed.case : runs.length + 1,
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

    last.logs = `${last.logs ?? ""}\n${pendingLogs.join("\n")}`.trim();
  }

  return runs.sort((first, second) => first.caseNum - second.caseNum);
}

function outputForComparison(run: CaseRun): string {
  if (run.outputJson?.trim()) {
    try {
      const parsed: unknown = JSON.parse(run.outputJson);
      return JSON.stringify(parsed);
    } catch {
      return run.outputJson;
    }
  }

  if (run.outputText !== undefined) {
    return run.outputText;
  }

  if (run.output !== undefined) {
    return run.output;
  }

  return "";
}

function normalizePythonLiterals(value: string): string {
  return value
    .trim()
    .replace(/\bTrue\b/g, "true")
    .replace(/\bFalse\b/g, "false")
    .replace(/\bNone\b/g, "null");
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
    // Compare non-JSON output as plain text.
  }

  return {
    parsed: false,
    value: value.replace(/\r\n/g, "\n").trim(),
  };
}

function deepEqual(first: JsonValue, second: JsonValue): boolean {
  try {
    return JSON.stringify(first) === JSON.stringify(second);
  } catch {
    return false;
  }
}

function stringifyExpected(value: JsonValue): string {
  try {
    const json = JSON.stringify(value);
    return json === undefined ? String(value) : json;
  } catch {
    return String(value);
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
  testCases: TestCase[],
): CaseRun[] {
  return runs.map((run, index) => {
    const caseIndex = run.caseNum > 0 ? run.caseNum - 1 : index;
    const testCase = testCases[caseIndex];

    if (!testCase) {
      return {
        ...run,
        passed: false,
      };
    }

    const expectedOutput = stringifyExpected(testCase.expectedOutput);
    const actualOutput = outputForComparison(run);

    return {
      ...run,
      expectedOutput,
      passed: run.ok && outputsEqual(actualOutput, expectedOutput),
    };
  });
}

function toNullableInt(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  const numeric = Number(String(value).replace(/[^\d.-]/g, ""));

  if (!Number.isFinite(numeric)) {
    return null;
  }

  return Math.round(numeric);
}

function isOutputLimitError(value: string): boolean {
  return /(?:output.{0,30}(?:limit|length|size|large|exceed|max)|(?:limit|max).{0,30}output)/i.test(
    value,
  );
}

function estimateOutputSize(testCase: TestCase): number {
  return stringifyExpected(testCase.expectedOutput).length + 250;
}

function createSubmissionBatches(testCases: TestCase[]): TestCase[][] {
  const batches: TestCase[][] = [];
  let currentBatch: TestCase[] = [];
  let currentEstimatedSize = 0;

  for (const testCase of testCases) {
    const estimatedSize = estimateOutputSize(testCase);
    const exceedsCaseLimit = currentBatch.length >= MAX_CASES_PER_BATCH;
    const exceedsOutputBudget =
      currentBatch.length > 0 &&
      currentEstimatedSize + estimatedSize > EXPECTED_OUTPUT_BUDGET;

    if (exceedsCaseLimit || exceedsOutputBudget) {
      batches.push(currentBatch);
      currentBatch = [];
      currentEstimatedSize = 0;
    }

    currentBatch.push(testCase);
    currentEstimatedSize += estimatedSize;
  }

  if (currentBatch.length) {
    batches.push(currentBatch);
  }

  return batches;
}

function updateMetrics(
  metrics: SubmissionMetrics,
  result: JDoodleResponse,
): void {
  const runtime = toNullableInt(result.cpuTime);
  const memory = toNullableInt(result.memory);

  if (runtime !== null) {
    metrics.runtime += runtime;
  }

  if (memory !== null) {
    metrics.memory =
      metrics.memory === null ? memory : Math.max(metrics.memory, memory);
  }
}

async function executeOnJDoodle(args: {
  script: string;
  language: Lang;
}): Promise<JDoodleResponse> {
  const response = await fetch("https://api.jdoodle.com/v1/execute", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      clientId: process.env.JDOODLE_CLIENT_ID,
      clientSecret: process.env.JDOODLE_CLIENT_SECRET,
      script: args.script,
      stdin: "",
      language: toJDoodleLanguage(args.language),
      versionIndex: "0",
    }),
  });

  const text = await response.text();

  let parsed: unknown;

  try {
    parsed = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      `JDoodle returned non-JSON response: ${text.slice(0, 300)}`,
    );
  }

  const data = parseJDoodleResponse(parsed);

  if (!response.ok) {
    throw new Error(
      data.error ?? `JDoodle request failed with ${response.status}`,
    );
  }

  return data;
}

async function judgeBatch(args: {
  sourceCode: string;
  language: Lang;
  testCases: TestCase[];
  globalStartIndex: number;
  entryPoint: Parameters<typeof buildJDoodleScript>[0]["entryPoint"];
  starterForLang: string | undefined;
  metrics: SubmissionMetrics;
}): Promise<JudgeState> {
  const {
    sourceCode,
    language,
    testCases,
    globalStartIndex,
    entryPoint,
    starterForLang,
    metrics,
  } = args;

  if (!testCases.length) {
    return { passedCases: 0 };
  }

  const script = buildJDoodleScript({
    language,
    userCode: sourceCode,
    cases: testCases,
    entryPoint,
    starterForLang,
  });

  const jdoodleResult = await executeOnJDoodle({
    script,
    language,
  });

  updateMetrics(metrics, jdoodleResult);

  const stdout = jdoodleResult.output ?? "";
  const stderr =
    jdoodleResult.error?.trim()
      ? jdoodleResult.error
      : typeof jdoodleResult.compilationStatus === "string" &&
          jdoodleResult.compilationStatus.trim()
        ? jdoodleResult.compilationStatus
        : "";

  const outputWasLimited = stderr ? isOutputLimitError(stderr) : false;
  let runs = parseStdoutByCase(stdout);

  const runsAreContiguous = runs.every(
    (run, index) => run.caseNum === index + 1,
  );

  if (!runsAreContiguous) {
    runs = [];
  }

  if (stderr && !outputWasLimited) {
    const firstTestCase = testCases[0];

    return {
      passedCases: 0,
      failedCase: {
        caseNum: globalStartIndex + 1,
        input: firstTestCase.input,
        output: "",
        expectedOutput: stringifyExpected(firstTestCase.expectedOutput),
        error: stderr,
        logs: stdout.trim(),
      },
    };
  }

  if (runs.length) {
    const completeRuns = runs.slice(0, testCases.length);
    const finalRuns = attachExpectedOutputs(
      completeRuns,
      testCases.slice(0, completeRuns.length),
    );

    const firstFailedLocalIndex = finalRuns.findIndex(
      (run) => !run.ok || run.passed === false,
    );

    if (firstFailedLocalIndex !== -1) {
      const failedRun = finalRuns[firstFailedLocalIndex];
      const failedTestCase = testCases[firstFailedLocalIndex];

      return {
        passedCases: firstFailedLocalIndex,
        failedCase: {
          caseNum: globalStartIndex + firstFailedLocalIndex + 1,
          input: failedTestCase.input,
          output: outputForComparison(failedRun),
          expectedOutput: failedRun.expectedOutput,
          error: failedRun.error,
          logs: failedRun.logs,
        },
      };
    }

    if (completeRuns.length === testCases.length) {
      return {
        passedCases: testCases.length,
      };
    }

    const remainingCases = testCases.slice(completeRuns.length);
    const remainingResult = await judgeBatch({
      ...args,
      testCases: remainingCases,
      globalStartIndex: globalStartIndex + completeRuns.length,
    });

    return {
      passedCases: completeRuns.length + remainingResult.passedCases,
      failedCase: remainingResult.failedCase,
      judgeError: remainingResult.judgeError,
    };
  }

  if (testCases.length > 1) {
    const midpoint = Math.ceil(testCases.length / 2);
    const firstHalf = testCases.slice(0, midpoint);
    const secondHalf = testCases.slice(midpoint);

    const firstResult = await judgeBatch({
      ...args,
      testCases: firstHalf,
    });

    if (firstResult.failedCase || firstResult.judgeError) {
      return firstResult;
    }

    const secondResult = await judgeBatch({
      ...args,
      testCases: secondHalf,
      globalStartIndex: globalStartIndex + midpoint,
    });

    return {
      passedCases: firstResult.passedCases + secondResult.passedCases,
      failedCase: secondResult.failedCase,
      judgeError: secondResult.judgeError,
    };
  }

  if (outputWasLimited) {
    return {
      passedCases: 0,
      judgeError:
        `Test case ${globalStartIndex + 1} produced more output than JDoodle can return. ` +
        "The submission was not marked wrong because the complete output could not be compared.",
    };
  }

  return {
    passedCases: 0,
    judgeError:
      `JDoodle did not return a parseable result for test case ${globalStartIndex + 1}.`,
  };
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const body: unknown = await request.json().catch(() => null);

  if (!isSubmitRequest(body)) {
    if (
      !isRecord(body) ||
      typeof body.sourceCode !== "string" ||
      body.sourceCode.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing sourceCode" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Invalid submission request" },
      { status: 400 },
    );
  }

  const { sourceCode, language, activeTimeSeconds } = body;
  const normalizedActiveTimeSeconds = Math.min(
    Math.floor(activeTimeSeconds),
    12 * 60 * 60,
  );

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: "Unauthenticated" },
      { status: 401 },
    );
  }

  const data = rawData as ProblemsFile;
  const problem = data.problems.find(
    (candidate) => candidate.slug === slug,
  );

  if (!problem) {
    return NextResponse.json(
      { error: "Problem not found" },
      { status: 404 },
    );
  }

  const testCases = problem.testCases ?? [];

  if (!testCases.length) {
    return NextResponse.json(
      { error: "No test cases found for this problem" },
      { status: 500 },
    );
  }

  const entryPoint = problem.entryPoint?.[language];

  if (!entryPoint) {
    return NextResponse.json(
      { error: `No entry point configured for ${language}` },
      { status: 500 },
    );
  }

  const batches = createSubmissionBatches(testCases);
  const metrics: SubmissionMetrics = {
    runtime: 0,
    memory: null,
  };

  let passedCases = 0;
  let failedCase: FailedCase | undefined;

  try {
    let globalStartIndex = 0;

    for (const batch of batches) {
      const result = await judgeBatch({
        sourceCode,
        language,
        testCases: batch,
        globalStartIndex,
        entryPoint,
        starterForLang: problem.starterCode?.[language],
        metrics,
      });

      passedCases += result.passedCases;

      if (result.judgeError) {
        return NextResponse.json(
          { error: result.judgeError },
          { status: 502 },
        );
      }

      if (result.failedCase) {
        failedCase = result.failedCase;
        break;
      }

      globalStartIndex += batch.length;
    }
  } catch (error: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 502 },
    );
  }

  const totalCases = testCases.length;
  const accepted = !failedCase && passedCases === totalCases;
  const memory = metrics.memory;
  const runtime = metrics.runtime > 0 ? metrics.runtime : null;
  const now = new Date().toISOString();

  const {
    data: insertedSubmission,
    error: insertError,
  } = await supabase
    .from("submissions")
    .insert({
      userId: user.id,
      problemId: problem.problemID,
      code: sourceCode,
      language,
      passed: accepted,
      memory,
      runtime,
      passedCases,
      totalCases,
      failedCase: accepted ? null : (failedCase ?? null),
      activeTimeSeconds: normalizedActiveTimeSeconds,
      createdAt: now,
    })
    .select("id")
    .single();

  if (insertError || !insertedSubmission) {
    return NextResponse.json(
      {
        error:
          insertError?.message ?? "Could not save the submission",
      },
      { status: 500 },
    );
  }

  const {
    data: existingStatus,
    error: existingStatusError,
  } = await supabase
    .from("user_problem_status")
    .select("completed")
    .eq("userId", user.id)
    .eq("problemId", problem.problemID)
    .maybeSingle();

  if (existingStatusError) {
    return NextResponse.json(
      { error: existingStatusError.message },
      { status: 500 },
    );
  }

  const completed = accepted || Boolean(existingStatus?.completed);
  const { error: statusError } = await supabase
    .from("user_problem_status")
    .upsert(
      {
        userId: user.id,
        problemId: problem.problemID,
        completed,
        lastSubmittedAt: now,
      },
      {
        onConflict: "userId,problemId",
      },
    );

  if (statusError) {
    return NextResponse.json(
      { error: statusError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    submissionId: insertedSubmission.id,
    accepted,
    status: accepted ? "accepted" : "failed",
    passedCases,
    totalCases,
    failedCase,
    isError: !accepted,
    memory: memory === null ? undefined : String(memory),
    cpuTime: runtime === null ? undefined : String(runtime),
    caseRuns: [],
  });
}