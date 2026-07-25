interface EmptyChartProps {
  message: string;
}

export default function EmptyChart({
  message,
}: EmptyChartProps) {
  return (
    <div className="flex h-70 items-center justify-center text-center">
      <p className="max-w-xs text-sm text-muted-foreground">
        {message}
      </p>
    </div>
  );
}