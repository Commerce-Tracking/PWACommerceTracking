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
        console.log("SW Registered: " + r);
      },
      onRegisterError(error) {
        console.error("SW registration error", error);
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
      <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <i className="pi pi-refresh text-blue-600 dark:text-blue-300"></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {t("pwa_update_available")}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("pwa_update_message")}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            label={t("pwa_update_now")}
            icon="pi pi-check"
            className="p-button-sm p-button-primary"
            onClick={handleUpdate}
          />
          <Button
            label={t("cancel")}
            icon="pi pi-times"
            className="p-button-sm p-button-secondary"
            onClick={() => setDismissed(true)}
          />
        </div>
      </div>
    </>
  );
}
