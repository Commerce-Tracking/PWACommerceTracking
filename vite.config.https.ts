// Configuration HTTPS pour PWA en réseau
// Copiez ce contenu dans vite.config.ts après avoir généré les certificats avec mkcert

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  // ... votre configuration existante ...
  server: {
    host: true,
    https: {
      // Assurez-vous d'avoir généré les certificats avec mkcert
      // et de les avoir placés dans le dossier certs/
      key: require("fs").readFileSync("./certs/key.pem"),
      cert: require("fs").readFileSync("./certs/cert.pem"),
    },
    // ... reste de la config
  },
});
