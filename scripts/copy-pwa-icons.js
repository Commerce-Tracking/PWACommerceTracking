// Script pour copier les icônes PWA dans dist/ après le build
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicIconsDir = path.join(__dirname, "..", "public", "icons");
const distIconsDir = path.join(__dirname, "..", "dist", "icons");
const iconsToCopy = ["pwa-192x192.png", "pwa-512x512.png"];

try {
  // Créer le dossier dist/icons s'il n'existe pas
  if (!fs.existsSync(distIconsDir)) {
    fs.mkdirSync(distIconsDir, { recursive: true });
    console.log("✅ Dossier dist/icons créé");
  }

  // Copier chaque icône
  let copiedCount = 0;
  iconsToCopy.forEach((icon) => {
    const src = path.join(publicIconsDir, icon);
    const dest = path.join(distIconsDir, icon);

    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`✅ ${icon} copié`);
      copiedCount++;
    } else {
      console.warn(`⚠️ ${icon} non trouvé dans public/icons/`);
    }
  });

  if (copiedCount > 0) {
    console.log(`\n🎉 ${copiedCount} icône(s) PWA copiée(s) avec succès !`);
  } else {
    console.error(
      "\n❌ Aucune icône copiée. Vérifiez que les icônes existent dans public/icons/"
    );
    process.exit(1);
  }
} catch (error) {
  console.error("❌ Erreur lors de la copie des icônes :", error.message);
  process.exit(1);
}
