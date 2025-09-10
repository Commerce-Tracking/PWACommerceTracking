import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import axiosInstance from "../../api/axios";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";

// Interfaces mises à jour selon la nouvelle structure API
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
  };
  originCity?: {
    name: string;
  };
  finalDestinationCity?: {
    name: string;
  };
  currency?: {
    name: string;
    code: string;
    symbol: string;
  };
  season?: {
    name: string;
  };
  collectionValidations?: Array<{
    id: number;
    validation_level: string;
    validation_action: string;
    validation_result: string;
    data_quality_score: number | null;
    validation_notes: string | null;
    rejection_reason: string | null;
    validated_at: string | null;
    priority_level?: string;
    submitted_at?: string;
    correction_instructions?: string | null;
    revision_number?: number;
    is_current_validation?: number;
  }>;
}

interface ValidationResponse {
  success: boolean;
  message: string;
  result: {
    id: number;
    public_id: string;
    collection_id: number;
    validation_level: string;
    validator_id: number;
    validation_action: string;
    validation_result: string;
    data_quality_score: number | null;
    validation_notes: string;
    rejection_reason: string | null;
    correction_instructions: string | null;
    quality_issues: {
      missing_fields: string[] | null;
      incomplete_data: boolean | null;
      data_consistency: string | null;
    } | null;
    validation_metadata: {
      validation_method: string;
      verification_date: string;
      verification_location: string;
    } | null;
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
  };
  errors: any;
  except: any;
}

interface WorkflowResponse {
  success: boolean;
  message: string;
  result: {
    collection_id: number;
    current_step: string;
    team_manager_validation: {
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
      validator: {
        id: number;
        public_id: string;
        user_id: number;
        organization_id: number;
        team_manager_id: number | null;
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
    } | null;
    supervisor_validation: {
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
      validator: {
        id: number;
        public_id: string;
        user_id: number;
        organization_id: number;
        team_manager_id: number | null;
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
    } | null;
    can_proceed: boolean;
    next_actions: string[];
    validation_history: Array<{
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
      validator: {
        id: number;
        public_id: string;
        user_id: number;
        organization_id: number;
        team_manager_id: number | null;
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
    }>;
  };
  errors: any;
  except: any;
}

const CollectionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const { t } = useTranslation();
  const toast = useRef<Toast>(null);

  const [collection, setCollection] = useState<Collection | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [showValidationDialog, setShowValidationDialog] =
    useState<boolean>(false);
  const [validationNotes, setValidationNotes] = useState<string>("");
  const [dataQualityScore, setDataQualityScore] = useState<number>(85);
  const [showRejectDialog, setShowRejectDialog] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>("");
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  const [isValidatingSupervisor, setIsValidatingSupervisor] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        setIsLoading(true);

        // Récupérer les données de la collecte
        console.log(`Fetching collection data for ID: ${id}`);
        const collectionResponse = await axiosInstance.get(
          `/api/trade-flow/collections/${id}`
        );
        console.log(
          "Données de la collecte:",
          JSON.stringify(collectionResponse.data, null, 2)
        );

        if (collectionResponse.data.success) {
          let collectionData = collectionResponse.data.result;

          // Récupérer l'état du workflow
          try {
            console.log(`Fetching workflow data for ID: ${id}`);
            const workflowResponse = await axiosInstance.get<WorkflowResponse>(
              `/api/trade-flow/collections/${id}/workflow`
            );
            console.log(
              "Données du workflow:",
              JSON.stringify(workflowResponse.data, null, 2)
            );

            if (workflowResponse.data.success) {
              const workflow = workflowResponse.data.result;

              // Mise à jour pour le chef d'équipe
              if (workflow.team_manager_validation) {
                collectionData = {
                  ...collectionData,
                  validated_by_team_manager:
                    workflow.team_manager_validation.validation_result ===
                    "approved",
                  validation_result:
                    workflow.team_manager_validation.validation_result,
                  validated_at: workflow.team_manager_validation.validated_at,
                };
              }

              // Mise à jour pour le superviseur
              if (workflow.supervisor_validation) {
                const isSupervisorValidated =
                  workflow.supervisor_validation.validation_result ===
                    "approved" && workflow.supervisor_validation.validated_at;

                console.log("=== DEBUG SUPERVISOR VALIDATION ===");
                console.log(
                  "supervisor_validation:",
                  workflow.supervisor_validation
                );
                console.log(
                  "validation_result:",
                  workflow.supervisor_validation.validation_result
                );
                console.log(
                  "validated_at:",
                  workflow.supervisor_validation.validated_at
                );
                console.log("isSupervisorValidated:", isSupervisorValidated);
                console.log("=== FIN DEBUG SUPERVISOR VALIDATION ===");

                collectionData = {
                  ...collectionData,
                  validated_by_supervisor: isSupervisorValidated,
                  supervisor_validation_result:
                    workflow.supervisor_validation.validation_result,
                  supervisor_validated_at:
                    workflow.supervisor_validation.validated_at,
                };
              }
            } else {
              console.log("Workflow non réussi:", workflowResponse.data);
            }
          } catch (workflowErr: any) {
            console.error("Erreur lors de la récupération du workflow:", {
              message: workflowErr.message,
              response: workflowErr.response?.data,
              status: workflowErr.response?.status,
              statusText: workflowErr.response?.statusText,
            });

            // Fallback: vérifier dans collectionValidations
            const teamManagerValidation =
              collectionData.collectionValidations?.find(
                (validation: any) =>
                  validation.validation_level === "1" &&
                  validation.validation_result === "approved"
              );

            const supervisorValidation =
              collectionData.collectionValidations?.find(
                (validation: any) =>
                  validation.validation_level === "2" &&
                  validation.validation_result === "approved"
              );

            if (teamManagerValidation) {
              collectionData = {
                ...collectionData,
                validated_by_team_manager: true,
                validation_result: teamManagerValidation.validation_result,
                validated_at: teamManagerValidation.validated_at,
              };
            }

            if (supervisorValidation) {
              collectionData = {
                ...collectionData,
                validated_by_supervisor: true,
                supervisor_validation_result:
                  supervisorValidation.validation_result,
                supervisor_validated_at: supervisorValidation.validated_at,
              };
            }
          }

          setCollection(collectionData);
          setIsLoading(false);
        } else {
          console.error(
            "Échec de la récupération des données de la collecte:",
            collectionResponse.data
          );
          setError(
            collectionResponse.data.message ||
              "Erreur lors de la récupération des données"
          );
          setIsLoading(false);
        }

        if (collectionResponse.data.errors || collectionResponse.data.except) {
          toast.current?.show({
            severity: "error",
            summary: "Erreur",
            detail:
              collectionResponse.data.errors ||
              collectionResponse.data.except ||
              "Erreur inconnue",
            life: 5000,
          });
        }
      } catch (err: any) {
        console.error("Erreur API:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          statusText: err.response?.statusText,
          config: err.config,
        });
        setError(err.message || "Erreur lors de la récupération des données");
        setIsLoading(false);
      }
    };

    fetchCollection();
  }, [id]);

  const handleValidate = async () => {
    if (!collection || !userInfo) return;

    try {
      setIsValidating(true);

      const requestData = {
        data_quality_score: dataQualityScore,
        validation_notes:
          validationNotes ||
          (userInfo?.role_id === 4
            ? "Validation effectuée par le chef d'équipe"
            : "Validation effectuée par le superviseur"),
      };

      console.log(
        `Validating collection ID: ${collection.id} with data:`,
        requestData
      );

      // Choisir l'endpoint selon le rôle
      const endpoint =
        userInfo?.role_id === 4
          ? `/api/trade-flow/collections/${collection.id}/validate/team-manager/complete`
          : `/api/trade-flow/collections/${collection.id}/validate/supervisor/complete`;

      const response = await axiosInstance.post<ValidationResponse>(
        endpoint,
        requestData
      );
      console.log(
        "Réponse de validation:",
        JSON.stringify(response.data, null, 2)
      );

      if (response.data.success) {
        toast.current?.show({
          severity: "success",
          summary: "Validation réussie",
          detail: response.data.message,
          life: 5000,
        });

        // Recharger les données de la collecte
        console.log(`Reloading collection data for ID: ${collection.id}`);
        const collectionResponse = await axiosInstance.get(
          `/api/trade-flow/collections/${collection.id}`
        );
        console.log(
          "Données de la collecte après validation:",
          JSON.stringify(collectionResponse.data, null, 2)
        );

        if (collectionResponse.data.success) {
          let updatedCollection = collectionResponse.data.result;

          // Recharger l'état du workflow
          try {
            console.log(`Reloading workflow data for ID: ${collection.id}`);
            const workflowResponse = await axiosInstance.get<WorkflowResponse>(
              `/api/trade-flow/collections/${collection.id}/workflow`
            );
            console.log(
              "Données du workflow après validation:",
              JSON.stringify(workflowResponse.data, null, 2)
            );

            if (workflowResponse.data.success) {
              const workflow = workflowResponse.data.result;

              // Mise à jour pour le chef d'équipe
              if (workflow.team_manager_validation) {
                updatedCollection = {
                  ...updatedCollection,
                  validated_by_team_manager:
                    workflow.team_manager_validation.validation_result ===
                    "approved",
                  validation_result:
                    workflow.team_manager_validation.validation_result,
                  validated_at: workflow.team_manager_validation.validated_at,
                };
              }

              // Mise à jour pour le superviseur
              if (workflow.supervisor_validation) {
                const isSupervisorValidated =
                  workflow.supervisor_validation.validation_result ===
                    "approved" && workflow.supervisor_validation.validated_at;

                updatedCollection = {
                  ...updatedCollection,
                  validated_by_supervisor: isSupervisorValidated,
                  supervisor_validation_result:
                    workflow.supervisor_validation.validation_result,
                  supervisor_validated_at:
                    workflow.supervisor_validation.validated_at,
                };
              }
            }
          } catch (workflowErr: any) {
            console.error(
              "Erreur lors de la récupération du workflow après validation:",
              {
                message: workflowErr.message,
                response: workflowErr.response?.data,
                status: workflowErr.response?.status,
                statusText: workflowErr.response?.statusText,
              }
            );
          }

          setCollection(updatedCollection);
        }

        setShowValidationDialog(false);
        setValidationNotes("");
        setDataQualityScore(85);
      } else {
        console.error("Échec de la validation:", response.data);
        toast.current?.show({
          severity: "error",
          summary: "Erreur de validation",
          detail: response.data.message || "Erreur lors de la validation",
          life: 5000,
        });
      }
    } catch (err: any) {
      console.error("Erreur lors de la validation:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText,
        config: err.config,
      });
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de la validation de la collecte";

      toast.current?.show({
        severity: "error",
        summary: "Erreur de validation",
        detail: errorMessage,
        life: 5000,
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleReject = async () => {
    if (!collection || !userInfo || !rejectReason.trim()) return;

    try {
      setIsRejecting(true);

      const requestData = {
        reason: rejectReason.trim(),
        level: userInfo?.role_id === 4 ? "1" : "2", // Niveau selon le rôle
      };

      console.log(
        `Rejecting collection ID: ${collection.id} with data:`,
        requestData
      );
      console.log(
        "URL de rejet:",
        `/api/trade-flow/collections/${collection.id}/reject`
      );
      console.log("Raison du rejet:", rejectReason.trim());

      const response = await axiosInstance.post(
        `/api/trade-flow/collections/${collection.id}/reject`,
        requestData
      );

      console.log("Réponse de rejet:", JSON.stringify(response.data, null, 2));

      if (response.data.success) {
        toast.current?.show({
          severity: "success",
          summary: "Collecte rejetée",
          detail: response.data.message,
          life: 5000,
        });

        // Recharger les données de la collecte
        console.log(`Reloading collection data for ID: ${collection.id}`);
        const collectionResponse = await axiosInstance.get(
          `/api/trade-flow/collections/${collection.id}`
        );

        if (collectionResponse.data.success) {
          let updatedCollection = collectionResponse.data.result;

          // Recharger l'état du workflow
          try {
            const workflowResponse = await axiosInstance.get<WorkflowResponse>(
              `/api/trade-flow/collections/${collection.id}/workflow`
            );

            if (workflowResponse.data.success) {
              const workflow = workflowResponse.data.result;

              // Mise à jour pour le chef d'équipe
              if (workflow.team_manager_validation) {
                updatedCollection = {
                  ...updatedCollection,
                  validated_by_team_manager:
                    workflow.team_manager_validation.validation_result ===
                    "approved",
                  validation_result:
                    workflow.team_manager_validation.validation_result,
                  validated_at: workflow.team_manager_validation.validated_at,
                };
              }

              // Mise à jour pour le superviseur
              if (workflow.supervisor_validation) {
                const isSupervisorValidated =
                  workflow.supervisor_validation.validation_result ===
                    "approved" && workflow.supervisor_validation.validated_at;

                updatedCollection = {
                  ...updatedCollection,
                  validated_by_supervisor: isSupervisorValidated,
                  supervisor_validation_result:
                    workflow.supervisor_validation.validation_result,
                  supervisor_validated_at:
                    workflow.supervisor_validation.validated_at,
                };
              }
            }
          } catch (workflowErr: any) {
            console.error(
              "Erreur lors de la récupération du workflow après rejet:",
              {
                message: workflowErr.message,
                response: workflowErr.response?.data,
                status: workflowErr.response?.status,
                statusText: workflowErr.response?.statusText,
              }
            );
          }

          setCollection(updatedCollection);
        }

        setShowRejectDialog(false);
        setRejectReason("");
      } else {
        console.error("Échec du rejet:", response.data);
        toast.current?.show({
          severity: "error",
          summary: "Erreur de rejet",
          detail: response.data.message || "Erreur lors du rejet",
          life: 5000,
        });
      }
    } catch (err: any) {
      console.error("Erreur lors du rejet:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText,
        config: err.config,
      });

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Erreur lors du rejet de la collecte";

      toast.current?.show({
        severity: "error",
        summary: "Erreur de rejet",
        detail: errorMessage,
        life: 5000,
      });
    } finally {
      setIsRejecting(false);
    }
  };

  const handleSupervisorValidate = async () => {
    if (!collection || !userInfo) return;

    try {
      setIsValidatingSupervisor(true);

      const requestData = {
        validation_notes:
          validationNotes.trim() || "Validation complète par le superviseur",
        data_quality_score: dataQualityScore,
        validation_metadata: {
          validation_method: "field_verification",
          verification_date: new Date().toISOString(),
          verification_location: "Validation en ligne",
        },
      };

      console.log(
        `Validating collection ID: ${collection.id} by supervisor with data:`,
        requestData
      );

      const response = await axiosInstance.post(
        `/api/trade-flow/collections/${collection.id}/validate/supervisor/complete`,
        requestData
      );

      console.log(
        "Supervisor validation response:",
        JSON.stringify(response.data, null, 2)
      );

      if (response.data.success) {
        toast.current?.show({
          severity: "success",
          summary: "Collecte validée",
          detail: response.data.message,
          life: 5000,
        });

        // Recharger les données de la collecte
        console.log(`Reloading collection data for ID: ${collection.id}`);
        const collectionResponse = await axiosInstance.get(
          `/api/trade-flow/collections/${collection.id}`
        );

        if (collectionResponse.data.success) {
          let updatedCollection = collectionResponse.data.result;

          // Recharger l'état du workflow
          try {
            const workflowResponse = await axiosInstance.get<WorkflowResponse>(
              `/api/trade-flow/collections/${collection.id}/workflow`
            );

            if (workflowResponse.data.success) {
              const workflow = workflowResponse.data.result;

              // Mise à jour pour le superviseur
              if (workflow.supervisor_validation) {
                const isSupervisorValidated =
                  workflow.supervisor_validation.validation_result ===
                    "approved" && workflow.supervisor_validation.validated_at;

                updatedCollection = {
                  ...updatedCollection,
                  validated_by_supervisor: isSupervisorValidated,
                  supervisor_validation_result:
                    workflow.supervisor_validation.validation_result,
                  supervisor_validated_at:
                    workflow.supervisor_validation.validated_at,
                };
              }
            }
          } catch (workflowErr: any) {
            console.error(
              "Erreur lors de la récupération du workflow après validation superviseur:",
              {
                message: workflowErr.message,
                response: workflowErr.response?.data,
                status: workflowErr.response?.status,
                statusText: workflowErr.response?.statusText,
              }
            );
          }

          setCollection(updatedCollection);
        }
      }
    } catch (err: any) {
      console.error("Erreur lors de la validation superviseur:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText,
        config: err.config,
      });

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de la validation par le superviseur";

      toast.current?.show({
        severity: "error",
        summary: "Erreur de validation",
        detail: errorMessage,
        life: 5000,
      });
    } finally {
      setIsValidatingSupervisor(false);
    }
  };

  const canValidate = () => {
    const result =
      userInfo?.role_id === 4 &&
      !collection?.validated_by_team_manager &&
      collection?.validation_result !== "approved" &&
      collection?.validation_result !== "rejected";
    console.log("=== DEBUG canValidate ===");
    console.log("userInfo:", userInfo);
    console.log("userInfo?.role_id:", userInfo?.role_id);
    console.log("collection:", collection);
    console.log(
      "collection?.validated_by_team_manager:",
      collection?.validated_by_team_manager
    );
    console.log(
      "collection?.validation_result:",
      collection?.validation_result
    );
    console.log("collection?.validated_at:", collection?.validated_at);
    console.log("collection?.status:", collection?.status);
    console.log("Conditions individuelles:");
    console.log("- userInfo?.role_id === 4:", userInfo?.role_id === 4);
    console.log(
      "- !collection?.validated_by_team_manager:",
      !collection?.validated_by_team_manager
    );
    console.log(
      "- collection?.validation_result !== 'approved':",
      collection?.validation_result !== "approved"
    );
    console.log(
      "- collection?.validation_result !== 'rejected':",
      collection?.validation_result !== "rejected"
    );
    console.log("canValidate result:", result);
    console.log("========================");
    return result;
  };

  const canSupervisorValidate = () => {
    // Pour le superviseur, vérifier si la collecte est validée par le chef d'équipe
    // et n'est pas encore validée par le superviseur
    const result =
      userInfo?.role_id === 5 &&
      collection?.validated_by_team_manager &&
      collection?.validation_result === "approved" &&
      !collection?.validated_by_supervisor;

    console.log("=== DEBUG canSupervisorValidate ===");
    console.log("userInfo?.role_id === 5:", userInfo?.role_id === 5);
    console.log(
      "collection?.validated_by_team_manager:",
      collection?.validated_by_team_manager
    );
    console.log(
      "collection?.validation_result === 'approved':",
      collection?.validation_result === "approved"
    );
    console.log(
      "!collection?.validated_by_supervisor:",
      !collection?.validated_by_supervisor
    );
    console.log("Résultat final:", result);
    console.log("=== FIN DEBUG canSupervisorValidate ===");
    return result;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Collecte non trouvée"}</p>
          <Button
            label="Retour à la liste"
            icon="pi pi-arrow-left"
            style={{ backgroundColor: "#00277F", borderColor: "#00277F" }}
            onClick={() => navigate("/create-user")}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageMeta
        title="OFR | Détails de la collecte"
        description="Détails de la collecte des agents"
      />
      <PageBreadcrumb pageTitle={`Détails de la collecte`} />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600 dark:text-gray-400">
              {collection.collection_type} - {collection.status}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              label="Retour à la liste"
              icon="pi pi-arrow-left"
              style={{ backgroundColor: "#00277F", borderColor: "#00277F" }}
              onClick={() => navigate("/create-user")}
            />
            {(canValidate() || canSupervisorValidate()) && (
              <>
                <Button
                  label="Valider la collecte"
                  icon="pi pi-check"
                  className="!bg-green-600 !hover:bg-green-700"
                  onClick={() => setShowValidationDialog(true)}
                />
                {(userInfo?.role_id === 4 ||
                  (canSupervisorValidate() &&
                    collection.supervisor_validation_result !==
                      "rejected")) && (
                  <Button
                    label="Rejeter la collecte"
                    icon="pi pi-times"
                    className="!bg-red-600 !hover:bg-red-700"
                    onClick={() => setShowRejectDialog(true)}
                  />
                )}
              </>
            )}
            {userInfo?.role_id === 4 &&
              collection.validated_by_team_manager && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                  <i className="pi pi-check-circle text-green-600"></i>
                  <span className="text-sm font-medium">
                    Collecte déjà validée
                  </span>
                </div>
              )}
            {userInfo?.role_id === 4 &&
              collection?.validation_result === "rejected" && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg">
                  <i className="pi pi-times-circle text-red-600"></i>
                  <span className="text-sm font-medium">Collecte rejetée</span>
                </div>
              )}
            {userInfo?.role_id === 5 &&
              collection.validated_by_team_manager &&
              !collection.validated_by_supervisor && (
                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
                  <i className="pi pi-clock text-yellow-600"></i>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      En attente de validation superviseur
                    </span>
                    {collection.validated_at && (
                      <span className="text-xs text-yellow-600">
                        Validée par le chef d'équipe le{" "}
                        {new Date(collection.validated_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              )}
            {userInfo?.role_id === 5 &&
              collection.supervisor_validation_result === "rejected" && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg">
                  <i className="pi pi-times-circle text-red-600"></i>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      Collecte rejetée par le superviseur
                    </span>
                    {collection.supervisor_validated_at && (
                      <span className="text-xs text-red-600">
                        Rejetée le{" "}
                        {new Date(
                          collection.supervisor_validated_at
                        ).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              )}
            {userInfo?.role_id === 5 && collection.validated_by_supervisor && (
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
                <i className="pi pi-check-circle text-blue-600"></i>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    Collecte validée par le superviseur
                  </span>
                  {collection.supervisor_validated_at && (
                    <span className="text-xs text-blue-600">
                      Validée le{" "}
                      {new Date(
                        collection.supervisor_validated_at
                      ).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <ComponentCard title="Informations générales">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">
                Collecte
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">ID :</span> {collection.id}
                </p>
                {/* <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Public ID :</span>{" "}
                  {collection.public_id}
                </p> */}
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Type :</span>{" "}
                  {collection.collection_type}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Contexte :</span>{" "}
                  {collection.collection_context}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Genre de l'opérateur :</span>{" "}
                  {collection.operator_gender}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Type d'opérateur :</span>{" "}
                  {collection.operator_type}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Nature du répondant :</span>{" "}
                  {collection.respondent_nature}
                </p>
                {collection.other_respondent_nature && (
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Autre nature :</span>{" "}
                    {collection.other_respondent_nature}
                  </p>
                )}
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Genre du propriétaire :</span>{" "}
                  {collection.merchandise_owner_gender}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Catégorie d'âge :</span>{" "}
                  {collection.merchandise_owner_age_category}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Handicap :</span>{" "}
                  {collection.merchandise_owner_has_disability ? "Oui" : "Non"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Statut :</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-xs ${
                      collection.status === "validated"
                        ? "bg-green-100 text-green-800"
                        : collection.status === "submitted"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {collection.status}
                  </span>
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Date de collecte :</span>{" "}
                  {collection.collection_date
                    ? new Date(collection.collection_date).toLocaleDateString()
                    : "Non définie"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Créé le :</span>{" "}
                  {new Date(collection.created_at).toLocaleString()}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Mise à jour le :</span>{" "}
                  {new Date(collection.updated_at).toLocaleString()}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Conditions du marché :</span>{" "}
                  {collection.market_condition}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Variation des prix :</span>{" "}
                  {collection.market_price_variation} %
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Notes :</span>{" "}
                  {collection.notes || "Aucune"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">
                Collecteur
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Nom :</span>{" "}
                  {collection.collector?.first_name || "Non spécifié"}{" "}
                  {collection.collector?.last_name || ""}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Téléphone :</span>{" "}
                  {collection.collector?.phone || "Non spécifié"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Email :</span>{" "}
                  {collection.collector?.email || "Non spécifié"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Genre :</span>{" "}
                  {collection.collector?.gender || "Non spécifié"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Adresse :</span>{" "}
                  {collection.collector?.address || "Non spécifié"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Nationalité :</span>{" "}
                  {collection.collector?.nationality || "Non spécifié"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Date de naissance :</span>{" "}
                  {collection.collector?.date_of_birth
                    ? new Date(
                        collection.collector.date_of_birth
                      ).toLocaleDateString()
                    : "Non spécifié"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Lieu de naissance :</span>{" "}
                  {collection.collector?.place_of_birth || "Non spécifié"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">
                Point de Collecte et Corridor
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Point de collecte :</span>{" "}
                  {collection.collectionPoint?.name || "Non spécifié"}
                </p>
                {collection.collectionPoint?.description && (
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Description :</span>{" "}
                    {collection.collectionPoint.description}
                  </p>
                )}
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Localité :</span>{" "}
                  {collection.collectionPoint?.locality || "Non spécifiée"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Région :</span>{" "}
                  {collection.collectionPoint?.region || "Non spécifiée"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Type de point :</span>{" "}
                  {collection.collectionPoint?.is_formal
                    ? "Formel"
                    : "Informel"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Passage frontière :</span>{" "}
                  {collection.collectionPoint?.is_border_crossing
                    ? "Oui"
                    : "Non"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Marché :</span>{" "}
                  {collection.collectionPoint?.is_market ? "Oui" : "Non"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Fluvial :</span>{" "}
                  {collection.collectionPoint?.is_fluvial ? "Oui" : "Non"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Poste de contrôle :</span>{" "}
                  {collection.collectionPoint?.is_checkpoint ? "Oui" : "Non"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Corridor :</span>{" "}
                  {collection.corridor?.name || "Non spécifié"}
                </p>
                {collection.corridor?.description && (
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">
                      Description du corridor :
                    </span>{" "}
                    {collection.corridor.description}
                  </p>
                )}
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Distance :</span>{" "}
                  {collection.corridor?.distance
                    ? `${collection.corridor.distance} km`
                    : "Non spécifiée"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">
                    Nombre de postes de contrôle :
                  </span>{" "}
                  {collection.corridor?.nbre_checkpoints || 0}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">
                Transport et Taxes
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Point de chargement :</span>{" "}
                  {collection.originCity?.name} (
                  {collection.originCountry?.flag}{" "}
                  {collection.originCountry?.name})
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">
                    Destination intermédiaire :
                  </span>{" "}
                  {collection.intermediate_destination || "Aucune"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Point de déchargement :</span>{" "}
                  {collection.finalDestinationCity?.name} (
                  {collection.destinationCountry?.flag}{" "}
                  {collection.destinationCountry?.name})
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Pays d'origine :</span>{" "}
                  {collection.originCountry?.flag}{" "}
                  {collection.originCountry?.name}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Pays de destination :</span>{" "}
                  {collection.destinationCountry?.flag}{" "}
                  {collection.destinationCountry?.name}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Direction :</span>{" "}
                  {collection.trade_flow_direction}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Moyen de transport :</span>{" "}
                  {collection.transportMode?.name} -{" "}
                  {collection.transportMode?.description}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Plaque :</span>{" "}
                  {collection.vehicle_registration_number}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Coût du transport :</span>{" "}
                  {collection.transport_cost
                    ? `${collection.transport_cost} ${collection.currency?.symbol}`
                    : "Non spécifié"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Paiement :</span>{" "}
                  {collection.payment_method}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Devise :</span>{" "}
                  {collection.currency?.name} ({collection.currency?.symbol})
                </p>
                {/* <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Saison :</span>{" "}
                  {collection.season?.name || "Non spécifié"}
                </p> */}
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Poids total :</span>{" "}
                  {collection.total_weight_kg} kg
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Taxes et frais :</span>{" "}
                  {collection.taxes_fees
                    ? `${collection.taxes_fees} ${collection.currency?.symbol}`
                    : "Non spécifié"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Détails des taxes :</span>{" "}
                  {collection.tax_details || "Aucun"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Taxes payées :</span>{" "}
                  {collection.taxes_paid ? "Oui" : "Non"} (
                  {collection.tax_amount} {collection.currency?.symbol})
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Frais illégaux payés :</span>{" "}
                  {collection.illegal_fees_paid ? "Oui" : "Non"} (
                  {collection.illegal_fees_amount || "Aucun"}{" "}
                  {collection.currency?.symbol})
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">
                    Lieux des frais illégaux :
                  </span>{" "}
                  {collection.illegal_fees_locations || "Aucun"}
                </p>
                {/* <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Coordonnées GPS :</span>{" "}
                  {collection.gps_latitude && collection.gps_longitude
                    ? `${collection.gps_latitude}, ${collection.gps_longitude}`
                    : "Non spécifiées"}
                </p> */}
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Postes de contrôle :</span>{" "}
                  {collection.has_control_posts ? "Oui" : "Non"} (
                  {collection.control_posts_count || 0} postes)
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">
                    Lieux des postes de contrôle :
                  </span>{" "}
                  {collection.control_locations || "Aucun"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Durée des contrôles :</span>{" "}
                  {collection.control_duration_value &&
                  collection.control_duration_type
                    ? `${collection.control_duration_value} ${collection.control_duration_type}`
                    : "Non spécifiée"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Jour de marché :</span>{" "}
                  {collection.market_day || "Non spécifié"}
                </p>
                {/* <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Marchés à proximité :</span>{" "}
                  {collection.nearby_markets || "Aucun"}
                </p> */}
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Conditions du marché :</span>{" "}
                  {collection.market_condition || "Non spécifiées"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Variation des prix :</span>{" "}
                  {collection.market_price_variation
                    ? `${collection.market_price_variation}%`
                    : "Non spécifiée"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">
                    Connaît les réglementations communautaires :
                  </span>{" "}
                  {collection.knows_community_regulations ? "Oui" : "Non"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">
                    Connaît les réglementations nationales :
                  </span>{" "}
                  {collection.knows_national_regulations ? "Oui" : "Non"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Autres difficultés :</span>{" "}
                  {collection.other_difficulties || "Aucune"}
                </p>
              </div>
            </div>
          </div>
        </ComponentCard>

        <ComponentCard
          title={`Articles collectés (${
            collection.collectionItems?.length || 0
          })`}
        >
          <div className="space-y-4">
            {collection.collectionItems?.map((item, index) => (
              <div
                key={item.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
                  Article {index + 1} -{" "}
                  {item.product?.name || item.animal?.name || "N/A"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Produit :</span>{" "}
                      {item.product?.name || "Non spécifié"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Code HS :</span>{" "}
                      {item.product?.HS_code || "Non spécifié"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Description :</span>{" "}
                      {item.product?.description || "Non spécifiée"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Quantité :</span>{" "}
                      {item.quantity} {item.unity?.symbol || ""}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Unité :</span>{" "}
                      {item.unity?.name || "Non spécifiée"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Prix unitaire :</span>{" "}
                      {item.unit_price} FCFA
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Valeur totale :</span>{" "}
                      {item.total_value} FCFA
                    </p>
                    {item.product_quality && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Qualité :</span>{" "}
                        {item.product_quality}
                      </p>
                    )}
                    {item.product_variety && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Variété :</span>{" "}
                        {item.product_variety}
                      </p>
                    )}
                    {item.is_seasonal_product && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">
                          Produit saisonnier :
                        </span>{" "}
                        {item.is_seasonal_product ? "Oui" : "Non"}
                      </p>
                    )}
                    {item.harvest_period && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">
                          Période de récolte :
                        </span>{" "}
                        {item.harvest_period}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Origine spécifique :</span>{" "}
                      {item.specific_origin || "Non spécifiée"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">
                        Destination spécifique :
                      </span>{" "}
                      {item.specific_destination || "Non spécifiée"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">
                        Poids unitaire local :
                      </span>{" "}
                      {item.local_unit_weight_kg} kg
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Poids total :</span>{" "}
                      {item.total_weight_kg} kg
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Coût de chargement :</span>{" "}
                      {item.loading_cost} FCFA
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">
                        Coût de déchargement :
                      </span>{" "}
                      {item.unloading_cost} FCFA
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Coût de transport :</span>{" "}
                      {item.transport_cost} FCFA
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Pays d'origine :</span>{" "}
                      {item.originCountry?.flag} {item.originCountry?.name}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Ville de chargement :</span>{" "}
                      {item.loadingCity?.name || "Non spécifiée"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">
                        Ville de déchargement :
                      </span>{" "}
                      {item.unloadingCity?.name || "Non spécifiée"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">
                        Enregistrement douanier :
                      </span>{" "}
                      {item.is_customs_registered ? "Oui" : "Non"}
                    </p>
                    {item.customs_registration_number && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">
                          Numéro d'enregistrement :
                        </span>{" "}
                        {item.customs_registration_number}
                      </p>
                    )}
                    {item.animal_count && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Nombre d'animaux :</span>{" "}
                        {item.animal_count}
                      </p>
                    )}
                    {item.animal_breed && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Race :</span>{" "}
                        {item.animal_breed}
                      </p>
                    )}
                    {item.animal_condition && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Condition :</span>{" "}
                        {item.animal_condition}
                      </p>
                    )}
                    {item.animal_gender && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Genre des animaux :</span>{" "}
                        {item.animal_gender}
                      </p>
                    )}
                    {item.average_weight_kg && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Poids moyen :</span>{" "}
                        {item.average_weight_kg} kg
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Pertes :</span>{" "}
                      {item.losses_quantity || "0"} ({item.losses_value || "0"}{" "}
                      FCFA)
                    </p>
                    {item.loss_reasons && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">
                          Raisons des pertes :
                        </span>{" "}
                        {item.loss_reasons}
                      </p>
                    )}
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">
                        Permis spéciaux requis :
                      </span>{" "}
                      {item.required_special_permits ? "Oui" : "Non"}
                    </p>
                    {item.special_permits_details && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">
                          Détails des permis :
                        </span>{" "}
                        {item.special_permits_details}
                      </p>
                    )}
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Frais spécifiques :</span>{" "}
                      {item.item_specific_fees || "0"} FCFA
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Produit saisonnier :</span>{" "}
                      {item.is_seasonal_product ? "Oui" : "Non"}
                    </p>
                    {item.harvest_period && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">
                          Période de récolte :
                        </span>{" "}
                        {item.harvest_period}
                      </p>
                    )}
                    {item.item_notes && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Notes :</span>{" "}
                        {item.item_notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ComponentCard>

        <ComponentCard
          title={`Contrôles effectués (${
            collection.collectionControls?.length || 0
          })`}
        >
          <div className="space-y-3">
            {collection.collectionControls?.map((control, index) => (
              <div
                key={control.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
              >
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Contrôle {index + 1} - {control.location}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Service ID :</span>{" "}
                      {control.service_id}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">
                        Autre organe de contrôle :
                      </span>{" "}
                      {control.other_control_body}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Nombre de postes :</span>{" "}
                      {control.control_posts_count}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Frais payés :</span>{" "}
                      {control.fees_paid || "0"} FCFA
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Montant du paiement :</span>{" "}
                      {control.payment_amount || "0"} FCFA
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Durée :</span>{" "}
                      {control.control_duration || "Non spécifiée"}{" "}
                      {control.duration_type || ""}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Type de frais :</span>{" "}
                      {control.taxType?.name || "Non spécifié"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Autre type de taxe :</span>{" "}
                      {control.other_tax_type || "Aucun"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Résultat :</span>
                      <span
                        className={`ml-1 px-2 py-1 rounded text-xs ${
                          control.control_result === "passed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {control.control_result || "Non spécifié"}
                      </span>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">
                        Frais payés (Oui/Non) :
                      </span>{" "}
                      {control.fees_paid_yes_no ? "Oui" : "Non"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">A un reçu :</span>{" "}
                      {control.has_receipt ? "Oui" : "Non"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Poste de paiement :</span>{" "}
                      {control.fees_payment_post || "Non spécifié"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Montant du paiement :</span>{" "}
                      {control.fees_payment_amount || "0"} FCFA
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">
                        Frais illégaux payés :
                      </span>{" "}
                      {control.illegal_fees_paid ? "Oui" : "Non"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">
                        Poste des frais illégaux :
                      </span>{" "}
                      {control.illegal_fees_post || "Aucun"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">
                        Montant des frais illégaux :
                      </span>{" "}
                      {control.illegal_fees_amount || "0"} FCFA
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">
                        Connaît les réglementations communautaires :
                      </span>{" "}
                      {control.knows_community_regulations ? "Oui" : "Non"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">
                        Connaît les réglementations nationales :
                      </span>{" "}
                      {control.knows_national_regulations ? "Oui" : "Non"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">
                        Temps d'arrêt par type de poste :
                      </span>{" "}
                      {control.stop_time_per_post_type || "Non spécifié"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">
                        Type de temps de passage frontière :
                      </span>{" "}
                      {control.border_crossing_time_type || "Non spécifié"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Problèmes :</span>{" "}
                      {control.control_issues || "Aucun"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Autres difficultés :</span>{" "}
                      {control.other_difficulties || "Aucune"}
                    </p>
                    {control.notes && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Notes :</span>{" "}
                        {control.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ComponentCard>

        <ComponentCard
          title={`Validations (${
            collection.collectionValidations?.length || 0
          })`}
        >
          <div className="space-y-3">
            {collection.collectionValidations?.map((validation, index) => (
              <div
                key={validation.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
              >
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Validation {index + 1} - Niveau {validation.validation_level}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Action :</span>{" "}
                      {validation.validation_action}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Résultat :</span>
                      <span
                        className={`ml-1 px-2 py-1 rounded text-xs ${
                          validation.validation_result === "approved"
                            ? "bg-green-100 text-green-800"
                            : validation.validation_result === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {validation.validation_result}
                      </span>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Score de qualité :</span>{" "}
                      {validation.data_quality_score || "Non évalué"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Priorité :</span>{" "}
                      {validation.priority_level || "Non spécifié"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Soumis le :</span>{" "}
                      {validation.submitted_at
                        ? new Date(validation.submitted_at).toLocaleString()
                        : "Non spécifié"}
                    </p>
                    {validation.validated_at && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Validé le :</span>{" "}
                        {new Date(validation.validated_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    {validation.validation_notes && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Notes :</span>{" "}
                        {validation.validation_notes}
                      </p>
                    )}
                    {validation.rejection_reason && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Raison du rejet :</span>{" "}
                        {validation.rejection_reason}
                      </p>
                    )}
                    {validation.correction_instructions && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">
                          Instructions de correction :
                        </span>{" "}
                        {validation.correction_instructions}
                      </p>
                    )}
                    {/* <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Source :</span>{" "}
                      {validation.validation_source}
                    </p> */}
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Révision :</span>{" "}
                      {validation.revision_number || "Non spécifié"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Validation actuelle :</span>{" "}
                      {validation.is_current_validation ? "Oui" : "Non"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ComponentCard>
      </div>

      <Dialog
        visible={showValidationDialog}
        header={
          userInfo?.role_id === 4
            ? "Valider la collecte (Chef d'équipe)"
            : "Valider la collecte (Superviseur)"
        }
        modal
        style={{ width: "40rem" }}
        onHide={() => setShowValidationDialog(false)}
      >
        <div className="p-4 space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Êtes-vous sûr de vouloir valider cette collecte ? Cette action ne
            peut pas être annulée.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Score de qualité des données (0-100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={dataQualityScore}
              onChange={(e) => setDataQualityScore(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Score de qualité (0-100)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes de validation (optionnel)
            </label>
            <textarea
              value={validationNotes}
              onChange={(e) => setValidationNotes(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Ajoutez des notes sur la validation..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              label="Annuler"
              icon="pi pi-times"
              style={{
                backgroundColor: "#00277F",
                borderColor: "#00277F",
                color: "white",
              }}
              onClick={() => setShowValidationDialog(false)}
            />

            <Button
              label="Valider"
              icon="pi pi-check"
              className="!bg-green-600 !hover:bg-green-700"
              loading={isValidating}
              onClick={handleValidate}
            />
          </div>
        </div>
      </Dialog>

      {/* Dialog de rejet */}
      <Dialog
        visible={showRejectDialog}
        header={
          userInfo?.role_id === 4
            ? "Rejeter la collecte (Chef d'équipe)"
            : "Rejeter la collecte (Superviseur)"
        }
        modal
        style={{ width: "40rem" }}
        onHide={() => setShowRejectDialog(false)}
      >
        <div className="p-4 space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Êtes-vous sûr de vouloir rejeter cette collecte ? Cette action ne
            peut pas être annulée.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Raison du rejet (obligatoire)
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={4}
              placeholder="Expliquez pourquoi cette collecte est rejetée..."
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              label="Annuler"
              icon="pi pi-times"
              style={{
                backgroundColor: "#00277F",
                borderColor: "#00277F",
                color: "white",
              }}
              onClick={() => setShowValidationDialog(false)}
            />

            <Button
              label="Rejeter"
              icon="pi pi-times"
              className="!bg-red-600 !hover:bg-red-700"
              loading={isRejecting}
              onClick={handleReject}
              disabled={!rejectReason.trim()}
            />
          </div>
        </div>
      </Dialog>

      <Toast ref={toast} position="bottom-right" />
    </div>
  );
};

export default CollectionDetails;
