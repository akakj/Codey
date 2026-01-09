"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { FileText, History, Puzzle } from "lucide-react";

export default function TabsHeaderClient({
  initialTab,
}: {
  initialTab: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const value = search.get("tab") ?? initialTab ?? "description";

  // Measure the header’s width (works with the resizer)
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setCompact((prev) => (prev !== w < 360 ? w < 360 : prev));
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const onValueChange = (v: string) => {
    const params = new URLSearchParams(search);
    params.set("tab", v);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const triggerCls = cn(
    "inline-flex items-center justify-center gap-2",
    "flex-1 min-w-0 rounded-md px-3 py-1.5 text-xs sm:text-sm font-medium",
    "text-muted-foreground hover:text-foreground",
    "data-[state=active]:bg-background data-[state=active]:text-foreground"
  );

  return (
    <div ref={wrapRef} className="w-full min-w-0">
      <Tabs value={value} onValueChange={onValueChange} className="w-full">
        <TabsList
          className={cn(
            "w-full flex gap-1 p-1 rounded-lg",
            "bg-[#d7dae0cb] dark:bg-[#212631]",
            "overflow-hidden"
          )}
        >
          <TabsTrigger value="description" asChild className={triggerCls}>
            <Link
              href="?tab=description"
              replace
              scroll={false}
              aria-label="Description"
            >
              <FileText className="shrink-0" />
              {!compact && <span className="truncate">Description</span>}
            </Link>
          </TabsTrigger>

          <TabsTrigger value="submissions" asChild className={triggerCls}>
            <Link
              href="?tab=submissions"
              replace
              scroll={false}
              aria-label="Submissions"
            >
              <History className="shrink-0" />
              {!compact && <span className="truncate">Submissions</span>}
            </Link>
          </TabsTrigger>

          <TabsTrigger value="solutions" asChild className={triggerCls}>
            <Link
              href="?tab=solutions"
              replace
              scroll={false}
              aria-label="Solution"
            >
              <Puzzle className="shrink-0" />
              {!compact && <span className="truncate">Solution</span>}
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
