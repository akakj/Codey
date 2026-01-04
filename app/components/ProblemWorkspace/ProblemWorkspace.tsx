import React from "react";
import { createClient } from "@/utils/supabase/server";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Problem } from "@/lib/problem";
import ProblemData from "./ProblemData";
import CodeEditor from "../editor/CodeEditor";

export default async function ProblemWorkspace({
  problem,
  initialTab = "description",
}: {
  problem: Problem;
  initialTab?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="px-0.5 sm:px-1 py-0.5 sm:py-1">
      <div className="w-full h-[91dvh] rounded-lg border overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={40} minSize={0}>
            <div className="h-full overflow-auto">
              <ProblemData problem={problem} initialTab={initialTab} />
            </div>
          </ResizablePanel>
          <ResizableHandle />

          <ResizablePanel defaultSize={60} minSize={0}>
            <div className="h-full overflow-auto">
              <CodeEditor
                isLoggedIn={!!user}
                problemSlug={problem.slug}
                starterCodeByLang={problem.starterCode}
                initialCases={problem.testCases.slice(0, 2)}
                entryPointByLang={problem.entryPoint}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
