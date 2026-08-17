type Props = {
  date: string | null | undefined;
  fallback?: string | null;
};

/** Date formatée : jour long + heure optionnelle. */
export default function CollectionDateCell({ date, fallback }: Props) {
  const raw = date || fallback;
  if (!raw) {
    return <span className="text-sm text-gray-500">—</span>;
  }

  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) {
    return <span className="text-sm text-gray-500">—</span>;
  }

  const dateLabel = d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const hasTime = d.getHours() !== 0 || d.getMinutes() !== 0 || d.getSeconds() !== 0;
  const timeLabel = hasTime
    ? d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div className="leading-tight">
      <p className="text-sm font-medium text-gray-900 dark:text-white/90">
        {dateLabel}
      </p>
      {timeLabel && (
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          {timeLabel}
        </p>
      )}
    </div>
  );
}
