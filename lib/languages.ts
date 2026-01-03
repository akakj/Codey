export const LANGS = ["javascript", "python3", "java", "csharp"] as const;
export type Lang = (typeof LANGS)[number];

export const LANGS_VERSIONS: Record<Lang, string> = {
  javascript: "18.15.0",
  python3: "3.10.0",
  java: "15.0.2",
  csharp: "6.12.0",
};

export type StarterMap = Partial<Record<Lang, string>>;

// Preferred order for defaults (editor dropdown, etc.)
export const DEFAULT_ORDER: readonly Lang[] = ["javascript", "python3", "java", "csharp"] as const;

export const DISPLAY_NAME: Record<Lang, string> = { javascript: "JavaScript", python3: "Python 3", java: "Java", csharp: "C#", };

// Helpers
export function isLang(x: string): x is Lang {
  return (LANGS as readonly string[]).includes(x);
}

export function pickInitialLang(map: StarterMap, order: readonly Lang[] = DEFAULT_ORDER): Lang {
  return (order.find((l) => map[l]) ?? "javascript") as Lang;
}
