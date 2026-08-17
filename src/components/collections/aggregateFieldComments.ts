export type FieldCommentMap = Record<string, { label: string; comment: string }>;

/**
 * Agrège les commentaires champ par champ + un motif libre éventuel
 * dans une seule chaîne destinée à `rejection_reason` / `reason`.
 */
export function aggregateFieldComments(
  comments: FieldCommentMap,
  freeText?: string
): string {
  const lines = Object.values(comments)
    .filter((entry) => entry.comment?.trim())
    .map((entry) => `[${entry.label}]: ${entry.comment.trim()}`);

  const free = freeText?.trim();
  if (free) {
    lines.push(free);
  }

  return lines.join("\n");
}

export function hasAnyFieldComment(comments: FieldCommentMap): boolean {
  return Object.values(comments).some((entry) => entry.comment?.trim());
}
