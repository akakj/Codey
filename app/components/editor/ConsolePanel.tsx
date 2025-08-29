"use client";

import React from "react";
import { ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, Terminal, SquareCheck } from "lucide-react";
import type { ImperativePanelHandle } from "react-resizable-panels";
import ConsoleCases from "../ProblemWorkspace/ConsoleCases";

const MIN = 6;
const EXPANDED = 40;

export function ConsolePanel({
  initialOpen = true,
  output,
  onRun,
  onSubmit,
}: {
  initialOpen?: boolean;
  output: string;
  onRun?: () => void;
  onSubmit?: () => void;
}) {
  const panelRef = React.useRef<ImperativePanelHandle>(null);
  const [size, setSize] = React.useState<number>(initialOpen ? EXPANDED : 10);
  const isExpanded = size > MIN + 2;

  const toggle = () => {
    const cur = panelRef.current?.getSize() ?? size;
    panelRef.current?.resize(cur <= MIN + 2 ? EXPANDED : MIN);
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
          <Tabs defaultValue="cases" className="flex h-full flex-col">
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
                <Button
                  variant="secondary"
                  className="hover:cursor-pointer bg-gray-300 dark:bg-gray-700 hover:bg-[#99a1af93] dark:hover:bg-gray-600"
                  onClick={onRun}
                >
                  Run
                </Button>
                <Button
                  className="bg-green-600 dark:bg-green-400 hover:cursor-pointer hover:bg-[#008f34] dark:hover:bg-[#00ff80]"
                  onClick={onSubmit}
                >
                  Submit
                </Button>
              </div>
            </div>

            <Separator className="-my-1" />

            {/* body */}
            <div className="flex-1 overflow-auto p-3">
              <TabsContent value="cases" className="m-0 h-full">
                <ConsoleCases />
              </TabsContent>
              <TabsContent value="output" className="m-0 h-full">
                <pre className="text-sm whitespace-pre-wrap">{output}</pre>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </ResizablePanel>

      {/* keep the group handle rendered by parent */}
      <ResizableHandle />
    </>
  );
}
