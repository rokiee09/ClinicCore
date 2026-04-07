import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Yerel: npm run dev → base /
 * GitHub Actions: npm run build -- --base /ClinicCore/
 * Elle build: npm run build:gh
 */
export default defineConfig({
  plugins: [react()],
});
