import { type ReactNode } from "react";
import { Button } from "primereact/button";
import { useTranslation } from "react-i18next";

export type CollectionReviewActionsProps = {
  onBack: () => void;
  onValidate?: () => void;
  onReject?: () => void;
  canValidate: boolean;
  canReject: boolean;
  showBackOnly?: boolean;
  statusBadges?: ReactNode;
  className?: string;
};

/**
 * Barre d'actions revue collecte : Retour / Valider / Rejeter.
 * À placer en bas du formulaire pour éviter la duplication HTML.
 */
export default function CollectionReviewActions({
  onBack,
  onValidate,
  onReject,
  canValidate,
  canReject,
  showBackOnly = false,
  statusBadges,
  className = "",
}: CollectionReviewActionsProps) {
  const { t } = useTranslation();

  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div className="flex flex-wrap gap-2">{statusBadges}</div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2.5">
        <Button
          label={t("back_to_list")}
          icon="pi pi-arrow-left"
          style={{ backgroundColor: "#00277F", borderColor: "#00277F" }}
          className="w-full text-sm sm:w-auto sm:text-base px-3 py-2 sm:px-4 sm:py-2.5 !rounded-xl"
          onClick={onBack}
        />
        {!showBackOnly && canValidate && (
          <Button
            label={t("validate_collection")}
            icon="pi pi-check"
            className="!bg-green-600 !hover:bg-green-700 w-full text-sm sm:w-auto sm:text-base px-3 py-2 sm:px-4 sm:py-2.5 !rounded-xl"
            onClick={onValidate}
          />
        )}
        {!showBackOnly && canReject && (
          <Button
            label={t("reject_collection")}
            icon="pi pi-times"
            className="!bg-red-600 !hover:bg-red-700 w-full text-sm sm:w-auto sm:text-base px-3 py-2 sm:px-4 sm:py-2.5 !rounded-xl"
            onClick={onReject}
          />
        )}
      </div>
    </div>
  );
}
