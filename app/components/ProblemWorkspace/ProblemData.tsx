import { Suspense } from "react";
import type { Problem } from "@/lib/problem";
import TabsHeaderClient from "./TabsHeaderClient";
import Description from "./tabs/Description";
import Submissions from "./tabs/Submissions";
import Solution from "./tabs/Solution";

export default function ProblemData({
  problem,
  initialTab = "description",
  mobileOnly = false,
  selectedSubmissionId,
}: {
  problem: Problem;
  initialTab?: string;
  mobileOnly?: boolean;
  selectedSubmissionId?: string;
}) {
  return (
    <div className="w-full p-3">
      <TabsHeaderClient initialTab={initialTab} />

      <div className="mt-3">
        {/* Re-render panel when ?tab= changes */}
        <Suspense
          key={`${initialTab}-${selectedSubmissionId ?? "all"}`}
          fallback={<div className="h-64 rounded-md animate-pulse bg-muted" />}
        >
          {initialTab === "description" && <Description problem={problem} />}
          {initialTab === "submissions" && (
            <Submissions
              problem={problem}
              selectedSubmissionId={selectedSubmissionId}
            />
          )}
          {initialTab === "solutions" && (
            <Solution problem={problem} mobileOnly={mobileOnly} />
          )}
        </Suspense>
      </div>
    </div>
  );
}
