"use client";

import { useMemo } from "react";

import {
  Bar,
  BarChart,
  type BarShapeProps,
  CartesianGrid,
  Rectangle,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import { difficultyChartColor } from "@/lib/difficulty";

import EmptyChart from "./EmptyChart";
import { formatLanguage } from "./formatters";
import type { DashboardAnalytics } from "./types";

interface BreakdownChartsProps {
  analytics: DashboardAnalytics;
}

const acceptanceChartConfig = {
  acceptanceRate: {
    label: "Acceptance rate",
  },
} satisfies ChartConfig;

const languageDistributionConfig = {
  share: {
    label: "Submission share",
  },
} satisfies ChartConfig;

function formatTooltipPercentage(value: unknown): string {
  const numericValue = Number(value);

  return Number.isFinite(numericValue) ? `${numericValue.toFixed(1)}%` : "-";
}

export default function BreakdownCharts({ analytics }: BreakdownChartsProps) {
  const difficultyAcceptanceData = useMemo(
    () =>
      analytics.difficultyAcceptance.map((item) => ({
        ...item,
        acceptanceRate: item.acceptanceRate ?? 0,
        fill: difficultyChartColor[item.difficulty],
      })),
    [analytics.difficultyAcceptance],
  );

  const languageData = useMemo(
    () =>
      analytics.languageAnalytics.map((item, index) => ({
        ...item,
        label: formatLanguage(item.language),
        acceptanceRate: item.acceptanceRate ?? 0,
        fill: `var(--chart-${(index % 5) + 1})`,
      })),
    [analytics.languageAnalytics],
  );

  const hasDifficultySubmissions = analytics.difficultyAcceptance.some(
    (item) => item.submissions > 0,
  );

  const hasLanguageSubmissions = languageData.length > 0;

  const renderDifficultyBar = (props: BarShapeProps) => {
    const item = difficultyAcceptanceData[props.index];

    return <Rectangle {...props} fill={item?.fill ?? "var(--chart-1)"} />;
  };

  const renderLanguageBar = (props: BarShapeProps) => {
    const item = languageData[props.index];

    return <Rectangle {...props} fill={item?.fill ?? "var(--chart-1)"} />;
  };

  return (
    <section className="grid gap-6 lg:grid-cols-3">
      <article className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Acceptance rate by difficulty</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Successful attempts within each difficulty
        </p>

        {!hasDifficultySubmissions ? (
          <EmptyChart message="Make a submission to see acceptance rates by difficulty." />
        ) : (
          <ChartContainer
            config={acceptanceChartConfig}
            className="mt-5 h-70 w-full"
          >
            <BarChart
              accessibilityLayer
              data={difficultyAcceptanceData}
              layout="vertical"
              margin={{
                left: 8,
                right: 24,
              }}
            >
              <CartesianGrid horizontal={false} />

              <XAxis
                type="number"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                type="category"
                dataKey="difficulty"
                width={65}
                tickLine={false}
                axisLine={false}
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={formatTooltipPercentage}
                  />
                }
              />

              <Bar
                dataKey="acceptanceRate"
                radius={6}
                shape={renderDifficultyBar}
              />
            </BarChart>
          </ChartContainer>
        )}
      </article>

      <article className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Language distribution</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Share of submissions made in each language
        </p>

        {!hasLanguageSubmissions ? (
          <EmptyChart message="Make a submission to see your language distribution." />
        ) : (
          <ChartContainer
            config={languageDistributionConfig}
            className="mt-5 h-70 w-full"
          >
            <BarChart
              accessibilityLayer
              data={languageData}
              layout="vertical"
              margin={{
                left: 16,
                right: 24,
              }}
            >
              <CartesianGrid horizontal={false} />

              <XAxis
                type="number"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                type="category"
                dataKey="label"
                width={90}
                tickLine={false}
                axisLine={false}
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={formatTooltipPercentage}
                  />
                }
              />

              <Bar dataKey="share" radius={6} shape={renderLanguageBar} />
            </BarChart>
          </ChartContainer>
        )}
      </article>

      <article className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Acceptance rate by language</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Successful attempts within each language
        </p>

        {!hasLanguageSubmissions ? (
          <EmptyChart message="Make a submission to see acceptance rates by language." />
        ) : (
          <ChartContainer
            config={acceptanceChartConfig}
            className="mt-5 h-70 w-full"
          >
            <BarChart
              accessibilityLayer
              data={languageData}
              layout="vertical"
              margin={{
                left: 16,
                right: 24,
              }}
            >
              <CartesianGrid horizontal={false} />

              <XAxis
                type="number"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                type="category"
                dataKey="label"
                width={90}
                tickLine={false}
                axisLine={false}
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={formatTooltipPercentage}
                  />
                }
              />

              <Bar
                dataKey="acceptanceRate"
                radius={6}
                shape={renderLanguageBar}
              />
            </BarChart>
          </ChartContainer>
        )}
      </article>
    </section>
  );
}
