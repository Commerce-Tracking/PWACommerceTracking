import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState, useEffect, useMemo } from "react";
import axiosInstance from "../../api/axios";
import useAuth from "../../providers/auth/useAuth";
import { useTranslation } from "react-i18next";

interface MonthlyData {
  month: string;
  monthKey: string;
  submitted: number;
  validated: number;
  rejected: number;
  details: {
    agricultural: { validated: number; rejected: number };
    livestock: { validated: number; rejected: number };
    fishery: { validated: number; rejected: number };
    mixed: { validated: number; rejected: number };
  };
}

interface ApiStatItem {
  month: string;
  type: string;
  action: string;
  count: number;
}

export default function MonthlySalesChart() {
  const auth = useAuth();
  const userInfo = auth?.userInfo;
  const { t } = useTranslation();
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fonction pour convertir le format YYYY-MM en nom de mois abrégé
  const formatMonth = (monthStr: string): string => {
    const date = new Date(monthStr + "-01");
    const monthNames = [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Jun",
      "Jul",
      "Aoû",
      "Sep",
      "Oct",
      "Nov",
      "Déc",
    ];
    return monthNames[date.getMonth()];
  };

  // Fonction pour générer tous les mois des 12 derniers mois
  const generateAllMonths = (): string[] => {
    const months: string[] = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      months.push(`${year}-${month}`);
    }
    
    return months;
  };

  // Fonction pour transformer les données de l'API en format utilisable
  const transformApiData = (apiData: ApiStatItem[]): MonthlyData[] => {
    // Grouper les données par mois avec détails par type
    const monthMap = new Map<
      string,
      {
        validated: number;
        rejected: number;
        details: {
          agricultural: { validated: number; rejected: number };
          livestock: { validated: number; rejected: number };
          fishery: { validated: number; rejected: number };
          mixed: { validated: number; rejected: number };
        };
      }
    >();

    apiData.forEach((item) => {
      const existing = monthMap.get(item.month) || {
        validated: 0,
        rejected: 0,
        details: {
          agricultural: { validated: 0, rejected: 0 },
          livestock: { validated: 0, rejected: 0 },
          fishery: { validated: 0, rejected: 0 },
          mixed: { validated: 0, rejected: 0 },
        },
      };

      // Mettre à jour les totaux
      if (item.action === "validated") {
        existing.validated += item.count;
      } else if (item.action === "rejected") {
        existing.rejected += item.count;
      }

      const typeKey = item.type as keyof typeof existing.details;
      if (typeKey in existing.details) {
        if (item.action === "validated") {
          existing.details[typeKey].validated += item.count;
        } else if (item.action === "rejected") {
          existing.details[typeKey].rejected += item.count;
        }
      }

      monthMap.set(item.month, existing);
    });

    // Générer tous les mois des 12 derniers mois
    const allMonths = generateAllMonths();

    // Créer les données pour tous les mois, avec 0 pour ceux qui n'ont pas de données
    const transformedData: MonthlyData[] = allMonths.map((monthKey) => {
      const data = monthMap.get(monthKey) || {
        validated: 0,
        rejected: 0,
        details: {
          agricultural: { validated: 0, rejected: 0 },
          livestock: { validated: 0, rejected: 0 },
          fishery: { validated: 0, rejected: 0 },
          mixed: { validated: 0, rejected: 0 },
        },
      };
      return {
        month: formatMonth(monthKey),
        monthKey,
        submitted: data.validated + data.rejected, // Total = validé + rejeté
        validated: data.validated,
        rejected: data.rejected,
        details: data.details,
      };
    });

    return transformedData;
  };

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axiosInstance.get("/trade-flow/collections/stats/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success && res.data.result) {
          const transformedData = transformApiData(res.data.result);
          setMonthlyData(transformedData);
        } else {
          console.error("Erreur: réponse API invalide", res.data);
          setMonthlyData([]);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données mensuelles:", error);
        setMonthlyData([]);
        setIsLoading(false);
      }
    };

    fetchMonthlyData();
  }, []);

  const options: ApexOptions = useMemo(() => {
    return {
      colors: ["#1A6C30", "#FFC200", "#d92d20"], // Vert, Jaune, Rouge pour les rejets
      chart: {
        fontFamily: "DM Sans, sans-serif",
        type: "bar",
        height: 350,
        toolbar: {
          show: false,
        },
        stacked: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 5,
          borderRadiusApplication: "end",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: monthlyData.map((data) => data.month),
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: "#6b7280",
            fontSize: "12px",
            fontFamily: "DM Sans, sans-serif",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#6b7280",
            fontSize: "12px",
            fontFamily: "DM Sans, sans-serif",
          },
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        show: true,
        position: "top",
        horizontalAlign: "right",
        fontFamily: "DM Sans, sans-serif",
        labels: {
          colors: "#6b7280",
        },
      },
      grid: {
        borderColor: "#e1e5ea",
        strokeDashArray: 5,
      },
      tooltip: {
        theme: "light",
        style: {
          fontSize: "12px",
          fontFamily: "DM Sans, sans-serif",
        },
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          const monthData = monthlyData[dataPointIndex];
          if (!monthData) return "";

          const details = monthData.details;
          const agriculturalTotal =
            details.agricultural.validated + details.agricultural.rejected;
          const livestockTotal =
            details.livestock.validated + details.livestock.rejected;
          const fisheryTotal =
            details.fishery.validated + details.fishery.rejected;
          const mixedTotal =
            details.mixed.validated + details.mixed.rejected;

          let html = `
            <div style="padding: 10px; background: white; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <div style="font-weight: 600; margin-bottom: 8px; color: #1b2e3b;">
                ${monthData.month} ${new Date(monthData.monthKey + "-01").getFullYear()}
              </div>
              <div style="margin-bottom: 6px;">
                <span style="color: #1A6C30; font-weight: 600;">${series[0][dataPointIndex]}</span> 
                <span style="color: #6b7280; margin-left: 4px;">${t("submitted_collections") || "Collectes soumises"}</span>
              </div>
              <div style="margin-bottom: 6px;">
                <span style="color: #FFC200; font-weight: 600;">${series[1][dataPointIndex]}</span> 
                <span style="color: #6b7280; margin-left: 4px;">${t("validated_collections") || "Collectes validées"}</span>
              </div>
              <div style="margin-bottom: 8px;">
                <span style="color: #d92d20; font-weight: 600;">${series[2][dataPointIndex]}</span> 
                <span style="color: #6b7280; margin-left: 4px;">${t("rejected_collections") || "Collectes rejetées"}</span>
              </div>
              <div style="border-top: 1px solid #e1e5ea; padding-top: 8px; margin-top: 8px;">
                <div style="font-weight: 600; margin-bottom: 4px; color: #1b2e3b; font-size: 11px;">
                  Détails par type:
                </div>
                <div style="margin-bottom: 4px; font-size: 11px;">
                  <span style="color: #6b7280;">Agricole:</span>
                  <span style="color: #1b2e3b; font-weight: 600; margin-left: 4px;">
                    ${agriculturalTotal} (${details.agricultural.validated} validées, ${details.agricultural.rejected} rejetées)
                  </span>
                </div>
                <div style="margin-bottom: 4px; font-size: 11px;">
                  <span style="color: #6b7280;">Bétail:</span>
                  <span style="color: #1b2e3b; font-weight: 600; margin-left: 4px;">
                    ${livestockTotal} (${details.livestock.validated} validées, ${details.livestock.rejected} rejetées)
                  </span>
                </div>
                <div style="margin-bottom: 4px; font-size: 11px;">
                  <span style="color: #6b7280;">Halieutique:</span>
                  <span style="color: #1b2e3b; font-weight: 600; margin-left: 4px;">
                    ${fisheryTotal} (${details.fishery.validated} validées, ${details.fishery.rejected} rejetées)
                  </span>
                </div>
                <div style="font-size: 11px;">
                  <span style="color: #6b7280;">Mixte:</span>
                  <span style="color: #1b2e3b; font-weight: 600; margin-left: 4px;">
                    ${mixedTotal} (${details.mixed.validated} validées, ${details.mixed.rejected} rejetées)
                  </span>
                </div>
              </div>
            </div>
          `;
          return html;
        },
      },
    };
  }, [monthlyData, t]);

  const series = [
    {
      name: t("submitted_collections") || "Collectes soumises",
      data: monthlyData.map((data) => data.submitted),
    },
    {
      name: t("validated_collections") || "Collectes validées",
      data: monthlyData.map((data) => data.validated),
    },
    {
      name: t("rejected_collections") || "Collectes rejetées",
      data: monthlyData.map((data) => data.rejected),
    },
  ];

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center h-[350px]">
          <p className="text-gray-500 dark:text-gray-400">{t("loading") || "Chargement..."}</p>
        </div>
      </div>
    );
  }

  if (monthlyData.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              {t("monthly_collections") || "Collectes mensuelles"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("monthly_collections_description") || "Évolution mensuelle des collectes"}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center h-[350px]">
          <p className="text-gray-500 dark:text-gray-400">
            {t("no_data_available") || "Aucune donnée disponible"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {t("monthly_collections") || "Collectes mensuelles"}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("monthly_collections_description") || "Évolution mensuelle des collectes"}
          </p>
        </div>
      </div>
      <div className="h-[350px] w-full">
        <Chart options={options} series={series} type="bar" height={350} />
      </div>
    </div>
  );
}


