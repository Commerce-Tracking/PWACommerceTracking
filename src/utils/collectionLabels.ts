/** Labels / enums centralisés pour les collectes digitalisées */

export type CollectionTypeFilter =
  | "all"
  | "livestock"
  | "agricultural"
  | "fishery"
  | "mixed";

export type CollectionType =
  | "livestock"
  | "agricultural"
  | "fishery"
  | "mixed";

export type ControlTimeType =
  | "5_min"
  | "10_min"
  | "15_min"
  | "20_min"
  | "25_min"
  | "30_min"
  | "35_min"
  | "40_min"
  | "45_min"
  | "50_min"
  | "55_min"
  | "60_min"
  | "plus_1_heure"
  | "2_heures"
  | "3_heures"
  | "4_heures"
  | "5_heures"
  | "6_heures"
  | "12_heures"
  | "24_heures"
  | "plus_24_heures";

export const COLLECTION_TYPE_LABELS: Record<CollectionType, string> = {
  livestock: "Bétail",
  agricultural: "Agricole",
  fishery: "Halieutique",
  mixed: "Mixte",
};

export const COLLECTION_TYPE_FILTER_OPTIONS: {
  value: CollectionTypeFilter;
  label: string;
}[] = [
  { value: "all", label: "Tous les types" },
  { value: "livestock", label: "Bétail" },
  { value: "agricultural", label: "Agricole" },
  { value: "fishery", label: "Halieutique" },
  { value: "mixed", label: "Mixte" },
];

export const CONTROL_TIME_LABELS: Record<ControlTimeType, string> = {
  "5_min": "5 min",
  "10_min": "10 min",
  "15_min": "15 min",
  "20_min": "20 min",
  "25_min": "25 min",
  "30_min": "30 min",
  "35_min": "35 min",
  "40_min": "40 min",
  "45_min": "45 min",
  "50_min": "50 min",
  "55_min": "55 min",
  "60_min": "60 min",
  plus_1_heure: "Plus de 1 heure",
  "2_heures": "2 heures",
  "3_heures": "3 heures",
  "4_heures": "4 heures",
  "5_heures": "5 heures",
  "6_heures": "6 heures",
  "12_heures": "12 heures",
  "24_heures": "24 heures",
  plus_24_heures: "Plus de 24 heures (Plus de 1 jour)",
};

export const TRADE_FLOW_LABELS: Record<string, string> = {
  import: "Import",
  export: "Export",
  transit: "Transit",
  domestic: "Domestic",
};

export const COLLECTION_CONTEXT_LABELS: Record<string, string> = {
  formal_border: "Frontière formelle",
  informal_border: "Frontière informelle",
  market: "Marché",
  formal: "Frontière formelle",
  informal: "Frontière informelle",
};

export const NOT_SPECIFIED = "Non renseigné";
export const DONT_KNOW = "Je ne sais pas";

export function getCollectionTypeLabel(
  type: string | null | undefined
): string {
  if (!type) return NOT_SPECIFIED;
  return COLLECTION_TYPE_LABELS[type as CollectionType] || type;
}

export function getControlTimeLabel(
  value: string | null | undefined
): string {
  if (value == null || value === "") return NOT_SPECIFIED;
  return CONTROL_TIME_LABELS[value as ControlTimeType] || value;
}

export function getTradeFlowLabel(value: string | null | undefined): string {
  if (!value) return NOT_SPECIFIED;
  return TRADE_FLOW_LABELS[value] || value;
}

export function getCollectionContextLabel(
  value: string | null | undefined
): string {
  if (!value) return NOT_SPECIFIED;
  return COLLECTION_CONTEXT_LABELS[value] || value;
}

/**
 * Booléens API (0/1/boolean/null) → Oui / Non / Non renseigné
 */
export function formatYesNo(
  value: boolean | number | string | null | undefined
): string {
  if (value === null || value === undefined || value === "") {
    return NOT_SPECIFIED;
  }
  if (value === true || value === 1 || value === "1" || value === "true") {
    return "Oui";
  }
  if (value === false || value === 0 || value === "0" || value === "false") {
    return "Non";
  }
  return NOT_SPECIFIED;
}

/**
 * Pays de provenance / destination produit : null = « Je ne sais pas »
 */
export function formatProductCountry(
  countryName: string | null | undefined,
  countryId: number | null | undefined
): string {
  if (countryName) return countryName;
  if (countryId == null) return DONT_KNOW;
  return `Pays #${countryId}`;
}

export function isCollectionTypeFilter(
  value: string | null
): value is CollectionTypeFilter {
  return (
    value === "all" ||
    value === "livestock" ||
    value === "agricultural" ||
    value === "fishery" ||
    value === "mixed"
  );
}

/** Produit végétal / halieutique (hors bétail) : afficher local_unit_weight_kg */
export function shouldShowLocalUnitWeightKg(
  collectionType: string | null | undefined,
  item?: { product?: unknown; animal?: unknown; animal_id?: number | null }
): boolean {
  if (collectionType === "agricultural" || collectionType === "fishery") {
    return true;
  }
  if (collectionType === "mixed") {
    const hasAnimal = Boolean(item?.animal || item?.animal_id);
    return Boolean(item?.product) && !hasAnimal;
  }
  return false;
}
