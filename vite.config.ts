import { defineConfig } from "vite";
import { getPort } from "get-port-please";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig(async () => {
  // cherche un port libre à partir de 5173
  const port = await getPort({ port: 5173 });

  return {
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
        workbox: {
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 Mo
        },

        registerType: "prompt",
        injectRegister: false,
        includeAssets: [
          "favicon.ico",
          "robots.txt",
          "fonts/**/*.ttf",
          "icons/pwa-192x192.png",
          "icons/pwa-512x512.png",
        ],
        manifest: {
          name: "Commerce Tracking Backoffice",
          short_name: "CT Admin",
          description:
            "Opération Fluidité Routière - Administration des collectes agricoles et bétail",
          theme_color: "#00277F",
          background_color: "#ffffff",
          display: "standalone",
          orientation: "portrait-primary",
          start_url: "/",
        },
        devOptions: {
          enabled: true,
          type: "module",
          navigateFallback: "index.html",
        },
      }),
    ],
    server: {
      host: true,
      port, // 👈 port automatique trouvé
      strictPort: false,
      proxy: {
        "/api": {
          target: "https://gateway-api.dev.freetrade-ofr.com",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
