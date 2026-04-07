import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** GitHub Pages: https://rokiee09.github.io/ClinicCore/ — yalnızca build’de alt yol */
export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/ClinicCore/" : "/",
  plugins: [react()],
}));
