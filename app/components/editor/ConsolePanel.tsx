"use client";

import React from "react";
import { ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, Terminal, SquareCheck, CloudUpload } from "lucide-react";
import type { ImperativePanelHandle } from "react-resizable-panels";
import { Loader2 } from "lucide-react";

import ConsoleCases from "./ConsoleCases";
import ConsoleOutput, { type CaseRun } from "./ConsoleOutput";
import { executeCode } from "./api";

import type { Lang, StarterMap } from "@/lib/languages";
import type { EntryPointByLang } from "@/lib/problem";

const MIN = 6;
const EXPANDED = 40;

type JsonCase = { input: any; output?: any };

const RESULT_PREFIX = "@@RESULT@@";

function parseStdoutByCase(stdout: string): CaseRun[] {
  const runs: CaseRun[] = [];
  let pendingLogs: string[] = [];

  for (const rawLine of stdout.split("\n")) {
    // keep line as-is (don’t trim)
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
        // if it looks like a result but isn't valid json, treat as log
        pendingLogs.push(line);
      }
      pendingLogs = [];
    } else {
      if (line.length) pendingLogs.push(line);
    }
  }

  // if leftover logs exist after the last result, append to last case (rare, but safe)
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

export function ConsolePanel({
  isLoggedIn,
  initialOpen = true,
  value,
  language,
  problemSlug,
  initialCases,
  entryPointByLang,
  starterCodeByLang,
}: {
  isLoggedIn: boolean;
  initialOpen?: boolean;
  value: string;
  language: Lang;
  problemSlug: string;
  initialCases?: { input: any; output?: any }[];
  entryPointByLang?: EntryPointByLang;
  starterCodeByLang?: StarterMap;
}) {
  const panelRef = React.useRef<ImperativePanelHandle>(null);
  const [size, setSize] = React.useState<number>(initialOpen ? EXPANDED : 10);
  const isExpanded = size > MIN + 2;

  const [activeTab, setActiveTab] = React.useState<"cases" | "output">("cases");

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isError, setIsError] = React.useState<boolean>(false);

  const [liveCases, setLiveCases] = React.useState<JsonCase[]>(
    initialCases ?? []
  );

  // Results state
  const [caseRuns, setCaseRuns] = React.useState<CaseRun[]>([]);
  const [activeOutputCase, setActiveOutputCase] = React.useState<number>(0);

  React.useEffect(() => {
    setLiveCases(initialCases ?? []);
    setActiveTab("cases");
    setCaseRuns([]);
    setActiveOutputCase(0);
    setIsError(false);
  }, [problemSlug, initialCases]);

  const toggle = () => {
    const cur = panelRef.current?.getSize() ?? size;
    panelRef.current?.resize(cur <= MIN + 2 ? EXPANDED : MIN);
  };

  const runCode = async () => {
    const sourceCode = value;
    if (!sourceCode) return;

    setActiveTab("output"); // switch to Test Result
    setIsLoading(true);
    setIsError(false);
    setCaseRuns([]);
    setActiveOutputCase(0);

    try {
      const data = await executeCode(
        language,
        sourceCode,
        liveCases ?? [],
        entryPointByLang?.[language],
        starterCodeByLang?.[language]
      );

      const stdout: string = data?.run?.stdout ?? "";
      const stderr: string = data?.run?.stderr ?? "";

      const runs = parseStdoutByCase(stdout);

      if (stderr.trim()) {
        if (runs.length) {
          for (const r of runs) {
            r.logs = (
              (r.logs ?? "").trimEnd() +
              "\n--- stderr ---\n" +
              stderr
            ).trim();
            r.ok = false;
            if (!r.error) r.error = "Runtime error";
          }
        } else {
          const n = Math.min(
            4,
            (liveCases?.length ?? 0) || (initialCases?.length ?? 0) || 1
          );

          const errRuns = Array.from({ length: n }, (_, i) => ({
            caseNum: i + 1,
            ok: false,
            error: "Runtime error",
            logs: `--- stderr ---\n${stderr}`.trim(),
          }));

          // replace runs entirely (since there were no parsed cases)
          runs.splice(0, runs.length, ...errRuns);
        }
      }

      // If we somehow got no runs, show raw stdout as a single case
      const finalRuns =
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

      setCaseRuns(finalRuns);
      setIsError(finalRuns.some((r) => !r.ok) || Boolean(stderr.trim()));
    } catch (error) {
      console.error("Error executing code:", error);
      setIsError(true);
      setCaseRuns([
        {
          caseNum: 1,
          ok: false,
          error: "An error occurred while running your code.",
          logs: "",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ResizablePanel
        ref={panelRef}
        defaultSize={initialOpen ? EXPANDED : 10}
        minSize={MIN}
        maxSize={90}
        className="border-t"
        onResize={setSize}
      >
        <div className="flex h-full flex-col bg-muted/10 dark:bg-muted/30">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "cases" | "output")}
            className="flex h-full flex-col"
          >
            {/* header */}
            <div className="flex items-center gap-1 px-2 py-1.5">
              <Button
                onClick={toggle}
                variant="secondary"
                size="icon"
                className="shrink-0 bg-transparent hover:bg-accent/90 dark:hover:bg-accent/50 hover:cursor-pointer"
                aria-expanded={isExpanded}
                title={isExpanded ? "Fold console" : "Expand console"}
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </Button>

              <TabsList className="rounded-none bg-transparent p-0 h-auto border-0">
                <TabsTrigger
                  value="cases"
                  className="px-2 py-1.5 hover:cursor-pointer data-[state=active]:border-gray-400"
                >
                  <SquareCheck className="mr-1 text-blue-500 dark:text-blue-300" />
                  Testcase
                </TabsTrigger>

                <TabsTrigger
                  value="output"
                  className="px-2 py-1.5 hover:cursor-pointer data-[state=active]:border-gray-400"
                >
                  <Terminal className="mr-1 text-blue-500 dark:text-blue-300" />
                  Test Result
                </TabsTrigger>
              </TabsList>

              <div className="ml-auto flex gap-1">
                {isLoggedIn ? (
                  <>
                    <Button
                      variant="secondary"
                      className="hover:cursor-pointer bg-[#d1d5dcc9] dark:bg-gray-700 hover:bg-[#99a1af93] dark:hover:bg-gray-600"
                      onClick={runCode}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        "Run"
                      )}
                    </Button>

                    <Button
                      className="text-[#008932] dark:text-green-500 hover:cursor-pointer ring-1 hover:bg-[#00d54eb3] dark:hover:bg-green-500 dark:hover:text-black"
                      variant="outline"
                    >
                      <CloudUpload />
                      Submit
                    </Button>
                  </>
                ) : (
                  <div className="ml-auto flex items-center min-w-0">
                    <p className="shrink-0 whitespace-nowrap text-right text-sm text-muted-foreground">
                      <a href="/login" className="underline">
                        Log in
                      </a>
                      {" to run or submit"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Separator className="-my-1" />

            {/* body */}
            <div className="flex-1 overflow-auto p-3">
              <TabsContent value="cases" className="m-0 h-full">
                <ConsoleCases
                  problemSlug={problemSlug}
                  initialCases={initialCases}
                  onCasesChange={setLiveCases}
                />
              </TabsContent>

              <TabsContent value="output" className="m-0 h-full">
                {caseRuns.length === 0 ? (
                  <pre
                    className={`text-sm whitespace-pre-wrap ${
                      isError ? "text-red-400" : ""
                    }`}
                  >
                    Run your code to see the output
                  </pre>
                ) : (
                  <ConsoleOutput
                    runs={caseRuns}
                    activeIndex={activeOutputCase}
                    onActiveIndexChange={setActiveOutputCase}
                    isError={isError}
                  />
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </ResizablePanel>

      <ResizableHandle />
    </>
  );
}
