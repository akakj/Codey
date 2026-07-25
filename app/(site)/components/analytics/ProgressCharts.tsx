"use client";

import { useMemo, useState } from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  difficultyChartColor,
} from "@/lib/difficulty";

import EmptyChart from "./EmptyChart";
import type { DashboardAnalytics } from "./types";

interface ProgressChartsProps {
  analytics: DashboardAnalytics;
}

type TimeRange = "month" | "year";

const difficultyChartConfig = {
  solved: {
    label: "Problems solved",
  },
  easy: {
    label: "Easy",
    color: difficultyChartColor.Easy,
  },
  medium: {
    label: "Medium",
    color: difficultyChartColor.Medium,
  },
  hard: {
    label: "Hard",
    color: difficultyChartColor.Hard,
  },
} satisfies ChartConfig;

function isTimeRange(
  value: string,
): value is TimeRange {
  return value === "month" || value === "year";
}

export default function ProgressCharts({
  analytics,
}: ProgressChartsProps) {
  const [timeRange, setTimeRange] =
    useState<TimeRange>("month");

  const frequencyData =
    timeRange === "month"
      ? analytics.fourWeekData
      : analytics.twelveMonthData;

  const highestSubmissionCount = Math.max(
    0,
    ...frequencyData.map(
      ({ easy, medium, hard }) =>
        easy + medium + hard,
    ),
  );

  const yAxisMaximum =
    highestSubmissionCount === 0
      ? 5
      : Math.max(
          highestSubmissionCount + 1,
          Math.ceil(
            highestSubmissionCount * 1.15,
          ),
        );

  const solvedPieData = useMemo(
    () => [
      {
        difficulty: "easy",
        solved: analytics.solvedByDifficulty.Easy,
        fill: "var(--color-easy)",
      },
      {
        difficulty: "medium",
        solved: analytics.solvedByDifficulty.Medium,
        fill: "var(--color-medium)",
      },
      {
        difficulty: "hard",
        solved: analytics.solvedByDifficulty.Hard,
        fill: "var(--color-hard)",
      },
    ],
    [analytics.solvedByDifficulty],
  );

  return (
    <section className="grid gap-6 lg:grid-cols-5">
      <article className="rounded-xl border bg-card p-5 shadow-sm lg:col-span-2">
        <h2 className="text-lg font-semibold">
          Solved by difficulty
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Unique completed problems
        </p>

        {analytics.solvedProblems === 0 ? (
          <EmptyChart message="Successfully solve a problem to see your difficulty breakdown." />
        ) : (
          <ChartContainer
            config={difficultyChartConfig}
            className="mx-auto h-80 w-full max-w-md"
          >
            <PieChart accessibilityLayer>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    nameKey="difficulty"
                  />
                }
              />

              <Pie
                data={solvedPieData}
                dataKey="solved"
                nameKey="difficulty"
                innerRadius={70}
                outerRadius={105}
                strokeWidth={4}
              >
                <Label
                  content={({ viewBox }) => {
                    if (
                      !viewBox ||
                      !("cx" in viewBox) ||
                      !("cy" in viewBox)
                    ) {
                      return null;
                    }

                    const cx = Number(viewBox.cx);
                    const cy = Number(viewBox.cy);

                    if (
                      !Number.isFinite(cx) ||
                      !Number.isFinite(cy)
                    ) {
                      return null;
                    }

                    return (
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={cx}
                          y={cy - 6}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {analytics.solvedProblems}
                        </tspan>

                        <tspan
                          x={cx}
                          y={cy + 20}
                          className="fill-muted-foreground text-xs"
                        >
                          Solved
                        </tspan>
                      </text>
                    );
                  }}
                />
              </Pie>

              <ChartLegend
                content={
                  <ChartLegendContent
                    nameKey="difficulty"
                  />
                }
              />
            </PieChart>
          </ChartContainer>
        )}
      </article>

      <article className="rounded-xl border bg-card p-5 shadow-sm lg:col-span-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Submission frequency
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {timeRange === "month"
                ? "Submission attempts during the last four weeks"
                : "Submission attempts during the last twelve months."}
            </p>
          </div>

          <Tabs
            value={timeRange}
            onValueChange={(value) => {
              if (isTimeRange(value)) {
                setTimeRange(value);
              }
            }}
          >
            <TabsList className="grid w-full grid-cols-2 sm:w-55">
              <TabsTrigger value="month" className=" hover:cursor-pointer">
                Month
              </TabsTrigger>

              <TabsTrigger value="year" className=" hover:cursor-pointer">
                Year
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <ChartContainer
          config={difficultyChartConfig}
          className="mt-6 h-80 w-full"
        >
          <BarChart
            accessibilityLayer
            data={frequencyData}
            margin={{
              left: 0,
              right: 8,
            }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={12}
            />

            <YAxis
              domain={[0, yAxisMaximum]}
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              width={30}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent indicator="dot" />
              }
            />

            <ChartLegend
              content={<ChartLegendContent />}
            />

            <Bar
              dataKey="easy"
              stackId="submissions"
              fill="var(--color-easy)"
              radius={2}
            />

            <Bar
              dataKey="medium"
              stackId="submissions"
              fill="var(--color-medium)"
              radius={2}
            />

            <Bar
              dataKey="hard"
              stackId="submissions"
              fill="var(--color-hard)"
              radius={2}
            />
          </BarChart>
        </ChartContainer>
      </article>
    </section>
  );
}