import React, { useEffect, useState } from "react";
import { FileIcon, ListIcon } from "../../icons";
import axiosInstance from "../../api/axios";
import useAuth from "../../providers/auth/useAuth";
import { useTranslation } from "react-i18next";
import { isSupervisor, isTeamManager } from "../../utils/roles";
import {
  deriveRoleCollectionMetrics,
  type CollectionLevelCounts,
} from "../../utils/collectionStats";

type MetricCard = {
  title: string;
  value: number;
  color: "warning" | "success" | "error" | "info";
  icon: React.ReactNode;
};

export default function EcommerceMetrics() {
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

  const getMetricsForRole = (): MetricCard[] => {
    const m = deriveRoleCollectionMetrics(stats, userInfo?.role_id);

    if (isSupervisor(userInfo?.role_id)) {
      return [
        {
          title: "En attente",
          value: m.pending,
          color: "warning",
          icon: (
            <ListIcon className="text-gray-800 size-6 dark:text-white/90" />
          ),
        },
        {
          title: t("validated_collections"),
          value: m.validated,
          color: "success",
          icon: (
            <FileIcon className="text-gray-800 size-6 dark:text-white/90" />
          ),
        },
        {
          title: t("total_rejected") || "Rejetées",
          value: m.rejected,
          color: "error",
          icon: (
            <FileIcon className="text-gray-800 size-6 dark:text-white/90" />
          ),
        },
      ];
    }

    if (isTeamManager(userInfo?.role_id)) {
      return [
        {
          title: "En attente",
          value: m.pending,
          color: "warning",
          icon: (
            <ListIcon className="text-gray-800 size-6 dark:text-white/90" />
          ),
        },
        {
          title: t("validated_collections"),
          value: m.validated,
          color: "success",
          icon: (
            <FileIcon className="text-gray-800 size-6 dark:text-white/90" />
          ),
        },
        {
          title: t("total_rejected") || "Rejetées",
          value: m.rejected,
          color: "error",
          icon: (
            <FileIcon className="text-gray-800 size-6 dark:text-white/90" />
          ),
        },
      ];
    }

    return [
      {
        title: t("total_collections"),
        value: m.total,
        color: "info",
        icon: <ListIcon className="text-gray-800 size-6 dark:text-white/90" />,
      },
      {
        title: t("total_rejected"),
        value: m.rejected,
        color: "error",
        icon: <FileIcon className="text-gray-800 size-6 dark:text-white/90" />,
      },
    ];
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]"
          />
        ))}
      </div>
    );
  }

  const metrics = getMetricsForRole();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {metrics.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            {card.icon}
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {card.title}
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {card.value.toLocaleString()}
              </h4>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
