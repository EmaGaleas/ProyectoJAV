import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";


export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
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