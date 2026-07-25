import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: ReactNode;
  description: string;
}

export default function MetricCard({
  label,
  value,
  description,
}: MetricCardProps) {
  return (
    <article className="rounded-xl border bg-card p-5 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">
        {label}
      </p>

      <div className="mt-2 text-2xl font-semibold tabular-nums">
        {value}
      </div>

      <p className="mt-2 text-sm text-muted-foreground">
        {description}
      </p>
    </article>
  );
}