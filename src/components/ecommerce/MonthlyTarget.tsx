import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { useTranslation } from "react-i18next";
import useAuth from "../../providers/auth/useAuth";
import { isSupervisor, isTeamManager } from "../../utils/roles";
import {
  EMPTY_COLLECTION_COUNTS,
  countsByLevelParams,
  gaugeProcessedPercent,
  mapBoardMetrics,
  type CollectionLevelCounts,
  type CountsByLevelQuery,
} from "../../utils/collectionStats";

export default function MonthlyTarget({
  dateRange,
}: {
  dateRange?: CountsByLevelQuery;
}) {
  const auth = useAuth();
  const userInfo = auth?.userInfo;
  const { t } = useTranslation();
  const [stats, setStats] = useState<CollectionLevelCounts>(
    EMPTY_COLLECTION_COUNTS
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get(
          "/trade-flow/collections/counts/by-level",
          { params: countsByLevelParams(dateRange) }
        );

        if (res.data.success && res.data.result) {
          setStats({ ...EMPTY_COLLECTION_COUNTS, ...res.data.result });
        }
      } catch (error) {
        console.error(t("error_fetching_collection_stats"), error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [t, dateRange?.start_date, dateRange?.end_date]);

  const metrics = mapBoardMetrics(stats);
  const progressPct = gaugeProcessedPercent(metrics);
  const series = [progressPct];
  const isEmpty = metrics.total === 0;

  const subtitleKey = isTeamManager(userInfo?.role_id)
    ? "collection_summary_subtitle_tm"
    : isSupervisor(userInfo?.role_id)
      ? "collection_summary_subtitle_supervisor"
      : "collection_summary_subtitle";

  const pendingHint = isTeamManager(userInfo?.role_id)
    ? t("pending_hint_tm")
    : isSupervisor(userInfo?.role_id)
      ? t("pending_hint_supervisor")
      : undefined;
  const validatedHint = isTeamManager(userInfo?.role_id)
    ? t("validated_hint_tm")
    : isSupervisor(userInfo?.role_id)
      ? t("validated_hint_supervisor")
      : undefined;
  const rejectedHint = isTeamManager(userInfo?.role_id)
    ? t("rejected_hint_tm")
    : isSupervisor(userInfo?.role_id)
      ? t("rejected_hint_supervisor")
      : undefined;

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
              {t(subtitleKey)}
            </p>
          </div>
        </div>
        {isEmpty ? (
          <p className="mx-auto mt-16 mb-6 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
            {t("collection_queue_empty")}
          </p>
        ) : (
          <>
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
          </>
        )}
      </div>
      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <div title={pendingHint}>
          <p className="mb-1 text-center text-gray-800 text-theme-xs dark:text-gray-400 sm:text-sm">
            {t("pending_collections")}
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {metrics.pending}
          </p>
        </div>
        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800" />
        <div title={validatedHint}>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            {t("validated_collections")}
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {metrics.validated}
          </p>
        </div>
        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800" />
        <div title={rejectedHint}>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            {t("rejected_collections")}
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {metrics.rejected}
          </p>
        </div>
      </div>
      {!isEmpty && (
        <p className="px-6 pb-4 text-center text-xs text-gray-400">
          Total : {metrics.total} = {metrics.pending} en attente +{" "}
          {metrics.validated} validées + {metrics.rejected} rejetées
        </p>
      )}
    </div>
  );
}
