import type { Problem } from "@/lib/problem";

export default async function Submissions({ problem }: { problem: Problem }) {
  // Later: read session, fetch from DB
  // const session = await auth();
  // const submissions = await db.submission.findMany({ where: { userId: session.user.id, problemId: problem.problemID } });

  return (
    <div className="space-y-3 m-2">
      <div className="text-lg font-bold">
        Submissions
      </div>
      <div className="rounded-md border p-6">
        <p className="text-sm">No submissions to show.</p>
        <p className="text-xs text-muted-foreground mt-2">
          (This is a placeholder. Hook up your DB query here.)
        </p>
      </div>
    </div>
  );
}
