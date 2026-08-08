import { NextResponse } from "next/server";
import rawData from "@/app/data/neetcode_150_problems_with_entry.json";
import type { JsonValue, ProblemsFile } from "@/lib/problem";
import type { Lang } from "@/lib/languages";
import { isLang } from "@/lib/languages";
import { createClient } from "@/utils/supabase/server";
import {
  toJDoodleLanguage,
  type JDoodleResponse,
} from "@/app/components/editor/api";
import {
  SUBMIT_RESULT_PREFIX,
  buildSubmitJDoodleScript,
} from "./submitScript";

export const runtime = "nodejs";

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

type ParsedSubmitResult =
  | {
      kind: "accepted";
      passedCases: number;
      totalCases: number;
    }
  | {
      kind: "failed";
      passedCases: number;
      totalCases: number;
      caseNum: number;
      output: string;
    }
  | {
      kind: "error";
      passedCases: number;
      totalCases: number;
      caseNum: number;
      error: string;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
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

function stringifyExpected(value: JsonValue): string {
  try {
    const json = JSON.stringify(value);
    return json === undefined ? String(value) : json;
  } catch {
    return String(value);
  }
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

function parseNonNegativeInteger(
  value: string | undefined,
): number | null {
  if (value === undefined || !/^\d+$/.test(value)) {
    return null;
  }

  const parsed = Number(value);

  return Number.isSafeInteger(parsed) ? parsed : null;
}

function decodeBase64(value: string | undefined): string {
  if (value === undefined) {
    return "";
  }

  try {
    return Buffer.from(value, "base64").toString("utf8");
  } catch {
    return "";
  }
}

/**
 * submitScript.ts returns one compact line:
 *
 * Accepted:
 * @@SUBMIT_RESULT@@A|passed|total
 *
 * Failed:
 * @@SUBMIT_RESULT@@F|passed|total|caseNum|actualBase64|expectedBase64
 *
 * Runtime error:
 * @@SUBMIT_RESULT@@E|passed|total|caseNum|errorBase64|expectedBase64
 */
function parseSubmitResult(
  stdout: string,
): ParsedSubmitResult | null {
  const resultLines = stdout
    .split(/\r?\n/)
    .filter((line) => line.startsWith(SUBMIT_RESULT_PREFIX));

  if (!resultLines.length) {
    return null;
  }

  // There should normally only be one result line.
  // Use the final one as a defensive measure.
  const line = resultLines[resultLines.length - 1];

  const payload = line.slice(SUBMIT_RESULT_PREFIX.length);
  const parts = payload.split("|");

  const status = parts[0];
  const passedCases = parseNonNegativeInteger(parts[1]);
  const totalCases = parseNonNegativeInteger(parts[2]);

  if (passedCases === null || totalCases === null) {
    return null;
  }

  if (status === "A") {
    return {
      kind: "accepted",
      passedCases,
      totalCases,
    };
  }

  const caseNum = parseNonNegativeInteger(parts[3]);

  if (caseNum === null || caseNum < 1) {
    return null;
  }

  if (status === "F") {
    return {
      kind: "failed",
      passedCases,
      totalCases,
      caseNum,
      output: decodeBase64(parts[4]),
    };
  }

  if (status === "E") {
    return {
      kind: "error",
      passedCases,
      totalCases,
      caseNum,
      error: decodeBase64(parts[4]),
    };
  }

  return null;
}

function getNonJudgeOutput(
  stdout: string,
): string | undefined {
  const output = stdout
    .split(/\r?\n/)
    .filter((line) => !line.startsWith(SUBMIT_RESULT_PREFIX))
    .join("\n")
    .trim();

  return output || undefined;
}

function getJDoodleExecutionError(
  result: JDoodleResponse,
): string | undefined {
  if (result.error?.trim()) {
    return result.error.trim();
  }

  if (
    typeof result.compilationStatus === "string" &&
    result.compilationStatus.trim()
  ) {
    return result.compilationStatus.trim();
  }

  return undefined;
}

/**
 * IMPORTANT:
 *
 * This is the only JDoodle API call in the submit route.
 *
 * buildSubmitJDoodleScript() contains all hidden test cases
 * inside one generated program, so they are all executed
 * within this single JDoodle request.
 */
async function executeOnJDoodle(args: {
  script: string;
  language: Lang;
}): Promise<JDoodleResponse> {
  const response = await fetch(
    "https://api.jdoodle.com/v1/execute",
    {
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
    },
  );

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
      data.error ??
        `JDoodle request failed with ${response.status}`,
    );
  }

  return data;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const body: unknown = await request
    .json()
    .catch(() => null);

  if (!isSubmitRequest(body)) {
    if (
      !isRecord(body) ||
      typeof body.sourceCode !== "string" ||
      body.sourceCode.length === 0
    ) {
      return NextResponse.json(
        {
          error: "Missing sourceCode",
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        error: "Invalid submission request",
      },
      {
        status: 400,
      },
    );
  }

  const {
    sourceCode,
    language,
    activeTimeSeconds,
  } = body;

  const normalizedActiveTimeSeconds = Math.min(
    Math.floor(activeTimeSeconds),
    12 * 60 * 60,
  );

  /*
   * Authenticate user
   */
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      {
        error: "Unauthenticated",
      },
      {
        status: 401,
      },
    );
  }

  /*
   * Find problem
   */
  const data = rawData as ProblemsFile;

  const problem = data.problems.find(
    (candidate) => candidate.slug === slug,
  );

  if (!problem) {
    return NextResponse.json(
      {
        error: "Problem not found",
      },
      {
        status: 404,
      },
    );
  }

  /*
   * Get hidden submission test cases
   */
  const testCases = problem.testCases ?? [];

  if (!testCases.length) {
    return NextResponse.json(
      {
        error: "No test cases found for this problem",
      },
      {
        status: 500,
      },
    );
  }

  /*
   * Get configured function/method entry point
   */
  const entryPoint = problem.entryPoint?.[language];

  if (!entryPoint) {
    return NextResponse.json(
      {
        error: `No entry point configured for ${language}`,
      },
      {
        status: 500,
      },
    );
  }

  /*
   * ============================================================
   * ONE JDOODLE EXECUTION
   * ============================================================
   *
   * buildSubmitJDoodleScript() receives ALL hidden test cases.
   *
   * The generated Python / JavaScript / Java / C# program:
   *
   * 1. Runs each hidden test internally.
   * 2. Compares actual vs expected internally.
   * 3. Stops on the first failure.
   * 4. Prints one compact result.
   *
   * Therefore this route does NOT:
   *
   * - batch test cases
   * - recursively retry test cases
   * - execute JDoodle once per batch
   */
  let jdoodleResult: JDoodleResponse;

  try {
    const script = buildSubmitJDoodleScript({
      language,
      userCode: sourceCode,
      cases: testCases,
      entryPoint,
      starterForLang: problem.starterCode?.[language],
    });

    jdoodleResult = await executeOnJDoodle({
      script,
      language,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: getErrorMessage(error),
      },
      {
        status: 502,
      },
    );
  }

  /*
   * Parse the single compact result returned by
   * submitScript.ts.
   */
  const totalCases = testCases.length;
  const stdout = jdoodleResult.output ?? "";

  const parsedResult = parseSubmitResult(stdout);
  const executionError =
    getJDoodleExecutionError(jdoodleResult);

  const nonJudgeOutput =
    getNonJudgeOutput(stdout);

  let accepted = false;
  let passedCases = 0;
  let failedCase: FailedCase | undefined;

  /*
   * Normal submission result.
   */
  if (parsedResult) {
    /*
     * Defensive check:
     *
     * The generated judge should report exactly the same
     * number of test cases that this route supplied.
     */
    if (parsedResult.totalCases !== totalCases) {
      return NextResponse.json(
        {
          error:
            "JDoodle returned a submission result with an unexpected test-case count.",
        },
        {
          status: 502,
        },
      );
    }

    /*
     * ACCEPTED
     *
     * @@SUBMIT_RESULT@@A|passed|total
     */
    if (parsedResult.kind === "accepted") {
      if (parsedResult.passedCases !== totalCases) {
        return NextResponse.json(
          {
            error:
              "JDoodle returned an inconsistent accepted submission result.",
          },
          {
            status: 502,
          },
        );
      }

      accepted = true;
      passedCases = totalCases;
    } else {
      /*
       * FAILED / RUNTIME ERROR
       *
       * Since submitScript.ts stops at the first failed case,
       *
       * case 1 failure => 0 passed
       * case 2 failure => 1 passed
       * case 3 failure => 2 passed
       * ...
       */
      if (
        parsedResult.caseNum > totalCases ||
        parsedResult.passedCases !==
          parsedResult.caseNum - 1
      ) {
        return NextResponse.json(
          {
            error:
              "JDoodle returned an inconsistent failed submission result.",
          },
          {
            status: 502,
          },
        );
      }

      const failedTestCase =
        testCases[parsedResult.caseNum - 1];

      passedCases = parsedResult.passedCases;

      /*
       * We already know the expected output on our server,
       * so we don't need to trust/reconstruct it from
       * JDoodle's response.
       */
      failedCase = {
        caseNum: parsedResult.caseNum,
        input: failedTestCase.input,
        expectedOutput: stringifyExpected(
          failedTestCase.expectedOutput,
        ),
        logs: nonJudgeOutput,

        ...(parsedResult.kind === "failed"
          ? {
              output: parsedResult.output,
            }
          : {
              error: parsedResult.error,
            }),
      };
    }
  } else if (executionError) {
    /*
     * Compilation errors happen before submitScript.ts
     * can print @@SUBMIT_RESULT@@.
     *
     * Treat this as a failed submission rather than
     * automatically sending another JDoodle request.
     */
    const firstTestCase = testCases[0];

    failedCase = {
      caseNum: 1,
      input: firstTestCase.input,
      output: "",
      expectedOutput: stringifyExpected(
        firstTestCase.expectedOutput,
      ),
      error: executionError,
      logs: stdout.trim() || undefined,
    };
  } else {
    /*
     * Do NOT retry automatically.
     *
     * A retry would consume another JDoodle credit.
     */
    return NextResponse.json(
      {
        error:
          "JDoodle did not return a parseable submission result.",
      },
      {
        status: 502,
      },
    );
  }

  /*
   * JDoodle execution metrics
   *
   * There is now only one execution, so there is
   * nothing to accumulate across batches.
   */
  const rawMemory = toNullableInt(
    jdoodleResult.memory,
  );

  const rawRuntime = toNullableInt(
    jdoodleResult.cpuTime,
  );

  const memory = rawMemory;

  const runtime =
    rawRuntime !== null && rawRuntime > 0
      ? rawRuntime
      : null;

  const now = new Date().toISOString();

  /*
   * Save submission
   */
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
      failedCase:
        accepted
          ? null
          : (failedCase ?? null),
      activeTimeSeconds:
        normalizedActiveTimeSeconds,
      createdAt: now,
    })
    .select("id")
    .single();

  if (insertError || !insertedSubmission) {
    return NextResponse.json(
      {
        error:
          insertError?.message ??
          "Could not save the submission",
      },
      {
        status: 500,
      },
    );
  }

  /*
   * Check whether the problem was already completed.
   *
   * A later failed submission should not change a
   * previously completed problem back to incomplete.
   */
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
      {
        error: existingStatusError.message,
      },
      {
        status: 500,
      },
    );
  }

  const completed =
    accepted ||
    Boolean(existingStatus?.completed);

  /*
   * Update completion status
   */
  const {
    error: statusError,
  } = await supabase
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
      {
        error: statusError.message,
      },
      {
        status: 500,
      },
    );
  }

  /*
   * Return result to frontend
   */
  return NextResponse.json({
    submissionId: insertedSubmission.id,

    accepted,

    status:
      accepted
        ? "accepted"
        : "failed",

    passedCases,
    totalCases,
    failedCase,

    isError: !accepted,

    memory:
      memory === null
        ? undefined
        : String(memory),

    cpuTime:
      runtime === null
        ? undefined
        : String(runtime),

    caseRuns: [],
  });
}