import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import axiosInstance from "../../../api/axios";
import ComponentCard from "../../common/ComponentCard";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  useEffect(() => {
    console.log("=== USEEFFECT TRIGGERED ===");
    console.log("currentPage:", currentPage);
    console.log("rowsPerPage:", rowsPerPage);
    console.log("=== FIN USEEFFECT DEBUG ===");

    const fetchData = async () => {
      try {
        setIsLoading(true);
        console.log("Tentative de connexion à l'API...");
        console.log(
          "URL complète:",
          `/api/trade-flow/agents/collections?page=${currentPage}&limit=${rowsPerPage}`
        );

        const accessToken = localStorage.getItem("accessToken");
        console.log("Token d'accès présent:", !!accessToken);

        const response = await axiosInstance.get<ApiResponse>(
          "/api/trade-flow/agents/collections",
          {
            params: {
              page: String(currentPage),
              limit: String(rowsPerPage),
              ...(userInfo?.role_id === 4 && { include_rejected: "true" }),
            },
          }
        );
        console.log(
          "Réponse API complète:",
          JSON.stringify(response.data, null, 2)
        );

        // Log de la première collection pour voir la structure
        if (response.data.result && response.data.result.length > 0) {
          console.log(
            "Première collection:",
            JSON.stringify(response.data.result[0], null, 2)
          );

          // Vérifier spécifiquement les champs d'origine et destination
          const firstCollection = response.data.result[0];
          console.log("originCity:", firstCollection.originCity);
          console.log("originCountry:", firstCollection.originCountry);
          console.log(
            "finalDestinationCity:",
            firstCollection.finalDestinationCity
          );
          console.log(
            "destinationCountry:",
            firstCollection.destinationCountry
          );
        }

        if (response.data.success) {
          let collections: Collection[] = [];

          // Pour le superviseur (role_id === 5), les données sont dans result.data et chaque élément a une propriété collection
          if (userInfo?.role_id === 5) {
            const result = response.data.result as any;
            const validationItems: ValidationItem[] = result.data || result;
            collections = validationItems.map(
              (validationItem: ValidationItem) => {
                const collection = validationItem.collection;
                return {
                  ...collection,
                  // Ajouter les informations de validation
                  validated_by_team_manager: true,
                  validation_result: validationItem.validation_result,
                  validation_notes: validationItem.validation_notes,
                  data_quality_score: validationItem.data_quality_score,
                  validated_at: validationItem.validated_at,
                };
              }
            );
            setTotalRecords(result.total || collections.length);
          } else {
            // Pour le chef d'équipe (role_id === 4), les données sont directement dans result
            if (Array.isArray(response.data.result)) {
              collections = response.data.result;
            } else if (
              response.data.result &&
              "data" in response.data.result &&
              Array.isArray((response.data.result as any).data)
            ) {
              const result = response.data.result as any;
              collections = result.data;
              setTotalRecords(result.total || collections.length);
            } else {
              console.error(
                "response.data.result n'est pas un tableau ou un objet valide:",
                response.data.result
              );
              throw new Error(
                "La réponse de l'API ne contient pas un tableau de collectes"
              );
            }

            // Pour le chef d'équipe, essayer d'abord l'endpoint workflow pour récupérer toutes les collectes
            if (userInfo?.role_id === 4) {
              try {
                console.log(
                  "Tentative de récupération via l'endpoint workflow pour le chef d'équipe..."
                );
                const workflowResponse = await axiosInstance.get(
                  "/api/trade-flow/workflows",
                  {
                    params: {
                      page: String(currentPage),
                      limit: String(rowsPerPage),
                    },
                  }
                );

                if (
                  workflowResponse.data.success &&
                  workflowResponse.data.result?.data
                ) {
                  console.log("Récupération réussie via l'endpoint workflows");

                  // Récupérer les détails des collectes pour chaque workflow
                  const collectionPromises =
                    workflowResponse.data.result.data.map(
                      async (workflowItem: any) => {
                        try {
                          const collectionResponse = await axiosInstance.get(
                            `/api/trade-flow/collections/${workflowItem.collection_id}`
                          );
                          if (collectionResponse.data.success) {
                            const collection = collectionResponse.data.result;
                            return {
                              ...collection,
                              // Données du chef d'équipe
                              validated_by_team_manager:
                                workflowItem.team_manager_validation
                                  ?.validation_result === "approved" ||
                                workflowItem.team_manager_validation
                                  ?.validation_action === "approved" ||
                                workflowItem.team_manager_validation
                                  ?.validation_result === "rejected" ||
                                workflowItem.team_manager_validation
                                  ?.validation_action === "rejected",
                              validation_result:
                                workflowItem.team_manager_validation
                                  ?.validation_result || null,
                              validation_action:
                                workflowItem.team_manager_validation
                                  ?.validation_action || null,
                              validated_at:
                                workflowItem.team_manager_validation
                                  ?.validated_at || null,
                              rejection_reason:
                                workflowItem.team_manager_validation
                                  ?.rejection_reason || null,
                              // Données du superviseur
                              validated_by_supervisor:
                                workflowItem.supervisor_validation
                                  ?.validation_result === "approved",
                              supervisor_validation_result:
                                workflowItem.supervisor_validation
                                  ?.validation_result || null,
                              supervisor_validated_at:
                                workflowItem.supervisor_validation
                                  ?.validated_at || null,
                            };
                          }
                        } catch (error) {
                          console.error(
                            `Erreur pour la collection ${workflowItem.collection_id}:`,
                            error
                          );
                        }
                        return null;
                      }
                    );

                  const resolvedCollections = await Promise.all(
                    collectionPromises
                  );
                  collections = resolvedCollections.filter(
                    (collection) => collection !== null
                  );

                  // Mettre à jour le total des enregistrements
                  setTotalRecords(
                    workflowResponse.data.result.total || collections.length
                  );
                } else {
                  throw new Error("Endpoint workflow non disponible");
                }
              } catch (workflowError) {
                console.log(
                  "Fallback vers la récupération individuelle des statuts"
                );
                // Fallback vers la récupération individuelle des statuts
                if (collections.length > 0) {
                  const validationPromises = collections.map(
                    async (collection) => {
                      try {
                        const validationResponse = await axiosInstance.get(
                          `/api/trade-flow/collections/${collection.id}/workflow`
                        );
                        if (validationResponse.data.success) {
                          const workflow = validationResponse.data.result;
                          const teamManagerValidation =
                            workflow.team_manager_validation;
                          const supervisorValidation =
                            workflow.supervisor_validation;

                          return {
                            ...collection,
                            // Données du chef d'équipe
                            validated_by_team_manager:
                              teamManagerValidation?.validation_result ===
                                "approved" ||
                              teamManagerValidation?.validation_action ===
                                "approved" ||
                              teamManagerValidation?.validation_result ===
                                "rejected" ||
                              teamManagerValidation?.validation_action ===
                                "rejected",
                            validation_result:
                              teamManagerValidation?.validation_result || null,
                            validation_action:
                              teamManagerValidation?.validation_action || null,
                            validated_at:
                              teamManagerValidation?.validated_at || null,
                            rejection_reason:
                              teamManagerValidation?.rejection_reason || null,
                            // Données du superviseur
                            validated_by_supervisor:
                              supervisorValidation?.validation_result ===
                              "approved",
                            supervisor_validation_result:
                              supervisorValidation?.validation_result || null,
                            supervisor_validated_at:
                              supervisorValidation?.validated_at || null,
                          };
                        }
                      } catch (error) {
                        console.error(
                          `Erreur pour la collection ${collection.id}:`,
                          error
                        );
                      }
                      return collection;
                    }
                  );

                  collections = await Promise.all(validationPromises);
                }
              }
            }
          }

          // Pour le superviseur, récupérer les statuts de validation individuellement
          if (userInfo?.role_id === 5 && collections.length > 0) {
            console.log(
              "Récupération des statuts de validation pour le superviseur..."
            );
            const validationPromises = collections.map(async (collection) => {
              try {
                const validationResponse = await axiosInstance.get(
                  `/api/trade-flow/collections/${collection.id}/workflow`
                );
                if (validationResponse.data.success) {
                  const workflow = validationResponse.data.result;
                  const teamManagerValidation =
                    workflow.team_manager_validation;
                  const supervisorValidation = workflow.supervisor_validation;

                  console.log(`Collection ${collection.id} - Workflow:`, {
                    teamManager: teamManagerValidation,
                    supervisor: supervisorValidation,
                  });

                  return {
                    ...collection,
                    // Données du chef d'équipe
                    validated_by_team_manager:
                      teamManagerValidation?.validation_result === "approved" ||
                      teamManagerValidation?.validation_action === "approved",
                    validation_result:
                      teamManagerValidation?.validation_result || null,
                    validation_action:
                      teamManagerValidation?.validation_action || null,
                    validated_at: teamManagerValidation?.validated_at || null,
                    rejection_reason:
                      teamManagerValidation?.rejection_reason || null,
                    // Données du superviseur
                    validated_by_supervisor:
                      supervisorValidation?.validation_result === "approved",
                    supervisor_validation_result:
                      supervisorValidation?.validation_result || null,
                    supervisor_validated_at:
                      supervisorValidation?.validated_at || null,
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

          const transformedData: Collection[] = collections.map((item) => ({
            ...item,
            collector_name:
              item.collector_name ||
              (item.collector
                ? `${item.collector.first_name} ${item.collector.last_name}`
                : "Non spécifié"),
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
          // setTotalRecords est déjà appelé dans les conditions ci-dessus
        } else {
          setError(
            response.data.message ||
              "Erreur lors de la récupération des collectes."
          );
          setTableData([]);
        }
      } catch (err: any) {
        console.error("Erreur détaillée:", err);
        console.error("Code d'erreur:", err.code);
        console.error("Message d'erreur:", err.message);
        console.error("Réponse d'erreur:", err.response?.data);
        console.error("Statut HTTP:", err.response?.status);
        console.error("URL envoyée:", err.response?.config?.url);

        let errorMessage =
          "Erreur lors de la récupération des collectes des agents.";

        if (err.code === "ERR_NETWORK") {
          errorMessage =
            "Erreur de connexion réseau. Vérifiez votre connexion internet.";
        } else if (err.response?.status === 401) {
          errorMessage = "Session expirée. Veuillez vous reconnecter.";
        } else if (err.response?.status === 403) {
          errorMessage = "Accès refusé. Vérifiez vos permissions.";
        } else if (err.response?.status === 404) {
          errorMessage = `Endpoint non trouvé. Vérifiez l'URL de l'API : ${err.response?.config?.url}`;
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else {
          errorMessage =
            err.message ||
            "Erreur inattendue lors de la récupération des collectes.";
        }

        setError(errorMessage);
        toast.current?.show({
          severity: "error",
          summary: "Erreur de connexion",
          detail: errorMessage,
          life: 5000,
        });
        setTableData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, rowsPerPage]);

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
    console.log("Page actuelle avant changement:", currentPage);
    console.log("Lignes par page avant changement:", rowsPerPage);

    setCurrentPage(event.page + 1);
    setRowsPerPage(event.rows);

    console.log("=== FIN DEBUG PAGINATION ===");
  };

  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const actionBodyTemplate = (rowData: Collection) => {
    return (
      <button
        onClick={() => handleViewDetails(rowData)}
        className="px-3 py-1 text-sm text-white bg-green-600 rounded "
      >
        Voir détails
      </button>
    );
  };

  const collectorBodyTemplate = (rowData: Collection) => {
    // Utiliser le nom du collecteur s'il est disponible
    if (rowData.collector_name) {
      return rowData.collector_name;
    }

    // Fallback sur l'ancienne structure si disponible
    if (rowData.collector) {
      const firstName = rowData.collector.first_name || "";
      const lastName = rowData.collector.last_name || "";
      const fullName = `${firstName} ${lastName}`.trim();
      return fullName || "Non spécifié";
    }

    return "Non spécifié";
  };

  const dateBodyTemplate = (rowData: Collection) => {
    return rowData.collection_date
      ? new Date(rowData.collection_date).toLocaleDateString()
      : new Date(rowData.created_at).toLocaleDateString();
  };

  const statusBodyTemplate = (rowData: Collection) => {
    const statusColors = {
      submitted: "bg-yellow-100 text-yellow-800",
      validated: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      draft: "bg-gray-100 text-gray-800",
      approved: "bg-green-100 text-green-800",
      pending: "bg-blue-100 text-blue-800",
    };

    // Pour le chef d'équipe, afficher le statut de validation après ses actions
    let displayStatus = rowData.status;
    let statusLabel = "Statut initial";

    if (userInfo?.role_id === 4) {
      // Chef d'équipe : afficher le statut après validation
      if (rowData.validated_by_team_manager) {
        // Utiliser validation_action et validation_result pour déterminer le statut
        if (
          rowData.validation_action === "approved" ||
          rowData.validation_result === "approved"
        ) {
          displayStatus = "approved";
          statusLabel = "Validée";
        } else if (
          rowData.validation_action === "rejected" ||
          rowData.validation_result === "rejected"
        ) {
          displayStatus = "rejected";
          statusLabel = "Rejetée";
        } else {
          displayStatus = "pending";
          statusLabel = "En attente";
        }
      } else {
        displayStatus = "submitted";
        statusLabel = "À traiter";
      }
    } else if (userInfo?.role_id === 5) {
      // Superviseur : afficher le statut de validation du superviseur
      console.log("Superviseur - Données de la collection:", {
        id: rowData.id,
        validated_by_supervisor: rowData.validated_by_supervisor,
        supervisor_validation_result: rowData.supervisor_validation_result,
        supervisor_validated_at: rowData.supervisor_validated_at,
        validated_by_team_manager: rowData.validated_by_team_manager,
        validation_result: rowData.validation_result,
      });

      if (rowData.supervisor_validation_result === "approved") {
        // Collecte validée par le superviseur
        displayStatus = "approved";
        statusLabel = "Validée par superviseur";
      } else if (rowData.supervisor_validation_result === "rejected") {
        // Collecte rejetée par le superviseur
        displayStatus = "rejected";
        statusLabel = "Rejetée par superviseur";
      } else if (
        rowData.validated_by_team_manager &&
        rowData.validation_result === "approved"
      ) {
        // Collecte validée par le chef d'équipe, en attente du superviseur
        displayStatus = "pending";
        statusLabel = "En attente superviseur";
      } else {
        // Collecte pas encore validée par le chef d'équipe
        displayStatus = "submitted";
        statusLabel = "En attente chef d'équipe";
      }
    }

    return (
      <div className="flex flex-col gap-1">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            statusColors[displayStatus as keyof typeof statusColors] ||
            "bg-gray-100 text-gray-800"
          }`}
        >
          {statusLabel}
        </span>
        {userInfo?.role_id === 4 && rowData.validated_by_team_manager && (
          <div className="text-xs text-gray-500">
            <div>
              {rowData.validation_action === "rejected" ||
              rowData.validation_result === "rejected"
                ? "Rejetée le"
                : "Traitée le"}{" "}
              {rowData.validated_at
                ? new Date(rowData.validated_at).toLocaleDateString()
                : "N/A"}
            </div>
            {rowData.rejection_reason && (
              <div className="text-red-600 mt-1">
                Raison: {rowData.rejection_reason}
              </div>
            )}
          </div>
        )}
        {userInfo?.role_id === 5 &&
          (rowData.supervisor_validation_result === "approved" ||
            rowData.supervisor_validation_result === "rejected") && (
            <div className="text-xs text-gray-500">
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
            </div>
          )}
      </div>
    );
  };

  const originBodyTemplate = (rowData: Collection) => {
    // Utiliser les nouvelles données structurées
    let cityName = "Non spécifié";
    let countryName = rowData.originCountry?.name || "Non spécifié";
    let countryFlag = rowData.originCountry?.flag || "";

    // Essayer de récupérer le nom de la ville depuis les collectionItems
    if (rowData.collectionItems && rowData.collectionItems.length > 0) {
      const firstItem = rowData.collectionItems[0];
      if (firstItem.loadingCity?.name) {
        cityName = firstItem.loadingCity.name;
      }
    }

    // Fallback sur les anciens champs si les nouveaux ne sont pas disponibles
    if (cityName === "Non spécifié" && rowData.origin_city_id) {
      cityName = `Ville ID: ${rowData.origin_city_id}`;
    }

    return (
      <div className="text-sm">
        <div className="font-medium">
          {cityName} ({countryFlag} {countryName})
        </div>
      </div>
    );
  };

  const destinationBodyTemplate = (rowData: Collection) => {
    // Utiliser les nouvelles données structurées
    let cityName = "Non spécifié";
    let countryName = rowData.destinationCountry?.name || "Non spécifié";
    let countryFlag = rowData.destinationCountry?.flag || "";

    // Essayer de récupérer le nom de la ville depuis les collectionItems
    if (rowData.collectionItems && rowData.collectionItems.length > 0) {
      const firstItem = rowData.collectionItems[0];
      if (firstItem.unloadingCity?.name) {
        cityName = firstItem.unloadingCity.name;
      }
    }

    // Fallback sur les anciens champs si les nouveaux ne sont pas disponibles
    if (cityName === "Non spécifié" && rowData.final_destination_city_id) {
      cityName = `Ville ID: ${rowData.final_destination_city_id}`;
    }

    return (
      <div className="text-sm">
        <div className="font-medium">
          {cityName} ({countryFlag} {countryName})
        </div>
      </div>
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

  // Debug pour la pagination
  console.log("=== RENDER DEBUG ===");
  console.log("tableData.length:", tableData.length);
  console.log("totalRecords:", totalRecords);
  console.log("currentPage:", currentPage);
  console.log("rowsPerPage:", rowsPerPage);
  console.log("first:", (currentPage - 1) * rowsPerPage);
  console.log("=== FIN RENDER DEBUG ===");

  return (
    <div className="p-4">
      <ComponentCard title={t("agent_collections")}>
        <DataTable
          value={tableData}
          loading={isLoading}
          responsiveLayout="scroll"
          showGridlines
          rows={rowsPerPage}
          first={(currentPage - 1) * rowsPerPage}
          totalRecords={totalRecords}
          onPage={onPageChange}
          filterDisplay="row"
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
          emptyMessage="Aucune collecte trouvée."
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
    </div>
  );
};

export default CollectionsTableOne;
