import { NextResponse } from "next/server";
import rawData from "@/app/data/neetcode_150_problems_with_entry.json";
import type { ProblemsFile } from "@/lib/problem";
import type { Lang } from "@/lib/languages";
import { isLang } from "@/lib/languages";
import { createClient } from "@/utils/supabase/server";
import {
  RESULT_PREFIX,
  buildJDoodleScript,
  toJDoodleLanguage,
} from "@/app/components/editor/api";

export const runtime = "nodejs";

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

type JsonCase = {
  input: any;
  expectedOutput: any;
};

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
          ok: Boolean(obj.ok),
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
    last.logs = `${last.logs ?? ""}\n${pendingLogs.join("\n")}`.trim();
  }

  return runs.sort((a, b) => a.caseNum - b.caseNum);
}

function outputForComparison(run: CaseRun): string {
  if (run.outputJson && run.outputJson.trim()) {
    try {
      return JSON.stringify(JSON.parse(run.outputJson));
    } catch {
      return run.outputJson;
    }
  }

  if (run.outputText !== undefined) return run.outputText;
  if (run.output !== undefined) return run.output;

  return "";
}

function normalizePythonLiterals(value: string): string {
  return value
    .trim()
    .replace(/\bTrue\b/g, "true")
    .replace(/\bFalse\b/g, "false")
    .replace(/\bNone\b/g, "null");
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

function deepEqual(a: any, b: any): boolean {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

function stringifyExpected(value: any): string {
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
  testCases: JsonCase[],
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
  if (value === null || value === undefined) return null;

  const numeric = Number(String(value).replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(numeric)) return null;

  return Math.round(numeric);
}

async function executeOnJDoodle(args: { script: string; language: Lang }) {
  const res = await fetch("https://api.jdoodle.com/v1/execute", {
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

  const text = await res.text();

  let data: any;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      `JDoodle returned non-JSON response: ${text.slice(0, 300)}`,
    );
  }

  if (!res.ok) {
    throw new Error(data?.error ?? `JDoodle request failed with ${res.status}`);
  }

  return data;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const body = await req.json().catch(() => null);

  const sourceCode = body?.sourceCode;
  const language = body?.language;

  if (!sourceCode || typeof sourceCode !== "string") {
    return NextResponse.json({ error: "Missing sourceCode" }, { status: 400 });
  }

  if (!language || typeof language !== "string" || !isLang(language)) {
    return NextResponse.json({ error: "Invalid language" }, { status: 400 });
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const data = rawData as ProblemsFile;
  const problem = data.problems.find((p) => p.slug === slug);

  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }

  const testCases = problem.testCases ?? [];

  if (!testCases.length) {
    return NextResponse.json(
      { error: "No test cases found for this problem" },
      { status: 500 },
    );
  }

  const script = buildJDoodleScript({
    language,
    userCode: sourceCode,
    cases: testCases,
    entryPoint: problem.entryPoint?.[language],
    starterForLang: problem.starterCode?.[language],
  });

  let jdoodleResult: any;

  try {
    jdoodleResult = await executeOnJDoodle({
      script,
      language,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        accepted: false,
        status: "failed",
        passedCases: 0,
        totalCases: testCases.length,
        isError: true,
        memory: null,
        cpuTime: null,
        caseRuns: [],
        failedCase: {
          caseNum: 1,
          input: testCases[0]?.input,
          output: "",
          expectedOutput: stringifyExpected(testCases[0]?.expectedOutput),
          error: error?.message ?? "Code execution failed",
          logs: "",
        },
      },
      { status: 200 },
    );
  }

  const stdout =
    typeof jdoodleResult?.output === "string" ? jdoodleResult.output : "";

  const stderr =
    typeof jdoodleResult?.error === "string" && jdoodleResult.error.trim()
      ? jdoodleResult.error
      : typeof jdoodleResult?.compilationStatus === "string" &&
          jdoodleResult.compilationStatus.trim()
        ? jdoodleResult.compilationStatus
        : "";

  let runs = parseStdoutByCase(stdout);

  if (!runs.length) {
    runs = [
      {
        caseNum: 1,
        ok: !stderr.trim(),
        output: stdout.trim(),
        error: stderr.trim() ? stderr : undefined,
        logs: "",
      },
    ];
  }

  if (stderr.trim()) {
    runs = runs.map((run) => ({
      ...run,
      ok: false,
      error: run.error ?? "Runtime/Compile error",
      logs: `${run.logs ?? ""}\n--- stderr ---\n${stderr}`.trim(),
    }));
  }

  const finalRuns = attachExpectedOutputs(runs, testCases);

  const totalCases = testCases.length;
  const passedCases = finalRuns.filter(
    (run) => run.ok && run.passed === true,
  ).length;

  const accepted =
    finalRuns.length === totalCases &&
    totalCases > 0 &&
    finalRuns.every((run) => run.ok && run.passed === true);

  const firstFailedRun = finalRuns.find(
    (run) => !run.ok || run.passed === false,
  );

  const firstFailedIndex = firstFailedRun
    ? Math.max(firstFailedRun.caseNum - 1, 0)
    : -1;

  const failedCase = firstFailedRun
    ? {
        caseNum: firstFailedRun.caseNum,
        input: testCases[firstFailedIndex]?.input,
        output: outputForComparison(firstFailedRun),
        expectedOutput: firstFailedRun.expectedOutput,
        error: firstFailedRun.error,
        logs: firstFailedRun.logs,
      }
    : undefined;

  const memory = toNullableInt(jdoodleResult?.memory);
  const runtime = toNullableInt(jdoodleResult?.cpuTime);
  const now = new Date().toISOString();

  const { data: insertedSubmission, error: insertError } = await supabase.from("submissions").insert({
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
    createdAt: now,
  })
  .select("id")
  .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  const { data: existingStatus, error: existingStatusError } = await supabase
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
    return NextResponse.json({ error: statusError.message }, { status: 500 });
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
    caseRuns: finalRuns,
  });
}
