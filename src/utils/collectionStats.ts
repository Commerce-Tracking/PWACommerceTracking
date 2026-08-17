/** Comptages renvoyés par GET /trade-flow/collections/counts/by-level */
export type CollectionLevelCounts = {
  submitted_by_collector: number;
  validated_by_team_manager: number;
  validated_by_supervisor: number;
  rejected_by_team_manager: number;
  rejected_by_supervisor: number;
  total_submitted: number;
  total_validated: number;
  total_rejected: number;
  period?: unknown;
};

export type RoleCollectionMetrics = {
  /** File d'attente (à traiter maintenant) */
  pending: number;
  /** Validées au niveau du rôle */
  validated: number;
  /** Rejetées au niveau du rôle */
  rejected: number;
  /** Décisions prises = validées + rejetées */
  processed: number;
  /** Périmètre = en attente + traitées */
  total: number;
};

function n(value: unknown): number {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : 0;
}

/**
 * Dérive des KPI cohérents (buckets disjoints) pour le dashboard.
 *
 * Hypothèse API (stocks courants par statut) :
 * - Chef d'équipe : pending = submitted, validated/rejected = niv.1
 * - Superviseur : pending = validées chef d'équipe en file niv.2,
 *   validated/rejected = décisions superviseur
 *
 * Garantie : total = pending + processed, processed = validated + rejected.
 */
export function deriveRoleCollectionMetrics(
  stats: CollectionLevelCounts,
  roleId: number | string | null | undefined
): RoleCollectionMetrics {
  const id = Number(roleId);

  if (id === 5) {
    const pending = n(stats.validated_by_team_manager);
    const validated = n(stats.validated_by_supervisor);
    const rejected = n(stats.rejected_by_supervisor);
    const processed = validated + rejected;
    return {
      pending,
      validated,
      rejected,
      processed,
      total: pending + processed,
    };
  }

  if (id === 4) {
    const pending = n(stats.submitted_by_collector);
    const validated = n(stats.validated_by_team_manager);
    const rejected = n(stats.rejected_by_team_manager);
    const processed = validated + rejected;
    return {
      pending,
      validated,
      rejected,
      processed,
      total: pending + processed,
    };
  }

  const pending = n(stats.total_submitted);
  const validated = n(stats.total_validated);
  const rejected = n(stats.total_rejected);
  const processed = validated + rejected;
  return {
    pending,
    validated,
    rejected,
    processed,
    total: pending + processed,
  };
}
