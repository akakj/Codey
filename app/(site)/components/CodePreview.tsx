import { CheckCircle2 } from "lucide-react";

export default function CodePreview() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:mx-0">
      <div
        aria-hidden="true"
        className="absolute -inset-8 rounded-full bg-blue-500/10 blur-3xl"
      />

      <div
        className="
          relative overflow-hidden rounded-xl
          border border-slate-200
          bg-white
          shadow-2xl shadow-slate-900/10
          dark:border-white/10
          dark:bg-[#161b22]
          dark:shadow-black/30
        "
      >
        <div
          className="
            flex h-11 items-center justify-between
            border-b border-slate-200
            bg-slate-50
            px-4
            dark:border-white/10
            dark:bg-[#161b22]
          "
        >
          <span className="font-mono text-xs text-slate-600 dark:text-gray-400">
            two-sum.py
          </span>
        </div>

        <div
          className="
            overflow-x-auto
            bg-white
            p-5
            font-mono text-sm leading-7
            text-slate-800
            sm:p-6
            dark:bg-[#161b22]
            dark:text-gray-300
          "
        >
          <p>
            <span className="text-purple-700 dark:text-purple-400">def</span>{" "}
            <span className="text-blue-700 dark:text-blue-400">two_sum</span>
            <span className="text-amber-700 dark:text-yellow-200">
              (nums, target):
            </span>
          </p>

          <p className="pl-5">seen = {"{}"}</p>

          <p className="pl-5">
            <span className="text-purple-700 dark:text-purple-400">for</span>{" "}
            index, value{" "}
            <span className="text-purple-700 dark:text-purple-400">in</span>{" "}
            enumerate(nums):
          </p>

          <p className="pl-10">difference = target - value</p>

          <p className="pl-10">
            <span className="text-purple-700 dark:text-purple-400">if</span>{" "}
            difference{" "}
            <span className="text-purple-700 dark:text-purple-400">in</span>{" "}
            seen:
          </p>

          <p className="pl-14">
            <span className="text-purple-700 dark:text-purple-400">return</span>{" "}
            [seen[difference], index]
          </p>

          <p className="pl-10">seen[value] = index</p>
        </div>

        <div
          className="
            border-t border-slate-200
            bg-slate-50
            p-4
            dark:border-white/10
            dark:bg-[#161b22]
          "
        >
          <div
            className="
              flex items-start gap-3 rounded-lg
              border border-green-700 dark:border-green-500/30
              bg-green-100 dark:bg-green-500/10
              p-3
            "
          >
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-800 dark:text-green-400" />

            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-400">
                Accepted
              </p>

              <p className="mt-1 font-mono text-xs text-slate-800 dark:text-gray-300">
                25 / 25 test cases passed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}