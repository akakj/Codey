import type { Lang } from "@/lib/languages";
import type { EntryPoint, JsonValue, TestCase } from "@/lib/problem";

export const SUBMIT_RESULT_PREFIX = "@@SUBMIT_RESULT@@";

const PREVIEW_LIMIT = 8_000;

type ParamSpec = { name: string; type: string };
type JsonObject = Record<string, JsonValue>;

function isJsonObject(value: JsonValue): value is JsonObject {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function splitTopLevelCommas(value: string): string[] {
  const parts: string[] = [];
  let current = "";
  let angleDepth = 0;

  for (const character of value) {
    if (character === "<") angleDepth += 1;
    if (character === ">") angleDepth = Math.max(0, angleDepth - 1);

    if (character === "," && angleDepth === 0) {
      parts.push(current);
      current = "";
    } else {
      current += character;
    }
  }

  if (current.trim()) parts.push(current);
  return parts;
}

function parseParams(
  starter: string,
  methodName: string,
  fallbackType: string,
): ParamSpec[] {
  const match = starter.match(
    new RegExp(`\\b${methodName}\\s*\\(([^)]*)\\)`, "m"),
  );

  if (!match?.[1]?.trim()) return [];

  return splitTopLevelCommas(match[1]).map((parameter) => {
    const parameterMatch = parameter
      .trim()
      .match(/(.+)\s+([A-Za-z_]\w*)$/);

    return parameterMatch
      ? {
          type: parameterMatch[1].trim(),
          name: parameterMatch[2].trim(),
        }
      : { type: fallbackType, name: "arg" };
  });
}

function buildArgsFromInput(
  input: JsonValue,
  params?: ParamSpec[],
): JsonValue[] {
  if (!isJsonObject(input)) return [input];

  if (params?.length) {
    return params.map((parameter) => input[parameter.name] ?? null);
  }

  return Object.values(input);
}

function normalizeExpected(value: JsonValue): JsonValue {
  if (Array.isArray(value)) return value.map(normalizeExpected);

  if (isJsonObject(value)) {
    const normalized: JsonObject = {};

    for (const key of Object.keys(value).sort()) {
      normalized[key] = normalizeExpected(value[key]);
    }

    return normalized;
  }

  return value;
}

function canonicalExpected(value: JsonValue): string {
  return JSON.stringify(normalizeExpected(value)) ?? "null";
}

function expectedAsBase64(value: JsonValue): string {
  return Buffer.from(canonicalExpected(value), "utf8").toString("base64");
}

function javaExpr(value: JsonValue, type: string): string {
  const normalized = type.replace(/\s+/g, "");

  if (value === null || value === undefined) return "null";
  if (normalized === "int" || normalized === "Integer") {
    return String(Number(value));
  }
  if (normalized === "long" || normalized === "Long") {
    return `${Number(value)}L`;
  }
  if (normalized === "double" || normalized === "Double") {
    return String(Number(value));
  }
  if (normalized === "boolean" || normalized === "Boolean") {
    return value ? "true" : "false";
  }
  if (normalized === "String") return JSON.stringify(String(value));
  if (normalized === "char") return `'${String(value)[0] ?? ""}'`;

  if (normalized === "int[]") {
    const array = Array.isArray(value) ? value : [];
    return `new int[]{${array.map((item) => Number(item)).join(",")}}`;
  }

  if (normalized === "String[]") {
    const array = Array.isArray(value) ? value : [];
    return `new String[]{${array
      .map((item) => JSON.stringify(String(item)))
      .join(",")}}`;
  }

  if (normalized === "int[][]") {
    const rows = (Array.isArray(value) ? value : []).map((row) => {
      const array = Array.isArray(row) ? row : [];
      return `new int[]{${array.map((item) => Number(item)).join(",")}}`;
    });
    return `new int[][]{${rows.join(",")}}`;
  }

  if (normalized === "String[][]") {
    const rows = (Array.isArray(value) ? value : []).map((row) => {
      const array = Array.isArray(row) ? row : [];
      return `new String[]{${array
        .map((item) => JSON.stringify(String(item)))
        .join(",")}}`;
    });
    return `new String[][]{${rows.join(",")}}`;
  }

  const nullableInt = (item: JsonValue) =>
    item === null ? "null" : String(Number(item));

  if (normalized === "ListNode") {
    const array = Array.isArray(value) ? value : [];
    return `ListNode.fromArray(new Integer[]{${array
      .map(nullableInt)
      .join(",")}})`;
  }

  if (normalized === "TreeNode") {
    const array = Array.isArray(value) ? value : [];
    return `TreeNode.fromLevelOrder(new Integer[]{${array
      .map(nullableInt)
      .join(",")}})`;
  }

  return JSON.stringify(value) ?? "null";
}

function csharpExpr(value: JsonValue, type: string): string {
  const normalized = type.replace(/\s+/g, "");

  if (value === null || value === undefined) return "null";
  if (normalized === "int") return String(Number(value));
  if (normalized === "long") return `${Number(value)}L`;
  if (normalized === "double" || normalized === "float") {
    return String(Number(value));
  }
  if (normalized === "bool" || normalized === "boolean") {
    return value ? "true" : "false";
  }
  if (normalized === "string") return JSON.stringify(String(value));
  if (normalized === "char") return `'${String(value)[0] ?? ""}'`;

  if (normalized === "int[]") {
    const array = Array.isArray(value) ? value : [];
    return `new int[]{${array.map((item) => Number(item)).join(",")}}`;
  }

  if (normalized === "string[]") {
    const array = Array.isArray(value) ? value : [];
    return `new string[]{${array
      .map((item) => JSON.stringify(String(item)))
      .join(",")}}`;
  }

  if (normalized === "int[][]") {
    const rows = (Array.isArray(value) ? value : []).map((row) => {
      const array = Array.isArray(row) ? row : [];
      return `new int[]{${array.map((item) => Number(item)).join(",")}}`;
    });
    return `new int[][]{${rows.join(",")}}`;
  }

  if (normalized === "string[][]") {
    const rows = (Array.isArray(value) ? value : []).map((row) => {
      const array = Array.isArray(row) ? row : [];
      return `new string[]{${array
        .map((item) => JSON.stringify(String(item)))
        .join(",")}}`;
    });
    return `new string[][]{${rows.join(",")}}`;
  }

  const nullableInt = (item: JsonValue) =>
    item === null ? "null" : String(Number(item));

  if (normalized === "ListNode") {
    const array = Array.isArray(value) ? value : [];
    return `ListNode.FromArray(new int?[]{${array
      .map(nullableInt)
      .join(",")}})`;
  }

  if (normalized === "TreeNode") {
    const array = Array.isArray(value) ? value : [];
    return `TreeNode.FromLevelOrder(new int?[]{${array
      .map(nullableInt)
      .join(",")}})`;
  }

  const listMatch = normalized.match(/^(?:List|IList)<(.*)>$/);

  if (listMatch) {
    const innerType = listMatch[1] ?? "object";
    const array = Array.isArray(value) ? value : [];
    return `new System.Collections.Generic.List<${innerType}>(){${array
      .map((item) => csharpExpr(item, innerType))
      .join(",")}}`;
  }

  return "null";
}

function injectIntoClass(
  code: string,
  className: string,
  insertion: string,
): string | null {
  const classMatch = new RegExp(`\\bclass\\s+${className}\\b`).exec(code);
  if (!classMatch) return null;

  const start = code.indexOf("{", classMatch.index);
  if (start === -1) return null;

  let depth = 0;

  for (let index = start; index < code.length; index += 1) {
    if (code[index] === "{") depth += 1;
    if (code[index] === "}") depth -= 1;

    if (depth === 0) {
      return `${code.slice(0, index)}\n${insertion}\n${code.slice(index)}`;
    }
  }

  return null;
}

function ensurePublicJavaClass(code: string, className: string): string {
  const escaped = className.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  if (new RegExp(`\\bpublic\\s+class\\s+${escaped}\\b`).test(code)) {
    return code;
  }

  return code.replace(
    new RegExp(`\\bclass\\s+${escaped}\\b`),
    `public class ${className}`,
  );
}

function buildPython(options: {
  userCode: string;
  cases: TestCase[];
  entryPoint: EntryPoint;
}): string {
  const tests = options.cases.map((testCase) =>
    buildArgsFromInput(testCase.input),
  );
  const expected = options.cases.map((testCase) =>
    expectedAsBase64(testCase.expectedOutput),
  );

  const invoke =
    options.entryPoint.kind === "method"
      ? `__codey_solution = ${options.entryPoint.className}()\n            __codey_result = getattr(__codey_solution, ${JSON.stringify(options.entryPoint.name)})(*__codey_args)`
      : `__codey_result = ${options.entryPoint.name}(*__codey_args)`;

  return `
import sys as __codey_sys

__codey_original_stdout = __codey_sys.stdout

class __CodeyDiscard:
    def write(self, value):
        return len(value)
    def flush(self):
        pass

__codey_sys.stdout = __CodeyDiscard()

${options.userCode}

import base64 as __codey_base64
import collections as __codey_collections
import contextlib as __codey_contextlib
import json as __codey_json
import math as __codey_math
import traceback as __codey_traceback

__codey_sys.stdout = __codey_original_stdout
__codey_tests = __codey_json.loads(${JSON.stringify(JSON.stringify(tests))})
__codey_expected_b64 = __codey_json.loads(${JSON.stringify(
    JSON.stringify(expected),
  )})
__codey_limit = ${PREVIEW_LIMIT}


def __codey_normalize(value):
    if value is None or isinstance(value, (str, int, bool)):
        return value
    if isinstance(value, float):
        return value if __codey_math.isfinite(value) else None
    if isinstance(value, (list, tuple)):
        return [__codey_normalize(item) for item in value]
    if isinstance(value, dict):
        return {
            str(key): __codey_normalize(value[key])
            for key in sorted(value.keys(), key=lambda item: str(item))
        }

    has_value = hasattr(value, "val")
    has_next = hasattr(value, "next")
    has_left = hasattr(value, "left")
    has_right = hasattr(value, "right")

    if has_value and has_next and not has_left and not has_right:
        output = []
        seen = set()
        current = value

        while current is not None:
            identity = id(current)
            if identity in seen:
                raise ValueError("Cycle detected in ListNode output")
            seen.add(identity)
            output.append(__codey_normalize(current.val))
            current = current.next

        return output

    if has_value and (has_left or has_right):
        output = []
        queue = __codey_collections.deque([value])
        seen = set()

        while queue:
            current = queue.popleft()
            if current is None:
                output.append(None)
                continue

            identity = id(current)
            if identity in seen:
                raise ValueError("Cycle detected in TreeNode output")
            seen.add(identity)
            output.append(__codey_normalize(current.val))
            queue.append(getattr(current, "left", None))
            queue.append(getattr(current, "right", None))

        while output and output[-1] is None:
            output.pop()

        return output

    return str(value)


def __codey_canonical(value):
    return __codey_json.dumps(
        __codey_normalize(value),
        ensure_ascii=False,
        separators=(",", ":"),
        sort_keys=True,
        allow_nan=False,
    )


def __codey_decode(value):
    return __codey_base64.b64decode(value).decode("utf-8")


def __codey_encode(value):
    return __codey_base64.b64encode(value.encode("utf-8")).decode("ascii")


def __codey_preview(value):
    if len(value) <= __codey_limit:
        return value
    return (
        value[:__codey_limit]
        + "\\n...[truncated; original length: "
        + str(len(value))
        + " characters]"
    )


__codey_passed = 0
__codey_total = len(__codey_tests)

for __codey_index, __codey_args in enumerate(__codey_tests):
    __codey_expected = __codey_decode(__codey_expected_b64[__codey_index])

    try:
        with __codey_contextlib.redirect_stdout(__CodeyDiscard()), \\
             __codey_contextlib.redirect_stderr(__CodeyDiscard()):
            ${invoke}

        __codey_actual = __codey_canonical(__codey_result)

        if __codey_actual != __codey_expected:
            print(
                ${JSON.stringify(SUBMIT_RESULT_PREFIX)}
                + "F|"
                + str(__codey_passed)
                + "|"
                + str(__codey_total)
                + "|"
                + str(__codey_index + 1)
                + "|"
                + __codey_encode(__codey_preview(__codey_actual))
                + "|"
                + __codey_encode(__codey_preview(__codey_expected))
            )
            break

        __codey_passed += 1
    except Exception:
        print(
            ${JSON.stringify(SUBMIT_RESULT_PREFIX)}
            + "E|"
            + str(__codey_passed)
            + "|"
            + str(__codey_total)
            + "|"
            + str(__codey_index + 1)
            + "|"
            + __codey_encode(__codey_preview(__codey_traceback.format_exc()))
            + "|"
            + __codey_encode(__codey_preview(__codey_expected))
        )
        break
else:
    print(
        ${JSON.stringify(SUBMIT_RESULT_PREFIX)}
        + "A|"
        + str(__codey_passed)
        + "|"
        + str(__codey_total)
    )
`;
}

function buildJavaScript(options: {
  userCode: string;
  cases: TestCase[];
  entryPoint: EntryPoint;
}): string {
  const tests = options.cases.map((testCase) =>
    buildArgsFromInput(testCase.input),
  );
  const expected = options.cases.map((testCase) =>
    expectedAsBase64(testCase.expectedOutput),
  );

  const invoke =
    options.entryPoint.kind === "function"
      ? `__codeyResult = ${options.entryPoint.name}(...__codeyArgs);`
      : `const __codeySolution = new ${options.entryPoint.className}();\n      __codeyResult = __codeySolution.${options.entryPoint.name}(...__codeyArgs);`;

  return `
globalThis.__codeyOriginalWrite = process.stdout.write.bind(process.stdout);
globalThis.__codeyOriginalConsole = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
  debug: console.debug,
};
console.log = console.info = console.warn = console.error = console.debug = () => {};
process.stdout.write = () => true;

${options.userCode}

const __codeyTests = ${JSON.stringify(tests)};
const __codeyExpectedB64 = ${JSON.stringify(expected)};
const __codeyLimit = ${PREVIEW_LIMIT};

function __codeySuppress() {
  console.log = console.info = console.warn = console.error = console.debug = () => {};
  process.stdout.write = () => true;
}

function __codeyRestore() {
  Object.assign(console, globalThis.__codeyOriginalConsole);
  process.stdout.write = globalThis.__codeyOriginalWrite;
}

function __codeyNormalize(value, seen = new WeakSet()) {
  if (value === null || value === undefined) return null;
  if (typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "bigint") return value.toString();
  if (Array.isArray(value)) {
    return value.map((item) => __codeyNormalize(item, seen));
  }
  if (typeof value === "object") {
    const hasValue = "val" in value;
    const hasNext = "next" in value;
    const hasLeft = "left" in value;
    const hasRight = "right" in value;

    if (hasValue && hasNext && !hasLeft && !hasRight) {
      const output = [];
      const nodes = new WeakSet();
      let current = value;

      while (current !== null && current !== undefined) {
        if (nodes.has(current)) {
          throw new Error("Cycle detected in ListNode output");
        }
        nodes.add(current);
        output.push(__codeyNormalize(current.val));
        current = current.next;
      }

      return output;
    }

    if (hasValue && (hasLeft || hasRight)) {
      const output = [];
      const queue = [value];
      const nodes = new WeakSet();

      while (queue.length > 0) {
        const current = queue.shift();
        if (current === null || current === undefined) {
          output.push(null);
          continue;
        }
        if (nodes.has(current)) {
          throw new Error("Cycle detected in TreeNode output");
        }
        nodes.add(current);
        output.push(__codeyNormalize(current.val));
        queue.push(current.left ?? null);
        queue.push(current.right ?? null);
      }

      while (output.length > 0 && output[output.length - 1] === null) {
        output.pop();
      }

      return output;
    }

    if (seen.has(value)) throw new Error("Cycle detected in returned object");
    seen.add(value);
    const normalized = {};
    for (const key of Object.keys(value).sort()) {
      normalized[key] = __codeyNormalize(value[key], seen);
    }
    seen.delete(value);
    return normalized;
  }
  return String(value);
}

function __codeyCanonical(value) {
  return JSON.stringify(__codeyNormalize(value));
}

function __codeyDecode(value) {
  return Buffer.from(value, "base64").toString("utf8");
}

function __codeyEncode(value) {
  return Buffer.from(value, "utf8").toString("base64");
}

function __codeyPreview(value) {
  return value.length <= __codeyLimit
    ? value
    : value.slice(0, __codeyLimit) +
        "\\n...[truncated; original length: " +
        value.length +
        " characters]";
}

__codeyRestore();
let __codeyPassed = 0;

for (let __codeyIndex = 0; __codeyIndex < __codeyTests.length; __codeyIndex++) {
  const __codeyArgs = __codeyTests[__codeyIndex];
  const __codeyExpected = __codeyDecode(__codeyExpectedB64[__codeyIndex]);

  try {
    let __codeyResult;
    try {
      __codeySuppress();
      ${invoke}
    } finally {
      __codeyRestore();
    }

    const __codeyActual = __codeyCanonical(__codeyResult);

    if (__codeyActual !== __codeyExpected) {
      globalThis.__codeyOriginalWrite(
        ${JSON.stringify(SUBMIT_RESULT_PREFIX)} +
          "F|" +
          __codeyPassed +
          "|" +
          __codeyTests.length +
          "|" +
          (__codeyIndex + 1) +
          "|" +
          __codeyEncode(__codeyPreview(__codeyActual)) +
          "|" +
          __codeyEncode(__codeyPreview(__codeyExpected)) +
          "\\n",
      );
      break;
    }

    __codeyPassed++;
  } catch (error) {
    __codeyRestore();
    const __codeyError =
      error && error.stack ? String(error.stack) : String(error);

    globalThis.__codeyOriginalWrite(
      ${JSON.stringify(SUBMIT_RESULT_PREFIX)} +
        "E|" +
        __codeyPassed +
        "|" +
        __codeyTests.length +
        "|" +
        (__codeyIndex + 1) +
        "|" +
        __codeyEncode(__codeyPreview(__codeyError)) +
        "|" +
        __codeyEncode(__codeyPreview(__codeyExpected)) +
        "\\n",
    );
    break;
  }

  if (__codeyIndex === __codeyTests.length - 1) {
    globalThis.__codeyOriginalWrite(
      ${JSON.stringify(SUBMIT_RESULT_PREFIX)} +
        "A|" +
        __codeyPassed +
        "|" +
        __codeyTests.length +
        "\\n",
    );
  }
}
`;
}

function buildJava(options: {
  userCode: string;
  cases: TestCase[];
  entryPoint: Extract<EntryPoint, { kind: "method" }>;
  starterForLang?: string;
}): string {
  if (/public\s+static\s+void\s+main\s*\(/.test(options.userCode)) {
    throw new Error("Java submissions must not define their own main method");
  }

  const params = options.starterForLang
    ? parseParams(options.starterForLang, options.entryPoint.name, "Object")
    : [];
  const tests = options.cases.map((testCase) =>
    buildArgsFromInput(testCase.input, params),
  );
  const expected = options.cases.map((testCase) =>
    expectedAsBase64(testCase.expectedOutput),
  );

  const calls = tests
    .map((testArguments, index) => {
      const expressions = params.length
        ? params
            .map((parameter, parameterIndex) =>
              javaExpr(testArguments[parameterIndex], parameter.type),
            )
            .join(", ")
        : testArguments
            .map((value) => javaExpr(value, "String"))
            .join(", ");

      return String.raw`
    {
    String codeyExpected = _codeyDecode("${expected[index]}");
    try {
      Object codeyResult;
      try {
        System.setOut(codeyDiscardOut);
        codeyResult = codeySolution.${options.entryPoint.name}(${expressions});
      } finally {
        System.setOut(codeyJudgeOut);
      }

      String codeyActual = _codeyJson(codeyResult);
      if (!codeyActual.equals(codeyExpected)) {
        codeyJudgeOut.println(
          "${SUBMIT_RESULT_PREFIX}F|" + codeyPassed + "|${options.cases.length}|${index + 1}|" +
          _codeyB64(_codeyPreview(codeyActual)) + "|" +
          _codeyB64(_codeyPreview(codeyExpected))
        );
        return;
      }
      codeyPassed++;
    } catch (Throwable codeyError) {
      System.setOut(codeyJudgeOut);
      codeyJudgeOut.println(
        "${SUBMIT_RESULT_PREFIX}E|" + codeyPassed + "|${options.cases.length}|${index + 1}|" +
        _codeyB64(_codeyPreview(_codeyStack(codeyError))) + "|" +
        _codeyB64(_codeyPreview(codeyExpected))
      );
      return;
    }
    }
`;
    })
    .join("\n");

  const insertion = String.raw`
  private static final int _CODEY_LIMIT = ${PREVIEW_LIMIT};

  private static String _codeyEsc(String value) {
    if (value == null) return "";
    return value
      .replace("\\", "\\\\")
      .replace("\"", "\\\"")
      .replace("\n", "\\n")
      .replace("\r", "\\r")
      .replace("\t", "\\t")
      .replace("\b", "\\b")
      .replace("\f", "\\f");
  }

  private static String _codeyQuote(String value) {
    return "\"" + _codeyEsc(value == null ? "" : value) + "\"";
  }

  private static String _codeyNumber(Number value) {
    if (value instanceof Double || value instanceof Float) {
      double number = value.doubleValue();
      if (Double.isNaN(number) || Double.isInfinite(number)) return "null";
      return java.math.BigDecimal.valueOf(number)
        .stripTrailingZeros()
        .toPlainString();
    }
    if (value instanceof java.math.BigDecimal) {
      return ((java.math.BigDecimal) value)
        .stripTrailingZeros()
        .toPlainString();
    }
    return String.valueOf(value);
  }

  private static java.lang.reflect.Field _codeyField(
    Class<?> type,
    String name
  ) {
    Class<?> current = type;
    while (current != null) {
      try {
        java.lang.reflect.Field field = current.getDeclaredField(name);
        field.setAccessible(true);
        return field;
      } catch (NoSuchFieldException ignored) {
        current = current.getSuperclass();
      }
    }
    return null;
  }

  private static Object _codeyRead(
    Object value,
    java.lang.reflect.Field field
  ) {
    try {
      return field == null ? null : field.get(value);
    } catch (IllegalAccessException error) {
      throw new RuntimeException(error);
    }
  }

  private static String _codeyListNodeJson(
    Object value,
    java.lang.reflect.Field valueField,
    java.lang.reflect.Field nextField
  ) {
    java.util.List<String> items = new java.util.ArrayList<String>();
    java.util.Set<Object> seen = java.util.Collections.newSetFromMap(
      new java.util.IdentityHashMap<Object, Boolean>()
    );
    Object current = value;

    while (current != null) {
      if (!seen.add(current)) {
        throw new RuntimeException("Cycle detected in ListNode output");
      }
      items.add(_codeyJson(_codeyRead(current, valueField)));
      current = _codeyRead(current, nextField);
    }

    return "[" + String.join(",", items) + "]";
  }

  private static String _codeyTreeNodeJson(
    Object value,
    java.lang.reflect.Field valueField,
    java.lang.reflect.Field leftField,
    java.lang.reflect.Field rightField
  ) {
    java.util.List<Object> values = new java.util.ArrayList<Object>();
    java.util.LinkedList<Object> queue = new java.util.LinkedList<Object>();
    java.util.Set<Object> seen = java.util.Collections.newSetFromMap(
      new java.util.IdentityHashMap<Object, Boolean>()
    );
    queue.add(value);

    while (!queue.isEmpty()) {
      Object current = queue.removeFirst();
      if (current == null) {
        values.add(null);
        continue;
      }
      if (!seen.add(current)) {
        throw new RuntimeException("Cycle detected in TreeNode output");
      }
      values.add(_codeyRead(current, valueField));
      queue.add(_codeyRead(current, leftField));
      queue.add(_codeyRead(current, rightField));
    }

    while (!values.isEmpty() && values.get(values.size() - 1) == null) {
      values.remove(values.size() - 1);
    }

    java.util.List<String> items = new java.util.ArrayList<String>();
    for (Object item : values) items.add(_codeyJson(item));
    return "[" + String.join(",", items) + "]";
  }

  private static String _codeyJson(Object value) {
    if (value == null) return "null";
    if (value instanceof String || value instanceof Character) {
      return _codeyQuote(String.valueOf(value));
    }
    if (value instanceof Boolean) {
      return ((Boolean) value) ? "true" : "false";
    }
    if (value instanceof Number) return _codeyNumber((Number) value);

    Class<?> type = value.getClass();
    java.lang.reflect.Field valueField = _codeyField(type, "val");
    java.lang.reflect.Field nextField = _codeyField(type, "next");
    java.lang.reflect.Field leftField = _codeyField(type, "left");
    java.lang.reflect.Field rightField = _codeyField(type, "right");

    if (valueField != null && nextField != null && leftField == null && rightField == null) {
      return _codeyListNodeJson(value, valueField, nextField);
    }
    if (valueField != null && (leftField != null || rightField != null)) {
      return _codeyTreeNodeJson(value, valueField, leftField, rightField);
    }

    if (type.isArray()) {
      java.util.List<String> items = new java.util.ArrayList<String>();
      int length = java.lang.reflect.Array.getLength(value);
      for (int index = 0; index < length; index++) {
        items.add(_codeyJson(java.lang.reflect.Array.get(value, index)));
      }
      return "[" + String.join(",", items) + "]";
    }

    if (value instanceof java.util.Map<?, ?>) {
      java.util.TreeMap<String, Object> sorted = new java.util.TreeMap<String, Object>();
      for (java.util.Map.Entry<?, ?> entry : ((java.util.Map<?, ?>) value).entrySet()) {
        sorted.put(String.valueOf(entry.getKey()), entry.getValue());
      }
      java.util.List<String> entries = new java.util.ArrayList<String>();
      for (java.util.Map.Entry<String, Object> entry : sorted.entrySet()) {
        entries.add(_codeyQuote(entry.getKey()) + ":" + _codeyJson(entry.getValue()));
      }
      return "{" + String.join(",", entries) + "}";
    }

    if (value instanceof java.lang.Iterable<?>) {
      java.util.List<String> items = new java.util.ArrayList<String>();
      for (Object item : (java.lang.Iterable<?>) value) {
        items.add(_codeyJson(item));
      }
      return "[" + String.join(",", items) + "]";
    }

    return _codeyQuote(String.valueOf(value));
  }

  private static String _codeyDecode(String value) {
    return new String(
      java.util.Base64.getDecoder().decode(value),
      java.nio.charset.StandardCharsets.UTF_8
    );
  }

  private static String _codeyB64(String value) {
    return java.util.Base64.getEncoder().encodeToString(
      value.getBytes(java.nio.charset.StandardCharsets.UTF_8)
    );
  }

  private static String _codeyPreview(String value) {
    if (value.length() <= _CODEY_LIMIT) return value;
    return value.substring(0, _CODEY_LIMIT) +
      "\n...[truncated; original length: " + value.length() + " characters]";
  }

  private static String _codeyStack(Throwable error) {
    java.io.StringWriter writer = new java.io.StringWriter();
    java.io.PrintWriter printer = new java.io.PrintWriter(writer);
    error.printStackTrace(printer);
    printer.flush();
    return writer.toString();
  }

  private static java.io.PrintStream _codeyDiscardOut() {
    return new java.io.PrintStream(new java.io.OutputStream() {
      @Override
      public void write(int value) {
      }
    });
  }

  public static void main(String[] args) {
    java.io.PrintStream codeyJudgeOut = System.out;
    java.io.PrintStream codeyDiscardOut = _codeyDiscardOut();
    ${options.entryPoint.className} codeySolution;

    try {
      System.setOut(codeyDiscardOut);
      codeySolution = new ${options.entryPoint.className}();
    } catch (Throwable codeyError) {
      System.setOut(codeyJudgeOut);
      String codeyExpected = _codeyDecode("${expected[0]}");
      codeyJudgeOut.println(
        "${SUBMIT_RESULT_PREFIX}E|0|${options.cases.length}|1|" +
        _codeyB64(_codeyPreview(_codeyStack(codeyError))) + "|" +
        _codeyB64(_codeyPreview(codeyExpected))
      );
      return;
    } finally {
      System.setOut(codeyJudgeOut);
    }

    int codeyPassed = 0;
    ${calls}

    codeyJudgeOut.println(
      "${SUBMIT_RESULT_PREFIX}A|" + codeyPassed + "|${options.cases.length}"
    );
  }
`;

  const publicCode = ensurePublicJavaClass(
    options.userCode,
    options.entryPoint.className,
  );

  return (
    injectIntoClass(publicCode, options.entryPoint.className, insertion) ??
    publicCode
  );
}

function buildCSharp(options: {
  userCode: string;
  cases: TestCase[];
  entryPoint: Extract<EntryPoint, { kind: "method" }>;
  starterForLang?: string;
}): string {
  if (/\bstatic\s+void\s+Main\s*\(/.test(options.userCode)) {
    throw new Error("C# submissions must not define their own Main method");
  }

  const params = options.starterForLang
    ? parseParams(options.starterForLang, options.entryPoint.name, "object")
    : [];
  const tests = options.cases.map((testCase) =>
    buildArgsFromInput(testCase.input, params),
  );
  const expected = options.cases.map((testCase) =>
    expectedAsBase64(testCase.expectedOutput),
  );

  const calls = tests
    .map((testArguments, index) => {
      const expressions = params.length
        ? params
            .map((parameter, parameterIndex) =>
              csharpExpr(testArguments[parameterIndex], parameter.type),
            )
            .join(", ")
        : testArguments
            .map((value) => csharpExpr(value, "string"))
            .join(", ");

      return String.raw`
    {
    string codeyExpected = _codeyDecode("${expected[index]}");
    try {
      object codeyResult;
      try {
        System.Console.SetOut(codeyDiscardOut);
        codeyResult = codeySolution.${options.entryPoint.name}(${expressions});
      } finally {
        System.Console.SetOut(codeyJudgeOut);
      }

      string codeyActual = _codeyJson(codeyResult);
      if (!System.String.Equals(codeyActual, codeyExpected, System.StringComparison.Ordinal)) {
        codeyJudgeOut.WriteLine(
          "${SUBMIT_RESULT_PREFIX}F|" + codeyPassed + "|${options.cases.length}|${index + 1}|" +
          _codeyB64(_codeyPreview(codeyActual)) + "|" +
          _codeyB64(_codeyPreview(codeyExpected))
        );
        return;
      }
      codeyPassed++;
    } catch (System.Exception codeyError) {
      System.Console.SetOut(codeyJudgeOut);
      codeyJudgeOut.WriteLine(
        "${SUBMIT_RESULT_PREFIX}E|" + codeyPassed + "|${options.cases.length}|${index + 1}|" +
        _codeyB64(_codeyPreview(codeyError.ToString())) + "|" +
        _codeyB64(_codeyPreview(codeyExpected))
      );
      return;
    }
    }
`;
    })
    .join("\n");

  const insertion = String.raw`
  private const int _CODEY_LIMIT = ${PREVIEW_LIMIT};

  private static string _codeyEsc(string value) {
    if (value == null) return "";
    return value
      .Replace("\\", "\\\\")
      .Replace("\"", "\\\"")
      .Replace("\n", "\\n")
      .Replace("\r", "\\r")
      .Replace("\t", "\\t")
      .Replace("\b", "\\b")
      .Replace("\f", "\\f");
  }

  private static string _codeyQuote(string value) {
    return "\"" + _codeyEsc(value ?? "") + "\"";
  }

  private static bool _codeyIsNumber(object value) {
    return value is byte || value is sbyte || value is short || value is ushort ||
      value is int || value is uint || value is long || value is ulong ||
      value is float || value is double || value is decimal;
  }

  private static string _codeyNumber(object value) {
    var culture = System.Globalization.CultureInfo.InvariantCulture;
    if (value is double) {
      double number = (double) value;
      if (double.IsNaN(number) || double.IsInfinity(number)) return "null";
      return number == 0d ? "0" : number.ToString("R", culture);
    }
    if (value is float) {
      float number = (float) value;
      if (float.IsNaN(number) || float.IsInfinity(number)) return "null";
      return number == 0f ? "0" : number.ToString("R", culture);
    }
    if (value is decimal) return ((decimal) value).ToString("G29", culture);
    return System.Convert.ToString(value, culture);
  }

  private sealed class _CodeyReferenceComparer :
    System.Collections.Generic.IEqualityComparer<object> {
    public bool Equals(object first, object second) {
      return object.ReferenceEquals(first, second);
    }
    public int GetHashCode(object value) {
      return System.Runtime.CompilerServices.RuntimeHelpers.GetHashCode(value);
    }
  }

  private static object _codeyReadMember(
    object value,
    string name,
    out bool found
  ) {
    var type = value.GetType();
    while (type != null) {
      var field = type.GetField(
        name,
        System.Reflection.BindingFlags.Instance |
        System.Reflection.BindingFlags.Public |
        System.Reflection.BindingFlags.NonPublic
      );
      if (field != null) {
        found = true;
        return field.GetValue(value);
      }

      var property = type.GetProperty(
        name,
        System.Reflection.BindingFlags.Instance |
        System.Reflection.BindingFlags.Public |
        System.Reflection.BindingFlags.NonPublic
      );
      if (property != null && property.GetIndexParameters().Length == 0) {
        found = true;
        return property.GetValue(value, null);
      }

      type = type.BaseType;
    }

    found = false;
    return null;
  }

  private static string _codeyListNodeJson(object value) {
    var items = new System.Collections.Generic.List<string>();
    var seen = new System.Collections.Generic.HashSet<object>(
      new _CodeyReferenceComparer()
    );
    object current = value;

    while (current != null) {
      if (!seen.Add(current)) {
        throw new System.Exception("Cycle detected in ListNode output");
      }
      bool hasValue;
      bool hasNext;
      object nodeValue = _codeyReadMember(current, "val", out hasValue);
      object next = _codeyReadMember(current, "next", out hasNext);
      if (!hasValue || !hasNext) {
        throw new System.Exception("Invalid ListNode output");
      }
      items.Add(_codeyJson(nodeValue));
      current = next;
    }

    return "[" + string.Join(",", items) + "]";
  }

  private static string _codeyTreeNodeJson(object value) {
    var values = new System.Collections.Generic.List<object>();
    var queue = new System.Collections.Generic.Queue<object>();
    var seen = new System.Collections.Generic.HashSet<object>(
      new _CodeyReferenceComparer()
    );
    queue.Enqueue(value);

    while (queue.Count > 0) {
      object current = queue.Dequeue();
      if (current == null) {
        values.Add(null);
        continue;
      }
      if (!seen.Add(current)) {
        throw new System.Exception("Cycle detected in TreeNode output");
      }

      bool hasValue;
      bool hasLeft;
      bool hasRight;
      object nodeValue = _codeyReadMember(current, "val", out hasValue);
      object left = _codeyReadMember(current, "left", out hasLeft);
      object right = _codeyReadMember(current, "right", out hasRight);
      if (!hasValue || (!hasLeft && !hasRight)) {
        throw new System.Exception("Invalid TreeNode output");
      }

      values.Add(nodeValue);
      queue.Enqueue(hasLeft ? left : null);
      queue.Enqueue(hasRight ? right : null);
    }

    while (values.Count > 0 && values[values.Count - 1] == null) {
      values.RemoveAt(values.Count - 1);
    }

    var items = new System.Collections.Generic.List<string>();
    foreach (object item in values) items.Add(_codeyJson(item));
    return "[" + string.Join(",", items) + "]";
  }

  private static string _codeyJson(object value) {
    if (value == null) return "null";
    if (value is string || value is char) return _codeyQuote(value.ToString());
    if (value is bool) return ((bool) value) ? "true" : "false";
    if (_codeyIsNumber(value)) return _codeyNumber(value);

    bool hasValue;
    bool hasNext;
    bool hasLeft;
    bool hasRight;
    _codeyReadMember(value, "val", out hasValue);
    _codeyReadMember(value, "next", out hasNext);
    _codeyReadMember(value, "left", out hasLeft);
    _codeyReadMember(value, "right", out hasRight);

    if (hasValue && hasNext && !hasLeft && !hasRight) {
      return _codeyListNodeJson(value);
    }
    if (hasValue && (hasLeft || hasRight)) {
      return _codeyTreeNodeJson(value);
    }

    if (value is System.Collections.IDictionary) {
      var entries = new System.Collections.Generic.List<
        System.Collections.Generic.KeyValuePair<string, object>
      >();
      foreach (System.Collections.DictionaryEntry entry in (System.Collections.IDictionary) value) {
        entries.Add(new System.Collections.Generic.KeyValuePair<string, object>(
          entry.Key == null ? "" : entry.Key.ToString(),
          entry.Value
        ));
      }
      entries.Sort((first, second) =>
        System.StringComparer.Ordinal.Compare(first.Key, second.Key)
      );
      var serialized = new System.Collections.Generic.List<string>();
      foreach (var entry in entries) {
        serialized.Add(_codeyQuote(entry.Key) + ":" + _codeyJson(entry.Value));
      }
      return "{" + string.Join(",", serialized) + "}";
    }

    if (value is System.Collections.IEnumerable) {
      var items = new System.Collections.Generic.List<string>();
      foreach (object item in (System.Collections.IEnumerable) value) {
        items.Add(_codeyJson(item));
      }
      return "[" + string.Join(",", items) + "]";
    }

    return _codeyQuote(value.ToString());
  }

  private static string _codeyDecode(string value) {
    return System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(value));
  }

  private static string _codeyB64(string value) {
    return System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(value));
  }

  private static string _codeyPreview(string value) {
    if (value.Length <= _CODEY_LIMIT) return value;
    return value.Substring(0, _CODEY_LIMIT) +
      "\n...[truncated; original length: " + value.Length + " characters]";
  }

  public static void Main() {
    System.IO.TextWriter codeyJudgeOut = System.Console.Out;
    System.IO.TextWriter codeyDiscardOut = System.IO.TextWriter.Null;
    ${options.entryPoint.className} codeySolution;

    try {
      System.Console.SetOut(codeyDiscardOut);
      codeySolution = new ${options.entryPoint.className}();
    } catch (System.Exception codeyError) {
      System.Console.SetOut(codeyJudgeOut);
      string codeyExpected = _codeyDecode("${expected[0]}");
      codeyJudgeOut.WriteLine(
        "${SUBMIT_RESULT_PREFIX}E|0|${options.cases.length}|1|" +
        _codeyB64(_codeyPreview(codeyError.ToString())) + "|" +
        _codeyB64(_codeyPreview(codeyExpected))
      );
      return;
    } finally {
      System.Console.SetOut(codeyJudgeOut);
    }

    int codeyPassed = 0;
    ${calls}

    codeyJudgeOut.WriteLine(
      "${SUBMIT_RESULT_PREFIX}A|" + codeyPassed + "|${options.cases.length}"
    );
  }
`;

  return (
    injectIntoClass(
      options.userCode,
      options.entryPoint.className,
      insertion,
    ) ?? options.userCode
  );
}

export function buildSubmitJDoodleScript(options: {
  language: Lang;
  userCode: string;
  cases: TestCase[];
  entryPoint?: EntryPoint;
  starterForLang?: string;
}): string {
  const { language, userCode, cases, entryPoint, starterForLang } = options;

  if (!entryPoint) {
    throw new Error(`No entry point configured for ${language}`);
  }

  if (!cases.length) {
    throw new Error("No submission test cases were supplied");
  }

  if (language === "python3") {
    return buildPython({ userCode, cases, entryPoint });
  }

  if (language === "javascript") {
    return buildJavaScript({ userCode, cases, entryPoint });
  }

  if (language === "java") {
    if (entryPoint.kind !== "method") {
      throw new Error("Java submissions require a method entry point");
    }
    return buildJava({ userCode, cases, entryPoint, starterForLang });
  }

  if (language === "csharp") {
    if (entryPoint.kind !== "method") {
      throw new Error("C# submissions require a method entry point");
    }
    return buildCSharp({ userCode, cases, entryPoint, starterForLang });
  }

  throw new Error(`Unsupported language: ${language}`);
}