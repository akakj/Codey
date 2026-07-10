import Link from "next/link";
import type { SubmissionListRow } from "./submissionUtils";
import {
  formatDateShort,
  formatMemory,
  formatRuntime,
  statusClass,
  statusText,
} from "./submissionUtils";

export default function SubmissionsList({
  problemSlug,
  submissions,
}: {
  problemSlug: string;
  submissions: SubmissionListRow[];
}) {
  return (
    <div className="rounded-xl border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="p-3 text-left">Submission</th>
            <th className="p-3 text-left">Language</th>
            <th className="p-3 text-left">Runtime</th>
            <th className="p-3 text-left">Memory</th>
          </tr>
        </thead>

        <tbody>
          {submissions.map((submission) => {
            const href = `/problems/${problemSlug}?tab=submissions&submissionId=${submission.id}`;

            return (
              <tr
                key={submission.id}
                className="border-t hover:bg-muted/40 transition-colors"
              >
                <td className="p-3">
                  <Link href={href} className="block">
                    <div
                      className={`font-semibold ${statusClass(
                        submission.passed,
                      )}`}
                    >
                      {statusText(submission.passed)}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {formatDateShort(submission.createdAt)}
                    </div>
                  </Link>
                </td>

                <td className="p-3">
                  <Link href={href} className="block">
                    {submission.language}
                  </Link>
                </td>

                <td className="p-3">
                  <Link href={href} className="block">
                    {formatRuntime(submission.runtime)}
                  </Link>
                </td>

                <td className="p-3">
                  <Link href={href} className="block">
                    {formatMemory(submission.memory)}
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}