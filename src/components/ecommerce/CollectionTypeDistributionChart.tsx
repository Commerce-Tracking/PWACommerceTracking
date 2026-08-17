import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../api/axios";
import { COLLECTION_TYPE_LABELS } from "../../utils/collectionLabels";

type TypeCounts = {
  agricultural: number;
  livestock: number;
  fishery: number;
  mixed: number;
  other: number;
};

interface ApiStatItem {
  month: string;
  type: string;
  action: string;
  count: number;
}

/**
 * Répartition par type à partir de /collections/stats/user
 * (agrégation validées + rejetées sur la période couverte par l'API).
 */
export default function CollectionTypeDistributionChart() {
  const [counts, setCounts] = useState<TypeCounts>({
    agricultural: 0,
    livestock: 0,
    fishery: 0,
    mixed: 0,
    other: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(
          "/trade-flow/collections/stats/user"
        );
        if (res.data.success && Array.isArray(res.data.result)) {
          const next: TypeCounts = {
            agricultural: 0,
            livestock: 0,
            fishery: 0,
            mixed: 0,
            other: 0,
          };
          (res.data.result as ApiStatItem[]).forEach((item) => {
            const n = Number(item.count) || 0;
            if (item.type === "agricultural") next.agricultural += n;
            else if (item.type === "livestock") next.livestock += n;
            else if (item.type === "fishery") next.fishery += n;
            else if (item.type === "mixed") next.mixed += n;
            else next.other += n;
          });
          setCounts(next);
          setHasData(
            next.agricultural +
              next.livestock +
              next.fishery +
              next.mixed +
              next.other >
              0
          );
        }
      } catch (error) {
        console.error("Erreur répartition par type:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const series = useMemo(
    () => [
      counts.agricultural,
      counts.livestock,
      counts.fishery,
      counts.mixed,
      ...(counts.other > 0 ? [counts.other] : []),
    ],
    [counts]
  );

  const labels = useMemo(() => {
    const base = [
      COLLECTION_TYPE_LABELS.agricultural,
      COLLECTION_TYPE_LABELS.livestock,
      COLLECTION_TYPE_LABELS.fishery,
      COLLECTION_TYPE_LABELS.mixed,
    ];
    return counts.other > 0 ? [...base, "Autre"] : base;
  }, [counts.other]);

  const options: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "DM Sans, sans-serif",
    },
    labels,
    colors: ["#1A6C30", "#FFC200", "#0BA5EC", "#465FFF", "#98A2B3"],
    legend: {
      position: "bottom",
      fontFamily: "DM Sans, sans-serif",
    },
    dataLabels: { enabled: true },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              formatter: () => String(series.reduce((a, b) => a + b, 0)),
            },
          },
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="h-[350px] animate-pulse rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800" />
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Répartition par type de collecte
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Validées et rejetées (stats utilisateur)
        </p>
      </div>
      {!hasData ? (
        <div className="flex h-[280px] items-center justify-center text-gray-500">
          Aucune donnée disponible
        </div>
      ) : (
        <Chart options={options} series={series} type="donut" height={300} />
      )}
    </div>
  );
}
