import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import CollectionsTableOne from "../../components/tables/BasicTables/CollectionsTableOne";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { isSupervisor } from "../../utils/roles";

export default function CollectionsPage() {
  const { t } = useTranslation();
  const { userInfo } = useAuth();

  const getPageTitle = () => {
    if (isSupervisor(userInfo?.role_id)) {
      return t("validated_collections_by_team_managers");
    }
    return t("all_collections");
  };

  return (
    <div>
      <PageMeta
        title="CT | Collectes"
        description="Liste des collectes soumises par les collecteurs"
      />
      <PageBreadcrumb pageTitle={getPageTitle()} subtle />

      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
          Collectes
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          Consultez, filtrez et validez les collectes enregistrées.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-5">
          <CollectionsTableOne />
        </div>
      </div>
    </div>
  );
}
