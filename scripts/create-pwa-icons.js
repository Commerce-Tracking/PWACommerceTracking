// Script pour créer des icônes PWA temporaires
// Utilise Canvas API de Node.js

const fs = require("fs");
const path = require("path");

// Créer un SVG simple pour les icônes
const createIconSVG = (size, text) => {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#00277F"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${
    size * 0.3
  }" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text>
</svg>`;
};

// Créer les dossiers si nécessaire
const iconsDir = path.join(__dirname, "..", "public", "icons");
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Note: Ce script crée des SVG, mais pour les PWA il faut des PNG
// Pour l'instant, on va créer des instructions pour l'utilisateur
console.log("📝 Instructions pour créer les icônes PWA:");
console.log("");
console.log("1. Créez deux icônes PNG:");
console.log("   - public/icons/pwa-192x192.png (192x192 pixels)");
console.log("   - public/icons/pwa-512x512.png (512x512 pixels)");
console.log("");
console.log("2. Vous pouvez utiliser un générateur en ligne:");
console.log("   - https://www.pwabuilder.com/imageGenerator");
console.log("   - https://realfavicongenerator.net/");
console.log("");
console.log("3. Ou créer manuellement avec votre logo:");
console.log("   convert logo.png -resize 192x192 public/icons/pwa-192x192.png");
console.log("   convert logo.png -resize 512x512 public/icons/pwa-512x512.png");
console.log("");
console.log(
  "✅ Le bouton d'installation apparaîtra automatiquement dans le header une fois les icônes créées."
);
