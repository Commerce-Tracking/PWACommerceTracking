import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../context/AuthContext";
import axiosInstance from "../../../api/axios";

import ComponentCard from "../../common/ComponentCard";
// import axiosInstance from "../../api/axios";

interface Collection {
  id: number;
  public_id: string;
  collection_date: string;
  collector_id: number;
  operator_gender: string;
  operator_type: string;
  collection_point_id: number | null;
  collection_type: string;
  collection_context: string;
  transport_batch_id: number | null;
  origin_city_id: number;
  origin_country_id: number;
  intermediate_destination: string | null;
  final_destination_city_id: number;
  destination_country_id: number;
  trade_flow_direction: string;
  transport_mode_id: number;
  vehicle_registration_number: string;
  transport_cost: number | null;
  market_day: string | null;
  nearby_markets: string | null;
  currency_id: number;
  payment_method: string;
  season_id: number;
  market_condition: string | null;
  market_price_variation: number | null;
  taxes_fees: number | null;
  tax_details: string | null;
  gps_latitude: number | null;
  gps_longitude: number | null;
  has_control_posts: boolean | null;
  control_posts_count: number | null;
  control_locations: string | null;
  control_duration_type: string | null;
  control_duration_value: number | null;
  taxes_paid: boolean;
  total_weight_kg: number;
  tax_amount: number;
  illegal_fees_paid: boolean;
  illegal_fees_locations: string | null;
  illegal_fees_amount: number | null;
  knows_community_regulations: boolean | null;
  knows_national_regulations: boolean | null;
  other_difficulties: string | null;
  notes: string;
  status: string;
  validated_at: string | null;
  validated_by: number | null;
  created_at: string;
  updated_at: string;
  collector_name?: string;
  total_items?: number;
  total_value?: string;
  collector?: {
    id: number;
    public_id: string;
    user_id: number;
    organization_id: number;
    team_manager_id: number;
    supervisor_id: number | null;
    country_id: number;
    last_name: string;
    first_name: string;
    phone: string;
    email: string;
    gender: string;
    address: string;
    marital_status: string;
    status: string;
    date_of_birth: string;
    place_of_birth: string;
    nationality: string;
    actor_role: string;
    created_at: string;
    updated_at: string;
  };
  collectionPoint?: {
    id: number;
    public_id: string;
    name: string;
    description: string | null;
    location: string | null;
    country_id: number;
    created_at: string;
    updated_at: string;
  };
  originCity?: {
    id: number;
    public_id: string;
    name: string;
    country_id: number;
    location: string | null;
    created_at: string;
    updated_at: string;
    country: {
      id: number;
      public_id: string;
      name: string;
      iso: string;
      prefix: string;
      flag: string;
      currency_id: number;
      status: string;
      metadata: any;
      created_at: string;
      updated_at: string;
    };
  };
  originCountry?: {
    id: number;
    public_id: string;
    name: string;
    iso: string;
    prefix: string;
    flag: string;
    currency_id: number;
    status: string;
    metadata: any;
    created_at: string;
    updated_at: string;
  };
  finalDestinationCity?: {
    id: number;
    public_id: string;
    name: string;
    country_id: number;
    location: string | null;
    created_at: string;
    updated_at: string;
    country: {
      id: number;
      public_id: string;
      name: string;
      iso: string;
      prefix: string;
      flag: string;
      currency_id: number;
      status: string;
      metadata: any;
      created_at: string;
      updated_at: string;
    };
  };
  destinationCountry?: {
    id: number;
    public_id: string;
    name: string;
    iso: string;
    prefix: string;
    flag: string;
    currency_id: number;
    status: string;
    metadata: any;
    created_at: string;
    updated_at: string;
  };
  transportMode?: {
    id: number;
    public_id: string;
    name: string;
    description: string;
    transport_method_id: number;
    created_at: string;
    updated_at: string;
  };
  currency?: {
    id: number;
    name: string;
    code: string;
    symbol: string;
    flag: string | null;
    status: string;
    created_at: string;
    updated_at: string;
  };
  season?: {
    id: number;
    public_id: string;
    name: string;
    description: string;
    type: string;
    created_at: string;
    updated_at: string;
  };
  validatedBy?: {
    id: number;
    public_id: string;
    user_id: number;
    organization_id: number;
    team_manager_id: number;
    supervisor_id: number | null;
    country_id: number;
    last_name: string;
    first_name: string;
    phone: string;
    email: string;
    gender: string;
    address: string;
    marital_status: string;
    status: string;
    date_of_birth: string;
    place_of_birth: string;
    nationality: string;
    actor_role: string;
    created_at: string;
    updated_at: string;
  };
  collectionItems?: Array<{
    id: number;
    public_id: string;
    collection_id: number;
    product_id: number | null;
    animal_id: number | null;
    quantity: string;
    unity_id: number;
    unit_price: string;
    total_value: string;
    product_quality: string | null;
    product_variety: string | null;
    product_processing_level: string | null;
    product_packaging: string | null;
    animal_count: number | null;
    animal_age_category: string | null;
    animal_gender: string | null;
    animal_condition: string | null;
    animal_breed: string | null;
    average_weight_kg: string | null;
    specific_origin: string | null;
    specific_destination: string | null;
    losses_quantity: string;
    losses_value: string;
    loss_reasons: string | null;
    required_special_permits: boolean | null;
    special_permits_details: string | null;
    item_specific_fees: string;
    is_seasonal_product: boolean;
    harvest_period: string | null;
    item_notes: string | null;
    created_at: string;
    updated_at: string;
  }>;
  collectionControls?: Array<any>;
  collectionValidations?: Array<{
    id: number;
    public_id: string;
    collection_id: number;
    validation_level: string;
    validator_id: number;
    validation_action: string;
    validation_result: string;
    data_quality_score: number | null;
    validation_notes: string | null;
    rejection_reason: string | null;
    correction_instructions: string | null;
    quality_issues: string | null;
    validation_metadata: any;
    requires_field_verification: boolean | null;
    requires_data_correction: boolean | null;
    requires_additional_documentation: boolean | null;
    validation_deadline: string | null;
    priority_level: string;
    submitted_at: string;
    validated_at: string | null;
    validation_duration_minutes: number | null;
    previous_validation_id: number | null;
    is_current_validation: number;
    revision_number: number;
    validation_source: string;
    system_metadata: any;
    created_at: string;
    updated_at: string;
  }>;
  corridor?: {
    id: number;
    public_id: string;
    name: string;
    description: string | null;
    origin_country_id: number;
    destination_country_id: number;
    distance_km: number | null;
    estimated_duration_hours: number | null;
    transport_modes: string[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  team_manager_validation_result?: string;
  team_manager_validation_date?: string;
  team_manager_rejection_reason?: string;
  supervisor_validation_result?: string;
  supervisor_validation_date?: string;
  supervisor_rejection_reason?: string;
  validated_by_supervisor?: boolean;
  validation_notes?: string;
  data_quality_score?: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  result: Collection[];
  errors: any;
  except: any;
}

const AgriculturalCollectionsTableOne = () => {
  const [tableData, setTableData] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [validationStatus, setValidationStatus] = useState<string>("");
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedRejectionReason, setSelectedRejectionReason] =
    useState<string>("");
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  // Fonction pour récupérer les collectes agricoles
  const fetchData = async () => {
    try {
      setIsLoading(true);
      console.log("Récupération des collectes agricoles...");

      // Utiliser le nouvel endpoint avec filtres de statut
      const searchParams: any = {
        page: String(currentPage),
        limit: String(rowsPerPage),
        collection_type: "agricultural",
      };

      // Ajouter le filtre de statut de validation
      if (validationStatus) {
        searchParams.validation_status = validationStatus;
      }

      // Ajouter la recherche globale
      if (globalFilter) {
        searchParams.search = globalFilter;
      }

      const response = await axiosInstance.get<ApiResponse>(
        "/api/trade-flow/collections/by-validation-status",
        { params: searchParams }
      );

      if (response.data.success) {
        let collections: Collection[] = [];

        // Structure de données unifiée pour le nouvel endpoint
        if (Array.isArray(response.data.result)) {
          collections = response.data.result;
        } else if (response.data.result && "data" in response.data.result) {
          const result = response.data.result as any;
          collections = result.data;
          setTotalRecords(result.total || collections.length);
        }

        // Récupérer les statuts de validation pour les chefs d'équipe et superviseurs
        if (userInfo?.role_id === 4 || userInfo?.role_id === 5) {
          const validationPromises = collections.map(async (collection) => {
            try {
              const workflowResponse = await axiosInstance.get(
                `/api/trade-flow/collections/${collection.id}/workflow`
              );
              if (workflowResponse.data.success) {
                const workflow = workflowResponse.data.result;
                const teamManagerValidation = workflow.team_manager_validation;
                const supervisorValidation = workflow.supervisor_validation;

                const isRejected =
                  teamManagerValidation?.validation_action === "rejected" ||
                  teamManagerValidation?.validation_result === "rejected";
                const isApproved =
                  teamManagerValidation?.validation_action === "approved" ||
                  teamManagerValidation?.validation_result === "approved";

                return {
                  ...collection,
                  validated_by_team_manager: isRejected || isApproved,
                  validation_result:
                    teamManagerValidation?.validation_result || null,
                  validation_action:
                    teamManagerValidation?.validation_action || null,
                  validated_at: teamManagerValidation?.validated_at || null,
                  rejection_reason:
                    teamManagerValidation?.rejection_reason || null,
                  validated_by_supervisor:
                    supervisorValidation?.validation_result === "approved",
                  supervisor_validation_result:
                    supervisorValidation?.validation_result || null,
                  supervisor_validated_at:
                    supervisorValidation?.validated_at || null,
                  team_manager_validation_result:
                    teamManagerValidation?.validation_result || null,
                  team_manager_validation_date:
                    teamManagerValidation?.validated_at || null,
                  team_manager_rejection_reason:
                    teamManagerValidation?.rejection_reason || null,
                  supervisor_validation_date:
                    supervisorValidation?.validated_at || null,
                  supervisor_rejection_reason:
                    supervisorValidation?.rejection_reason || null,
                };
              }
            } catch (error) {
              console.error(
                `Erreur pour la collection ${collection.id}:`,
                error
              );
            }
            return collection;
          });

          collections = await Promise.all(validationPromises);
        }

        // Filtrage côté client pour s'assurer que les statuts correspondent
        if (validationStatus) {
          collections = collections.filter((collection) => {
            const teamManagerResult = collection.team_manager_validation_result;
            const supervisorResult = collection.supervisor_validation_result;

            if (userInfo?.role_id === 4) {
              // Chef d'équipe : regarde le statut de validation du chef d'équipe
              if (validationStatus === "approved") {
                return teamManagerResult === "approved";
              } else if (validationStatus === "rejected") {
                return teamManagerResult === "rejected";
              } else if (validationStatus === "pending") {
                return !teamManagerResult || teamManagerResult === "pending";
              }
            } else if (userInfo?.role_id === 5) {
              // Superviseur : regarde le statut de validation du superviseur
              if (validationStatus === "approved") {
                return supervisorResult === "approved";
              } else if (validationStatus === "rejected") {
                return supervisorResult === "rejected";
              } else if (validationStatus === "pending") {
                return !supervisorResult || supervisorResult === "pending";
              }
            }
            return true;
          });
        }

        // Traitement des données
        const transformedData = collections.map((item) => ({
          ...item,
          collector_name: item.collector
            ? `${item.collector.first_name} ${item.collector.last_name}`
            : "Non spécifié",
          total_items: item.collectionItems ? item.collectionItems.length : 0,
          total_value: item.collectionItems
            ? item.collectionItems
                .reduce(
                  (sum: number, item) =>
                    sum + parseFloat(item.total_value || "0"),
                  0
                )
                .toFixed(2)
            : "0.00",
        }));

        setTableData(transformedData);
      }
    } catch (err: any) {
      console.error(
        "Erreur lors de la récupération des collectes agricoles:",
        err
      );
      setError(
        err.message || "Erreur lors de la récupération des collectes agricoles"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("=== USEEFFECT TRIGGERED ===");
    console.log("currentPage:", currentPage);
    console.log("rowsPerPage:", rowsPerPage);
    console.log("globalFilter:", globalFilter);
    console.log("validationStatus:", validationStatus);
    console.log("=== FIN USEEFFECT DEBUG ===");

    fetchData();
  }, [currentPage, rowsPerPage, globalFilter, validationStatus]);

  const handleViewDetails = (collection: Collection) => {
    // Passer les données de la collecte via l'état de navigation
    navigate(`/collection/${collection.id}`, {
      state: { collection },
    });
  };

  const onPageChange = (event: any) => {
    console.log("=== PAGINATION DEBUG ===");
    console.log("Event reçu:", event);
    console.log("Nouvelle page:", event.page + 1);
    console.log("Nouveau nombre de lignes:", event.rows);

    setCurrentPage(event.page + 1);
    setRowsPerPage(event.rows);
  };

  const onFilter = (event: any) => {
    console.log("=== FILTER DEBUG ===");
    console.log("Event de filtre:", event);

    if (event.globalFilter !== undefined) {
      setGlobalFilter(event.globalFilter);
      setCurrentPage(1);
    }
  };

  // Fonction pour gérer les changements de filtre de statut de validation
  const handleValidationStatusChange = (status: string) => {
    setValidationStatus(status);
    setCurrentPage(1);
  };

  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const collectorBodyTemplate = (rowData: Collection) => {
    return (
      <div className="flex items-center">
        <div className="flex-shrink-0 w-8 h-8">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {rowData.collector_name?.charAt(0) || "?"}
            </span>
          </div>
        </div>
        <div className="ml-3">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {rowData.collector_name || "Non spécifié"}
          </div>
        </div>
      </div>
    );
  };

  const originBodyTemplate = (rowData: Collection) => {
    const city = rowData.originCity?.name || "Non spécifié";
    const country = rowData.originCountry?.name || "Non spécifié";
    const flag = rowData.originCountry?.flag || "";

    return (
      <div className="flex items-center">
        <span className="text-lg mr-2">{flag}</span>
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {city}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {country}
          </div>
        </div>
      </div>
    );
  };

  const destinationBodyTemplate = (rowData: Collection) => {
    const city = rowData.finalDestinationCity?.name || "Non spécifié";
    const country = rowData.destinationCountry?.name || "Non spécifié";
    const flag = rowData.destinationCountry?.flag || "";

    return (
      <div className="flex items-center">
        <span className="text-lg mr-2">{flag}</span>
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {city}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {country}
          </div>
        </div>
      </div>
    );
  };

  const totalValueBodyTemplate = (rowData: Collection) => {
    const value = parseFloat(rowData.total_value || "0");
    const formattedValue = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
    }).format(value);

    return (
      <div className="text-sm font-medium text-green-600">{formattedValue}</div>
    );
  };

  const dateBodyTemplate = (rowData: Collection) => {
    const date = new Date(rowData.created_at);
    const formattedDate = date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return (
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {formattedDate}
      </span>
    );
  };

  const getCollectionTypeLabel = (type: string) => {
    switch (type) {
      case "livestock":
        return "Bétail";
      case "agricultural":
        return "Agricole";
      default:
        return type;
    }
  };

  const collectionTypeBodyTemplate = (rowData: Collection) => {
    return getCollectionTypeLabel(rowData.collection_type);
  };

  const showRejectionReason = (reason: string) => {
    setSelectedRejectionReason(reason);
    setShowRejectionModal(true);
  };

  const statusBodyTemplate = (rowData: Collection) => {
    if (userInfo?.role_id === 4) {
      // Chef d'équipe
      if (rowData.team_manager_validation_result === "rejected") {
        return (
          <div className="flex flex-col items-start">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              Rejetée le{" "}
              {rowData.team_manager_validation_date
                ? new Date(
                    rowData.team_manager_validation_date
                  ).toLocaleDateString("fr-FR")
                : ""}
            </span>
            {rowData.team_manager_rejection_reason && (
              <button
                onClick={() =>
                  showRejectionReason(rowData.team_manager_rejection_reason!)
                }
                className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors duration-200 mt-1"
              >
                <i className="pi pi-eye mr-1"></i>
                Voir motif
              </button>
            )}
          </div>
        );
      } else if (rowData.team_manager_validation_result === "approved") {
        return (
          <div className="flex items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Validée le{" "}
              {rowData.team_manager_validation_date
                ? new Date(
                    rowData.team_manager_validation_date
                  ).toLocaleDateString("fr-FR")
                : ""}
            </span>
          </div>
        );
      } else {
        return (
          <div className="flex items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              À traiter
            </span>
          </div>
        );
      }
    } else if (userInfo?.role_id === 5) {
      // Superviseur
      if (rowData.supervisor_validation_result === "rejected") {
        return (
          <div className="flex flex-col items-start">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              Rejetée le{" "}
              {rowData.supervisor_validation_date
                ? new Date(
                    rowData.supervisor_validation_date
                  ).toLocaleDateString("fr-FR")
                : ""}
            </span>
            {rowData.supervisor_rejection_reason && (
              <button
                onClick={() =>
                  showRejectionReason(rowData.supervisor_rejection_reason!)
                }
                className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors duration-200 mt-1"
              >
                <i className="pi pi-eye mr-1"></i>
                Voir motif
              </button>
            )}
          </div>
        );
      } else if (rowData.supervisor_validation_result === "approved") {
        return (
          <div className="flex items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Validée le{" "}
              {rowData.supervisor_validation_date
                ? new Date(
                    rowData.supervisor_validation_date
                  ).toLocaleDateString("fr-FR")
                : ""}
            </span>
          </div>
        );
      } else if (rowData.team_manager_validation_result === "approved") {
        return (
          <div className="flex items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              En attente de validation du superviseur
            </span>
          </div>
        );
      } else {
        return (
          <div className="flex items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              En attente de validation du chef d'équipe
            </span>
          </div>
        );
      }
    }

    return (
      <div className="flex items-center">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
          {rowData.status}
        </span>
      </div>
    );
  };

  const actionBodyTemplate = (rowData: Collection) => {
    return (
      <button
        onClick={() => handleViewDetails(rowData)}
        className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
      >
        {t("see_details")}
      </button>
    );
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="mb-4">
          <p className="text-red-600 dark:text-red-400 mb-2">
            Erreur : {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-700 text-white rounded transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Debug pour les données
  console.log("=== RENDER DEBUG ===");
  console.log("tableData.length:", tableData.length);
  console.log("totalRecords:", totalRecords);
  console.log("currentPage:", currentPage);
  console.log("rowsPerPage:", rowsPerPage);
  console.log("first:", (currentPage - 1) * rowsPerPage);
  console.log("=== FIN RENDER DEBUG ===");

  return (
    <div className="p-4">
      <ComponentCard title={t("agricultural_collections")}>
        {/* Filtre de statut de validation */}
        <div className="mb-4 flex flex-wrap gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Statut de validation
            </label>
            <select
              value={validationStatus}
              onChange={(e) => handleValidationStatusChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="approved">Approuvé</option>
              <option value="rejected">Rejeté</option>
              <option value="pending">En attente</option>
            </select>
          </div>
        </div>

        <DataTable
          value={tableData}
          loading={isLoading}
          responsiveLayout="scroll"
          showGridlines
          rows={rowsPerPage}
          first={(currentPage - 1) * rowsPerPage}
          totalRecords={totalRecords}
          onPage={onPageChange}
          globalFilter={globalFilter}
          onFilter={onFilter}
          globalFilterFields={[
            "collector_name",
            "collection_type",
            "status",
            "total_value",
            "originCountry.name",
            "destinationCountry.name",
            "collectionPoint.name",
            "transportMode.name",
            "corridor.name",
            ...(userInfo?.role_id === 5
              ? ["validation_notes", "data_quality_score"]
              : []),
          ]}
          emptyMessage="Aucune collecte agricole trouvée."
          paginator
          rowsPerPageOptions={[5, 10, 25]}
          tableStyle={{ minWidth: "50rem" }}
          className="p-datatable-sm"
          lazy={true}
        >
          <Column
            field="collector_name"
            header={t("collector")}
            filter
            filterPlaceholder="Rechercher par collecteur"
            style={{ width: "22%" }}
            body={collectorBodyTemplate}
          />
          <Column
            field="collection_type"
            header={t("collection_type")}
            filter
            filterPlaceholder="Rechercher par type"
            style={{ width: "18%" }}
            body={collectionTypeBodyTemplate}
          />
          <Column
            field="total_value"
            header="Valeur Totale"
            sortable
            filter
            filterPlaceholder="Filtrer par valeur"
            style={{ width: "13%" }}
            body={totalValueBodyTemplate}
          />
          <Column
            field="created_at"
            header={t("date")}
            style={{ width: "12%" }}
            body={dateBodyTemplate}
          />
          <Column
            field="status"
            header="Statut de Validation"
            style={{ width: "15%" }}
            body={statusBodyTemplate}
          />
          <Column
            header={t("actions")}
            body={actionBodyTemplate}
            style={{ width: "10%" }}
          />
        </DataTable>
      </ComponentCard>
      <Toast ref={toast} position="bottom-right" />

      {/* Modal pour afficher la raison de rejet */}
      <Dialog
        header="Motif de rejet"
        visible={showRejectionModal}
        style={{ width: "50vw" }}
        onHide={() => setShowRejectionModal(false)}
        footer={
          <Button
            label="Fermer"
            icon="pi pi-times"
            onClick={() => setShowRejectionModal(false)}
            className="p-button-text"
          />
        }
      >
        <div className="p-4">
          <p className="text-gray-700 dark:text-gray-300">
            {selectedRejectionReason}
          </p>
        </div>
      </Dialog>
    </div>
  );
};

export default AgriculturalCollectionsTableOne;
