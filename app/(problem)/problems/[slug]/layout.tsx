import type { ReactNode } from "react";

import ProblemTopBar from "@/app/components/ProblemWorkspace/ProblemTopBar";
import { createClient } from "@/utils/supabase/server";

import { getUserProblemProgress } from "@/lib/getUserProblemProgress";

export const dynamic = "force-dynamic";

export default async function ProblemLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { user, completedProblemIds } =
    await getUserProblemProgress();

  const { slug } = await params;

  return (
    <div>
      <ProblemTopBar
        currentSlug={slug}
        user={user}
        completedProblemIds={completedProblemIds}
      />

      <main className="min-h-screen pt-16">
        {children}
      </main>
    </div>
  );
}