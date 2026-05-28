import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: 'inline'
  },
  optimizeDeps: {
    esbuildOptions: {
      sourcemap: false  // desactiva sourcemaps en dev dependencies
    }
  }
})
