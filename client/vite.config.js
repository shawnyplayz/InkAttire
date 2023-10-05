import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path, { resolve } from "node:path";
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@store": path.resolve(__dirname, "./src/redux/store"),
    },
  },
  define: {
    "process.env": {
      REACT_APP_DEV_URL: "http://localhost:5000",
      REACT_APP_UAT_URL:
        "https://inklothes-app-backend-y2xvt.ondigitalocean.app",
    },
  },
  plugins: [react({})],
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
  server: {
    port: 3000,
  },
  build: {
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      external: "sweetalert2.all.min.js",
      output: {
        globals: {
          react: "React",
        },
      },
    },
  },
});
