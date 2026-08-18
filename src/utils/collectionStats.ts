/** Comptages renvoyés par GET /trade-flow/collections/counts/by-level */
export type CollectionLevelCounts = {
  pending: number;
  validated: number;
  rejected: number;
  /** = pending + validated + rejected → dénominateur jauge */
  total: number;

  pending_team_manager: number;
  pending_supervisor: number;

  submitted_by_collector: number;
  validated_by_team_manager: number;
  validated_by_supervisor: number;
  rejected_by_team_manager: number;
  rejected_by_supervisor: number;

  /** Alias de total (jauge), plus le vieux « tous statuts hors draft » */
  total_submitted: number;
  /** Alias de validated (rôle) */
  total_validated: number;
  /** Alias de rejected (rôle) */
  total_rejected: number;

  period?: { start_date?: string; end_date?: string };
};

export type CountsByLevelQuery = {
  start_date?: string;
  end_date?: string;
};

export type RoleCollectionMetrics = {
  pending: number;
  validated: number;
  rejected: number;
  processed: number;
  total: number;
};

export const EMPTY_COLLECTION_COUNTS: CollectionLevelCounts = {
  pending: 0,
  validated: 0,
  rejected: 0,
  total: 0,
  pending_team_manager: 0,
  pending_supervisor: 0,
  submitted_by_collector: 0,
  validated_by_team_manager: 0,
  validated_by_supervisor: 0,
  rejected_by_team_manager: 0,
  rejected_by_supervisor: 0,
  total_submitted: 0,
  total_validated: 0,
  total_rejected: 0,
};

function n(value: unknown): number {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : 0;
}

/**
 * Board = file du rôle connecté (gateway).
 * Ne pas recalculer pending/validated/rejected à partir des champs N1/N2.
 */
export function mapBoardMetrics(
  stats: CollectionLevelCounts
): RoleCollectionMetrics {
  const pending = n(stats.pending);
  const validated = n(stats.validated);
  const rejected = n(stats.rejected);
  const total =
    n(stats.total) || pending + validated + rejected;
  const processed = validated + rejected;

  return {
    pending,
    validated,
    rejected,
    processed,
    total,
  };
}

/** Part traitée sur la file, plafonnée à 100 %. */
export function gaugeProcessedPercent(metrics: RoleCollectionMetrics): number {
  if (metrics.total <= 0) return 0;
  const raw = (metrics.processed / metrics.total) * 100;
  return Number(Math.min(100, Math.max(0, raw)).toFixed(1));
}

export function countsByLevelParams(
  query?: CountsByLevelQuery
): CountsByLevelQuery | undefined {
  if (!query) return undefined;
  const params: CountsByLevelQuery = {};
  if (query.start_date) params.start_date = query.start_date;
  if (query.end_date) params.end_date = query.end_date;
  return Object.keys(params).length ? params : undefined;
}
