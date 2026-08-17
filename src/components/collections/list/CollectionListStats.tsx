type StatItem = {
  label: string;
  value: number | string;
  icon?: string;
  tone?: "default" | "warning" | "success" | "error" | "info";
};

type Props = {
  items: StatItem[];
  className?: string;
};

const TONE_ICON: Record<NonNullable<StatItem["tone"]>, string> = {
  default: "bg-gray-50 text-gray-500 dark:bg-white/5 dark:text-gray-400",
  warning: "bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400",
  success: "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400",
  error: "bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-400",
  info: "bg-info-50 text-info-700 dark:bg-info-500/15 dark:text-info-300",
};

/** Ligne de cartes KPI pour la liste des collectes. */
export default function CollectionListStats({
  items,
  className = "",
}: Props) {
  return (
    <div
      className={`grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5 ${className}`}
    >
      {items.map((item) => {
        const tone = item.tone || "default";
        return (
          <div
            key={item.label}
            className="rounded-2xl border border-gray-200/80 bg-white px-4 py-3.5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {item.label}
                </p>
                <p className="mt-1 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  {item.value}
                </p>
              </div>
              {item.icon && (
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${TONE_ICON[tone]}`}
                >
                  <i className={`pi ${item.icon} text-sm`} aria-hidden />
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
