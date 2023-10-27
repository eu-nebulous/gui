import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import * as path from "path"
import svgLoader from "vite-svg-loader"

const pathResolve = (pathStr: string): string => {
  return path.resolve(__dirname, ".", pathStr)
}

export default defineConfig({
  /*  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  },*/
  build: {
    commonjsOptions: {
      include: ["tailwind.config.js", "node_modules/**"]
    }
  },
  optimizeDeps: {
    include: ["tailwind-config"]
  },
  plugins: [vue(), svgLoader()],
  resolve: {
    extensions: [".js", ".ts", ".vue", ".json"],
    alias: {
      "tailwind-config": pathResolve("./tailwind.config.js"),
      "@": pathResolve("./src")
    }
  }
})
