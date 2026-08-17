import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import axiosInstance from "../../api/axios";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import CollectionReviewActions from "../../components/collections/CollectionReviewActions";
import FieldWithComment from "../../components/collections/FieldWithComment";
import {
  FieldReviewCommentsProvider,
  useFieldReviewComments,
} from "../../components/collections/FieldReviewCommentsContext";
import { formatActorName } from "../../utils/actors";
import { isTeamManager, isSupervisor } from "../../utils/roles";
import {
  getCollectionContextLabel,
  getTradeFlowLabel,
  NOT_SPECIFIED,
} from "../../utils/collectionLabels";
import YesNoValue from "../../components/collections/YesNoValue";
import CountryValue from "../../components/collections/CountryValue";
import ControlTimeLabel from "../../components/collections/ControlTimeLabel";
import CollectionTypeBadge from "../../components/collections/CollectionTypeBadge";
import DetailSection from "../../components/collections/detail/DetailSection";
import InfoField from "../../components/collections/detail/InfoField";
import SummaryKpiCard from "../../components/collections/detail/SummaryKpiCard";
import CollectionStatusBadge from "../../components/collections/detail/CollectionStatusBadge";
import CollectionTimeline from "../../components/collections/detail/CollectionTimeline";
import CollectionDetailHeader from "../../components/collections/detail/CollectionDetailHeader";

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
  loading_cost: string | null;
  unloading_cost: string | null;
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
  driver_vehicle_inspection_uptodate?: boolean | null;
  driver_registration_card_uptodate?: boolean | null;
  driver_vehicle_insurance_uptodate?: boolean | null;
  driver_license_uptodate?: boolean | null;
  driver_other_required_documents_uptodate?: boolean | null;
  driver_other_required_documents?: string | null;
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
    animal_categories: Array<{
      qty: number;
      price: number;
      category: string;
    }> | null;
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
    product_destination_country_id?: number | null;
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
    productDestinationCountry?: any | null;
  }>;
  collectionControls?: Array<{
    id: number;
    collection_id: number;
    checkpoint_id: number | null;
    service_id: number | null;
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
    fees_paid_yes_no: number | null;
    has_receipt: number | null;
    tax_type_id: number | null;
    other_tax_type: string;
    fees_payment_post: string | null;
    fees_payment_amount: string | null;
    illegal_fees_paid: number | null;
    illegal_fees_post: string | null;
    illegal_fees_amount: string | null;
    knows_community_regulations: number | null;
    knows_national_regulations: number | null;
    other_difficulties: string | null;
    created_at: string;
    updated_at: string;
    service?: {
      id: number;
      public_id: string;
      name: string;
      description: string;
      type: string;
      created_at: string;
      updated_at: string;
    } | null;
    taxType?: {
      id: number;
      name: string;
      description: string;
      created_at: string;
      updated_at: string;
    } | null;
    taxTypes?: Array<{
      id: number;
      collection_control_id: number;
      tax_type_id: number;
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
  const location = useLocation();
  const { userInfo } = useAuth();
  const { t } = useTranslation();
  const { aggregate } = useFieldReviewComments();

  const [collection, setCollection] = useState<Collection | null>(null);
  const [workflow, setWorkflow] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [showValidationDialog, setShowValidationDialog] =
    useState<boolean>(false);
  const [validationNotes, setValidationNotes] = useState<string>("");
  const [dataQualityScore, setDataQualityScore] = useState<number | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>("");
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  const [isResubmission, setIsResubmission] = useState<boolean>(false);

  const handleBack = () => {
    const returnPath = location.state?.returnPath || "/collections";
    navigate(returnPath);
  };

  const openRejectDialog = () => {
    setRejectReason(aggregate());
    setShowRejectDialog(true);
  };

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        setIsLoading(true);

        const collectionResponse = await axiosInstance.get(
          `/trade-flow/digitalized-collections/${id}`
        );
        if (collectionResponse.data.success) {
          let collectionData = collectionResponse.data.result;

          // Récupérer l'état du workflow
          try {
            const workflowResponse = await axiosInstance.get<WorkflowResponse>(
              `/trade-flow/collections/${id}/workflow`
            );

            if (workflowResponse.data.success) {
              const workflow = workflowResponse.data.result;
              setWorkflow(workflow);

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

            }
          } catch (workflowErr: any) {


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
          setIsResubmission(false); // Réinitialiser le flag de resoumission
          setIsLoading(false);
        } else {

          setError(
            collectionResponse.data.message ||
            "Erreur lors de la récupération des données"
          );
          setIsLoading(false);
        }

        if (collectionResponse.data.errors || collectionResponse.data.except) {
          toast.error("Erreur", {
            description:
              collectionResponse.data.errors ||
              collectionResponse.data.except ||
              "Erreur inconnue",
            duration: 5000,
          });
        }
      } catch (err: any) {

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
            : "Validation effectuée par l'éditeur"),
      };



      // Choisir l'endpoint selon le rôle
      const endpoint =
        userInfo?.role_id === 4
          ? `/trade-flow/collections/${collection.id}/validate/team-manager/complete`
          : `/trade-flow/collections/${collection.id}/validate/supervisor/complete`;

      const response = await axiosInstance.post<ValidationResponse>(
        endpoint,
        requestData
      );


      if (response.data.success) {
        // Vérifier si c'est une resoumission
        const isResubmissionFlag =
          (response.data.result as any)?.is_resubmission === true;


        if (isResubmissionFlag) {
          setIsResubmission(true);

        }

        toast.success(t("validation_successful"), {
          description: response.data.message,
          duration: 5000,
        });

        // Recharger les données de la collecte

        const collectionResponse = await axiosInstance.get(
          `/trade-flow/digitalized-collections/${collection.id}`
        );


        if (collectionResponse.data.success) {
          let updatedCollection = collectionResponse.data.result;

          // Recharger l'état du workflow
          try {

            const workflowResponse = await axiosInstance.get<WorkflowResponse>(
              `/trade-flow/collections/${collection.id}/workflow`
            );


            if (workflowResponse.data.success) {
              const workflow = workflowResponse.data.result;
              setWorkflow(workflow);

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

          }

          setCollection(updatedCollection);
        }

        setShowValidationDialog(false);
        setValidationNotes("");
        setDataQualityScore(null);
      } else {

        toast.error(t("validation_error"), {
          description: response.data.message || "Erreur lors de la validation",
          duration: 5000,
        });
      }
    } catch (err: any) {

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de la validation de la collecte";

      toast.error("Erreur de validation", {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleReject = async () => {
    const reason = rejectReason.trim();
    if (!collection || !userInfo) return;

    if (!reason) {
      toast.error(t("rejection_reason_label") || "Motif de rejet", {
        description:
          "Le motif de rejet est obligatoire. Ajoutez un commentaire ou commentez des champs.",
        duration: 5000,
      });
      return;
    }

    try {
      setIsRejecting(true);

      const requestData = {
        reason,
        level: userInfo?.role_id === 4 ? "1" : "2",
      };

      const response = await axiosInstance.post(
        `/trade-flow/collections/${collection.id}/reject`,
        requestData
      );



      if (response.data.success) {
        // Vérifier si c'est une resoumission
        const isResubmissionFlag =
          (response.data.result as any)?.is_resubmission === true;


        if (isResubmissionFlag) {
          setIsResubmission(true);

        }

        toast.success(t("collection_rejected"), {
          description: response.data.message,
          duration: 5000,
        });

        // Recharger les données de la collecte

        const collectionResponse = await axiosInstance.get(
          `/trade-flow/digitalized-collections/${collection.id}`
        );

        if (collectionResponse.data.success) {
          let updatedCollection = collectionResponse.data.result;

          // Recharger l'état du workflow
          try {
            const workflowResponse = await axiosInstance.get<WorkflowResponse>(
              `/trade-flow/collections/${collection.id}/workflow`
            );

            if (workflowResponse.data.success) {
              const workflow = workflowResponse.data.result;
              setWorkflow(workflow);

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

          }

          setCollection(updatedCollection);
        }

        setShowRejectDialog(false);
        setRejectReason("");
      } else {

        toast.error(t("rejection_error"), {
          description: response.data.message || "Erreur lors du rejet",
          duration: 5000,
        });
      }
    } catch (err: any) {


      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Erreur lors du rejet de la collecte";

      toast.error("Erreur de rejet", {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsRejecting(false);
    }
  };

  const handleSupervisorValidate = async () => {
    if (!collection || !userInfo) return;

    try {
      setIsValidating(true);

      const requestData = {
        validation_notes:
          validationNotes.trim() || "Validation complète par l'éditeur",
        data_quality_score: dataQualityScore,
        validation_metadata: {
          validation_method: "field_verification",
          verification_date: new Date().toISOString(),
          verification_location: "Validation en ligne",
        },
      };



      const response = await axiosInstance.post(
        `/trade-flow/collections/${collection.id}/validate/supervisor/complete`,
        requestData
      );



      if (response.data.success) {
        toast.success(t("collection_validated"), {
          description: response.data.message,
          duration: 5000,
        });

        // Recharger les données de la collecte

        const collectionResponse = await axiosInstance.get(
          `/trade-flow/digitalized-collections/${collection.id}`
        );

        if (collectionResponse.data.success) {
          let updatedCollection = collectionResponse.data.result;

          // Recharger l'état du workflow
          try {
            const workflowResponse = await axiosInstance.get<WorkflowResponse>(
              `/trade-flow/collections/${collection.id}/workflow`
            );

            if (workflowResponse.data.success) {
              const workflow = workflowResponse.data.result;
              setWorkflow(workflow);

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

          }

          setCollection(updatedCollection);
        }
      }
    } catch (err: any) {


      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de la validation par le superviseur";

      toast.error("Erreur de validation", {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsValidating(false);
    }
  };

  const canValidate = () => {
    // Pour le chef d'équipe, vérifier si la collection peut être validée
    // Prendre en compte la resoumission : si status = "submitted" et qu'il n'y a pas de validation courante approuvée
    const hasCurrentApprovedValidation =
      collection?.collectionValidations?.some(
        (validation: any) =>
          validation.validation_level === "1" &&
          validation.validation_result === "approved" &&
          validation.is_current_validation === 1
      );

    const result =
      userInfo?.role_id === 4 &&
      collection?.status === "submitted" &&
      (!hasCurrentApprovedValidation || isResubmission);


    return result;
  };

  const canSupervisorValidate = () => {
    // Pour le superviseur, vérifier si la collecte peut être validée
    // Prendre en compte la resoumission : si elle est validée par le chef d'équipe mais pas encore par le superviseur

    // Vérification de sécurité
    if (
      !collection?.collectionValidations ||
      collection.collectionValidations.length === 0
    ) {


      // Fallback: utiliser les anciennes propriétés si collectionValidations n'est pas disponible
      const hasTeamManagerApproval = collection?.validated_by_team_manager;
      const hasCurrentSupervisorValidation =
        collection?.validated_by_supervisor;

      const result =
        userInfo?.role_id === 5 &&
        hasTeamManagerApproval &&
        !hasCurrentSupervisorValidation;



      return result;
    }

    // Vérifier si le chef d'équipe a approuvé (validation courante ou historique)
    const hasTeamManagerApproval = collection?.collectionValidations?.some(
      (validation: any) =>
        validation.validation_level === "1" &&
        validation.validation_result === "approved"
    );

    // Vérifier s'il y a une validation superviseur courante ET résolue (approved ou rejected)
    const hasCurrentSupervisorValidation =
      collection?.collectionValidations?.some(
        (validation: any) =>
          validation.validation_level === "2" &&
          validation.is_current_validation === 1 &&
          (validation.validation_result === "approved" ||
            validation.validation_result === "rejected")
      );

    // Le superviseur peut valider si :
    // 1. Il est superviseur (role_id === 5)
    // 2. Le chef d'équipe a approuvé (à un moment donné)
    // 3. Il n'y a pas de validation superviseur courante en cours OU c'est une resoumission
    const result =
      userInfo?.role_id === 5 &&
      hasTeamManagerApproval &&
      (!hasCurrentSupervisorValidation || isResubmission);




    return result;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-brand-500" />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {t("loading_details")}
          </p>
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="mb-4 text-sm text-red-600">
            {error || t("collection_not_found")}
          </p>
          <Button
            label={t("back_to_list")}
            icon="pi pi-arrow-left"
            style={{ backgroundColor: "#00277F", borderColor: "#00277F" }}
            className="!rounded-xl"
            onClick={() => {
              const returnPath = location.state?.returnPath || "/create-user";
              navigate(returnPath);
            }}
          />
        </div>
      </div>
    );
  }

  const itemsCount = collection.collectionItems?.length || 0;
  const controlsCount = collection.collectionControls?.length || 0;
  const validationsCount = workflow?.validation_history?.length || 0;
  const collectorDisplayName = formatActorName(collection.collector);
  const collectionPointName =
    collection.collectionPoint?.name || t("not_specified");
  const corridorName = collection.corridor?.name || t("not_specified");
  const collectionDateLabel = collection.collection_date
    ? new Date(collection.collection_date).toLocaleDateString()
    : t("not_specified");

  const timelineSteps = [
    {
      label: t("created_at"),
      date: new Date(collection.created_at).toLocaleString(),
      done: true,
    },
    {
      label: t("submitted_at"),
      date:
        collection.status !== "draft"
          ? collectionDateLabel !== t("not_specified")
            ? collectionDateLabel
            : new Date(collection.updated_at).toLocaleString()
          : undefined,
      done: collection.status !== "draft",
      active: collection.status === "submitted",
    },
    {
      label: t("validated_at"),
      date: collection.validated_at
        ? new Date(collection.validated_at).toLocaleString()
        : collection.supervisor_validated_at
          ? new Date(collection.supervisor_validated_at).toLocaleString()
          : undefined,
      done:
        collection.status === "validated" ||
        Boolean(collection.validated_by_supervisor),
      active:
        collection.status === "submitted" &&
        Boolean(collection.validated_by_team_manager),
    },
  ];

  return (
    <div className="pb-28">
      <PageMeta
        title="CT | Détails de la collecte"
        description="Détails de la collecte des agents"
      />
      <PageBreadcrumb pageTitle={`Détails de la collecte`} />

      <div className="space-y-5">
        <CollectionDetailHeader
          title={collectionPointName}
          badges={
            <>
              <CollectionTypeBadge type={collection.collection_type} size="md" />
              <CollectionStatusBadge status={collection.status} size="md" />
            </>
          }
          meta={[
            {
              label: t("collection_date"),
              value: collectionDateLabel,
              icon: "pi-calendar",
            },
            {
              label: t("collection_point"),
              value: collectionPointName,
              icon: "pi-map-marker",
            },
            {
              label: t("corridor"),
              value: corridorName,
              icon: "pi-directions",
            },
            {
              label: t("collector_name"),
              value: collectorDisplayName,
              icon: "pi-user",
            },
          ]}
        />

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <SummaryKpiCard
            label={t("collection_items")}
            value={itemsCount}
            icon="pi-box"
          />
          <SummaryKpiCard
            label={t("collection_controls")}
            value={controlsCount}
            icon="pi-shield"
          />
          <SummaryKpiCard
            label={t("validations")}
            value={validationsCount}
            icon="pi-verified"
          />
          <SummaryKpiCard
            label={t("collection_status")}
            value={<CollectionStatusBadge status={collection.status} />}
            icon="pi-info-circle"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <div className="space-y-5 xl:col-span-8">
            <DetailSection title={t("collection_general_info")}>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                <FieldWithComment
                  fieldKey="collection_type"
                  label={t("collection_type")}
                >
                  <InfoField label={t("collection_type")}>
                    <CollectionTypeBadge type={collection.collection_type} />
                  </InfoField>
                </FieldWithComment>
                <FieldWithComment fieldKey="collection_context" label="Contexte">
                  <InfoField label="Contexte">
                    <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:bg-white/10 dark:text-gray-200">
                      {getCollectionContextLabel(collection.collection_context)}
                    </span>
                  </InfoField>
                </FieldWithComment>
                <FieldWithComment
                  fieldKey="operator_gender"
                  label={t("operator_gender")}
                >
                  <InfoField label={t("operator_gender")}>
                    {collection.operator_gender}
                  </InfoField>
                </FieldWithComment>
                <FieldWithComment
                  fieldKey="respondent_nature"
                  label={t("respondent_nature")}
                >
                  <InfoField label={t("respondent_nature")}>
                    {collection.respondent_nature}
                  </InfoField>
                </FieldWithComment>
                {collection.other_respondent_nature && (
                  <InfoField label={t("other_respondent_nature")}>
                    {collection.other_respondent_nature}
                  </InfoField>
                )}
                <InfoField label={t("merchandise_owner_gender")}>
                  {collection.merchandise_owner_gender}
                </InfoField>
                <InfoField label={t("merchandise_owner_age_category")}>
                  {collection.merchandise_owner_age_category}
                </InfoField>
                <InfoField label={t("merchandise_owner_has_disability")}>
                  <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:bg-white/10 dark:text-gray-200">
                    {collection.merchandise_owner_has_disability
                      ? t("yes")
                      : t("no")}
                  </span>
                </InfoField>
                <InfoField label={t("collection_status")}>
                  <CollectionStatusBadge status={collection.status} />
                </InfoField>
                <InfoField label={t("collection_date")}>
                  {collectionDateLabel}
                </InfoField>
                <InfoField label={t("created_at")}>
                  {new Date(collection.created_at).toLocaleString()}
                </InfoField>
                <InfoField label={t("updated_at")}>
                  {new Date(collection.updated_at).toLocaleString()}
                </InfoField>
                <InfoField label="Genre de l'opérateur">
                  {collection.operator_gender === "M" ? t("male") : t("female")}
                </InfoField>
                <InfoField label={t("collection_context")}>
                  {getCollectionContextLabel(collection.collection_context)}
                </InfoField>
              </dl>
            </DetailSection>

            <DetailSection title={t("collection_point_and_corridor")} collapsible>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                <FieldWithComment
                  fieldKey="collection_point"
                  label={t("collection_point")}
                >
                  <InfoField label={t("collection_point")}>
                    {collectionPointName}
                  </InfoField>
                </FieldWithComment>
                <InfoField label="Type de point de collecte">
                  {collection.collectionPoint?.is_formal
                    ? "Passage frontalier formel"
                    : "Passage frontalier informel"}
                </InfoField>
                <InfoField label={t("corridor")}>{corridorName}</InfoField>
                {collection.corridor?.description && (
                  <InfoField label={t("corridor_description")} className="sm:col-span-2">
                    {collection.corridor.description}
                  </InfoField>
                )}
              </dl>
            </DetailSection>

            <DetailSection title={t("transport_and_taxes")} collapsible>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                <InfoField label={t("loading_country")}>
                  {collection.originCountry?.name || NOT_SPECIFIED}
                </InfoField>
                <InfoField label={t("loading_point")}>
                  {collection.originCity?.name ||
                    collection.collectionItems?.[0]?.loadingCity?.name ||
                    NOT_SPECIFIED}
                </InfoField>
                <InfoField label={t("unloading_country")}>
                  {collection.destinationCountry?.name || NOT_SPECIFIED}
                </InfoField>
                <InfoField label={t("unloading_point")}>
                  {collection.finalDestinationCity?.name ||
                    collection.collectionItems?.[0]?.unloadingCity?.name ||
                    NOT_SPECIFIED}
                </InfoField>
                <InfoField label={t("trade_flow_direction")}>
                  {getTradeFlowLabel(collection.trade_flow_direction)}
                </InfoField>
                <InfoField label={t("transport_mode")}>
                  {collection.transportMode?.name} -{" "}
                  {collection.transportMode?.description}
                </InfoField>
                <InfoField label={t("vehicle_registration_number")}>
                  {collection.vehicle_registration_number}
                </InfoField>
                <InfoField label={t("transport_cost")}>
                  {collection.transport_cost
                    ? `${collection.transport_cost} ${collection.currency?.symbol}`
                    : t("not_specified")}
                </InfoField>
                <InfoField label={t("loading_cost")}>
                  {(collection as any).loading_cost
                    ? `${(collection as any).loading_cost} ${collection.currency?.symbol}`
                    : t("not_specified")}
                </InfoField>
                <InfoField label={t("unloading_cost")}>
                  {(collection as any).unloading_cost
                    ? `${(collection as any).unloading_cost} ${collection.currency?.symbol}`
                    : t("not_specified")}
                </InfoField>
                <InfoField label={t("payment_method")}>
                  {collection.payment_method}
                </InfoField>
                <InfoField label={t("currency")}>
                  {collection.currency?.name || `ID: ${collection.currency_id}`}{" "}
                  ({collection.currency?.symbol || "N/A"})
                </InfoField>
                <InfoField label={t("total_weight")}>
                  {collection.total_weight_kg} kg
                </InfoField>
                {collection.intermediate_destination && (
                  <InfoField label={t("intermediate_destination")}>
                    {collection.intermediate_destination}
                  </InfoField>
                )}
                {collection.market_day && (
                  <InfoField label={t("market_day")}>
                    {collection.market_day}
                  </InfoField>
                )}
                {collection.nearby_markets && (
                  <InfoField label={t("nearby_markets")}>
                    {collection.nearby_markets}
                  </InfoField>
                )}
                {collection.market_condition && (
                  <InfoField label={t("market_condition")}>
                    {collection.market_condition}
                  </InfoField>
                )}
                {collection.market_price_variation && (
                  <InfoField label={t("market_price_variation")}>
                    {collection.market_price_variation}
                  </InfoField>
                )}
                {collection.taxes_fees && (
                  <InfoField label={t("taxes_fees")}>
                    {collection.taxes_fees}
                  </InfoField>
                )}
                {collection.tax_details && (
                  <InfoField label={t("tax_details")}>
                    {collection.tax_details}
                  </InfoField>
                )}
                {collection.taxes_paid && (
                  <InfoField label={t("taxes_paid")}>
                    {collection.taxes_paid}
                  </InfoField>
                )}
                {collection.tax_amount && (
                  <InfoField label={t("tax_amount")}>
                    {collection.tax_amount}
                  </InfoField>
                )}
                {(collection.gps_latitude || collection.gps_longitude) && (
                  <InfoField label={t("gps_coordinates")}>
                    {collection.gps_latitude && collection.gps_longitude
                      ? `${collection.gps_latitude}, ${collection.gps_longitude}`
                      : t("not_specified")}
                  </InfoField>
                )}
                <InfoField label={t("control_posts")}>
                  {collection.has_control_posts ? t("yes") : t("no")}
                </InfoField>
                <InfoField label={t("control_posts_count")}>
                  {collection.control_posts_count !== null &&
                  collection.control_posts_count !== undefined
                    ? collection.control_posts_count
                    : t("not_specified")}
                </InfoField>
                {collection.collectionControls &&
                  collection.collectionControls.length > 0 && (
                    <InfoField label={t("control_locations")} className="sm:col-span-2">
                      {collection.collectionControls
                        .map((control) => control.location)
                        .filter((loc) => loc && loc.trim())
                        .join(", ") || t("none")}
                    </InfoField>
                  )}
                {collection.control_duration_type && (
                  <InfoField label={t("control_duration_type")}>
                    {collection.control_duration_type}
                  </InfoField>
                )}
                {collection.control_duration_value && (
                  <InfoField label={t("control_duration_value")}>
                    {collection.control_duration_value}
                  </InfoField>
                )}
                {collection.illegal_fees_paid && (
                  <InfoField label={t("illegal_fees_paid")}>
                    {collection.illegal_fees_paid}
                  </InfoField>
                )}
                {collection.illegal_fees_locations && (
                  <InfoField label={t("illegal_fees_locations")}>
                    {collection.illegal_fees_locations}
                  </InfoField>
                )}
                {collection.illegal_fees_amount && (
                  <InfoField label={t("illegal_fees_amount")}>
                    {collection.illegal_fees_amount}
                  </InfoField>
                )}
                <InfoField label={t("knows_community_regulations")}>
                  <YesNoValue value={collection.knows_community_regulations} />
                </InfoField>
                <InfoField label={t("knows_national_regulations")}>
                  <YesNoValue value={collection.knows_national_regulations} />
                </InfoField>
                <InfoField label={t("other_difficulties")} className="sm:col-span-2">
                  {collection.other_difficulties || NOT_SPECIFIED}
                </InfoField>
                <InfoField label="Autres difficultés" className="sm:col-span-2">
                  {collection.other_difficulties || t("none")}
                </InfoField>
                <InfoField label={t("control_posts")}>
                  {collection.has_control_posts ? t("yes") : t("no")} (
                  {collection.control_posts_count || 0} postes)
                </InfoField>
                <InfoField label={t("control_locations")} className="sm:col-span-2">
                  {collection.collectionControls &&
                  collection.collectionControls.length > 0
                    ? collection.collectionControls
                        .map((control) => control.location)
                        .filter((loc) => loc && loc.trim())
                        .join(", ") || t("none")
                    : t("none")}
                </InfoField>
                {collection.validated_at && (
                  <InfoField label="Validé le">
                    {new Date(collection.validated_at).toLocaleString()}
                  </InfoField>
                )}
                {collection.validated_by && (
                  <InfoField label="Validé par (ID)">
                    {collection.validated_by}
                  </InfoField>
                )}
              </dl>

              <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-white/[0.02]">
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Documents du conducteur
                </h4>
                <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                  <InfoField label="Visite technique à jour">
                    <YesNoValue
                      value={collection.driver_vehicle_inspection_uptodate}
                    />
                  </InfoField>
                  <InfoField label="Carte grise à jour">
                    <YesNoValue
                      value={collection.driver_registration_card_uptodate}
                    />
                  </InfoField>
                  <InfoField label="Assurance à jour">
                    <YesNoValue
                      value={collection.driver_vehicle_insurance_uptodate}
                    />
                  </InfoField>
                  <InfoField label="Permis de conduire à jour">
                    <YesNoValue value={collection.driver_license_uptodate} />
                  </InfoField>
                  <InfoField label="Autres documents obligatoires à jour">
                    <YesNoValue
                      value={
                        collection.driver_other_required_documents_uptodate
                      }
                    />
                  </InfoField>
                  <InfoField label="Liste des autres documents" className="sm:col-span-2">
                    {collection.driver_other_required_documents?.trim() ||
                      NOT_SPECIFIED}
                  </InfoField>
                </dl>
              </div>
            </DetailSection>

            <DetailSection
              title={`${t("collection_items")} (${itemsCount})`}
            >
              <div className="space-y-4">
                {collection.collectionItems?.map((item, index) => (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-b from-white to-gray-50/40 dark:border-gray-800 dark:from-white/[0.03] dark:to-transparent"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 px-4 py-3.5 dark:border-gray-800">
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Article {index + 1}
                        </p>
                        <h4 className="mt-0.5 text-base font-semibold text-gray-900 dark:text-white">
                          {item.product?.name || item.animal?.name || "N/A"}
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                          {item.quantity} {item.unity?.name || ""}
                        </span>
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-white/10 dark:text-gray-200">
                          {item.total_weight_kg} kg
                        </span>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                          {item.total_value} FCFA
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 p-4 md:grid-cols-2 lg:grid-cols-3">
                      <div className="space-y-4">
                        <FieldWithComment
                          fieldKey={`item_${item.id}_product`}
                          label={`${t("product")} #${index + 1}`}
                        >
                          <InfoField label={t("product")}>
                            {item.product?.name ||
                              item.animal?.name ||
                              t("not_specified")}
                          </InfoField>
                        </FieldWithComment>
                        {(item.product?.HS_code || item.animal?.HS_code) && (
                          <InfoField label="Code HS">
                            {item.product?.HS_code || item.animal?.HS_code}
                          </InfoField>
                        )}
                        <InfoField label={t("description")}>
                          {item.product?.description || t("not_specified")}
                        </InfoField>
                        <FieldWithComment
                          fieldKey={`item_${item.id}_quantity`}
                          label={`${t("quantity")} #${index + 1}`}
                        >
                          <InfoField label={t("quantity")}>
                            {item.quantity}
                          </InfoField>
                        </FieldWithComment>
                        <InfoField label="Unité de mesure locale">
                          {item.unity?.name || t("not_specified")}
                        </InfoField>
                        <FieldWithComment
                          fieldKey={`item_${item.id}_total_value`}
                          label={`${t("total_value")} #${index + 1}`}
                        >
                          <InfoField label={t("total_value")}>
                            {item.total_value} FCFA
                          </InfoField>
                        </FieldWithComment>
                      </div>

                      <div className="space-y-4">
                        <InfoField label={t("total_weight")}>
                          {item.total_weight_kg} kg
                        </InfoField>
                        <InfoField label={t("customs_registration")}>
                          <YesNoValue value={item.is_customs_registered} />
                        </InfoField>
                        {item.customs_registration_number && (
                          <InfoField label={t("customs_registration_number")}>
                            {item.customs_registration_number}
                          </InfoField>
                        )}
                        <FieldWithComment
                          fieldKey={`item_${item.id}_product_origin`}
                          label={`Pays de provenance du produit #${index + 1}`}
                        >
                          <InfoField label="Pays de provenance du produit">
                            <CountryValue
                              mode="product"
                              country={item.productOriginCountry}
                              countryId={item.product_origin_country_id}
                            />
                          </InfoField>
                        </FieldWithComment>
                        <FieldWithComment
                          fieldKey={`item_${item.id}_product_destination`}
                          label={`Pays de destination finale du produit #${index + 1}`}
                        >
                          <InfoField label="Pays de destination finale du produit">
                            <CountryValue
                              mode="product"
                              country={item.productDestinationCountry}
                              countryId={item.product_destination_country_id}
                            />
                          </InfoField>
                        </FieldWithComment>
                        {(item.specific_origin || item.specific_destination) && (
                          <>
                            <InfoField label="Origine spécifique">
                              {item.specific_origin || NOT_SPECIFIED}
                            </InfoField>
                            <InfoField label="Destination spécifique">
                              {item.specific_destination || NOT_SPECIFIED}
                            </InfoField>
                          </>
                        )}
                        {(item.product_quality ||
                          item.product_variety ||
                          item.product_processing_level ||
                          item.product_packaging) && (
                          <>
                            {item.product_quality && (
                              <InfoField label="Qualité">
                                {item.product_quality}
                              </InfoField>
                            )}
                            {item.product_variety && (
                              <InfoField label="Variété">
                                {item.product_variety}
                              </InfoField>
                            )}
                            {item.product_processing_level && (
                              <InfoField label="Transformation">
                                {item.product_processing_level}
                              </InfoField>
                            )}
                            {item.product_packaging && (
                              <InfoField label="Emballage">
                                {item.product_packaging}
                              </InfoField>
                            )}
                          </>
                        )}
                      </div>

                      <div className="space-y-4">
                        {item.animal_count && (
                          <InfoField label={t("animal_count")}>
                            {item.animal_count}
                          </InfoField>
                        )}
                        {item.animal_breed && (
                          <InfoField label={t("breed")}>
                            {item.animal_breed}
                          </InfoField>
                        )}
                        {item.animal_condition && (
                          <InfoField label={t("condition")}>
                            {item.animal_condition}
                          </InfoField>
                        )}
                        {item.animal_gender && (
                          <InfoField label={t("animal_gender")}>
                            {item.animal_gender}
                          </InfoField>
                        )}
                        {item.average_weight_kg && (
                          <InfoField label={t("average_weight")}>
                            {item.average_weight_kg} kg
                          </InfoField>
                        )}
                        {item.animal_categories &&
                          item.animal_categories.length > 0 && (
                            <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-white/[0.02]">
                              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                {t("animal_categories")}
                              </p>
                              <ul className="mt-2 space-y-1.5">
                                {item.animal_categories.map(
                                  (category, catIndex) => {
                                    const categoryKey =
                                      category.category.toLowerCase();

                                    const getCategoryTranslation = (
                                      categoryName: string
                                    ) => {
                                      switch (categoryName.toLowerCase()) {
                                        case "small":
                                          return t("animal_category_small");
                                        case "medium":
                                          return t("animal_category_medium");
                                        case "large":
                                          return t("animal_category_large");
                                        default:
                                          return categoryName;
                                      }
                                    };

                                    const getCategoryPriceLabel = () => {
                                      switch (categoryKey) {
                                        case "small":
                                          return t("animal_price_small");
                                        case "medium":
                                          return t("animal_price_medium");
                                        case "large":
                                          return t("animal_price_large");
                                        default:
                                          return t("unit_price");
                                      }
                                    };

                                    const categoryValue =
                                      category.qty * category.price;

                                    return (
                                      <li
                                        key={catIndex}
                                        className="rounded-lg bg-gray-50 px-2.5 py-1.5 text-sm text-gray-800 dark:bg-white/5 dark:text-gray-200"
                                      >
                                        <span className="font-medium">
                                          {getCategoryTranslation(
                                            category.category
                                          )}
                                        </span>
                                        <div className="mt-0.5 space-y-0.5 text-xs text-gray-500">
                                          <p>
                                            {category.qty}{" "}
                                            {t("animal_head_unit")}
                                          </p>
                                          <p>
                                            {getCategoryPriceLabel()}:{" "}
                                            {category.price} FCFA
                                          </p>
                                          <p>
                                            {t("animal_category_value")}:{" "}
                                            {categoryValue.toFixed(2)} FCFA
                                          </p>
                                        </div>
                                      </li>
                                    );
                                  }
                                )}
                              </ul>
                            </div>
                          )}
                        {item.harvest_period && (
                          <InfoField label={t("harvest_period")}>
                            {item.harvest_period}
                          </InfoField>
                        )}
                        {item.item_notes && (
                          <InfoField label={t("notes")}>
                            {item.item_notes}
                          </InfoField>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </DetailSection>

            <DetailSection
              title={`${t("collection_controls")} (${controlsCount})`}
              collapsible
            >
              <div className="space-y-3">
                {collection.collectionControls?.map((control, index) => (
                  <article
                    key={control.id}
                    className="rounded-2xl border border-gray-200/80 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.02]"
                  >
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Contrôle {index + 1}
                      </h4>
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-white/10 dark:text-gray-200">
                        {control.location}
                      </span>
                    </div>
                    <dl className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-3">
                      <InfoField label={t("control_service_name")}>
                        {control.service?.name ||
                          control.other_control_body ||
                          (control.service_id
                            ? `Service ID: ${control.service_id}`
                            : "Non spécifié")}
                      </InfoField>
                      <InfoField label={t("control_location")}>
                        {control.location}
                      </InfoField>
                      <InfoField label={t("tax_type")}>
                        {control.taxTypes && control.taxTypes.length > 0 ? (
                          <span className="inline-flex flex-wrap gap-1">
                            {control.taxTypes.map((taxTypeItem) => (
                              <span
                                key={taxTypeItem.id}
                                className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                              >
                                {taxTypeItem.taxType.name}
                              </span>
                            ))}
                          </span>
                        ) : control.taxType?.name ? (
                          control.taxType.name
                        ) : (
                          t("not_specified")
                        )}
                      </InfoField>
                      <InfoField label={t("other_tax_type")}>
                        {control.other_tax_type || t("none")}
                      </InfoField>
                      <InfoField label={`${t("fees_paid")} (Oui/Non)`}>
                        <YesNoValue value={control.fees_paid_yes_no} />
                      </InfoField>
                      <InfoField label={t("has_receipt")}>
                        <YesNoValue value={control.has_receipt} />
                      </InfoField>
                      <InfoField label={t("payment_amount")}>
                        {control.fees_payment_amount || "0"} FCFA
                      </InfoField>
                      <InfoField label={t("illegal_fees_paid")}>
                        <YesNoValue value={control.illegal_fees_paid} />
                      </InfoField>
                      {control.illegal_fees_post && (
                        <InfoField label="Poste des faux frais">
                          {control.illegal_fees_post}
                        </InfoField>
                      )}
                      {control.illegal_fees_amount != null &&
                        control.illegal_fees_amount !== "" && (
                          <InfoField label="Montant des faux frais">
                            {control.illegal_fees_amount} FCFA
                          </InfoField>
                        )}
                      <InfoField label={t("stop_time_per_post_type")}>
                        <ControlTimeLabel
                          value={control.stop_time_per_post_type}
                        />
                      </InfoField>
                      <InfoField label={t("border_crossing_time_type")}>
                        <ControlTimeLabel
                          value={control.border_crossing_time_type}
                        />
                      </InfoField>
                      <InfoField label={t("control_issues")}>
                        {control.control_issues || t("none")}
                      </InfoField>
                      <InfoField label={t("other_difficulties")}>
                        {control.other_difficulties || t("none")}
                      </InfoField>
                      {control.notes && (
                        <InfoField label={t("notes")} className="md:col-span-3">
                          {control.notes}
                        </InfoField>
                      )}
                    </dl>
                  </article>
                ))}
              </div>
            </DetailSection>

            <DetailSection
              title={`${t("validations")} (${validationsCount})`}
              collapsible
            >
              <div className="space-y-3">
                {workflow?.validation_history?.map((validation, index) => (
                  <article
                    key={validation.id}
                    className="rounded-2xl border border-gray-200/80 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.02]"
                  >
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {t("validations")} {index + 1} — {t("validation_level")}{" "}
                        {validation.validation_level}
                        {validation.validation_level === "1"
                          ? " (Chef d'équipe)"
                          : validation.validation_level === "2"
                            ? " (Superviseur)"
                            : ""}
                      </h4>
                      <CollectionStatusBadge
                        status={validation.validation_result}
                      />
                    </div>
                    <dl className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                      {(validation as any).validator && (
                        <InfoField label="Validateur">
                          {formatActorName((validation as any).validator)}
                        </InfoField>
                      )}
                      <InfoField label={t("validation_action")}>
                        {validation.validation_action}
                      </InfoField>
                      <InfoField label={t("validation_result")}>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            validation.validation_result === "approved"
                              ? "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400"
                              : validation.validation_result === "rejected"
                                ? "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400"
                                : "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400"
                          }`}
                        >
                          {validation.validation_result}
                        </span>
                      </InfoField>
                      <InfoField label={t("data_quality_score")}>
                        {validation.data_quality_score || t("not_specified")}
                      </InfoField>
                      <InfoField label={t("priority")}>
                        {validation.priority_level || t("not_specified")}
                      </InfoField>
                      <InfoField label={t("submitted_at")}>
                        {validation.submitted_at
                          ? new Date(validation.submitted_at).toLocaleString()
                          : t("not_specified")}
                      </InfoField>
                      {validation.validated_at && (
                        <InfoField label={t("validated_at")}>
                          {new Date(validation.validated_at).toLocaleString()}
                        </InfoField>
                      )}
                      {validation.validation_notes && (
                        <InfoField label={t("notes")} className="md:col-span-2">
                          {validation.validation_notes}
                        </InfoField>
                      )}
                      {validation.rejection_reason && (
                        <InfoField
                          label={t("rejection_reason")}
                          className="md:col-span-2"
                        >
                          {validation.rejection_reason}
                        </InfoField>
                      )}
                      {validation.correction_instructions && (
                        <InfoField
                          label={t("correction_instructions")}
                          className="md:col-span-2"
                        >
                          {validation.correction_instructions}
                        </InfoField>
                      )}
                    </dl>
                  </article>
                ))}
              </div>
            </DetailSection>

            <DetailSection title={t("notes")}>
              <FieldWithComment fieldKey="collection_notes" label={t("notes")}>
                <div className="rounded-xl bg-gray-50/80 px-4 py-3 text-sm leading-relaxed text-gray-800 dark:bg-white/[0.04] dark:text-gray-200">
                  {collection.notes || t("none")}
                </div>
              </FieldWithComment>
            </DetailSection>
          </div>

          <aside className="space-y-5 xl:col-span-4">
            <div className="space-y-5 xl:sticky xl:top-24">
              <DetailSection title={t("collector")}>
                <dl className="space-y-4">
                  <FieldWithComment
                    fieldKey="collector_name"
                    label={t("collector_name")}
                  >
                    <InfoField label={t("collector_name")}>
                      {collectorDisplayName}
                    </InfoField>
                  </FieldWithComment>
                  <FieldWithComment
                    fieldKey="collector_phone"
                    label={t("collector_phone")}
                  >
                    <InfoField label={t("collector_phone")}>
                      {collection.collector?.phone || t("not_specified")}
                    </InfoField>
                  </FieldWithComment>
                </dl>
              </DetailSection>

              <DetailSection title={t("corridor")}>
                <dl className="space-y-4">
                  <InfoField label={t("corridor")}>{corridorName}</InfoField>
                  {collection.corridor?.description && (
                    <InfoField label={t("corridor_description")}>
                      {collection.corridor.description}
                    </InfoField>
                  )}
                  <InfoField label={t("collection_point")}>
                    {collectionPointName}
                  </InfoField>
                </dl>
              </DetailSection>

              <DetailSection title={t("collection_status")}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-gray-500">Statut</span>
                    <CollectionStatusBadge status={collection.status} size="md" />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-gray-500">Type</span>
                    <CollectionTypeBadge type={collection.collection_type} />
                  </div>
                </div>
              </DetailSection>

              <DetailSection title="Timeline">
                <CollectionTimeline steps={timelineSteps} />
              </DetailSection>
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200/80 bg-white/90 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/90">
        <div className="mx-auto max-w-screen-2xl">
          <CollectionReviewActions
            onBack={handleBack}
            onValidate={() => setShowValidationDialog(true)}
            onReject={openRejectDialog}
            canValidate={Boolean(canValidate() || canSupervisorValidate())}
            canReject={Boolean(
              (canValidate() || canSupervisorValidate()) &&
                (userInfo?.role_id === 4 || canSupervisorValidate())
            )}
            statusBadges={
              <>
                {userInfo?.role_id === 4 &&
                  collection?.collectionValidations?.some(
                    (validation: any) =>
                      validation.validation_level === "1" &&
                      validation.validation_result === "approved" &&
                      validation.is_current_validation === 1
                  ) && (
                    <div className="flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2 text-green-800 dark:bg-green-500/15 dark:text-green-300">
                      <i className="pi pi-check-circle text-green-600"></i>
                      <span className="text-sm font-medium">
                        {t("collection_already_validated")}
                      </span>
                    </div>
                  )}
                {userInfo?.role_id === 4 &&
                  collection?.collectionValidations?.some(
                    (validation: any) =>
                      validation.validation_level === "1" &&
                      validation.validation_result === "rejected" &&
                      validation.is_current_validation === 1
                  ) && (
                    <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-red-800 dark:bg-red-500/15 dark:text-red-300">
                      <i className="pi pi-times-circle text-red-600"></i>
                      <span className="text-sm font-medium">
                        {t("collection_rejected")}
                      </span>
                    </div>
                  )}
                {userInfo?.role_id === 5 &&
                  collection?.collectionValidations?.some(
                    (validation: any) =>
                      validation.validation_level === "1" &&
                      validation.validation_result === "approved" &&
                      validation.is_current_validation === 1
                  ) &&
                  !collection?.collectionValidations?.some(
                    (validation: any) =>
                      validation.validation_level === "2" &&
                      validation.is_current_validation === 1
                  ) && (
                    <div className="flex items-center gap-2 rounded-xl bg-yellow-50 px-3 py-2 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-300">
                      <i className="pi pi-clock text-yellow-600"></i>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {t("waiting_supervisor_validation")}
                        </span>
                        {workflow?.team_manager_validation?.validator && (
                          <span className="text-xs text-yellow-700 dark:text-yellow-400">
                            Chef :{" "}
                            {formatActorName(
                              workflow.team_manager_validation.validator
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
              </>
            }
          />
        </div>
      </div>

      <Dialog
        visible={showValidationDialog}
        header={
          userInfo?.role_id === 4
            ? t("validate_collection_team_manager")
            : t("validate_collection_supervisor")
        }
        modal
        style={{ width: "40rem" }}
        onHide={() => setShowValidationDialog(false)}
      >
        <div className="space-y-4 p-4">
          <p className="text-gray-800 dark:text-gray-400">
            {t("validation_confirmation")}
          </p>
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
              {t("quality_score_label")}
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={dataQualityScore === null ? "" : dataQualityScore}
              onChange={(e) => {
                const value = e.target.value;
                setDataQualityScore(value === "" ? null : Number(value));
              }}
              className="w-full rounded-xl border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              placeholder={t("quality_score_placeholder")}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
              {t("validation_notes_optional")}
            </label>
            <textarea
              value={validationNotes}
              onChange={(e) => setValidationNotes(e.target.value)}
              className="w-full rounded-xl border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder={t("validation_notes_placeholder")}
            />
          </div>
          <div className="flex flex-col justify-end gap-3 sm:flex-row">
            <Button
              label={t("cancel")}
              icon="pi pi-times"
              style={{
                backgroundColor: "#00277F",
                borderColor: "#00277F",
                color: "white",
              }}
              className="w-full text-sm sm:w-auto sm:text-base px-3 py-2 sm:px-4 sm:py-3 !rounded-xl"
              onClick={() => setShowValidationDialog(false)}
            />

            <Button
              label={t("validate")}
              icon="pi pi-check"
              className="!bg-green-600 !hover:bg-green-700 w-full text-sm sm:w-auto sm:text-base px-3 py-2 sm:px-4 sm:py-3 !rounded-xl"
              loading={isValidating}
              onClick={handleValidate}
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        visible={showRejectDialog}
        header={
          userInfo?.role_id === 4
            ? t("reject_collection_team_manager")
            : t("reject_collection_supervisor")
        }
        modal
        style={{ width: "40rem" }}
        onHide={() => setShowRejectDialog(false)}
      >
        <div className="space-y-4 p-4">
          <p className="text-gray-800 dark:text-gray-400">
            {t("rejection_confirmation")}
          </p>
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
              {t("rejection_reason_label")}
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full rounded-xl border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-red-500"
              rows={4}
              placeholder={t("rejection_reason_placeholder")}
              required
            />
          </div>
          <div className="flex flex-col justify-end gap-3 sm:flex-row">
            <Button
              label={t("cancel")}
              icon="pi pi-times"
              style={{
                backgroundColor: "#00277F",
                borderColor: "#00277F",
                color: "white",
              }}
              className="w-full text-sm sm:w-auto sm:text-base px-3 py-2 sm:px-4 sm:py-3 !rounded-xl"
              onClick={() => setShowRejectDialog(false)}
            />

            <Button
              label={t("reject")}
              icon="pi pi-times"
              className="!bg-red-600 !hover:bg-red-700 w-full text-sm sm:w-auto sm:text-base px-3 py-2 sm:px-4 sm:py-3 !rounded-xl"
              loading={isRejecting}
              onClick={handleReject}
              disabled={!rejectReason.trim()}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );

};

const CollectionDetailsPage = () => {
  const { userInfo } = useAuth();
  const enabled =
    isTeamManager(userInfo?.role_id) || isSupervisor(userInfo?.role_id);

  return (
    <FieldReviewCommentsProvider enabled={enabled}>
      <CollectionDetails />
    </FieldReviewCommentsProvider>
  );
};

export default CollectionDetailsPage;
