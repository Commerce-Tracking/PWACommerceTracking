type StatusTone = "success" | "warning" | "error" | "info" | "neutral";

type Props = {
  tone: StatusTone;
  label: string;
  className?: string;
};

const TONE_STYLES: Record<StatusTone, { wrap: string; icon: string }> = {
  success: {
    wrap: "bg-success-50 text-success-700 ring-success-200/70 dark:bg-success-500/15 dark:text-success-400 dark:ring-success-500/20",
    icon: "pi-check-circle",
  },
  warning: {
    wrap: "bg-warning-50 text-warning-800 ring-warning-200/70 dark:bg-warning-500/15 dark:text-warning-400 dark:ring-warning-500/20",
    icon: "pi-clock",
  },
  error: {
    wrap: "bg-error-50 text-error-700 ring-error-200/70 dark:bg-error-500/15 dark:text-error-400 dark:ring-error-500/20",
    icon: "pi-times-circle",
  },
  info: {
    wrap: "bg-info-50 text-info-700 ring-info-200/70 dark:bg-info-500/15 dark:text-info-300 dark:ring-info-500/20",
    icon: "pi-info-circle",
  },
  neutral: {
    wrap: "bg-gray-100 text-gray-700 ring-gray-200/80 dark:bg-white/10 dark:text-gray-300 dark:ring-white/10",
    icon: "pi-circle",
  },
};

/** Badge statut moderne avec icône — purement présentationnel. */
export default function CollectionListStatusBadge({
  tone,
  label,
  className = "",
}: Props) {
  const styles = TONE_STYLES[tone] || TONE_STYLES.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${styles.wrap} ${className}`}
    >
      <i className={`pi ${styles.icon} text-[10px]`} aria-hidden />
      {label}
    </span>
  );
}

export function statusToneFromKey(status: string): StatusTone {
  switch (status) {
    case "validated":
    case "approved":
      return "success";
    case "submitted":
    case "pending":
      return "warning";
    case "rejected":
      return "error";
    case "draft":
      return "neutral";
    default:
      return "info";
  }
}
