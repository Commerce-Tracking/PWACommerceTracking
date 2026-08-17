import { useState, type ReactNode } from "react";
import { useFieldReviewComments } from "./FieldReviewCommentsContext";

type FieldWithCommentProps = {
  fieldKey: string;
  label: string;
  children: ReactNode;
  className?: string;
};

/**
 * Affiche une valeur de champ + (en mode revue) une zone de commentaire optionnelle.
 * Les commentaires sont agrégés dans le motif de rejet via le contexte.
 */
export default function FieldWithComment({
  fieldKey,
  label,
  children,
  className = "",
}: FieldWithCommentProps) {
  const { enabled, getComment, setComment } = useFieldReviewComments();
  const [open, setOpen] = useState(false);
  const current = getComment(fieldKey);
  const hasComment = Boolean(current.trim());

  if (!enabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative group ${className}`}>
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">{children}</div>
        <button
          type="button"
          title={hasComment ? "Modifier le commentaire" : "Commenter ce champ"}
          aria-label={`Commenter ${label}`}
          onClick={() => setOpen((v) => !v)}
          className={`mt-0.5 shrink-0 rounded p-1 text-sm transition-colors ${
            hasComment
              ? "text-amber-600 bg-amber-50 hover:bg-amber-100"
              : "text-gray-400 hover:text-brand-500 hover:bg-gray-100"
          }`}
        >
          <i className={`pi ${hasComment ? "pi-comment" : "pi-plus-circle"}`} />
        </button>
      </div>
      {(open || hasComment) && (
        <div className="mt-2 ml-0">
          <label className="block text-xs font-medium text-amber-700 dark:text-amber-400 mb-1">
            Commentaire — {label}
          </label>
          <textarea
            value={current}
            onChange={(e) => setComment(fieldKey, label, e.target.value)}
            rows={2}
            placeholder="Indiquer la correction attendue…"
            className="w-full p-2 text-sm border border-amber-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-800 dark:border-amber-700 dark:text-white"
          />
        </div>
      )}
    </div>
  );
}
