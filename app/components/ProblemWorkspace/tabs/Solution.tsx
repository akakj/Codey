import type { Problem } from "@/lib/problem";
// You can swap this for a client editor later with next/dynamic({ ssr: false })

export default async function Solution({ problem }: { problem: Problem }) {
  // Later: read session, fetch user's saved note for this problem
  // const session = await auth();
  // const note = await db.note.findUnique({ where: { userId_problemId: { userId: session.user.id, problemId: problem.problemID } } });

  return (
    <div className="space-y-3 m-2">
      <div className="text-lg font-bold">Solution</div>

      <div className="rounded-md p-3">
        Submit your code at least once to see the solution
      </div>
    </div>
  );
}
