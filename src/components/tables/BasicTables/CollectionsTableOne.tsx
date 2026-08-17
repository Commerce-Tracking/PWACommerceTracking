import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import axiosInstance from "../../../api/axios";
import { Paginator } from "primereact/paginator";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import CollectionTypeBadge from "../../collections/CollectionTypeBadge";
import CollectorCell from "../../collections/list/CollectorCell";
import CollectionDateCell from "../../collections/list/CollectionDateCell";
import CollectionListStats from "../../collections/list/CollectionListStats";
import CollectionListStatusBadge, {
  statusToneFromKey,
} from "../../collections/list/CollectionListStatusBadge";
import {
  COLLECTION_TYPE_FILTER_OPTIONS,
  getTradeFlowLabel,
  isCollectionTypeFilter,
  type CollectionTypeFilter,
} from "../../../utils/collectionLabels";
import { isSupervisor, isTeamManager } from "../../../utils/roles";

interface Collection {
  id: number;
  public_id: string;
  collection_date: string | null;
  collector_id: number;
  operator_gender: string;
  operator_type: string;
  respondent_nature: string;
  other_respondent_nature: string | null;
  merchandise_owner_gender: string;
  merchandise_owner_age_category: string;
  merchandise_owner_has_disability: number;
  collection_point_id: number | null;
  collection_type: string;
  collection_context: string;
  transport_batch_id: number | null;
  origin_city_id: number | null;
  origin_country_id: number;
  intermediate_destination: string | null;
  final_destination_city_id: number | null;
  destination_country_id: number;
  trade_flow_direction: string;
  transport_mode_id: number;
  vehicle_registration_number: string;
  transport_cost: string | null;
  market_day: number | null;
  nearby_markets: string | null;
  currency_id: number;
  payment_method: string;
  season_id: number | null;
  market_condition: string | null;
  market_price_variation: string | null;
  taxes_fees: string | null;
  tax_details: string | null;
  gps_latitude: string | null;
  gps_longitude: string | null;
  has_control_posts: number | null;
  control_posts_count: number | null;
  control_locations: string | null;
  control_duration_type: string | null;
  control_duration_value: string | null;
  taxes_paid: string | null;
  total_weight_kg: string | null;
  tax_amount: string | null;
  illegal_fees_paid: string | null;
  illegal_fees_locations: string | null;
  illegal_fees_amount: string | null;
  knows_community_regulations: number | null;
  knows_national_regulations: number | null;
  other_difficulties: string | null;
  notes: string | null;
  corridor_id: number;
  status: string;
  validated_at: string | null;
  validated_by: number | null;
  created_at: string;
  updated_at: string;
  // Nouvelles relations
  collectionPoint?: {
    id: number;
    public_id: string;
    name: string;
    description: string;
    country_id: number;
    corridor_id: number | null;
    collection_point_type_id: number;
    locality: string;
    region: string;
    coordinates: string | null;
    is_formal: boolean;
    is_border_crossing: boolean;
    is_market: boolean;
    is_fluvial: boolean;
    is_checkpoint: boolean;
    status: string;
    created_at: string;
    updated_at: string;
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
  corridor?: {
    id: number;
    public_id: string;
    name: string;
    description: string;
    country_start_id: number;
    country_end_id: number;
    city_start_id: number;
    city_end_id: number;
    distance: number;
    nbre_checkpoints: number;
    created_at: string;
    updated_at: string;
  };
  collectionItems?: Array<{
    id: number;
    public_id: string;
    collection_id: number;
    product_id: number;
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
    animal_categories: string | null;
    animal_age_category: string | null;
    animal_gender: string | null;
    animal_condition: string | null;
    animal_breed: string | null;
    average_weight_kg: string;
    specific_origin: string | null;
    specific_destination: string | null;
    losses_quantity: string | null;
    losses_value: string | null;
    loss_reasons: string | null;
    required_special_permits: number | null;
    special_permits_details: string | null;
    item_specific_fees: string | null;
    is_seasonal_product: number | null;
    harvest_period: string | null;
    item_notes: string | null;
    local_unit_weight_kg: string;
    total_weight_kg: string;
    loading_cost: string;
    unloading_cost: string;
    transport_cost: string;
    origin_country_id: number;
    loading_city_id: number;
    unloading_city_id: number;
    product_origin_country_id: number | null;
    customs_registration_number: string | null;
    is_customs_registered: number;
    created_at: string;
    updated_at: string;
    product: {
      id: number;
      public_id: string;
      name: string;
      product_type_id: number;
      HS_code: string;
      description: string;
      created_at: string;
      updated_at: string;
    };
    animal: any | null;
    unity: {
      id: number;
      public_id: string;
      name: string;
      description: string;
      symbol: string;
      created_at: string;
      updated_at: string;
    };
    originCountry: {
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
    loadingCity: {
      id: number;
      public_id: string;
      name: string;
      country_id: number;
      location: string | null;
      created_at: string;
      updated_at: string;
    };
    unloadingCity: {
      id: number;
      public_id: string;
      name: string;
      country_id: number;
      location: string | null;
      created_at: string;
      updated_at: string;
    };
    productOriginCountry: any | null;
  }>;
  collectionControls?: Array<{
    id: number;
    collection_id: number;
    checkpoint_id: number | null;
    service_id: number;
    location: string;
    fees_paid: string | null;
    payment_amount: string | null;
    duration_type: string | null;
    control_duration: string | null;
    control_result: string | null;
    control_issues: string | null;
    notes: string | null;
    other_control_body: string;
    control_posts_count: number;
    stop_time_per_post_type: string | null;
    border_crossing_time_type: string | null;
    fees_paid_yes_no: number;
    has_receipt: number;
    tax_type_id: number;
    other_tax_type: string;
    fees_payment_post: string | null;
    fees_payment_amount: string | null;
    illegal_fees_paid: number;
    illegal_fees_post: string | null;
    illegal_fees_amount: string | null;
    knows_community_regulations: number;
    knows_national_regulations: number;
    other_difficulties: string | null;
    created_at: string;
    updated_at: string;
    taxType: {
      id: number;
      name: string;
      description: string;
      created_at: string;
      updated_at: string;
    };
  }>;
  // Champs de validation
  validated_by_team_manager?: boolean;
  validation_result?: string | null;
  validation_action?: string | null;
  validation_notes?: string | null;
  data_quality_score?: number | null;
  rejection_reason?: string | null;
  validated_by_supervisor?: boolean;
  supervisor_validation_result?: string | null;
  supervisor_validated_at?: string | null;
  // Champs calculés
  total_value?: string;
  collector_name?: string;
  total_items?: number;
  // Champs de compatibilité pour l'ancienne structure
  collector?: {
    first_name: string;
    last_name: string;
  };
  originCity?: {
    name: string;
  };
  finalDestinationCity?: {
    name: string;
  };
  // Propriétés de validation supplémentaires
  team_manager_validation_result?: string | null;
  team_manager_validation_date?: string;
  team_manager_rejection_reason?: string;
  supervisor_validation_date?: string;
  supervisor_rejection_reason?: string;
}

// Interface pour la structure de validation du superviseur
interface ValidationItem {
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
  quality_issues: any;
  validation_metadata: any;
  requires_field_verification: number | null;
  requires_data_correction: number | null;
  requires_additional_documentation: number | null;
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
  collection: Collection;
}

interface ApiResponse {
  success: boolean;
  message: string;
  result: Collection[];
  errors: any;
  except: any;
}

const CollectionsTableOne = () => {
  const [tableData, setTableData] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [countriesById, setCountriesById] = useState<
    Record<string, { name: string; flag?: string }>
  >({});
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const { t, i18n } = useTranslation();
  const [, forceUpdate] = useState({});

  // Initialiser la page depuis l'URL, location.state, ou par défaut 1
  const getInitialPage = (): number => {
    // Priorité 1: location.state (retour depuis détails)
    if (location.state?.returnPage) {
      return location.state.returnPage;
    }
    // Priorité 2: URL
    const pageFromUrl = searchParams.get("page");
    if (pageFromUrl) {
      const pageNum = parseInt(pageFromUrl, 10);
      if (!isNaN(pageNum) && pageNum > 0) {
        return pageNum;
      }
    }
    // Par défaut: page 1
    return 1;
  };

  const [currentPage, setCurrentPage] = useState<number>(getInitialPage);
  // Ref pour garder la valeur actuelle de currentPage
  const currentPageRef = useRef<number>(getInitialPage());
  // Flag pour indiquer si la restauration initiale est terminée
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Mettre à jour la ref quand currentPage change
  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  // Charger le référentiel pays pour résoudre origin_country_id / destination_country_id
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axiosInstance.get("/admin/countries", {
          params: { page: 1, limit: 500 },
        });
        // Formes possibles : data.data.data | data.data | result.data | result
        const payload = response.data;
        const raw =
          payload?.data?.data ??
          (Array.isArray(payload?.data) ? payload.data : null) ??
          payload?.result?.data ??
          payload?.result ??
          [];
        const list: any[] = Array.isArray(raw) ? raw : [];
        const map: Record<string, { name: string; flag?: string }> = {};
        list.forEach((country) => {
          if (country?.id == null) return;
          map[String(country.id)] = {
            name: country.name || `Pays #${country.id}`,
            flag: country.flag,
          };
        });
        setCountriesById(map);
      } catch (err) {
        // Endpoint admin parfois inaccessible aux validateurs — fallback via relations/IDs
        console.error("Erreur chargement pays:", err);
      }
    };
    fetchCountries();
  }, []);

  // Synchroniser currentPage avec l'URL et location.state (doit se déclencher en premier)
  useEffect(() => {
    const pageFromUrl = searchParams.get("page");
    const urlPage = pageFromUrl ? parseInt(pageFromUrl, 10) : null;



    // Priorité 1: location.state (retour depuis détails)
    if (location.state?.returnPage) {
      const savedPage = location.state.returnPage;
      if (savedPage !== currentPage) {
        setCurrentPage(savedPage);
        currentPageRef.current = savedPage;
      }
      // Mettre à jour l'URL avec la page sauvegardée
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", savedPage.toString());
      setSearchParams(newSearchParams, { replace: true });
      setIsInitialized(true);

      return;
    }

    if (urlPage && !isNaN(urlPage) && urlPage > 0 && urlPage !== currentPage) {
      setCurrentPage(urlPage);
      currentPageRef.current = urlPage;
    }

    // Si l'URL n'a pas de page mais currentPage n'est pas 1, mettre à jour l'URL
    if (!urlPage && currentPage !== 1) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", currentPage.toString());
      setSearchParams(newSearchParams, { replace: true });
    }

    setIsInitialized(true);

    // Seulement au montage ou quand location.key change (nouvelle navigation)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedRejectionReason, setSelectedRejectionReason] =
    useState<string>("");
  // Initialiser validationStatus depuis l'URL
  const getInitialValidationStatus = (): string => {
    const statusFromUrl = searchParams.get("status");
    return statusFromUrl || "";
  };

  const [validationStatus, setValidationStatus] = useState<string>(getInitialValidationStatus);
  const toast = useRef<Toast>(null);

  const getInitialCollectionType = (): CollectionTypeFilter => {
    const typeFromUrl = searchParams.get("collection_type");
    if (isCollectionTypeFilter(typeFromUrl)) return typeFromUrl;
    return "all";
  };

  const [collectionTypeFilter, setCollectionTypeFilter] =
    useState<CollectionTypeFilter>(getInitialCollectionType);

  // Synchroniser validationStatus et collection_type avec l'URL
  useEffect(() => {
    const statusFromUrl = searchParams.get("status") || "";
    if (statusFromUrl !== validationStatus) {
      setValidationStatus(statusFromUrl);
    }

    const typeFromUrl = searchParams.get("collection_type");
    const nextType: CollectionTypeFilter = isCollectionTypeFilter(typeFromUrl)
      ? typeFromUrl
      : "all";
    if (nextType !== collectionTypeFilter) {
      setCollectionTypeFilter(nextType);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const buildListParams = () => {
    const params: Record<string, string> = {
      page: String(currentPage),
      limit: String(rowsPerPage),
    };
    if (collectionTypeFilter !== "all") {
      params.collection_type = collectionTypeFilter;
    }
    if (globalFilter) {
      params.search = globalFilter;
    }
    return params;
  };

  // Liste unique des collectes (tous types par défaut)
  const fetchData = async () => {
    try {
      setIsLoading(true);


      let response;

      // Si un statut de validation est sélectionné, utiliser l'endpoint de filtrage approprié
      if (validationStatus) {
        const listParams: Record<string, string> = buildListParams();

        if (isTeamManager(userInfo?.role_id)) {
          // Chef d'équipe : utiliser collection_status
          listParams.collection_status = validationStatus;
          response = await axiosInstance.get<ApiResponse>(
            "/trade-flow/collections/by-validation-status",
            {
              params: listParams,
            }
          );
        } else if (isSupervisor(userInfo?.role_id)) {
          // Superviseur : utiliser validation_status et validation_level
          listParams.validation_status = validationStatus;
          listParams.validation_level = "2";
          response = await axiosInstance.get<ApiResponse>(
            "/trade-flow/collections/by-validation-status",
            {
              params: listParams,
            }
          );
        }
      } else {
        // Sinon, utiliser l'endpoint normal
        const listParams = buildListParams();

        response = await axiosInstance.get<ApiResponse>(
          "/trade-flow/agents/collections",
          {
            params: listParams,
          }
        );
      }

      if (response.data.success) {
        let collections: Collection[] = [];

        // Structure de données unifiée pour le nouvel endpoint
        let result: any = null;
        if (Array.isArray(response.data.result)) {
          collections = response.data.result;
        } else if (response.data.result && "data" in response.data.result) {
          result = response.data.result as any;

          // Pour les deux rôles, les données sont directement dans result.data
          collections = result.data;

          setTotalRecords(result.total || collections.length);
        }

        // Récupérer les informations de workflow pour chaque collection
        const processedCollections = await Promise.all(
          collections.map(async (collection, index) => {
            if (!collection || !collection.id) {
              return null;
            }

            const validationData = result ? result.data[index] : collection;

            // Extraire les données de validation depuis collectionValidations
            let teamManagerValidation: any = null;
            let supervisorValidation: any = null;

            if (
              (collection as any).collectionValidations &&
              (collection as any).collectionValidations.length > 0
            ) {
              // Trouver la validation actuelle (is_current_validation: 1)
              const currentValidation =
                (collection as any).collectionValidations.find(
                  (validation: any) => validation.is_current_validation === 1
                ) ||
                (collection as any).collectionValidations[
                (collection as any).collectionValidations.length - 1
                ];

              // Déterminer si c'est une validation de chef d'équipe ou superviseur
              if (currentValidation.validation_level === "1") {
                teamManagerValidation = currentValidation;
              } else if (currentValidation.validation_level === "2") {
                supervisorValidation = currentValidation;
              }
            }

            try {
              // Récupérer les informations de workflow pour avoir les statuts de validation complets
              const workflowResponse = await axiosInstance.get(
                `/trade-flow/collections/${collection.id}/workflow`
              );

              if (workflowResponse.data.success) {
                const workflow = workflowResponse.data.result;
                const workflowTeamManagerValidation =
                  workflow.team_manager_validation;
                const supervisorValidation = workflow.supervisor_validation;

                return {
                  ...collection,
                  // Informations de validation du chef d'équipe
                  validated_by_team_manager:
                    workflowTeamManagerValidation?.validation_result ===
                    "approved",
                  validation_result:
                    workflowTeamManagerValidation?.validation_result,
                  validation_action:
                    workflowTeamManagerValidation?.validation_action,
                  validated_at: workflowTeamManagerValidation?.validated_at,
                  rejection_reason:
                    workflowTeamManagerValidation?.rejection_reason,
                  data_quality_score:
                    workflowTeamManagerValidation?.data_quality_score,
                  validation_notes:
                    workflowTeamManagerValidation?.validation_notes,
                  // Pour la compatibilité avec l'ancienne structure
                  team_manager_validation_result:
                    workflowTeamManagerValidation?.validation_result,
                  team_manager_validation_date:
                    workflowTeamManagerValidation?.validated_at,
                  team_manager_rejection_reason:
                    workflowTeamManagerValidation?.rejection_reason,
                  team_manager_name: workflowTeamManagerValidation?.validator
                    ? `${workflowTeamManagerValidation.validator.first_name || ""} ${workflowTeamManagerValidation.validator.last_name || ""}`.trim()
                    : undefined,
                  // Informations de validation du superviseur
                  validated_by_supervisor:
                    supervisorValidation?.validation_result === "approved",
                  supervisor_validation_result:
                    supervisorValidation?.validation_result,
                  supervisor_validated_at: supervisorValidation?.validated_at,
                  supervisor_validation_date:
                    supervisorValidation?.validated_at,
                  supervisor_rejection_reason:
                    supervisorValidation?.rejection_reason,
                };
              }
            } catch (error) {

            }

            // Utiliser les données de collectionValidations directement
            return {
              ...collection,
              // Informations de validation du chef d'équipe
              validated_by_team_manager:
                teamManagerValidation?.validation_result === "approved" ||
                collection.status === "validated",
              validation_result:
                teamManagerValidation?.validation_result ||
                (collection.status === "validated" ? "approved" : null),
              validation_action:
                teamManagerValidation?.validation_action ||
                (collection.status === "validated" ? "validated" : null),
              validated_at:
                teamManagerValidation?.validated_at || collection.validated_at,
              rejection_reason: teamManagerValidation?.rejection_reason,
              data_quality_score: teamManagerValidation?.data_quality_score,
              validation_notes: teamManagerValidation?.validation_notes,
              // Pour la compatibilité avec l'ancienne structure
              team_manager_validation_result:
                teamManagerValidation?.validation_result ||
                (collection.status === "validated" ? "approved" : null),
              team_manager_validation_date:
                teamManagerValidation?.validated_at || collection.validated_at,
              team_manager_rejection_reason:
                teamManagerValidation?.rejection_reason,
              team_manager_name: (teamManagerValidation as any)?.validator
                ? `${(teamManagerValidation as any).validator.first_name || ""} ${(teamManagerValidation as any).validator.last_name || ""}`.trim()
                : undefined,
              // Informations de validation du superviseur
              validated_by_supervisor:
                supervisorValidation?.validation_result === "approved",
              supervisor_validation_result:
                supervisorValidation?.validation_result,
              supervisor_validated_at: supervisorValidation?.validated_at,
              supervisor_validation_date: supervisorValidation?.validated_at,
              supervisor_rejection_reason:
                supervisorValidation?.rejection_reason,
            };
          })
        );

        collections = processedCollections.filter(
          (collection) => collection !== null
        );

        // Pas de filtrage côté client - laisser l'API gérer tous les filtres

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

        // Enrichir le référentiel pays à partir des relations présentes dans la liste
        // (utile si /admin/countries est inaccessible au rôle courant)
        setCountriesById((prev) => {
          const next = { ...prev };
          const remember = (country: any) => {
            if (country?.id == null || !country?.name) return;
            next[String(country.id)] = {
              name: country.name,
              flag: country.flag,
            };
          };
          transformedData.forEach((item: any) => {
            remember(item.originCountry || item.origin_country);
            remember(item.destinationCountry || item.destination_country);
            item.collectionItems?.forEach((ci: any) => {
              remember(ci.originCountry || ci.origin_country);
              remember(ci.destinationCountry || ci.destination_country);
              remember(ci.productOriginCountry || ci.product_origin_country);
              remember(
                ci.productDestinationCountry || ci.product_destination_country
              );
            });
          });
          return next;
        });

        setTableData(transformedData);
      }
    } catch (err: any) {

      setError(
        err.message || "Erreur lors de la récupération des collectes"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Ne pas appeler fetchData avant que la restauration initiale soit terminée
    if (!isInitialized) {

      return;
    }



    fetchData();
  }, [
    currentPage,
    rowsPerPage,
    globalFilter,
    validationStatus,
    collectionTypeFilter,
    isInitialized,
  ]);

  // Force le re-rendu quand la langue change
  useEffect(() => {
    forceUpdate({});
  }, [i18n.language]);

  const handleViewDetails = useCallback((collection: Collection) => {
    // Utiliser la ref pour obtenir la valeur actuelle de currentPage
    const actualPage = currentPageRef.current;

    // Lire le statut depuis l'URL actuelle (window.location pour être sûr d'avoir la vraie URL)
    const currentUrl = new URL(window.location.href);
    const statusFromUrl = currentUrl.searchParams.get("status") || "";
    // Aussi depuis searchParams au cas où
    const statusFromSearchParams = searchParams.get("status") || "";
    // Utiliser celui qui n'est pas vide, ou validationStatus en dernier recours
    const finalStatus = statusFromUrl || statusFromSearchParams || validationStatus;

    // Construire le chemin de retour avec la page actuelle et le statut dans l'URL
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("page", actualPage.toString());
    if (finalStatus) {
      newSearchParams.set("status", finalStatus);
    }
    if (collectionTypeFilter !== "all") {
      newSearchParams.set("collection_type", collectionTypeFilter);
    }
    const returnPath = `${location.pathname}?${newSearchParams.toString()}`;



    // Mettre à jour l'URL avant de naviguer pour qu'elle soit sauvegardée
    setSearchParams(newSearchParams, { replace: true });

    // Passer les données de la collecte, la page actuelle et le statut via l'état de navigation
    navigate(`/collection/${collection.id}`, {
      state: {
        collection,
        returnPage: actualPage,
        returnValidationStatus: finalStatus,
        returnPath: returnPath,
      },
    });
  }, [
    currentPage,
    validationStatus,
    collectionTypeFilter,
    searchParams,
    location.pathname,
    navigate,
    setSearchParams,
  ]);

  const onPageChange = (event: any) => {


    const newPage = event.page + 1;

    // Mettre à jour l'URL AVANT de mettre à jour currentPage pour éviter les conflits
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", newPage.toString());
    setSearchParams(newSearchParams, { replace: true });

    // Mettre à jour currentPage et la ref après l'URL
    setCurrentPage(newPage);
    currentPageRef.current = newPage;
    setRowsPerPage(event.rows);
  };

  const onFilter = (event: any) => {


    if (event.globalFilter !== undefined) {
      setGlobalFilter(event.globalFilter);
      setCurrentPage(1);
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const actionBodyTemplate = useMemo(() => {
    return (rowData: Collection) => {
      const currentLang = i18n.language;
      return (
        <button
          onClick={() => handleViewDetails(rowData)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/50 dark:border-gray-700 dark:bg-white/5 dark:text-gray-200 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/10 dark:hover:text-brand-300"
          key={`${rowData.id}-${currentLang}`}
        >
          <i className="pi pi-eye text-[11px]" aria-hidden />
          {t("view_details")}
        </button>
      );
    };
  }, [i18n.language, t, handleViewDetails]);

  const collectorBodyTemplate = (rowData: Collection) => {
    return <CollectorCell name={rowData.collector_name} />;
  };

  const dateBodyTemplate = (rowData: Collection) => {
    return (
      <CollectionDateCell
        date={rowData.collection_date}
        fallback={rowData.created_at}
      />
    );
  };

  const collectionTypeBodyTemplate = (rowData: Collection) => {
    return <CollectionTypeBadge type={rowData.collection_type} />;
  };

  const tradeFlowBodyTemplate = (rowData: Collection) => {
    return (
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
        {getTradeFlowLabel(rowData.trade_flow_direction)}
      </span>
    );
  };

  const itemsCountBodyTemplate = (rowData: Collection) => {
    const count = rowData.total_items ?? rowData.collectionItems?.length ?? 0;
    return (
      <span className="inline-flex min-w-[1.75rem] items-center justify-center rounded-lg bg-gray-50 px-2 py-1 text-sm font-semibold text-gray-800 dark:bg-white/5 dark:text-gray-200">
        {count}
      </span>
    );
  };

  const showRejectionReason = (reason: string) => {
    setSelectedRejectionReason(reason);
    setShowRejectionModal(true);
  };

  const handleValidationStatusChange = (status: string) => {
    setValidationStatus(status);
    setCurrentPage(1); // Reset à la première page

    // Mettre à jour l'URL avec le nouveau statut
    const newSearchParams = new URLSearchParams(searchParams);
    if (status) {
      newSearchParams.set("status", status);
    } else {
      newSearchParams.delete("status");
    }
    // Réinitialiser la page à 1 dans l'URL aussi
    newSearchParams.set("page", "1");
    setSearchParams(newSearchParams, { replace: true });
  };

  const handleCollectionTypeChange = (type: CollectionTypeFilter) => {
    setCollectionTypeFilter(type);
    setCurrentPage(1);

    const newSearchParams = new URLSearchParams(searchParams);
    if (type === "all") {
      newSearchParams.delete("collection_type");
    } else {
      newSearchParams.set("collection_type", type);
    }
    newSearchParams.set("page", "1");
    setSearchParams(newSearchParams, { replace: true });
  };

  const statusBodyTemplate = (rowData: Collection) => {
    // Pour le chef d'équipe, afficher le statut de validation après ses actions
    let displayStatus = rowData.status;
    let statusLabel = "Statut initial";

    if (userInfo?.role_id === 4) {
      // Chef d'équipe : utiliser directement le status de la collection


      // Utiliser directement le status de la collection
      if (rowData.status === "validated") {
        displayStatus = "validated";
        statusLabel = "Validée";
      } else if (rowData.status === "rejected") {
        displayStatus = "rejected";
        statusLabel = "Rejetée";
      } else {
        // Toutes les autres collections (submitted, draft, etc.) sont considérées comme "À traiter"
        displayStatus = "submitted";
        statusLabel = "À traiter";
      }
    } else if (userInfo?.role_id === 5) {
      // Superviseur : vérifier si la collection a été validée par le chef d'équipe mais pas encore par le superviseur


      // Vérifier s'il y a une validation du superviseur (validation_level: "2")
      const hasSupervisorValidation =
        rowData.supervisor_validation_result !== undefined &&
        rowData.supervisor_validation_result !== null;

      if (hasSupervisorValidation) {
        // La collection a été traitée par le superviseur
        if (rowData.supervisor_validation_result === "approved") {
          displayStatus = "validated";
          statusLabel = "Validée par l'éditeur";
        } else if (rowData.supervisor_validation_result === "rejected") {
          displayStatus = "rejected";
          statusLabel = "Rejetée par superviseur";
        } else {
          displayStatus = "pending";
          statusLabel = "En attente de l'éditeur";
        }
      } else if (
        rowData.status === "rejected" ||
        (rowData as any).team_manager_validation_result === "rejected"
      ) {
        displayStatus = "rejected";
        statusLabel = (rowData as any).team_manager_name
          ? `Rejetée par ${(rowData as any).team_manager_name}`
          : "Rejetée par chef d'équipe";
      } else if (rowData.status === "validated") {
        // Collection validée par le chef d'équipe mais pas encore traitée par le superviseur
        displayStatus = "pending";
        statusLabel = "En attente de l'éditeur";
      } else {
        // Toutes les autres collections sont en attente du superviseur
        displayStatus = "pending";
        statusLabel = "En attente de l'éditeur";
      }
    }

    return (
      <div className="flex flex-col gap-1.5">
        <CollectionListStatusBadge
          tone={statusToneFromKey(displayStatus)}
          label={statusLabel}
        />
        {userInfo?.role_id === 4 &&
          ((rowData as any).team_manager_validation_result ||
            (rowData as any).validation_result) && (
            <div className="text-xs text-gray-500">
              <div>
                {(rowData as any).validation_action === "rejected" ||
                  (rowData as any).validation_result === "rejected" ||
                  (rowData as any).team_manager_validation_result === "rejected"
                  ? "Rejetée le"
                  : "Traitée le"}{" "}
                {(rowData as any).validated_at ||
                  (rowData as any).team_manager_validation_date
                  ? new Date(
                    (rowData as any).validated_at ||
                    (rowData as any).team_manager_validation_date
                  ).toLocaleDateString()
                  : "N/A"}
              </div>
              {((rowData as any).rejection_reason ||
                (rowData as any).team_manager_rejection_reason) && (
                  <div className="mt-1">
                    <button
                      onClick={() =>
                        showRejectionReason(
                          (rowData as any).rejection_reason ||
                          (rowData as any).team_manager_rejection_reason!
                        )
                      }
                      className="inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
                    >
                      <i className="pi pi-eye mr-1"></i>
                      Voir motif
                    </button>
                  </div>
                )}
            </div>
          )}
        {userInfo?.role_id === 5 && (
          <div className="text-xs text-gray-500">
            {rowData.supervisor_validation_result === "approved" ||
              rowData.supervisor_validation_result === "rejected" ? (
              // Collection traitée par le superviseur
              <div>
                <div>
                  {rowData.supervisor_validation_result === "rejected"
                    ? "Rejetée le"
                    : "Validée le"}{" "}
                  {rowData.supervisor_validated_at
                    ? new Date(
                      rowData.supervisor_validated_at
                    ).toLocaleDateString()
                    : "N/A"}
                </div>
                {rowData.supervisor_validation_result === "rejected" &&
                  rowData.supervisor_rejection_reason && (
                    <div className="mt-1">
                      <button
                        onClick={() =>
                          showRejectionReason(
                            rowData.supervisor_rejection_reason!
                          )
                        }
                        className="inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
                      >
                        <i className="pi pi-eye mr-1"></i>
                        Voir motif
                      </button>
                    </div>
                  )}
              </div>
            ) : (
              // Collection en attente du superviseur - afficher la date de validation du chef d'équipe
              <div>
                <div>
                  Validée
                  {(rowData as any).team_manager_name
                    ? ` par ${(rowData as any).team_manager_name}`
                    : " par chef d'équipe"}{" "}
                  le{" "}
                  {rowData.team_manager_validation_date
                    ? new Date(
                      rowData.team_manager_validation_date
                    ).toLocaleDateString()
                    : rowData.validated_at
                      ? new Date(rowData.validated_at).toLocaleDateString()
                      : "N/A"}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const asCountry = (
    value: { name?: string | null; flag?: string | null } | null | undefined
  ) => {
    if (!value?.name) return null;
    return { name: value.name, flag: value.flag || undefined };
  };

  /** Résout un pays depuis la ligne (relations camel/snake + items + référentiel). */
  const resolveCountryFromRow = (
    rowData: Collection,
    kind: "origin" | "destination"
  ) => {
    const row = rowData as any;
    const firstItem = row.collectionItems?.[0];
    const countryId =
      kind === "origin"
        ? rowData.origin_country_id ?? firstItem?.origin_country_id
        : rowData.destination_country_id;

    const nestedCandidates =
      kind === "origin"
        ? [
            rowData.originCountry,
            row.origin_country,
            firstItem?.originCountry,
            firstItem?.origin_country,
            firstItem?.productOriginCountry,
            firstItem?.product_origin_country,
          ]
        : [
            rowData.destinationCountry,
            row.destination_country,
            firstItem?.destinationCountry,
            firstItem?.destination_country,
            firstItem?.productDestinationCountry,
            firstItem?.product_destination_country,
          ];

    for (const candidate of nestedCandidates) {
      const resolved = asCountry(candidate);
      if (resolved) return resolved;
    }

    if (countryId != null && countriesById[String(countryId)]) {
      return countriesById[String(countryId)];
    }

    // Dernier recours : afficher l'ID plutôt que « Non renseigné » silencieux
    if (countryId != null) {
      return { name: `Pays #${countryId}` };
    }

    return null;
  };

  const loadingCountryBodyTemplate = (rowData: Collection) => {
    const country = resolveCountryFromRow(rowData, "origin");
    if (!country) {
      return <span className="text-sm text-gray-400">Non renseigné</span>;
    }
    return (
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
        {country.flag ? `${country.flag} ` : ""}
        {country.name}
      </span>
    );
  };

  const unloadingCountryBodyTemplate = (rowData: Collection) => {
    const country = resolveCountryFromRow(rowData, "destination");
    if (!country) {
      return <span className="text-sm text-gray-400">Non renseigné</span>;
    }
    return (
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
        {country.flag ? `${country.flag} ` : ""}
        {country.name}
      </span>
    );
  };

  const totalValueBodyTemplate = (rowData: Collection) => {
    let totalValue = 0;

    // Calculer la valeur totale à partir des collectionItems
    if (rowData.collectionItems && rowData.collectionItems.length > 0) {
      totalValue = rowData.collectionItems.reduce((sum, item) => {
        return sum + parseFloat(item.total_value || "0");
      }, 0);
    } else if (rowData.total_value) {
      // Fallback sur l'ancien champ si disponible
      totalValue = parseFloat(rowData.total_value);
    }

    const formattedValue = totalValue.toLocaleString("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    return (
      <div className="text-sm font-medium text-green-600">{formattedValue}</div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-brand-500" />
          <p className="mt-4 text-sm text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="mb-4 text-sm text-red-600 dark:text-red-400">
          Erreur : {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // KPI dérivés des données déjà chargées (page courante + totalRecords)
  let pendingOnPage = 0;
  let validatedOnPage = 0;
  let rejectedOnPage = 0;
  let itemsOnPage = 0;
  for (const row of tableData) {
    itemsOnPage += row.total_items ?? row.collectionItems?.length ?? 0;
    if (userInfo?.role_id === 5) {
      const hasSupervisorValidation =
        row.supervisor_validation_result !== undefined &&
        row.supervisor_validation_result !== null;
      if (hasSupervisorValidation) {
        if (row.supervisor_validation_result === "approved") validatedOnPage += 1;
        else if (row.supervisor_validation_result === "rejected")
          rejectedOnPage += 1;
        else pendingOnPage += 1;
      } else if (
        row.status === "rejected" ||
        (row as any).team_manager_validation_result === "rejected"
      ) {
        rejectedOnPage += 1;
      } else {
        pendingOnPage += 1;
      }
    } else if (row.status === "validated") {
      validatedOnPage += 1;
    } else if (row.status === "rejected") {
      rejectedOnPage += 1;
    } else {
      pendingOnPage += 1;
    }
  }

  const filterSelectClass =
    "w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-800 shadow-sm transition focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-400/30 dark:border-gray-700 dark:bg-gray-900 dark:text-white";

  return (
    <div className="space-y-5">
      <CollectionListStats
        items={[
          {
            label: "Total des collectes",
            value: totalRecords,
            icon: "pi-database",
            tone: "info",
          },
          {
            label: "En attente",
            value: pendingOnPage,
            icon: "pi-clock",
            tone: "warning",
          },
          {
            label: "Validées",
            value: validatedOnPage,
            icon: "pi-check-circle",
            tone: "success",
          },
          {
            label: "Rejetées",
            value: rejectedOnPage,
            icon: "pi-times-circle",
            tone: "error",
          },
          {
            label: "Articles collectés",
            value: itemsOnPage,
            icon: "pi-box",
            tone: "default",
          },
        ]}
      />

      {(isTeamManager(userInfo?.role_id) ||
        isSupervisor(userInfo?.role_id)) && (
        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500 dark:bg-white/5 dark:text-gray-400">
              <i className="pi pi-filter text-sm" aria-hidden />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                Filtres
              </h2>
              <p className="text-xs text-gray-500">
                Affinez la liste des collectes
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="collection-type-filter"
                className="text-xs font-medium uppercase tracking-wide text-gray-500"
              >
                Type de collecte
              </label>
              <div className="relative">
                <i className="pi pi-tags absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400" aria-hidden />
                <select
                  id="collection-type-filter"
                  value={collectionTypeFilter}
                  onChange={(e) =>
                    handleCollectionTypeChange(
                      e.target.value as CollectionTypeFilter
                    )
                  }
                  className={filterSelectClass}
                >
                  {COLLECTION_TYPE_FILTER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="validation-status-filter"
                className="text-xs font-medium uppercase tracking-wide text-gray-500"
              >
                Statut de validation
              </label>
              <div className="relative">
                <i className="pi pi-verified absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400" aria-hidden />
                <select
                  id="validation-status-filter"
                  value={validationStatus}
                  onChange={(e) => handleValidationStatusChange(e.target.value)}
                  className={filterSelectClass}
                  key={`validation-status-${validationStatus}`}
                >
                  <option value="">Tous les statuts</option>
                  {isTeamManager(userInfo?.role_id) ? (
                    <>
                      <option value="submitted">En attente</option>
                      <option value="validated">Validée</option>
                      <option value="rejected">Rejetée</option>
                    </>
                  ) : (
                    <>
                      <option value="pending">En attente</option>
                      <option value="approved">Validée</option>
                      <option value="rejected">Rejetée</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop / tablette : tableau */}
      <div className="collections-modern-table hidden md:block">
        <DataTable
          key={`datatable-${i18n.language}`}
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
            "public_id",
            "vehicle_registration_number",
            ...(isSupervisor(userInfo?.role_id)
              ? ["validation_notes", "data_quality_score"]
              : []),
          ]}
          emptyMessage="Aucune collecte trouvée."
          paginator
          rowsPerPageOptions={[5, 10, 25]}
          tableStyle={{ minWidth: "50rem" }}
          className="p-datatable-sm"
          lazy={true}
          rowHover
        >
          <Column
            field="collector_name"
            header={t("collector")}
            filter
            filterPlaceholder="Rechercher par collecteur"
            style={{ width: "14%" }}
            body={collectorBodyTemplate}
          />
          <Column
            field="collection_type"
            header={t("collection_type")}
            style={{ width: "10%" }}
            body={collectionTypeBodyTemplate}
          />
          <Column
            field="trade_flow_direction"
            header="Sens du flux"
            style={{ width: "10%" }}
            body={tradeFlowBodyTemplate}
          />
          <Column
            field="origin_country_id"
            header={t("loading_country")}
            style={{ width: "12%" }}
            body={loadingCountryBodyTemplate}
          />
          <Column
            field="destination_country_id"
            header={t("unloading_country")}
            style={{ width: "12%" }}
            body={unloadingCountryBodyTemplate}
          />
          <Column
            field="total_items"
            header="Items"
            style={{ width: "6%" }}
            body={itemsCountBodyTemplate}
          />
          <Column
            field="created_at"
            header={t("date")}
            style={{ width: "9%" }}
            body={dateBodyTemplate}
          />
          <Column
            field="status"
            header="Statut de Validation"
            style={{ width: "12%" }}
            body={statusBodyTemplate}
          />
          <Column
            header={t("actions")}
            body={actionBodyTemplate}
            style={{ width: "8%" }}
          />
        </DataTable>
      </div>

      {/* Mobile : cartes */}
      <div className="space-y-3 md:hidden">
        {tableData.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-500 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
            Aucune collecte trouvée.
          </div>
        ) : (
          tableData.map((row) => (
            <article
              key={row.id}
              className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition-colors dark:border-gray-800 dark:bg-white/[0.03]"
            >
              <div className="flex items-start justify-between gap-3">
                <CollectorCell name={row.collector_name} />
                <div>{statusBodyTemplate(row)}</div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                    Type
                  </p>
                  <div className="mt-1">
                    <CollectionTypeBadge type={row.collection_type} />
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                    Flux
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-800 dark:text-gray-200">
                    {getTradeFlowLabel(row.trade_flow_direction)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                    {t("loading_country")}
                  </p>
                  <div className="mt-1">
                    {loadingCountryBodyTemplate(row)}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                    {t("unloading_country")}
                  </p>
                  <div className="mt-1">
                    {unloadingCountryBodyTemplate(row)}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                    Items
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-800 dark:text-gray-200">
                    {itemsCountBodyTemplate(row)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                    {t("date")}
                  </p>
                  <div className="mt-1">{dateBodyTemplate(row)}</div>
                </div>
              </div>

              <div className="mt-4 border-t border-gray-100 pt-3 dark:border-gray-800">
                {actionBodyTemplate(row)}
              </div>
            </article>
          ))
        )}

        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <Paginator
            first={(currentPage - 1) * rowsPerPage}
            rows={rowsPerPage}
            totalRecords={totalRecords}
            rowsPerPageOptions={[5, 10, 25]}
            onPageChange={onPageChange}
            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          />
        </div>
      </div>

      <Toast ref={toast} position="bottom-right" />

      <Dialog
        header="Motif de rejet"
        visible={showRejectionModal}
        style={{ width: "50vw" }}
        onHide={() => setShowRejectionModal(false)}
        footer={
          <Button
            label="Fermer"
            icon="pi pi-times"
            style={{
              backgroundColor: "#00277F",
              borderColor: "#00277F",
              color: "white",
            }}
            onClick={() => setShowRejectionModal(false)}
            className="w-full rounded-xl text-sm sm:w-auto sm:text-base px-3 py-2 sm:px-4 sm:py-3"
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

export default CollectionsTableOne;
