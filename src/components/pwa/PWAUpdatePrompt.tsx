import { useState, useEffect } from "react";
import { registerSW } from "virtual:pwa-register";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "primereact/button";

export function usePWAUpdate() {
  const { t } = useTranslation();
  const toast = useRef<Toast>(null);
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [updateSW, setUpdateSW] = useState<
    ((reload?: boolean) => Promise<void>) | null
  >(null);
  const hasShownUpdateToast = useRef(false);
  const hasShownOfflineToast = useRef(false);
  const isRegistered = useRef(false);

  useEffect(() => {
    // Éviter l'enregistrement multiple
    if (isRegistered.current) return;
    isRegistered.current = true;

    const updateServiceWorker = registerSW({
      immediate: false, // Ne pas vérifier immédiatement au chargement
      onRegistered(r) {

      },
      onRegisterError(error) {
      },
      onNeedRefresh() {
        // Ne déclencher que si ce n'est pas déjà affiché
        if (!hasShownUpdateToast.current) {
          hasShownUpdateToast.current = true;
          setNeedRefresh(true);
        }
      },
      onOfflineReady() {
        if (!hasShownOfflineToast.current) {
          hasShownOfflineToast.current = true;
          setOfflineReady(true);
          // Le toast sera affiché dans le composant
        }
      },
    });

    setUpdateSW(() => updateServiceWorker);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdate = async () => {
    if (updateSW) {
      await updateSW(true);
      window.location.reload();
    }
  };

  return {
    needRefresh,
    offlineReady,
    handleUpdate,
    toast,
  };
}

// Variable globale pour éviter les doublons
let isPromptShown = false;
let hasShownOfflineToast = false;

export default function PWAUpdatePrompt() {
  const { t } = useTranslation();
  const { needRefresh, handleUpdate, toast, offlineReady } = usePWAUpdate();
  const [dismissed, setDismissed] = useState(false);

  // Afficher le toast d'offline ready une seule fois
  useEffect(() => {
    if (offlineReady && toast.current && !hasShownOfflineToast) {
      hasShownOfflineToast = true;
      toast.current.show({
        severity: "success",
        summary: t("pwa_offline_ready"),
        detail: t("pwa_offline_message"),
        life: 3000,
      });
    }
  }, [offlineReady, toast, t]);

  // Ne pas afficher le banner de mise à jour si déjà montré ou dismissé
  if (!needRefresh || dismissed) {
    return <Toast ref={toast} position="top-right" />;
  }

  // Marquer comme montré une seule fois
  if (!isPromptShown) {
    isPromptShown = true;
  }

  return (
    <>
      <Toast ref={toast} position="top-right" />
      <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-sm font-dm-sans">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-info-50 dark:bg-info-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <i className="pi pi-refresh text-info-500 dark:text-info-400 text-lg"></i>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
              {t("pwa_update_available")}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {t("pwa_update_message")}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            label={t("pwa_update_now")}
            icon="pi pi-check"
            className="!bg-brand-500 hover:!bg-brand-600 !border-brand-500 hover:!border-brand-600 !text-white flex-1 text-sm px-3 py-2"
            style={{
              backgroundColor: "#1A6C30",
              borderColor: "#1A6C30",
              color: "white",
              fontSize: "0.875rem",
              padding: "0.5rem 0.75rem",
            }}
            onClick={handleUpdate}
          />
          <Button
            label={t("cancel")}
            icon="pi pi-times"
            className="!bg-gray-100 hover:!bg-gray-200 dark:!bg-gray-800 dark:hover:!bg-gray-700 !text-gray-700 dark:!text-gray-300 !border-gray-200 dark:!border-gray-700 text-sm px-3 py-2"
            style={{
              fontSize: "0.875rem",
              padding: "0.5rem 0.75rem",
            }}
            onClick={() => setDismissed(true)}
          />
        </div>
      </div>
    </>
  );
}
