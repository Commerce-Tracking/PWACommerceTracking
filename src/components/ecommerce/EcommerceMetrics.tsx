import React, { useEffect, useState } from "react";
import { CheckCircleIcon, FileIcon, ListIcon } from "../../icons";
import axiosInstance from "../../api/axios";
import useAuth from "../../providers/auth/useAuth";
import { useTranslation } from "react-i18next";
import { isSupervisor, isTeamManager } from "../../utils/roles";
import {
  EMPTY_COLLECTION_COUNTS,
  countsByLevelParams,
  mapBoardMetrics,
  type CollectionLevelCounts,
  type CountsByLevelQuery,
} from "../../utils/collectionStats";

type MetricCard = {
  key: string;
  title: string;
  hint?: string;
  value: number;
  color: "warning" | "success" | "error" | "info";
  icon: React.ReactNode;
};

function MetricCardsGrid({ cards }: { cards: MetricCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {cards.map((card) => (
        <div
          key={card.key}
          title={card.hint}
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
              {card.hint && (
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  {card.hint}
                </p>
              )}
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

export default function EcommerceMetrics({
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

  const m = mapBoardMetrics(stats);
  const tm = isTeamManager(userInfo?.role_id);
  const supervisor = isSupervisor(userInfo?.role_id);

  const queueCards: MetricCard[] = supervisor || tm
    ? [
        {
          key: "pending",
          title: t("pending_collections"),
          hint: tm ? t("pending_hint_tm") : t("pending_hint_supervisor"),
          value: m.pending,
          color: "warning",
          icon: (
            <ListIcon className="text-gray-800 size-6 dark:text-white/90" />
          ),
        },
        {
          key: "validated",
          title: t("validated_collections"),
          hint: tm ? t("validated_hint_tm") : t("validated_hint_supervisor"),
          value: m.validated,
          color: "success",
          icon: (
            <FileIcon className="text-gray-800 size-6 dark:text-white/90" />
          ),
        },
        {
          key: "rejected",
          title: t("rejected_collections"),
          hint: tm ? t("rejected_hint_tm") : t("rejected_hint_supervisor"),
          value: m.rejected,
          color: "error",
          icon: (
            <FileIcon className="text-gray-800 size-6 dark:text-white/90" />
          ),
        },
      ]
    : [
        {
          key: "total",
          title: t("total_collections"),
          value: m.total,
          color: "info",
          icon: <ListIcon className="text-gray-800 size-6 dark:text-white/90" />,
        },
        {
          key: "rejected",
          title: t("total_rejected"),
          value: m.rejected,
          color: "error",
          icon: <FileIcon className="text-gray-800 size-6 dark:text-white/90" />,
        },
      ];

  const followUpCards: MetricCard[] = tm
    ? [
        {
          key: "validated_by_supervisor",
          title: t("validated_by_supervisor"),
          hint: t("validated_by_supervisor_hint"),
          value: Number(stats.validated_by_supervisor) || 0,
          color: "success",
          icon: (
            <CheckCircleIcon className="text-gray-800 size-6 dark:text-white/90" />
          ),
        },
        {
          key: "rejected_by_supervisor",
          title: t("rejected_by_supervisor"),
          hint: t("rejected_by_supervisor_hint"),
          value: Number(stats.rejected_by_supervisor) || 0,
          color: "error",
          icon: (
            <FileIcon className="text-gray-800 size-6 dark:text-white/90" />
          ),
        },
      ]
    : supervisor
      ? [
          {
            key: "pending_at_team_managers",
            title: t("pending_at_team_managers"),
            hint: t("pending_at_team_managers_hint"),
            value: Number(stats.pending_team_manager) || 0,
            color: "info",
            icon: (
              <ListIcon className="text-gray-800 size-6 dark:text-white/90" />
            ),
          },
          {
            key: "rejected_by_team_managers",
            title: t("rejected_by_team_managers"),
            hint: t("rejected_by_team_managers_hint"),
            value: Number(stats.rejected_by_team_manager) || 0,
            color: "error",
            icon: (
              <FileIcon className="text-gray-800 size-6 dark:text-white/90" />
            ),
          },
        ]
      : [];

  if (isLoading) {
    const placeholders = tm || supervisor ? 5 : 3;
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
        {Array.from({ length: placeholders }, (_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <MetricCardsGrid cards={queueCards} />
      {followUpCards.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
            {tm ? t("supervisor_follow_up") : t("team_follow_up")}
          </p>
          <MetricCardsGrid cards={followUpCards} />
        </div>
      )}
    </div>
  );
}
