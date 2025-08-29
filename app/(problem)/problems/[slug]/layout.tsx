import { ReactNode } from "react";
import ProblemTopBar from "@/app/components/ProblemWorkspace/ProblemTopBar";

export default async function ProblemLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div>
      <ProblemTopBar currentSlug={slug} />
      <main className="pt-16 min-h-screen">{children}</main>
    </div>
  );
}
