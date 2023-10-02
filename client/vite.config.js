import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env": {
      REACT_APP_DEV_URL: "http://localhost:5000",
      REACT_APP_UAT_URL:
        "https://inklothes-app-backend-y2xvt.ondigitalocean.app",
    },
  },
  plugins: [react({})],
});
