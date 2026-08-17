export type ActorNameFields = {
  first_name?: string | null;
  last_name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

export function formatActorName(
  actor: ActorNameFields | null | undefined,
  fallback = "Non spécifié"
): string {
  if (!actor) return fallback;
  const first = (actor.first_name ?? actor.firstName ?? "").trim();
  const last = (actor.last_name ?? actor.lastName ?? "").trim();
  const full = `${first} ${last}`.trim();
  return full || fallback;
}
