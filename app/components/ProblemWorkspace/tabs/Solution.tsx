import type { Problem } from "@/lib/problem";
import { getSolutionBySlug } from "@/lib/solutions";
import { DEFAULT_ORDER, type Lang } from "@/lib/languages";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SolutionCodeTabs } from "./SolutionCodeTabs";

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="rounded-md border bg-muted/40 p-3 overflow-auto text-sm">
      <code className="whitespace-pre">{code}</code>
    </pre>
  );
}

export default async function Solution({
  problem,
  mobileOnly,
}: {
  problem: Problem;
  mobileOnly?: boolean;
}) {
  const sol = getSolutionBySlug(problem.slug);
  const solutionFontSize = mobileOnly ? 10 : 14;
  if (!sol) {
    return (
      <div className="space-y-3 m-2">
        <div className="text-xl font-bold">Solution</div>
        <div className="p-3 text-md">
          No solution added for this problem yet.
        </div>
      </div>
    );
  }

  const codeByLang = sol.codeByLang ?? {};
  const availableLangs = DEFAULT_ORDER.filter((l) => !!codeByLang[l]) as Lang[];

  const initialLang: Lang = (availableLangs[0] ??
    sol.runner?.lang ??
    "javascript") as Lang;

  const time = sol.complexity?.time;
  const space = sol.complexity?.space;

  return (
    <div className="space-y-4 m-2">
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-xl font-bold">Solution</div>
        {sol.updatedAt && (
          <div className="text-xs text-muted-foreground">
            Updated: {sol.updatedAt}
          </div>
        )}
      </div>

      {sol.approachMd && (
        <div className="-mt-4 p-3 prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {sol.approachMd}
          </ReactMarkdown>
        </div>
      )}

      <div className="p-3 -mt-5">
        <div className="font-bold text-lg mb-2">Code</div>

        {availableLangs.length > 0 ? (
          <SolutionCodeTabs
            codeByLang={codeByLang}
            availableLangs={availableLangs}
            initialLang={initialLang}
            fontSize={solutionFontSize}
          />
        ) : sol.runner?.code ? (
          <CodeBlock code={sol.runner.code} />
        ) : (
          <div className="text-sm text-muted-foreground">
            No code found in this solution entry.
          </div>
        )}
      </div>

      {(time || space) && (
        <div className="rounded-md border p-3 text-sm">
          <div className="font-bold mb-1">Complexity</div>
          <div className="">
            {time ? <div>Time: {time}</div> : null}
            {space ? <div>Space: {space}</div> : null}
          </div>
        </div>
      )}
    </div>
  );
}
