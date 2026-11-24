
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuration Vite pour MANA - GitHub Pages
export default defineConfig({
  plugins: [react()],

  // Base URL du repository GitHub
  base: "/mana/",

  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
  },
});
