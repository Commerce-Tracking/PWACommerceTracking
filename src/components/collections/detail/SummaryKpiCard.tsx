import type { ReactNode } from "react";

type SummaryKpiCardProps = {
  label: string;
  value: ReactNode;
  icon?: string;
  className?: string;
};

/** Petite carte KPI compacte sous le header. */
export default function SummaryKpiCard({
  label,
  value,
  icon,
  className = "",
}: SummaryKpiCardProps) {
  return (
    <div
      className={`rounded-2xl border border-gray-200/80 bg-white px-4 py-3.5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {label}
          </p>
          <div className="mt-1 truncate text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
            {value}
          </div>
        </div>
        {icon && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-500 dark:bg-white/5 dark:text-gray-400">
            <i className={`pi ${icon} text-sm`} />
          </span>
        )}
      </div>
    </div>
  );
}
