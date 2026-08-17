import type { ReactNode } from "react";

type DetailSectionProps = {
  title: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
};

/** Carte section moderne pour la page détail collecte. */
export default function DetailSection({
  title,
  children,
  className = "",
  action,
  collapsible = false,
  defaultOpen = true,
}: DetailSectionProps) {
  const header = (
    <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white/90">
        {title}
      </h3>
      {action}
    </div>
  );

  const body = (
    <div className="border-t border-gray-100 px-5 py-5 sm:px-6 dark:border-gray-800">
      {children}
    </div>
  );

  if (collapsible) {
    return (
      <details
        defaultOpen={defaultOpen}
        className={`group rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
      >
        <summary className="cursor-pointer list-none rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60 focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
          <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white/90">
              {title}
            </h3>
            <div className="flex items-center gap-3">
              {action}
              <i className="pi pi-chevron-down text-xs text-gray-400 transition-transform group-open:rotate-180" aria-hidden />
            </div>
          </div>
        </summary>
        {body}
      </details>
    );
  }

  return (
    <section
      className={`rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {header}
      {body}
    </section>
  );
}
