import React from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Problem } from "@/lib/problem";
import ProblemData from "./ProblemData";
import CodeEditor from "../editor/CodeEditor";
import ConsoleCases from "./ConsoleCases";

export default function ProblemWorkspace({
  problem,
  initialTab = "description",
}: {
  problem: Problem;
  initialTab?: string;
}) {
  return (
    <div className="px-[2px] sm:px-[5px] py-[2px] sm:py-[5px]">
      <div className="w-full h-[91dvh] rounded-lg border overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={40} minSize={25}>
            <div className="h-full overflow-auto">
              <ProblemData problem={problem} initialTab={initialTab} />
            </div>
          </ResizablePanel>
          <ResizableHandle />

          <ResizablePanel defaultSize={60} minSize={35}>
            <div className="h-full overflow-auto">
              <CodeEditor
                problemSlug={problem.slug}
                starterCodeByLang={problem.starterCode}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
