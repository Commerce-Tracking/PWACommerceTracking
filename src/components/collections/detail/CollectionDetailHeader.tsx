import type { ReactNode } from "react";

type MetaItem = {
  label: string;
  value: ReactNode;
  icon?: string;
};

type Props = {
  title: string;
  badges?: ReactNode;
  meta: MetaItem[];
  className?: string;
};

/** Header moderne en haut de la page détail. */
export default function CollectionDetailHeader({
  title,
  badges,
  meta,
  className = "",
}: Props) {
  return (
    <header
      className={`rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm sm:p-6 dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">{badges}</div>
          <h1 className="mt-3 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl dark:text-white">
            {title}
          </h1>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {meta.map((item) => (
          <div
            key={item.label}
            className="flex items-start gap-3 rounded-xl bg-gray-50/80 px-3.5 py-3 dark:bg-white/[0.04]"
          >
            {item.icon && (
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm dark:bg-white/10 dark:text-gray-300">
                <i className={`pi ${item.icon} text-xs`} />
              </span>
            )}
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {item.label}
              </p>
              <div className="mt-0.5 truncate text-sm font-medium text-gray-900 dark:text-white/90">
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </header>
  );
}
