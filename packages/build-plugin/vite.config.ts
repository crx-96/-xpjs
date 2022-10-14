import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePluginCopyFile } from "./lib/index";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePluginCopyFile([
      { src: "./static", dest: "./dist" },
      {
        src: "./dist/public/index.html",
        dest: "./dist",
        del: ["./dist/public", "./dist/public/index.html"],
      },
    ]),
  ],
  build: {
    rollupOptions: {
      input: "./public/index.html",
    },
  },
});
