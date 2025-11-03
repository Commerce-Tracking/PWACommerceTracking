import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
    VitePWA({
      registerType: "prompt",
      injectRegister: false,
      includeAssets: [
        "favicon.ico",
        "robots.txt",
        "fonts/**/*.ttf",
        "icons/pwa-192x192.png",
        "icons/pwa-512x512.png",
      ],
      strategies: "generateSW",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2,ttf}"],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 Mo
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/gateway-api\.dev\.freetrade-ofr\.com\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 24 heures
              },
              networkTimeoutSeconds: 10,
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 jours
              },
            },
          },
          {
            urlPattern: /\.(?:js|css|woff2?|ttf)$/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "static-resources",
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 jours
              },
            },
          },
        ],
      },
      manifest: {
        name: "Commerce Tracking Backoffice",
        short_name: "OFR Admin",
        description:
          "Opération Fluidité Routière - Administration des collectes agricoles et bétail",
        theme_color: "#00277F",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait-primary",
        scope: "/",
        start_url: "/",
        categories: ["productivity", "business"],
        lang: "fr",
        dir: "ltr",
        icons: [
          {
            src: "/icons/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
          // Fallback : utiliser directement le logo si les icônes PWA ne se chargent pas
          {
            src: "/images/logo/Plan de travail 1.png",
            sizes: "any",
            type: "image/png",
            purpose: "any",
          },
        ],
        shortcuts: [
          {
            name: "Dashboard",
            short_name: "Dashboard",
            description: "Accéder au tableau de bord",
            url: "/",
            icons: [{ src: "/icons/pwa-192x192.png", sizes: "192x192" }],
          },
          {
            name: "Collections",
            short_name: "Collections",
            description: "Gérer les collectes",
            url: "/agricultural-collections",
            icons: [{ src: "/icons/pwa-192x192.png", sizes: "192x192" }],
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: "module",
        navigateFallback: "index.html",
      },
    }),
  ],
  server: {
    host: true, // Permet l'accès depuis le réseau local
    // HTTPS nécessaire pour PWA en réseau (pas seulement localhost)
    // Pour activer HTTPS :
    // 1. Installez mkcert : https://github.com/FiloSottile/mkcert
    // 2. Exécutez : mkcert -install
    // 3. Exécutez : mkcert localhost 127.0.0.1 192.168.x.x (votre IP)
    // 4. Créez le dossier certs/ et déplacez les fichiers générés
    // 5. Décommentez les lignes ci-dessous
    // HTTPS nécessaire pour PWA en réseau (décommentez et configurez si besoin)
    // Pour activer HTTPS :
    // 1. Installez mkcert : https://github.com/FiloSottile/mkcert
    // 2. Exécutez : mkcert -install
    // 3. Exécutez : mkcert localhost 127.0.0.1 192.168.x.x (votre IP)
    // 4. Créez le dossier certs/ et déplacez les fichiers
    // 5. Décommentez et modifiez les lignes ci-dessous :
    // https: {
    //   key: require('fs').readFileSync('./certs/key.pem'),
    //   cert: require('fs').readFileSync('./certs/cert.pem'),
    // },
    proxy: {
      // Proxy pour les appels vers ton
      // API distante
      "/api": {
        target: "https://gateway-api.dev.freetrade-ofr.com",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""), // enlève le préfixe /api
      },
    },
  },
});
