import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";

type QualityMetrics = {
  sampleSize: number;
  withControlsPct: number | null;
  withIllegalFeesPct: number | null;
  knowsCommunityPct: number | null;
  knowsNationalPct: number | null;
  driverInspectionPct: number | null;
  driverRegistrationPct: number | null;
  driverInsurancePct: number | null;
  driverLicensePct: number | null;
  driverOtherDocsPct: number | null;
};

const SAMPLE_LIMIT = 50;

function pct(yes: number, total: number): number | null {
  if (total <= 0) return null;
  return Math.round((yes / total) * 100);
}

function MetricRow({
  label,
  value,
}: {
  label: string;
  value: number | null;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      <span className="text-sm font-semibold text-gray-800 dark:text-white/90">
        {value == null ? "N/D" : `${value} %`}
      </span>
    </div>
  );
}

/**
 * Qualité & conformité (Proposition B.1–B.4) calculée sur un échantillon
 * de collectes soumises — sans endpoint stats dédié côté backend.
 */
export default function CollectionQualityMetrics() {
  const [metrics, setMetrics] = useState<QualityMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSample = async () => {
      try {
        const res = await axiosInstance.get("/trade-flow/agents/collections", {
          params: { page: "1", limit: String(SAMPLE_LIMIT) },
        });

        if (!res.data.success) {
          setError("Impossible de charger l'échantillon");
          return;
        }

        const raw = res.data.result;
        const collections: any[] = Array.isArray(raw)
          ? raw
          : raw?.data || [];

        let withControls = 0;
        let withIllegalFees = 0;
        let knowsCommunity = 0;
        let knowsNational = 0;
        let communityAnswered = 0;
        let nationalAnswered = 0;
        let driverInspection = 0;
        let driverRegistration = 0;
        let driverInsurance = 0;
        let driverLicense = 0;
        let driverOther = 0;
        let driverInspectionAnswered = 0;
        let driverRegistrationAnswered = 0;
        let driverInsuranceAnswered = 0;
        let driverLicenseAnswered = 0;
        let driverOtherAnswered = 0;

        collections.forEach((c) => {
          const hasControls =
            c.has_control_posts === 1 ||
            c.has_control_posts === true ||
            (Array.isArray(c.collectionControls) &&
              c.collectionControls.length > 0);
          if (hasControls) withControls += 1;

          const illegal =
            c.illegal_fees_paid === 1 ||
            c.illegal_fees_paid === true ||
            c.illegal_fees_paid === "yes" ||
            (Array.isArray(c.collectionControls) &&
              c.collectionControls.some(
                (ctrl: any) =>
                  ctrl.illegal_fees_paid === 1 ||
                  ctrl.illegal_fees_paid === true
              ));
          if (illegal) withIllegalFees += 1;

          if (
            c.knows_community_regulations !== null &&
            c.knows_community_regulations !== undefined
          ) {
            communityAnswered += 1;
            if (
              c.knows_community_regulations === 1 ||
              c.knows_community_regulations === true
            ) {
              knowsCommunity += 1;
            }
          }
          if (
            c.knows_national_regulations !== null &&
            c.knows_national_regulations !== undefined
          ) {
            nationalAnswered += 1;
            if (
              c.knows_national_regulations === 1 ||
              c.knows_national_regulations === true
            ) {
              knowsNational += 1;
            }
          }

          const bumpDoc = (
            value: unknown,
            onYes: () => void,
            onAnswered: () => void
          ) => {
            if (value === null || value === undefined || value === "") return;
            onAnswered();
            if (value === true || value === 1 || value === "1") onYes();
          };

          bumpDoc(
            c.driver_vehicle_inspection_uptodate,
            () => {
              driverInspection += 1;
            },
            () => {
              driverInspectionAnswered += 1;
            }
          );
          bumpDoc(
            c.driver_registration_card_uptodate,
            () => {
              driverRegistration += 1;
            },
            () => {
              driverRegistrationAnswered += 1;
            }
          );
          bumpDoc(
            c.driver_vehicle_insurance_uptodate,
            () => {
              driverInsurance += 1;
            },
            () => {
              driverInsuranceAnswered += 1;
            }
          );
          bumpDoc(
            c.driver_license_uptodate,
            () => {
              driverLicense += 1;
            },
            () => {
              driverLicenseAnswered += 1;
            }
          );
          bumpDoc(
            c.driver_other_required_documents_uptodate,
            () => {
              driverOther += 1;
            },
            () => {
              driverOtherAnswered += 1;
            }
          );
        });

        const n = collections.length;
        setMetrics({
          sampleSize: n,
          withControlsPct: pct(withControls, n),
          withIllegalFeesPct: pct(withIllegalFees, n),
          knowsCommunityPct: pct(knowsCommunity, communityAnswered),
          knowsNationalPct: pct(knowsNational, nationalAnswered),
          driverInspectionPct: pct(driverInspection, driverInspectionAnswered),
          driverRegistrationPct: pct(
            driverRegistration,
            driverRegistrationAnswered
          ),
          driverInsurancePct: pct(driverInsurance, driverInsuranceAnswered),
          driverLicensePct: pct(driverLicense, driverLicenseAnswered),
          driverOtherDocsPct: pct(driverOther, driverOtherAnswered),
        });
      } catch (err) {
        console.error(err);
        setError("Erreur lors du calcul des indicateurs qualité");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSample();
  }, []);

  if (isLoading) {
    return (
      <div className="h-[320px] animate-pulse rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800" />
    );
  }

  if (error || !metrics) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Qualité & conformité
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          {error || "Aucune donnée"}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Qualité & conformité
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Estimations sur un échantillon de {metrics.sampleSize} collecte
          {metrics.sampleSize > 1 ? "s" : ""} (endpoint stats dédié manquant)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Contrôles & réglementations
          </h4>
          <MetricRow
            label="% avec postes de contrôle"
            value={metrics.withControlsPct}
          />
          <MetricRow
            label="% avec faux frais déclarés"
            value={metrics.withIllegalFeesPct}
          />
          <MetricRow
            label="% connaissance textes communautaires"
            value={metrics.knowsCommunityPct}
          />
          <MetricRow
            label="% connaissance textes nationaux"
            value={metrics.knowsNationalPct}
          />
        </div>
        <div>
          <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Documents conducteur (à jour)
          </h4>
          <MetricRow
            label="Visite technique"
            value={metrics.driverInspectionPct}
          />
          <MetricRow
            label="Carte grise"
            value={metrics.driverRegistrationPct}
          />
          <MetricRow label="Assurance" value={metrics.driverInsurancePct} />
          <MetricRow
            label="Permis de conduire"
            value={metrics.driverLicensePct}
          />
          <MetricRow
            label="Autres documents obligatoires"
            value={metrics.driverOtherDocsPct}
          />
        </div>
      </div>
    </div>
  );
}
