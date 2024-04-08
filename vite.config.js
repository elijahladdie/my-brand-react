/* eslint-disable no-undef */
import react from "@vitejs/plugin-react";
import "dotenv/config";
import { defineConfig } from "vite";
import crossOriginIsolation from "vite-plugin-cross-origin-isolation";

const PORT = process.env.PORT || 3000;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crossOriginIsolation()],

  //change port for DEV
  preview: {
    port: PORT,
    host: true,
  },
  // for PROD
  server: {
    host: true,
    port: PORT,
    fs: {
      strict: false,
    },
    transform: {
      // Add a custom transform to set the correct MIME type for JSX files
      async transformIndexHtml(html) {
        return html.replace(
          /<script type="module" src="(.*?)"><\/script>/g,
          (match, src) => {
            if (src.endsWith(".jsx")) {
              return `<script type="module" src="${src}" crossorigin="use-credentials"></script>`;
            }
            return match;
          }
        );
      },
    },
    logLevel: "silent",
  },
});