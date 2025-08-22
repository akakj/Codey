import type { Problem } from "@/lib/problem";
// You can swap this for a client editor later with next/dynamic({ ssr: false })

export default async function Notes({ problem }: { problem: Problem }) {
  // Later: read session, fetch user's saved note for this problem
  // const session = await auth();
  // const note = await db.note.findUnique({ where: { userId_problemId: { userId: session.user.id, problemId: problem.problemID } } });

  return (
    <div className="space-y-3 m-2">
      <div className="text-lg font-bold">
        Notes
      </div>

      <div className="rounded-md border p-3">
        {/* Placeholder textarea just to show layout */}
        <textarea
          className="w-full h-56 resize-y rounded-md border bg-background p-3 outline-none"
          placeholder="Write your notes here… (placeholder; wire a client editor later)"
          defaultValue=""
        />
      </div>
    </div>
  );
}
