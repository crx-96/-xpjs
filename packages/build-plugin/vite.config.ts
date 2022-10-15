import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePluginCopyFile, VitePluginHtml } from "./lib/index";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePluginCopyFile([
      { src: "./static", dest: "./dist" },
      {
        src: "./dist/public/index.html",
        dest: "./dist",
        del: ["./dist/public"],
      },
    ]),
    VitePluginHtml([
      {
        record: { title: "index" },
        htmlPrefix: "htmlWebpackPlugin.options.",
        fixed: ["/vite.svg"],
      },
    ]),
  ],
  server: {
    port: 3999,
    host: "0.0.0.0",
  },
});
