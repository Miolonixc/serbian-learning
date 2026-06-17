interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
}

export default function ProgressBar({ current, total, showLabel = true }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-sm text-slate-500 mb-1">
          <span>{current} из {total}</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
