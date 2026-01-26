import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@components": path.resolve(path.__dirname, "src/components"),
      "@pages": path.resolve(path.__dirname, "src/pages"),
      "@hooks": path.resolve(path.__dirname, "src/hooks"),
      "@api": path.resolve(path.__dirname, "src/api"),
      "@styles": path.resolve(path.__dirname, "src/styles"),
      "@assets": path.resolve(path.__dirname, "src/assets"),
      "@utils": path.resolve(path.__dirname, "src/utils"),
      "@src": path.resolve(path.__dirname, "src/"),
    },
  },
  server: {
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
