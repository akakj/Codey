import Link from "next/link";
import type { Problem } from "@/lib/problem";
import { createClient } from "@/utils/supabase/server";

import SubmissionDetail from "./submissions/SubmissionDetails";
import SubmissionsList from "./submissions/SubmissionsList";
import type {
  SubmissionDetailRow,
  SubmissionListRow,
} from "./submissions/submissionUtils";

function StateCard({
  message,
  error = false,
}: {
  message: string;
  error?: boolean;
}) {
  return (
    <div className="rounded-md border p-6">
      <p className={error ? "text-sm text-red-500" : "text-sm"}>{message}</p>
    </div>
  );
}

function BackToSubmissions({ href }: { href: string }) {
  return (
    <Link href={href} className="text-sm text-muted-foreground">
      ← All submissions
    </Link>
  );
}

export default async function Submissions({
  problem,
  selectedSubmissionId,
}: {
  problem: Problem;
  selectedSubmissionId?: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="space-y-3 m-2">
        <div className="text-lg font-bold">Submissions</div>
        <StateCard message="Log in to view your submissions" />
      </div>
    );
  }

  const backHref = `/problems/${problem.slug}?tab=submissions`;

  if (selectedSubmissionId) {
    const numericSubmissionId = Number(selectedSubmissionId);

    if (!Number.isInteger(numericSubmissionId)) {
      return (
        <div className="space-y-3 m-2">
          <BackToSubmissions href={backHref} />
          <StateCard message="Invalid submission." error />
        </div>
      );
    }

    const { data: submission, error } = await supabase
      .from("submissions")
      .select(
  "id, language, passed, memory, runtime, createdAt, code, passedCases, totalCases, failedCase",
)
      .eq("id", numericSubmissionId)
      .eq("userId", user.id)
      .eq("problemId", problem.problemID)
      .maybeSingle();

    if (error) {
      return (
        <div className="space-y-3 m-2">
          <BackToSubmissions href={backHref} />
          <StateCard message={error.message} error />
        </div>
      );
    }

    if (!submission) {
      return (
        <div className="space-y-3 m-2">
          <BackToSubmissions href={backHref} />
          <StateCard message="Submission not found" />
        </div>
      );
    }

    return (
      <SubmissionDetail
        item={submission as SubmissionDetailRow}
        backHref={backHref}
      />
    );
  }

  const { data: submissions, error } = await supabase
    .from("submissions")
    .select(
      "id, language, passed, memory, runtime, createdAt, passedCases, totalCases",
    )
    .eq("userId", user.id)
    .eq("problemId", problem.problemID)
    .order("createdAt", { ascending: false });

  if (error) {
    return (
      <div className="space-y-3 m-2">
        <div className="text-lg font-bold">Submissions</div>
        <StateCard message={error.message} error />
      </div>
    );
  }

  return (
    <div className="space-y-4 m-2">
      <div className="text-lg font-bold">Submissions</div>

      {!submissions?.length ? (
        <StateCard message="No submissions to show." />
      ) : (
        <SubmissionsList
          problemSlug={problem.slug}
          submissions={submissions as SubmissionListRow[]}
        />
      )}
    </div>
  );
}