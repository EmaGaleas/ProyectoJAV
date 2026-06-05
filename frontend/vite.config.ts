import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: 'inline',
    // Configuración de Rollup para producción
    rollupOptions: {
      output: {
        codeSplitting: true // Activa la división automática de chunks
      }
    }
  }
})