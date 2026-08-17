type TimelineStep = {
  label: string;
  date?: string | null;
  done: boolean;
  active?: boolean;
};

type Props = {
  steps: TimelineStep[];
  className?: string;
};

/** Timeline verticale création → soumission → validation. */
export default function CollectionTimeline({ steps, className = "" }: Props) {
  return (
    <ol className={`space-y-0 ${className}`}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <li key={step.label} className="relative flex gap-3 pb-5 last:pb-0">
            {!isLast && (
              <span
                className={`absolute left-[9px] top-5 h-[calc(100%-8px)] w-px ${
                  step.done
                    ? "bg-brand-400/60"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
                aria-hidden
              />
            )}
            <span
              className={`relative z-10 mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 ${
                step.done
                  ? "border-brand-500 bg-brand-500 text-white"
                  : step.active
                    ? "border-brand-500 bg-white dark:bg-gray-900"
                    : "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900"
              }`}
            >
              {step.done && <i className="pi pi-check text-[8px]" />}
            </span>
            <div className="min-w-0 pt-0">
              <p
                className={`text-sm font-medium ${
                  step.done || step.active
                    ? "text-gray-900 dark:text-white/90"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {step.label}
              </p>
              {step.date && (
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {step.date}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
