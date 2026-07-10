"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DISPLAY_NAME, type Lang } from "@/lib/languages";
import { MonacoCodeBlock } from "./MonacoCodeBlock";

export function SolutionCodeTabs({
  codeByLang,
  availableLangs,
  initialLang,
  fontSize,
  height
}: {
  codeByLang: Partial<Record<Lang, string>>;
  availableLangs: Lang[];
  initialLang: Lang;
  fontSize?: number;
  height?: number;
}) {
  const [lang, setLang] = useState<Lang>(initialLang);

  return (
    <Tabs value={lang} onValueChange={(v) => setLang(v as Lang)}>
      <TabsList className="flex flex-wrap h-auto">
        {availableLangs.map((l) => (
          <TabsTrigger key={l} value={l} className="cursor-pointer">
            {DISPLAY_NAME[l]}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value={lang} className="mt-3">
        <MonacoCodeBlock
          key={lang}
          code={codeByLang[lang] ?? ""}
          lang={lang}
          height={height}
          fontSize={fontSize}
        />
      </TabsContent>
    </Tabs>
  );
}