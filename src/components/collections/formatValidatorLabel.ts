import { formatActorName, type ActorNameFields } from "../../utils/actors";

export function formatValidatorLabel(
  validator: ActorNameFields | null | undefined
): string | null {
  if (!validator) return null;
  const name = formatActorName(validator, "");
  return name || null;
}

export function teamManagerActionLabel(
  result: string | null | undefined,
  validator: ActorNameFields | null | undefined,
  date?: string | null
): string {
  const who = formatValidatorLabel(validator);
  const when = date ? new Date(date).toLocaleDateString("fr-FR") : null;
  const action =
    result === "rejected"
      ? "Rejetée"
      : result === "approved"
        ? "Validée"
        : "Traitée";

  const by = who ? ` par ${who}` : " par chef d'équipe";
  const on = when ? ` le ${when}` : "";
  return `${action}${by}${on}`;
}
