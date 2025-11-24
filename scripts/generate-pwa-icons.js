// Script pour générer les icônes PWA à partir du favicon existant
// Utilise sharp si disponible, sinon donne des instructions

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconsDir = path.join(__dirname, "..", "public", "icons");
const faviconPath = path.join(__dirname, "..", "public", "favicon.png");
const logoPath = path.join(
  __dirname,
  "..",
  "public",
  "images",
  "logo",
  "Plan de travail 1.png"
);

// Créer le dossier icons s'il n'existe pas
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
  console.log("✅ Dossier public/icons créé");
}

// Vérifier si sharp est disponible
let sharp;
try {
  sharp = (await import("sharp")).default;
  console.log("✅ Sharp trouvé, génération des icônes...");
} catch (e) {
  console.log(
    "⚠️  Sharp non installé, utilisation d'une méthode alternative..."
  );
}

async function generateIcons() {
  // Prioriser le logo du projet qui est déjà utilisé dans l'app
  const sourceImage = fs.existsSync(logoPath)
    ? logoPath
    : fs.existsSync(faviconPath)
    ? faviconPath
    : null;

  if (!sourceImage) {
    console.error("❌ Aucun favicon ou logo trouvé !");
    console.log("\n📝 Instructions manuelles :");
    console.log("1. Placez un fichier favicon.png ou logo dans public/");
    console.log(
      "2. Ou utilisez un générateur en ligne : https://www.pwabuilder.com/imageGenerator"
    );
    return;
  }

  if (sharp) {
    try {
      // Générer favicon.png (32x32 pour l'onglet du navigateur)
      await sharp(sourceImage)
        .resize(32, 32, {
          fit: "contain",
          background: { r: 0, g: 39, b: 127, alpha: 1 },
        })
        .toFile(faviconPath);
      console.log("✅ favicon.png créé");

      // Générer pwa-192x192.png
      await sharp(sourceImage)
        .resize(192, 192, {
          fit: "contain",
          background: { r: 0, g: 39, b: 127, alpha: 1 },
        })
        .toFile(path.join(iconsDir, "pwa-192x192.png"));
      console.log("✅ pwa-192x192.png créé");

      // Générer pwa-512x512.png
      await sharp(sourceImage)
        .resize(512, 512, {
          fit: "contain",
          background: { r: 0, g: 39, b: 127, alpha: 1 },
        })
        .toFile(path.join(iconsDir, "pwa-512x512.png"));
      console.log("✅ pwa-512x512.png créé");

      console.log("\n🎉 Icônes PWA et favicon créés avec succès !");
      console.log("📍 Emplacement : public/icons/ et public/favicon.png");
      console.log(
        "\n🔄 Redémarrez votre serveur de développement pour voir le bouton d'installation."
      );
    } catch (error) {
      console.error("❌ Erreur lors de la génération :", error.message);
      showManualInstructions();
    }
  } else {
    showManualInstructions();
  }
}

function showManualInstructions() {
  console.log("\n📝 Instructions pour créer les icônes manuellement :");
  console.log("");
  console.log("Option 1 : Utiliser un générateur en ligne (RAPIDE)");
  console.log("  1. Allez sur : https://www.pwabuilder.com/imageGenerator");
  console.log("  2. Téléchargez votre logo ou favicon.png");
  console.log("  3. Générez et téléchargez les icônes");
  console.log("  4. Placez-les dans public/icons/");
  console.log("");
  console.log("Option 2 : Avec ImageMagick (si installé)");
  console.log(
    `  convert "${faviconPath}" -resize 192x192 public/icons/pwa-192x192.png`
  );
  console.log(
    `  convert "${faviconPath}" -resize 512x512 public/icons/pwa-512x512.png`
  );
  console.log("");
  console.log("Option 3 : Avec un éditeur d'images");
  console.log("  1. Ouvrez favicon.png ou votre logo");
  console.log(
    "  2. Redimensionnez à 192x192 → Sauvegardez comme pwa-192x192.png"
  );
  console.log(
    "  3. Redimensionnez à 512x512 → Sauvegardez comme pwa-512x512.png"
  );
  console.log("  4. Placez les fichiers dans public/icons/");
}

// Installer sharp si nécessaire
async function installSharpIfNeeded() {
  try {
    const { exec } = await import("child_process");
    const { promisify } = await import("util");
    const execAsync = promisify(exec);

    console.log("📦 Tentative d'installation de sharp...");
    await execAsync("npm install --save-dev sharp");
    console.log("✅ Sharp installé ! Relancez ce script.");
  } catch (error) {
    console.log("⚠️  Impossible d'installer sharp automatiquement.");
    showManualInstructions();
  }
}

// Exécuter
try {
  await generateIcons();
} catch (error) {
  if (error.code === "MODULE_NOT_FOUND" && error.message.includes("sharp")) {
    console.log(
      "\n📦 Sharp n'est pas installé. Voulez-vous l'installer automatiquement ?"
    );
    await installSharpIfNeeded();
  } else {
    console.error("❌ Erreur :", error.message);
    showManualInstructions();
  }
}
