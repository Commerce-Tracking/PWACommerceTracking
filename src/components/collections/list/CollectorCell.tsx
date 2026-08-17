type Props = {
  name?: string | null;
  className?: string;
};

/** Cellule collecteur : avatar initiale + nom. */
export default function CollectorCell({ name, className = "" }: Props) {
  const display = name?.trim() || "Non spécifié";
  const initial = display.charAt(0).toUpperCase();

  return (
    <div className={`flex min-w-0 items-center gap-3 ${className}`}>
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-brand-50 text-sm font-semibold text-brand-700 ring-1 ring-brand-200/60 dark:from-brand-500/20 dark:to-brand-500/5 dark:text-brand-300 dark:ring-brand-500/20"
        aria-hidden
      >
        {initial}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-gray-900 dark:text-white/90">
          {display}
        </p>
      </div>
    </div>
  );
}
