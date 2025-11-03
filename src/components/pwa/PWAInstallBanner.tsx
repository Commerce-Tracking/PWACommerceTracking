import { useState, useEffect } from "react";
import { usePWAInstall } from "../../hooks/usePWAInstall";
import { useTranslation } from "react-i18next";
import { Button } from "primereact/button";

export default function PWAInstallBanner() {
  const { t } = useTranslation();
  const { isInstallable, isInstalled, promptInstall, canInstallManually } =
    usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Détecter si on est sur mobile (pour les instructions spécifiques)
    const checkMobile = () => {
      return (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth < 768
      );
    };

    setIsMobile(checkMobile());

    const handleResize = () => {
      setIsMobile(checkMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Ne pas afficher si déjà installé, rejeté, ou si l'installation n'est pas disponible
  // On affiche seulement si isInstallable est true (beforeinstallprompt déclenché)
  if (isInstalled || dismissed || !isInstallable) {
    return null;
  }

  const handleInstall = async () => {
    // Si l'installation est disponible via beforeinstallprompt, lancer directement
    if (isInstallable) {
      console.log("PWA: Lancement de l'installation...");
      const success = await promptInstall();
      if (success) {
        // Installation réussie
        setDismissed(true);
      } else {
        // L'utilisateur a peut-être refusé, mais ne pas afficher d'instructions
        // Le prompt du navigateur a déjà été affiché
        console.log("PWA: Installation annulée par l'utilisateur");
      }
      return;
    }

    // Si canInstallManually mais pas isInstallable, l'événement beforeinstallprompt
    // n'a pas encore été déclenché. Dans ce cas, ne pas afficher le banner
    // ou afficher les instructions seulement si vraiment nécessaire
    // Pour l'instant, on ne fait rien - le banner ne devrait pas s'afficher dans ce cas
    console.warn(
      "PWA: Installation non disponible - l'événement beforeinstallprompt n'a pas été déclenché"
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="flex items-center justify-between gap-3 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <i className="pi pi-download text-xl md:text-lg"></i>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-base md:text-sm leading-tight">
              {t("pwa_install_banner_title") || "Installer l'application"}
            </p>
            <p className="text-sm md:text-xs text-white/90 mt-0.5">
              {t("pwa_install_banner_description") ||
                "Accès rapide depuis votre écran d'accueil"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            label={t("pwa_install_now") || "Installer"}
            icon="pi pi-check"
            className="p-button-sm md:p-button-xs p-button-success"
            onClick={handleInstall}
            disabled={!isInstallable && !canInstallManually}
          />
          <Button
            icon="pi pi-times"
            className="p-button-sm md:p-button-xs p-button-text p-button-plain text-white"
            onClick={() => setDismissed(true)}
            aria-label={t("close")}
          />
        </div>
      </div>
    </div>
  );
}
