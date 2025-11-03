import { useState, useEffect } from "react";
import { usePWAInstall } from "../../hooks/usePWAInstall";
import { Button } from "primereact/button";
import { useTranslation } from "react-i18next";
import { Tooltip } from "primereact/tooltip";

export default function PWAInstallButton() {
  const { t } = useTranslation();
  const { isInstallable, isInstalled, promptInstall, canInstallManually } =
    usePWAInstall();

  // Debug avec plus d'informations
  useEffect(() => {
    console.log(
      "🔔 PWA Install Button - isInstallable:",
      isInstallable,
      "isInstalled:",
      isInstalled
    );
    if (isInstallable) {
      console.log("✅ L'application est maintenant installable !");
      console.log(
        "📍 Cherchez le bouton d'installation dans le header, ou l'icône dans la barre d'adresse"
      );
    } else if (!isInstalled) {
      console.log("⏳ En attente de l'événement beforeinstallprompt...");
      console.log(
        "💡 Tous les critères PWA semblent remplis, le navigateur devrait déclencher l'événement bientôt"
      );
    }
  }, [isInstallable, isInstalled]);

  // Ne pas afficher si déjà installé
  if (isInstalled) {
    return null;
  }

  // Si pas encore installable mais que tous les critères sont remplis,
  // on affiche quand même le bouton avec un message pour installer manuellement
  if (!isInstallable) {
    if (canInstallManually) {
      return (
        <>
          <Tooltip
            target=".pwa-install-manual-btn"
            content={t("pwa_install_manual_tooltip")}
          />
          <Button
            className="pwa-install-manual-btn p-button-outlined p-button-sm p-button-help"
            icon="pi pi-download"
            onClick={() => {
              // Ouvrir les instructions dans un toast ou une modal
              alert(t("pwa_install_manual_instructions"));
            }}
            label={t("pwa_install_app")}
            aria-label={t("pwa_install_app")}
          />
        </>
      );
    }
    return null;
  }

  return (
    <>
      <Tooltip target=".pwa-install-btn" content={t("pwa_install_tooltip")} />
      <Button
        id="pwa-install-btn"
        className="pwa-install-btn p-button-outlined p-button-sm"
        icon="pi pi-download"
        onClick={promptInstall}
        label={t("pwa_install_app")}
        aria-label={t("pwa_install_app")}
      />
    </>
  );
}
