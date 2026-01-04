import axios from "axios";
import { LANGS_VERSIONS, type Lang } from "@/lib/languages";
import type { EntryPoint } from "@/lib/problem";

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
  headers: { "Content-Type": "application/json" },
});

function toPistonLanguage(lang: Lang): string {
  return lang === "python3" ? "python" : lang;
}

// type required ofr java and c#
type ParamSpec = { name: string; type: string };

function splitTopLevelCommas(s: string): string[] {
  const out: string[] = [];
  let cur = "";
  let depthAngle = 0;

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "<") depthAngle++;
    else if (ch === ">") depthAngle = Math.max(0, depthAngle - 1);

    if (ch === "," && depthAngle === 0) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  if (cur.trim()) out.push(cur);
  return out;
}

function parseJavaParamsFromStarter(starter: string, methodName: string): ParamSpec[] {
  const re = new RegExp(`\\b${methodName}\\s*\\(([^)]*)\\)`, "m");
  const m = starter.match(re);
  if (!m) return [];
  const inside = m[1].trim();
  if (!inside) return [];

  return splitTopLevelCommas(inside).map((p) => {
    const part = p.trim();
    const mm = part.match(/(.+)\s+([A-Za-z_]\w*)$/);
    if (!mm) return { type: "Object", name: "arg" };
    return { type: mm[1].trim(), name: mm[2].trim() };
  });
}

function parseCSharpParamsFromStarter(starter: string, methodName: string): ParamSpec[] {
  const re = new RegExp(`\\b${methodName}\\s*\\(([^)]*)\\)`, "m");
  const m = starter.match(re);
  if (!m) return [];
  const inside = m[1].trim();
  if (!inside) return [];

  return splitTopLevelCommas(inside).map((p) => {
    const part = p.trim();
    const mm = part.match(/(.+)\s+([A-Za-z_]\w*)$/);
    if (!mm) return { type: "object", name: "arg" };
    return { type: mm[1].trim(), name: mm[2].trim() };
  });
}

// build args from testcase input
function buildArgsFromInput(input: any, params?: ParamSpec[]): any[] {
  // If input is { a:..., b:... } and we know param names, order by params.
  if (input && typeof input === "object" && !Array.isArray(input)) {
    if (params && params.length) return params.map((p) => input[p.name]);
    // fallback: JSON insertion order (usually same as in file)
    return Object.keys(input).map((k) => input[k]);
  }
  // single primitive/array
  return [input];
}

// Java/C# typed literal generation (extend over time) 
function javaExpr(v: any, type: string): string {
  const t = type.replace(/\s+/g, "");
  if (v === null || v === undefined) return "null";

  if (t === "int" || t === "Integer") return String(Number(v));
  if (t === "long" || t === "Long") return String(Number(v)) + "L";
  if (t === "double" || t === "Double") return String(Number(v));
  if (t === "boolean" || t === "Boolean") return v ? "true" : "false";
  if (t === "String") return JSON.stringify(String(v));
  if (t === "char") return `'${String(v)[0] ?? ""}'`;

  if (t === "int[]") {
    const arr = Array.isArray(v) ? v : [];
    return `new int[]{${arr.map((x) => String(Number(x))).join(",")}}`;
  }
  if (t === "String[]") {
    const arr = Array.isArray(v) ? v : [];
    return `new String[]{${arr.map((x) => JSON.stringify(String(x))).join(",")}}`;
  }
  if (t === "int[][]") {
    const outer = Array.isArray(v) ? v : [];
    const rows = outer.map((row: any) => {
      const r = Array.isArray(row) ? row : [];
      return `new int[]{${r.map((x: any) => String(Number(x))).join(",")}}`;
    });
    return `new int[][]{${rows.join(",")}}`;
  }

  const listMatch = t.match(/^List<(.*)>$/);
  if (listMatch) {
    const inner = listMatch[1];
    const arr = Array.isArray(v) ? v : [];
    const elems = arr.map((x) => javaExpr(x, inner)).join(",");
    return `java.util.Arrays.asList(${elems})`;
  }

  // fallback
  return "null";
}

function csExpr(v: any, type: string): string {
  const t = type.replace(/\s+/g, "");
  if (v === null || v === undefined) return "null";

  if (t === "int") return String(Number(v));
  if (t === "long") return String(Number(v)) + "L";
  if (t === "double" || t === "float") return String(Number(v));
  if (t === "bool" || t === "boolean") return v ? "true" : "false";
  if (t === "string") return JSON.stringify(String(v));
  if (t === "char") return `'${String(v)[0] ?? ""}'`;

  if (t === "int[]") {
    const arr = Array.isArray(v) ? v : [];
    return `new int[]{${arr.map((x) => String(Number(x))).join(",")}}`;
  }
  if (t === "string[]") {
    const arr = Array.isArray(v) ? v : [];
    return `new string[]{${arr.map((x) => JSON.stringify(String(x))).join(",")}}`;
  }

  const listMatch = t.match(/^(?:List|IList)<(.*)>$/);
  if (listMatch) {
    const inner = listMatch[1];
    const arr = Array.isArray(v) ? v : [];
    const elems = arr.map((x) => csExpr(x, inner)).join(",");
    return `new System.Collections.Generic.List<${inner}>{${elems}}`;
  }

  return "null";
}

/** ---------- inject into class body (Java/C#) ---------- */
function injectIntoClass(code: string, className: string, insert: string) {
  const re = new RegExp(`\\bclass\\s+${className}\\b`);
  const m = re.exec(code);
  if (!m) return null;

  const start = code.indexOf("{", m.index);
  if (start === -1) return null;

  let depth = 0;
  for (let i = start; i < code.length; i++) {
    const ch = code[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        return code.slice(0, i) + "\n" + insert + "\n" + code.slice(i);
      }
    }
  }
  return null;
}

function hasJavaMain(code: string) {
  return /public\s+static\s+void\s+main\s*\(/.test(code);
}
function hasCSharpMain(code: string) {
  return /\bstatic\s+void\s+Main\s*\(/.test(code);
}

/** ---------- build piston files (multi-arg support) ---------- */
function buildFiles(opts: {
  language: Lang;
  userCode: string;
  cases: { input: any }[];
  entryPoint?: EntryPoint;
  starterForLang?: string; // to parse param types for Java/C#
}) {
  const { language, userCode, cases, entryPoint, starterForLang } = opts;
  const safeCases = cases.length ? cases : [{ input: "" }];

  // PYTHON: no types needed; just spread args
  if (language === "python3") {
    if (!entryPoint) return [{ name: "main.py", content: userCode }];

    const argLists = safeCases.map((tc) => buildArgsFromInput(tc.input));
    const runner =
      entryPoint.kind === "method"
        ? `
from solution import ${entryPoint.className}
import json, traceback

tests = json.loads(${JSON.stringify(JSON.stringify(argLists))})

if __name__ == "__main__":
    sol = ${entryPoint.className}()
    for args in tests:
        try:
            res = getattr(sol, "${entryPoint.name}")(*args)
            if res is not None:
                print(res)
        except Exception:
            traceback.print_exc()
`
        : `
from solution import ${entryPoint.name} as entry_fn
import json, traceback

tests = json.loads(${JSON.stringify(JSON.stringify(argLists))})

if __name__ == "__main__":
    for args in tests:
        try:
            res = entry_fn(*args)
            if res is not None:
                print(res)
        except Exception:
            traceback.print_exc()
`;

    return [
      { name: "main.py", content: runner },
      { name: "solution.py", content: userCode },
    ];
  }

  // JAVASCRIPT: no types needed; just spread args
  if (language === "javascript") {
    if (!entryPoint) return [{ name: "main.js", content: userCode }];

    const argLists = safeCases.map((tc) => buildArgsFromInput(tc.input));
    if (entryPoint.kind === "function") {
      const exportShim = `\n\ntry { module.exports = { ${entryPoint.name} }; } catch (e) {}\n`;
      const runner = `
const { ${entryPoint.name} } = require("./solution");
const tests = ${JSON.stringify(argLists)};

for (const args of tests) {
  try {
    const res = ${entryPoint.name}(...args);
    if (res !== undefined) console.log(res);
  } catch (e) {
    console.error(e && e.stack ? e.stack : String(e));
  }
}
`;
      return [
        { name: "main.js", content: runner },
        { name: "solution.js", content: userCode + exportShim },
      ];
    } else {
      const exportShim = `\n\ntry { module.exports = { ${entryPoint.className}: ${entryPoint.className} }; } catch (e) {}\n`;
      const runner = `
const mod = require("./solution");
const tests = ${JSON.stringify(argLists)};

for (const args of tests) {
  try {
    const sol = new mod.${entryPoint.className}();
    const res = sol.${entryPoint.name}(...args);
    if (res !== undefined) console.log(res);
  } catch (e) {
    console.error(e && e.stack ? e.stack : String(e));
  }
}
`;
      return [
        { name: "main.js", content: runner },
        { name: "solution.js", content: userCode + exportShim },
      ];
    }
  }

  // JAVA: need types => parse from starter, then inject main into Solution
  if (language === "java") {
    if (!entryPoint || entryPoint.kind !== "method") {
      return [{ name: "Solution.java", content: userCode }];
    }
    if (hasJavaMain(userCode)) {
      return [{ name: "Solution.java", content: userCode }];
    }

    const params = starterForLang
      ? parseJavaParamsFromStarter(starterForLang, entryPoint.name)
      : [];

    const argLists = safeCases.map((tc) => buildArgsFromInput(tc.input, params));

    // generate per-case calls
    const callLines = argLists
      .slice(0, 2) // keep run snappy; change to more later
      .map((args, i) => {
        const exprs =
          params.length
            ? params.map((p, idx) => javaExpr(args[idx], p.type)).join(", ")
            : args.map((v) => javaExpr(v, "String")).join(", ");
        return `
      // Case ${i + 1}
      Object res${i} = sol.${entryPoint.name}(${exprs});
      if (res${i} != null) System.out.println(res${i});
`;
      })
      .join("\n");

    const mainInsert = `
  public static void main(String[] args) {
    ${entryPoint.className} sol = new ${entryPoint.className}();
    try {${callLines}
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
`;

    const injected = injectIntoClass(userCode, entryPoint.className, mainInsert);
    return [{ name: "Solution.java", content: injected ?? userCode }];
  }

  // C#: need types => parse from starter, then inject Main into Solution
  if (!entryPoint || entryPoint.kind !== "method") {
    return [{ name: "Program.cs", content: userCode }];
  }
  if (hasCSharpMain(userCode)) {
    return [{ name: "Program.cs", content: userCode }];
  }

  const params = starterForLang
    ? parseCSharpParamsFromStarter(starterForLang, entryPoint.name)
    : [];

  const argLists = safeCases.map((tc) => buildArgsFromInput(tc.input, params));

  const callLines = argLists
    .slice(0, 2)
    .map((args, i) => {
      const exprs =
        params.length
          ? params.map((p, idx) => csExpr(args[idx], p.type)).join(", ")
          : args.map((v) => csExpr(v, "string")).join(", ");
      return `
    // Case ${i + 1}
    var res${i} = sol.${entryPoint.name}(${exprs});
    if (res${i} != null) System.Console.WriteLine(res${i});
`;
    })
    .join("\n");

  const mainInsert = `
  public static void Main() {
    var sol = new ${entryPoint.className}();
    try {${callLines}
    } catch (System.Exception e) {
      System.Console.Error.WriteLine(e.ToString());
    }
  }
`;

  const injected = injectIntoClass(userCode, entryPoint.className, mainInsert);
  return [{ name: "Program.cs", content: injected ?? userCode }];
}

export async function executeCode(
  language: Lang,
  sourceCode: string,
  cases: { input: any; output?: any }[] = [],
  entryPoint?: EntryPoint,
  starterForLang?: string
) {
  const pistonLanguage = toPistonLanguage(language);
  const version = LANGS_VERSIONS[language];

  const files = buildFiles({
    language,
    userCode: sourceCode,
    cases,
    entryPoint,
    starterForLang,
  });

  const response = await API.post("/execute", {
    language: pistonLanguage,
    version,
    files,
    stdin: "",
  });

  return response.data;
}
