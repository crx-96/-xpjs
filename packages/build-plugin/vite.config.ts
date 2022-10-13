import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePluginCopyFile } from "./lib/index";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VitePluginCopyFile()],
});
