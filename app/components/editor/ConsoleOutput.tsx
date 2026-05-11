// Here we print the output and stdout of each case run
"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type CaseRun = {
  caseNum: number;
  ok: boolean;
  passed?: boolean;
  output?: string; // java/python/csharp (string)
  outputText?: string; // js (string)
  outputJson?: string; // js (json string)
  expectedOutput?: any;
  error?: string;
  logs?: string; // lines printed BEFORE @@RESULT@@ for this case
};

function prettyOutput(run: CaseRun): string {
  if (run.outputJson && run.outputJson.trim()) {
    try {
      return JSON.stringify(JSON.parse(run.outputJson), null, 2);
    } catch {
      return run.outputJson;
    }
  }
  if (run.outputText !== undefined) return run.outputText;
  if (run.output !== undefined) return run.output;
  return "";
}

export default function ConsoleOutput({
  runs,
  activeIndex,
  onActiveIndexChange,
  isError,
}: {
  runs: CaseRun[];
  activeIndex: number;
  onActiveIndexChange: (idx: number) => void;
  isError: boolean;
}) {
  const cur = runs[activeIndex];

  return (
    <div className="h-full flex flex-col gap-3">
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
              className="px-3 pr-4 hover:cursor-pointer"
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
                isError ? "text-red-800 dark:text-red-400" : ""
              }`}
            >
              {(() => {
                const out = prettyOutput(cur);
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
              {cur.expectedOutput}
            </pre>
          </div>
        </div>
      ) : null}

    </div>
  );
}
