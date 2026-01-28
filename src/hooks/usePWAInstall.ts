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
        setIsInstalled(true);
        return true;
      }
      return false;
    };

    if (checkInstalled()) return;

    // Écouter l'événement beforeinstallprompt
    const handler = (e: Event) => {
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
              return null;
            }
          })
          .then((manifest) => {
            if (manifest) {

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
                  };

                  img.onerror = () => {
                    cleanup();
                  };

                  // Timeout de 5 secondes
                  timeoutId = setTimeout(() => {
                    cleanup();
                  }, 5000);

                  // Charger avec timestamp pour bypass cache
                  img.src = `${icon.src}?t=${Date.now()}`;
                });
              } else {
              }
            }
          })
          .catch(() => {
          });

        // Vérifier le Service Worker
        navigator.serviceWorker.getRegistration().then((reg) => {
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
      return false;
    }

    try {
      // Déclencher directement le prompt d'installation du navigateur
      // Cela affiche le dialogue d'installation natif du navigateur
      await deferredPrompt.prompt();

      // Attendre la réponse de l'utilisateur (accepté ou refusé)
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setIsInstallable(false);
        setIsInstalled(true);
        setDeferredPrompt(null);
        return true;
      } else {
        // Ne pas nettoyer le deferredPrompt ici - l'utilisateur peut réessayer
        return false;
      }
    } catch (error: any) {
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
