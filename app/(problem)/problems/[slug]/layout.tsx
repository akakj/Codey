import { ReactNode } from "react";
import { createClient } from "@/utils/supabase/server";
import ProblemTopBar from "@/app/components/ProblemWorkspace/ProblemTopBar";

export default async function ProblemLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { slug } = await params;
  return (
    <div>
      <ProblemTopBar currentSlug={slug} user={user} />
      <main className="pt-16 min-h-screen">{children}</main>
    </div>
  );
}
