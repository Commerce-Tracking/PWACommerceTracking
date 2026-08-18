import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import useAuth from "../../providers/auth/useAuth";
import { useTranslation } from "react-i18next";
import { isSupervisor } from "../../utils/roles";

type TeamRow = {
  team_manager_id: number;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  pending_n1: number;
  rejected_n1: number;
  pending_n2: number;
  validated_n2: number;
  rejected_n2: number;
};

type TeamBreakdown = {
  teams: TeamRow[];
  totals: Omit<
    TeamRow,
    "team_manager_id" | "first_name" | "last_name" | "email"
  >;
};

const EMPTY_TOTALS = {
  pending_n1: 0,
  rejected_n1: 0,
  pending_n2: 0,
  validated_n2: 0,
  rejected_n2: 0,
};

function teamName(row: TeamRow): string {
  const name = [row.first_name, row.last_name].filter(Boolean).join(" ").trim();
  return name || row.email || `#${row.team_manager_id}`;
}

export default function SupervisorTeamBreakdown() {
  const auth = useAuth();
  const { t } = useTranslation();
  const supervisor = isSupervisor(auth?.userInfo?.role_id);
  const [data, setData] = useState<TeamBreakdown>({
    teams: [],
    totals: EMPTY_TOTALS,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!supervisor) {
      setIsLoading(false);
      return;
    }

    const fetchBreakdown = async () => {
      try {
        const res = await axiosInstance.get(
          "/trade-flow/collections/stats/teams"
        );
        if (res.data.success && res.data.result) {
          setData({
            teams: res.data.result.teams || [],
            totals: { ...EMPTY_TOTALS, ...res.data.result.totals },
          });
        }
      } catch (error) {
        console.error(t("error_fetching_collection_stats"), error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBreakdown();
  }, [supervisor, t]);

  if (!supervisor) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="h-48 animate-pulse rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]" />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 py-4 md:px-6">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
          {t("supervisor_team_breakdown")}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t("supervisor_team_breakdown_hint")}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-y border-gray-100 bg-gray-50 text-xs font-medium uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-400">
            <tr>
              <th className="px-5 py-3 md:px-6">{t("team_manager_col")}</th>
              <th className="px-3 py-3 text-right">{t("col_pending_n1")}</th>
              <th className="px-3 py-3 text-right">{t("col_rejected_n1")}</th>
              <th className="px-3 py-3 text-right">{t("col_pending_n2")}</th>
              <th className="px-3 py-3 text-right">{t("col_validated_n2")}</th>
              <th className="px-3 py-3 text-right md:pr-6">{t("col_rejected_n2")}</th>
            </tr>
          </thead>
          <tbody>
            {data.teams.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  {t("no_team_managers_in_perimeter")}
                </td>
              </tr>
            ) : (
              data.teams.map((team) => (
                <tr
                  key={team.team_manager_id}
                  className="border-b border-gray-100 last:border-0 dark:border-gray-800"
                >
                  <td className="px-5 py-3 font-medium text-gray-800 dark:text-white/90 md:px-6">
                    {teamName(team)}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    {team.pending_n1.toLocaleString()}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    {team.rejected_n1.toLocaleString()}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    {team.pending_n2.toLocaleString()}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    {team.validated_n2.toLocaleString()}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums md:pr-6">
                    {team.rejected_n2.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {data.teams.length > 0 && (
            <tfoot className="border-t border-gray-200 bg-gray-50 font-semibold text-gray-800 dark:border-gray-800 dark:bg-white/[0.02] dark:text-white/90">
              <tr>
                <td className="px-5 py-3 md:px-6">{t("table_total")}</td>
                <td className="px-3 py-3 text-right tabular-nums">
                  {data.totals.pending_n1.toLocaleString()}
                </td>
                <td className="px-3 py-3 text-right tabular-nums">
                  {data.totals.rejected_n1.toLocaleString()}
                </td>
                <td className="px-3 py-3 text-right tabular-nums">
                  {data.totals.pending_n2.toLocaleString()}
                </td>
                <td className="px-3 py-3 text-right tabular-nums">
                  {data.totals.validated_n2.toLocaleString()}
                </td>
                <td className="px-3 py-3 text-right tabular-nums md:pr-6">
                  {data.totals.rejected_n2.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
