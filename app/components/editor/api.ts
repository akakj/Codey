import axios from "axios";
import { LANGS_VERSIONS, type Lang } from "@/lib/languages";
import type { EntryPoint } from "@/lib/problem";

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
  headers: { "Content-Type": "application/json" },
});

const RESULT_PREFIX = "@@RESULT@@";

function toPistonLanguage(lang: Lang): string {
  return lang === "python3" ? "python" : lang;
}

// type required for Java and C#
type ParamSpec = { name: string; type: string };

// split a comma-separated list at top level only (not inside <...>)
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
  if (input && typeof input === "object" && !Array.isArray(input)) {
    if (params && params.length) return params.map((p) => input[p.name]);
    return Object.keys(input).map((k) => input[k]);
  }
  return [input];
}

// Java typed literal generation (extend over time)
function javaExpr(v: any, type: string): string {
  const t = type.replace(/\s+/g, "");
  if (v === null || v === undefined) return "null";

  if (t === "int" || t === "Integer") return String(Number(v));
  if (t === "long" || t === "Long") return String(Number(v)) + "L";
  if (t === "double" || t === "Double") return String(Number(v));
  if (t === "boolean" || t === "Boolean") return v ? "true" : "false";
  if (t === "String") return JSON.stringify(String(v));
  if (t === "char") return `'${String(v)[0] ?? ""}'`;

  // --- 1D arrays ---
  if (t === "int[]") {
    const arr = Array.isArray(v) ? v : [];
    return `new int[]{${arr.map((x) => String(Number(x))).join(",")}}`;
  }
  if (t === "String[]") {
    const arr = Array.isArray(v) ? v : [];
    return `new String[]{${arr.map((x) => JSON.stringify(String(x))).join(",")}}`;
  }

  // --- 2D arrays ---
  if (t === "int[][]") {
    const outer = Array.isArray(v) ? v : [];
    const rows = outer.map((row: any) => {
      const r = Array.isArray(row) ? row : [];
      return `new int[]{${r.map((x: any) => String(Number(x))).join(",")}}`;
    });
    return `new int[][]{${rows.join(",")}}`;
  }
  if (t === "String[][]") {
    const outer = Array.isArray(v) ? v : [];
    const rows = outer.map((row: any) => {
      const r = Array.isArray(row) ? row : [];
      return `new String[]{${r.map((x: any) => JSON.stringify(String(x))).join(",")}}`;
    });
    return `new String[][]{${rows.join(",")}}`;
  }

  const integerLiteral = (x: any) =>
    x === null || x === undefined ? "null" : String(Number(x));

  // Linked List (ListNode)
  if (t === "ListNode") {
    const arr = Array.isArray(v) ? v : [];
    return `ListNode.fromArray(new Integer[]{${arr.map(integerLiteral).join(",")}})`;
  }

  // Binary Tree (TreeNode)
  if (t === "TreeNode") {
    const arr = Array.isArray(v) ? v : [];
    return `TreeNode.fromLevelOrder(new Integer[]{${arr.map(integerLiteral).join(",")}})`;
  }

  return JSON.stringify(v);
}

// C# typed literal generation (extend over time)
function csExpr(v: any, type: string): string {
  const t = type.replace(/\s+/g, "");
  if (v === null || v === undefined) return "null";

  if (t === "int") return String(Number(v));
  if (t === "long") return String(Number(v)) + "L";
  if (t === "double" || t === "float") return String(Number(v));
  if (t === "bool" || t === "boolean") return v ? "true" : "false";
  if (t === "string") return JSON.stringify(String(v));
  if (t === "char") return `'${String(v)[0] ?? ""}'`;

  // 1D arrays
  if (t === "int[]") {
    const arr = Array.isArray(v) ? v : [];
    return `new int[]{${arr.map((x) => String(Number(x))).join(",")}}`;
  }
  if (t === "string[]") {
    const arr = Array.isArray(v) ? v : [];
    return `new string[]{${arr.map((x) => JSON.stringify(String(x))).join(",")}}`;
  }

  // 2D arrays
  if (t === "int[][]") {
    const outer = Array.isArray(v) ? v : [];
    const rows = outer.map((row: any) => {
      const r = Array.isArray(row) ? row : [];
      return `new int[]{${r.map((x: any) => String(Number(x))).join(",")}}`;
    });
    return `new int[][]{${rows.join(",")}}`;
  }
  if (t === "string[][]") {
    const outer = Array.isArray(v) ? v : [];
    const rows = outer.map((row: any) => {
      const r = Array.isArray(row) ? row : [];
      return `new string[]{${r.map((x: any) => JSON.stringify(String(x))).join(",")}}`;
    });
    return `new string[][]{${rows.join(",")}}`;
  }

  const intNullableLiteral = (x: any) =>
    x === null || x === undefined ? "null" : String(Number(x));

  if (t === "ListNode") {
    const arr = Array.isArray(v) ? v : [];
    return `ListNode.FromArray(new int?[]{${arr.map(intNullableLiteral).join(",")}})`;
  }

  if (t === "TreeNode") {
    const arr = Array.isArray(v) ? v : [];
    return `TreeNode.FromLevelOrder(new int?[]{${arr.map(intNullableLiteral).join(",")}})`;
  }

  const listMatch = t.match(/^(?:List|IList)<(.*)>$/);
  if (listMatch) {
    const inner = listMatch[1];
    const arr = Array.isArray(v) ? v : [];
    const elems = arr.map((x) => csExpr(x, inner)).join(",");
    return `new System.Collections.Generic.List<${inner}>(){${elems}}`;
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

  // PYTHON
  if (language === "python3") {
    if (!entryPoint) return [{ name: "main.py", content: userCode }];

    const argLists = safeCases.map((tc) => buildArgsFromInput(tc.input));
    const runner =
      entryPoint.kind === "method"
        ? `
from solution import ${entryPoint.className}
import json, traceback

tests = json.loads(${JSON.stringify(JSON.stringify(argLists))})

def emit(obj):
    print("${RESULT_PREFIX}" + json.dumps(obj, ensure_ascii=False))

if __name__ == "__main__":
    sol = ${entryPoint.className}()
    for idx, args in enumerate(tests, start=1):
        try:
            res = getattr(sol, "${entryPoint.name}")(*args)
            out = "" if res is None else str(res)
            emit({"case": idx, "ok": True, "output": out})
        except Exception:
            emit({"case": idx, "ok": False, "error": traceback.format_exc()})
`
        : `
from solution import ${entryPoint.name} as entry_fn
import json, traceback

tests = json.loads(${JSON.stringify(JSON.stringify(argLists))})

def emit(obj):
    print("${RESULT_PREFIX}" + json.dumps(obj, ensure_ascii=False))

if __name__ == "__main__":
    for idx, args in enumerate(tests, start=1):
        try:
            res = entry_fn(*args)
            out = "" if res is None else str(res)
            emit({"case": idx, "ok": True, "output": out})
        except Exception:
            emit({"case": idx, "ok": False, "error": traceback.format_exc()})
`;

    return [
      { name: "main.py", content: runner },
      { name: "solution.py", content: userCode },
    ];
  }

  // JAVASCRIPT
  if (language === "javascript") {
    if (!entryPoint) return [{ name: "main.js", content: userCode }];

    const argLists = safeCases.map((tc) => buildArgsFromInput(tc.input));

    if (entryPoint.kind === "function") {
      const exportShim = `\n\ntry { module.exports = { ${entryPoint.name} }; } catch (e) {}\n`;
      const runner = `
const { ${entryPoint.name} } = require("./solution");
const tests = ${JSON.stringify(argLists)};

function emit(obj) {
  process.stdout.write(${JSON.stringify(RESULT_PREFIX)} + JSON.stringify(obj) + "\\n");
}

for (let i = 0; i < tests.length; i++) {
  const args = tests[i];
  try {
    const res = ${entryPoint.name}(...args);
    emit({
      case: i + 1,
      ok: true,
      outputJson: JSON.stringify(res),
      outputText: (res === undefined || res === null) ? "" : String(res),
    });
  } catch (e) {
    emit({ case: i + 1, ok: false, error: e && e.stack ? String(e.stack) : String(e) });
  }
}
`;
      return [
        { name: "main.js", content: runner },
        { name: "solution.js", content: userCode + exportShim },
      ];
    }

    // method
    const exportShim = `\n\ntry { module.exports = { ${entryPoint.className}: ${entryPoint.className} }; } catch (e) {}\n`;
    const runner = `
const mod = require("./solution");
const tests = ${JSON.stringify(argLists)};

function emit(obj) {
  process.stdout.write(${JSON.stringify(RESULT_PREFIX)} + JSON.stringify(obj) + "\\n");
}

for (let i = 0; i < tests.length; i++) {
  const args = tests[i];
  try {
    const sol = new mod.${entryPoint.className}();
    const res = sol.${entryPoint.name}(...args);
    emit({
      case: i + 1,
      ok: true,
      outputJson: JSON.stringify(res),
      outputText: (res === undefined || res === null) ? "" : String(res),
    });
  } catch (e) {
    emit({ case: i + 1, ok: false, error: e && e.stack ? String(e.stack) : String(e) });
  }
}
`;
    return [
      { name: "main.js", content: runner },
      { name: "solution.js", content: userCode + exportShim },
    ];
  }

  // JAVA
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

    const callLines = argLists
      .map((args, i) => {
        const exprs = params.length
          ? params.map((p, idx) => javaExpr(args[idx], p.type)).join(", ")
          : args.map((v) => javaExpr(v, "String")).join(", ");

        const caseNum = i + 1;

        return `
    try {
      Object res = sol.${entryPoint.name}(${exprs});
      String out = (res == null) ? "" : String.valueOf(res);
      System.out.println("${RESULT_PREFIX}" + "{\\"case\\":${caseNum},\\"ok\\":true,\\"output\\":\\"" + _esc(out) + "\\"}");
    } catch (Exception e) {
      System.out.println("${RESULT_PREFIX}" + "{\\"case\\":${caseNum},\\"ok\\":false,\\"error\\":\\"" + _esc(_stack(e)) + "\\"}");
    }
`;
      })
      .join("\n");

    const mainInsert = `
  private static String _esc(String s) {
    if (s == null) return "";
    return s
      .replace("\\\\", "\\\\\\\\")
      .replace("\\"", "\\\\\\"")
      .replace("\\n", "\\\\n")
      .replace("\\r", "\\\\r")
      .replace("\\t", "\\\\t");
  }

  private static String _stack(Exception e) {
    java.io.StringWriter sw = new java.io.StringWriter();
    java.io.PrintWriter pw = new java.io.PrintWriter(sw);
    e.printStackTrace(pw);
    return sw.toString();
  }

  public static void main(String[] args) {
    ${entryPoint.className} sol = new ${entryPoint.className}();
    ${callLines}
  }
`;

    const injected = injectIntoClass(userCode, entryPoint.className, mainInsert);
    return [{ name: "Solution.java", content: injected ?? userCode }];
  }

  // C#
  if (language === "csharp") {
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
      .map((args, i) => {
        const exprs =
          params.length
            ? params.map((p, idx) => csExpr(args[idx], p.type)).join(", ")
            : args.map((v) => csExpr(v, "string")).join(", ");

        const caseNum = i + 1;

        return `
    try {
      var res = sol.${entryPoint.name}(${exprs});
      var outStr = res == null ? "" : res.ToString();
      System.Console.WriteLine("${RESULT_PREFIX}" + "{\\"case\\":${caseNum},\\"ok\\":true,\\"output\\":\\"" + _esc(outStr) + "\\"}");
    } catch (System.Exception e) {
      System.Console.WriteLine("${RESULT_PREFIX}" + "{\\"case\\":${caseNum},\\"ok\\":false,\\"error\\":\\"" + _esc(e.ToString()) + "\\"}");
    }
`;
      })
      .join("\n");

    const mainInsert = `
  static string _esc(string s) {
    if (s == null) return "";
    return s
      .Replace("\\\\", "\\\\\\\\")
      .Replace("\\"", "\\\\\\"")
      .Replace("\\n", "\\\\n")
      .Replace("\\r", "\\\\r")
      .Replace("\\t", "\\\\t");
  }

  public static void Main() {
    var sol = new ${entryPoint.className}();
    ${callLines}
  }
`;

    const injected = injectIntoClass(userCode, entryPoint.className, mainInsert);
    return [{ name: "Program.cs", content: injected ?? userCode }];
  }

  // fallback
  return [{ name: "main.txt", content: userCode }];
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
