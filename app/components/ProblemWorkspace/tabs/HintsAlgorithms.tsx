"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Tag, Lightbulb } from "lucide-react";

export default function HintsAlgorithms({
  algorithms = [],
  hints = [],
}: {
  algorithms?: string[];
  hints?: string[];
}) {
  if (!algorithms.length && !hints.length) return null;

  return (
    <div className="mt-6">
      <Accordion type="multiple" className="space-y-4">
        {algorithms.length > 0 && (
          <AccordionItem
            value="algorithms"
            className="rounded-xl border bg-muted/10 dark:bg-muted/20"
          >
            <AccordionTrigger className="px-3 py-2 hover:no-underline cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span className="font-semibold">Algorithms</span>
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3">
              <div className="flex flex-wrap gap-2">
                {algorithms.map((t, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-xs"
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {hints.map((h, i) => (
          <AccordionItem
            key={i}
            value={`hint-${i}`}
            className="rounded-xl border bg-muted/10 dark:bg-muted/20"
          >
            <AccordionTrigger className="px-3 py-2 hover:no-underline cursor-pointer">
              <span className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-300" aria-hidden="true" />
                <span className="font-semibold">Hint {i + 1}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3">
              <div className="max-w-none">
                <p>{h}</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
