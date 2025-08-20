import React from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Problem } from "@/lib/problem";
import { getDifficulty } from "@/lib/difficulty";
import ProblemData from './ProblemData';
import CodeEditor from './CodeEditor'; 
import ConsoleCases from './ConsoleCases';


export default function ProblemWorkspace({ problem }: { problem: Problem }) {
  return (
    <div className="px-[2px] sm:px-[5px] py-[2px] sm:py-[5px]">
    <div className="w-full h-[91dvh] rounded-lg border overflow-hidden ">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={40} minSize={25}>
          <div className="h-full overflow-auto items-center">
            <ProblemData/>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={60} minSize={35}>
          <ResizablePanelGroup direction="vertical" className="h-full">
            {/* Code Editor */}
            <ResizablePanel defaultSize={80} minSize={40}>
              <div className="h-full overflow-auto">
                <CodeEditor/>
              </div>
            </ResizablePanel>

            <ResizableHandle />

            {/* Console + Test Cases */}
            <ResizablePanel defaultSize={30} minSize={15}>
              <div className="h-full overflow-auto">
                <ConsoleCases />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  </div>
  );
}
