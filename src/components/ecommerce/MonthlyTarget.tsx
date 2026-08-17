import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { useTranslation } from "react-i18next";
import useAuth from "../../providers/auth/useAuth";
import {
  deriveRoleCollectionMetrics,
  type CollectionLevelCounts,
} from "../../utils/collectionStats";

export default function MonthlyTarget() {
  const auth = useAuth();
  const userInfo = auth?.userInfo;
  const { t } = useTranslation();
  const [stats, setStats] = useState<CollectionLevelCounts>({
    submitted_by_collector: 0,
    validated_by_team_manager: 0,
    validated_by_supervisor: 0,
    rejected_by_team_manager: 0,
    rejected_by_supervisor: 0,
    total_submitted: 0,
    total_validated: 0,
    total_rejected: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get(
          "/trade-flow/collections/counts/by-level"
        );

        if (res.data.success && res.data.result) {
          setStats(res.data.result);
        }
      } catch (error) {
        console.error(t("error_fetching_collection_stats"), error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [t]);

  const metrics = deriveRoleCollectionMetrics(stats, userInfo?.role_id);
  // Avancement du stock : part déjà traitée sur le périmètre (attente + décisions)
  const progressPct =
    metrics.total > 0
      ? Number(((metrics.processed / metrics.total) * 100).toFixed(1))
      : 0;
  const series = [progressPct];

  const options: ApexOptions = {
    colors: ["#1A6C30"],
    chart: {
      fontFamily: "DM Sans, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: { size: "80%" },
        track: {
          background: "#e1e5ea",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1b2e3b",
            formatter: (val) => val + "%",
          },
        },
      },
    },
    fill: { type: "solid", colors: ["#1A6C30"] },
    stroke: { lineCap: "round" },
    labels: ["Avancement"],
  };

  if (isLoading) {
    return (
      <div className="h-[420px] animate-pulse rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800" />
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              {t("collection_summary")}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Part traitée sur le périmètre (en attente + décisions)
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="max-h-[330px]" id="chartDarkStyle">
            <Chart
              options={options}
              series={series}
              type="radialBar"
              height={330}
            />
          </div>
        </div>
        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          {t("processed_collections_message", {
            count: metrics.processed,
          })}
        </p>
      </div>
      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <div>
          <p className="mb-1 text-center text-gray-800 text-theme-xs dark:text-gray-400 sm:text-sm">
            En attente
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {metrics.pending}
          </p>
        </div>
        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800" />
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            {t("validated_collections")}
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {metrics.validated}
          </p>
        </div>
        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800" />
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            {t("rejected_collections")}
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {metrics.rejected}
          </p>
        </div>
      </div>
      <p className="px-6 pb-4 text-center text-xs text-gray-400">
        Total : {metrics.total} = {metrics.pending} en attente +{" "}
        {metrics.validated} validées + {metrics.rejected} rejetées
      </p>
    </div>
  );
}
