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

import type { Lang, StarterMap } from "@/lib/languages";
import type { EntryPointByLang } from "@/lib/problem";
import { runCode, submitCode, type SubmitCodeResult } from "./codeRunner";

const MIN = 6;
const EXPANDED = 40;

type JsonCase = {
  input: any;
  expectedOutput?: any; // present for default cases
  isUser?: boolean; // true for user-added cases
};

export function ConsolePanel({
  isLoggedIn,
  initialOpen = true,
  value,
  language,
  problemSlug,
  initialCases,
  entryPointByLang,
  starterCodeByLang,
  testCases,
}: {
  isLoggedIn: boolean;
  initialOpen?: boolean;
  value: string;
  language: Lang;
  problemSlug: string;
  initialCases?: JsonCase[];
  entryPointByLang?: EntryPointByLang;
  starterCodeByLang?: StarterMap;
  testCases?: JsonCase[];
}) {
  const panelRef = React.useRef<ImperativePanelHandle>(null);
  const [size, setSize] = React.useState<number>(initialOpen ? EXPANDED : 10);
  const isExpanded = size > MIN + 2;

  const [activeTab, setActiveTab] = React.useState<"cases" | "output">("cases");

  const [loadingAction, setLoadingAction] = React.useState<
    "run" | "submit" | null
  >(null);

  const isLoading = loadingAction !== null;

  const [isError, setIsError] = React.useState<boolean>(false);

  const [liveCases, setLiveCases] = React.useState<JsonCase[]>(
    initialCases ?? [],
  );

  // Results state
  const [caseRuns, setCaseRuns] = React.useState<CaseRun[]>([]);
  const [activeOutputCase, setActiveOutputCase] = React.useState<number>(0);

  const [submitResult, setSubmitResult] =
    React.useState<SubmitCodeResult | null>(null);

  React.useEffect(() => {
    setLiveCases(initialCases ?? []);
    setActiveTab("cases");
    setCaseRuns([]);
    setActiveOutputCase(0);
    setIsError(false);
  }, [problemSlug]);

  const toggle = () => {
    const cur = panelRef.current?.getSize() ?? size;
    panelRef.current?.resize(cur <= MIN + 2 ? EXPANDED : MIN);
  };

  const handleRunCode = async () => {
    const sourceCode = value;
    if (!sourceCode) return;

    setActiveTab("output");
    setLoadingAction("run");
    setIsError(false);
    setSubmitResult(null);
    setCaseRuns([]);
    setActiveOutputCase(0);

    const result = await runCode({
      sourceCode,
      language,
      liveCases,
      initialCases,
      entryPointByLang,
      starterCodeByLang,
    });

    setCaseRuns(result.caseRuns);
    setIsError(result.isError);
    setLoadingAction(null);
  };

  const handleSubmitCode = async () => {
    const sourceCode = value;
    if (!sourceCode) return;

    setActiveTab("output");
    setLoadingAction("submit");
    setIsError(false);
    setSubmitResult(null);
    setCaseRuns([]);
    setActiveOutputCase(0);

    const result = await submitCode({
      sourceCode,
      language,
      testCases,
      entryPointByLang,
      starterCodeByLang,
    });

    console.log(result);

    setSubmitResult(result);
    setIsError(result.isError);
    setLoadingAction(null);
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
                      onClick={handleRunCode}
                      disabled={isLoading}
                    >
                      {loadingAction === "run" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Run"
                      )}
                    </Button>

                    <Button
                      className="text-[#008932] dark:text-green-500 hover:cursor-pointer ring-1 hover:bg-[#00d54eb3] dark:hover:bg-green-500 dark:hover:text-black"
                      variant="outline"
                      onClick={handleSubmitCode}
                      disabled={isLoading}
                    >
                      {loadingAction === "submit" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CloudUpload />
                      )}
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
              <TabsContent value="output" className="m-0 h-full">
                {submitResult ? (
                  <div className="space-y-4">
                    <p
                      className={`text-xl font-semibold ${
                        submitResult.accepted
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {submitResult.accepted ? "Accepted" : "Failed"}
                    </p>
                    <div className="text-sm">
                      <p>
                        Passed {submitResult.passedCases} /{" "}
                        {submitResult.totalCases} cases
                      </p>

                      <div className="mt-3 grid grid-cols-2 gap-3 sm:max-w-md">
                        <div>
                          <p className="text-muted-foreground">CPU Time</p>
                          <p className="font-medium">
                            {submitResult.cpuTime ?? "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-muted-foreground">Memory</p>
                          <p className="font-medium">
                            {submitResult.memory ?? "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : caseRuns.length === 0 ? (
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
