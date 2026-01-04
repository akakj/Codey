import axios from "axios";
import { LANGS_VERSIONS, type Lang } from "@/lib/languages";
import type { EntryPoint } from "@/lib/problem"; // add this type (shown below)

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
  headers: { "Content-Type": "application/json" },
});

function toPistonLanguage(lang: Lang): string {
  return lang === "python3" ? "python" : lang;
}

function extractSingleArg(input: any) {
  if (input && typeof input === "object" && !Array.isArray(input)) {
    const keys = Object.keys(input);
    if (keys.length === 1) return input[keys[0]];
  }
  return input;
}

// Helpers to detect if Java/C# code has its own main method
function hasJavaMain(code: string) {
  return /public\s+static\s+void\s+main\s*\(/.test(code);
}
function hasCSharpMain(code: string) {
  return /\bstatic\s+void\s+Main\s*\(/.test(code);
}

// insert main into Java class to call method tests
function injectIntoJavaClass(code: string, className: string, insert: string) {
  const classRe = new RegExp(`\\bclass\\s+${className}\\b`);
  const m = classRe.exec(code);
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
        // Insert right before the class closing brace
        return code.slice(0, i) + "\n" + insert + "\n" + code.slice(i);
      }
    }
  }
  return null;
}

// Build files for Piston execution based on language and entry point
function buildFiles(
  language: Lang,
  userCode: string,
  cases: { input: any }[],
  entryPoint?: EntryPoint
) {
  const args = cases.map((tc) => extractSingleArg(tc.input));
  const safeArgs = args.length ? args : [""];

  // -------- Python --------
  if (language === "python3") {
    if (!entryPoint) {
      return [{ name: "main.py", content: userCode }];
    }

    if (entryPoint.kind === "method") {
      const runner = `
from solution import ${entryPoint.className}
import json, traceback

if __name__ == "__main__":
    tests = json.loads(${JSON.stringify(JSON.stringify(safeArgs))})
    sol = ${entryPoint.className}()
    for x in tests:
        try:
            res = getattr(sol, "${entryPoint.name}")(x)
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

    const runner = `
import json, traceback
from solution import ${entryPoint.name} as entry_fn

if __name__ == "__main__":
    tests = json.loads(${JSON.stringify(JSON.stringify(safeArgs))})
    for x in tests:
        try:
            res = entry_fn(x)
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

  // -------- JavaScript --------
  if (language === "javascript") {
    if (!entryPoint) {
      return [{ name: "main.js", content: userCode }];
    }

    if (entryPoint.kind === "function") {
      const exportShim = `\n\ntry { module.exports = { ${entryPoint.name} }; } catch (e) {}\n`;
      const runner = `
const { ${entryPoint.name} } = require("./solution");
const tests = ${JSON.stringify(safeArgs)};

for (const x of tests) {
  try {
    const res = ${entryPoint.name}(x);
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

    const exportShim = `\n\ntry { module.exports = { ${entryPoint.className}: ${entryPoint.className} }; } catch (e) {}\n`;
    const runner = `
const mod = require("./solution");
const tests = ${JSON.stringify(safeArgs)};

for (const x of tests) {
  try {
    const sol = new mod.${entryPoint.className}();
    const res = sol.${entryPoint.name}(x);
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

  // -------- Java --------
  if (language === "java") {
  if (!entryPoint || entryPoint.kind !== "method") {
    // fallback: run raw
    return [{ name: "Solution.java", content: userCode }];
  }

  // If user already has main(), don't inject
  if (hasJavaMain(userCode)) {
    return [{ name: "Solution.java", content: userCode }];
  }

  const methodName = entryPoint.name;
  const className = entryPoint.className; // should be "Solution"
  const args = cases.map((tc) => extractSingleArg(tc.input));
  const safeArgs = args.length ? args : [""];

  // For now: strings only (your palindrome)
  const stringArgs = safeArgs.map((a) => JSON.stringify(String(a))).join(", ");

  const mainInsert = `
  public static void main(String[] args) {
    ${className} sol = new ${className}();
    String[] tests = new String[] { ${stringArgs} };
    for (String s : tests) {
      try {
        Object res = sol.${methodName}(s);
        if (res != null) System.out.println(res);
      } catch (Exception e) {
        e.printStackTrace();
      }
    }
  }
`;

  const injected = injectIntoJavaClass(userCode, className, mainInsert);

  return [{ name: "Solution.java", content: injected ?? userCode }];
}

  // -------- C# --------
  if (hasCSharpMain(userCode) || !entryPoint || entryPoint.kind !== "method") {
    return [{ name: "Program.cs", content: userCode }];
  }

  const methodName = entryPoint.name;
  const stringArgs = safeArgs.map((a) => JSON.stringify(String(a))).join(", ");

  const runner = `
public class Program {
  public static void Main() {
    var sol = new ${entryPoint.className}();
    var tests = new string[] { ${stringArgs} };
    foreach (var s in tests) {
      try {
        var res = sol.${methodName}(s);
        if (res != null) System.Console.WriteLine(res);
      } catch (System.Exception e) {
        System.Console.Error.WriteLine(e.ToString());
      }
    }
  }
}
`;
  return [
    { name: "Program.cs", content: runner },
    { name: "Solution.cs", content: userCode },
  ];
}

export async function executeCode(
  language: Lang,
  sourceCode: string,
  cases: { input: any; output?: any }[] = [],
  entryPoint?: EntryPoint
) {
  const pistonLanguage = toPistonLanguage(language);
  const version = LANGS_VERSIONS[language];

  const files = buildFiles(language, sourceCode, cases, entryPoint);

  const response = await API.post("/execute", {
    language: pistonLanguage,
    version,
    files,
    stdin: "",
    compile_timeout: 10000,
    run_timeout: 3000,
  });

  return response.data;
}
