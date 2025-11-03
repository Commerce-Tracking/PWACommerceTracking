import { useState, useEffect, useRef } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstallManually, setCanInstallManually] = useState(false);

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    const checkInstalled = () => {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone;

      if (isStandalone) {
        console.log("PWA: Application déjà installée");
        setIsInstalled(true);
        return true;
      }
      return false;
    };

    if (checkInstalled()) return;

    // Écouter l'événement beforeinstallprompt
    const handler = (e: Event) => {
      console.log("🎉 PWA: Événement beforeinstallprompt détecté !");
      console.log("✅ L'application peut maintenant être installée");
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Vérifier si on peut installer manuellement (même si beforeinstallprompt ne se déclenche pas)
    const checkManualInstall = async () => {
      try {
        const manifestRes = await fetch("/manifest.webmanifest");
        if (!manifestRes.ok) return false;

        const swReg = await navigator.serviceWorker.getRegistration();
        if (!swReg || !swReg.active) return false;

        // Si tous les critères sont remplis, on peut proposer l'installation manuelle
        return true;
      } catch {
        return false;
      }
    };

    // Vérifier après 3 secondes si on peut installer manuellement
    const checkTimeout = setTimeout(async () => {
      if (!isInstallable) {
        const canInstall = await checkManualInstall();
        if (canInstall) {
          setCanInstallManually(true);
          console.log("✅ PWA: Tous les critères sont remplis !");
          console.log("💡 Installation disponible via :");
          console.log(
            "   - Menu navigateur (3 points) > 'Installer l'application'"
          );
          console.log("   - Icône dans la barre d'adresse (si disponible)");
        }
      }
    }, 3000);

    // Vérification périodique des critères PWA
    let checkCount = 0;
    const maxChecks = 15; // 30 secondes max (15 * 2s)

    const checkInterval = setInterval(() => {
      if (checkCount >= maxChecks) {
        clearInterval(checkInterval);
        return;
      }
      checkCount++;

      if (!isInstallable && !checkInstalled()) {
        // Vérifier le manifest
        fetch("/manifest.webmanifest")
          .then((res) => {
            if (res.ok) {
              return res.json();
            } else {
              console.warn("PWA: Manifest non trouvé (404)");
              return null;
            }
          })
          .then((manifest) => {
            if (manifest) {
              console.log("PWA: Manifest valide trouvé", {
                name: manifest.name,
                icons: manifest.icons?.length || 0,
              });

              // Vérifier chaque icône
              if (manifest.icons && manifest.icons.length > 0) {
                manifest.icons.forEach((icon: any, index: number) => {
                  const img = new Image();
                  let timeoutId: ReturnType<typeof setTimeout>;

                  const cleanup = () => {
                    if (timeoutId) clearTimeout(timeoutId);
                    img.onload = null;
                    img.onerror = null;
                  };

                  img.onload = () => {
                    cleanup();
                    console.log(
                      `PWA: ✅ Icône ${index + 1} valide (${icon.src})`
                    );
                  };

                  img.onerror = () => {
                    cleanup();
                    console.warn(
                      `PWA: ⚠️ Icône ${index + 1} invalide (${icon.src})`
                    );
                    console.warn(
                      `💡 Solution: Videz le cache (DevTools > Application > Clear storage)`
                    );
                  };

                  // Timeout de 5 secondes
                  timeoutId = setTimeout(() => {
                    cleanup();
                    console.warn(
                      `PWA: ⏱️ Timeout lors du chargement de l'icône ${
                        index + 1
                      }`
                    );
                  }, 5000);

                  // Charger avec timestamp pour bypass cache
                  img.src = `${icon.src}?t=${Date.now()}`;
                });
              } else {
                console.warn("PWA: ⚠️ Aucune icône dans le manifest !");
              }
            }
          })
          .catch(() => {
            console.warn("PWA: Impossible de charger le manifest");
          });

        // Vérifier le Service Worker
        navigator.serviceWorker.getRegistration().then((reg) => {
          if (reg) {
            console.log("PWA: Service Worker actif");
          } else {
            console.warn("PWA: ⚠️ Service Worker non enregistré");
          }
        });
      }
    }, 2000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearInterval(checkInterval);
      if (checkTimeout) clearTimeout(checkTimeout);
    };
  }, []);

  const promptInstall = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      console.warn(
        "PWA: deferredPrompt non disponible - l'événement beforeinstallprompt ne s'est pas déclenché"
      );
      return false;
    }

    try {
      console.log("PWA: Déclenchement du prompt d'installation...");

      // Déclencher directement le prompt d'installation du navigateur
      // Cela affiche le dialogue d'installation natif du navigateur
      await deferredPrompt.prompt();

      // Attendre la réponse de l'utilisateur (accepté ou refusé)
      const { outcome } = await deferredPrompt.userChoice;

      console.log("PWA: Résultat de l'installation:", outcome);

      if (outcome === "accepted") {
        console.log("✅ PWA: Installation acceptée par l'utilisateur");
        setIsInstallable(false);
        setIsInstalled(true);
        setDeferredPrompt(null);
        return true;
      } else {
        console.log("❌ PWA: Installation refusée par l'utilisateur");
        // Ne pas nettoyer le deferredPrompt ici - l'utilisateur peut réessayer
        return false;
      }
    } catch (error: any) {
      console.error("❌ Erreur lors de l'installation:", error);

      // Certaines erreurs sont normales (prompt déjà déclenché, etc.)
      if (
        error.message?.includes("already been triggered") ||
        error.message?.includes("already shown") ||
        error.message?.includes("user gesture")
      ) {
        console.warn(
          "ℹ️ PWA: Le prompt a déjà été déclenché ou nécessite un geste utilisateur"
        );
      }

      return false;
    }
  };

  return {
    isInstallable,
    isInstalled,
    promptInstall,
    canInstallManually,
  };
}
