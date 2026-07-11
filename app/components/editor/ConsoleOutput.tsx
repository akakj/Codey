// Here we print the output and stdout of each case run
"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCaseOutput, stringifyOutputValue } from "@/lib/outputFormatting";

export type CaseRun = {
  caseNum: number;
  ok: boolean;
  passed?: boolean;
  isDefaultCase?: boolean;
  output?: string; // java/python/csharp (string)
  outputText?: string; // js (string)
  outputJson?: string; // js (json string)
  expectedOutput?: string;
  error?: string;
  logs?: string; // lines printed BEFORE @@RESULT@@ for this case
};


export default function ConsoleOutput({
  runs,
  activeIndex,
  onActiveIndexChange,
  isError,
}: {
  runs: CaseRun[];
  activeIndex: number;
  onActiveIndexChange: (idx: number) => void;
  isError?: boolean;
}) {
  const cur = runs[activeIndex];

  // Determine overall status based on default cases with pass/fail info
  const defaultRunsWithPassFail = runs.filter(
    (r) => r.isDefaultCase && r.passed !== undefined,
  );

  const overallStatus =
    defaultRunsWithPassFail.length === 0
      ? null
      : defaultRunsWithPassFail.every((r) => r.passed === true)
        ? "Accepted"
        : "Failed";

  return (
    <div className="h-full flex flex-col gap-3">
      {/* Overall status */}
      {overallStatus ? (
        <div
          className={`text-md font-semibold ${
            overallStatus === "Accepted"
              ? "text-green-700 dark:text-green-400"
              : "text-red-700 dark:text-red-400"
          }`}
        >
          {overallStatus}
        </div>
      ) : null}
      {/* Case tabs */}
      <Tabs
        value={`case-${activeIndex}`}
        onValueChange={(v) =>
          onActiveIndexChange(parseInt(v.split("-")[1]!, 10))
        }
      >
        <TabsList className="h-9">
          {runs.map((r, i) => (
            <TabsTrigger
              key={`${r.caseNum}-${i}`}
              value={`case-${i}`}
              className={`px-3 pr-4 hover:cursor-pointer ${
                r.passed === true
                  ? "font-semibold text-green-700 data-[state=active]:text-green-700 dark:text-green-400 dark:data-[state=active]:text-green-400"
                  : r.passed === false
                    ? "font-semibold text-red-700 data-[state=active]:text-red-700 dark:text-red-400 dark:data-[state=active]:text-red-400"
                    : ""
              }`}
            >
              {`Case ${r.caseNum}`}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Stdout only shown if there is any */}
      {cur?.logs?.trim()?.length ? (
        <div className="shrink-0">
          <div className="mb-2 text-sm font-medium">Stdout</div>
          <div className="h-auto overflow-auto rounded-md border border-border bg-muted/20 p-3">
            <pre className="text-sm whitespace-pre-wrap text-muted-foreground">
              {cur.logs}
            </pre>
          </div>
        </div>
      ) : null}

      {/* Output return null if none */}
      <div className="shrink-0">
        <div className="mb-2 text-sm font-medium">Output</div>
        <div className="h-auto overflow-auto rounded-md border border-border bg-muted/20 p-3">
          {!cur ? null : !cur.ok ? (
            <pre className="text-sm whitespace-pre-wrap text-red-800 dark:text-red-400">
              {cur.error || "(error)"}
            </pre>
          ) : (
            <pre
              className={`text-sm whitespace-pre-wrap ${
                cur.error || cur.passed === false
                  ? "text-red-800 dark:text-red-400"
                  : ""
              }`}
            >
              {(() => {
                const out = getCaseOutput(cur);
                return out && out.length ? (
                  out
                ) : (
                  <span className="text-red-800 dark:text-red-400">null</span>
                );
              })()}
            </pre>
          )}
        </div>
      </div>

      {/* Expected output only shown when the current input exists in the problem file */}
      {cur?.expectedOutput !== undefined ? (
        <div className="shrink-0">
          <div className="mb-2 text-sm font-medium">Expected Output</div>
          <div className="h-auto overflow-auto rounded-md border border-border bg-muted/20 p-3">
            <pre className="text-sm whitespace-pre-wrap text-muted-foreground">
              {stringifyOutputValue(cur.expectedOutput)}
            </pre>
          </div>
        </div>
      ) : null}
    </div>
  );
}
