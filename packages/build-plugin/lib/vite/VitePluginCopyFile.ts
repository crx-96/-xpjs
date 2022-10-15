import { existsSync } from "fs";
import { Plugin } from "vite";
import { copyFile, delFile, getUrl } from "../utils";

export const VitePluginCopyFile = (
  options: Plugin.CopyFileOptions | Plugin.CopyFileOptions[] = {
    src: "static",
    dest: "dist/static",
    outFile: false,
  }
): Plugin => {
  const delList: string[] = [];
  let delay = 100;
  return {
    name: "vite-plugin-copy-file",
    enforce: "post",
    apply: "build",
    closeBundle() {
      if (Array.isArray(options)) {
        options.forEach((item) => {
          if (item?.delay && item.delay > delay) {
            delay = item.delay;
          }
          if (item?.del) {
            if (Array.isArray(item.del)) {
              delList.push(...item.del.map((i) => getUrl(i)));
            } else {
              delList.push(getUrl(item.del));
            }
          }
          const src = getUrl(item?.src || "static");
          const dest = getUrl(item?.dest || "dist/static");
          if (existsSync(src)) {
            copyFile(src, dest, item?.outFile);
          }
        });
      } else {
        if (options?.delay) {
          delay = options.delay;
        }
        if (options?.del) {
          if (Array.isArray(options.del)) {
            delList.push(...options.del.map((i) => getUrl(i)));
          } else {
            delList.push(getUrl(options.del));
          }
        }
        const src = getUrl(options?.src || "static");
        const dest = getUrl(options?.dest || "dist/static");
        if (existsSync(src)) {
          copyFile(src, dest, options?.outFile);
        }
      }
      // 删除文件
      delList.sort((a, b) => b.length - a.length);
      setTimeout(() => {
        delList.forEach((item) => {
          delFile(item);
        });
      }, delay);
    },
    config() {
      return {
        publicDir: false,
      };
    },
  };
};
