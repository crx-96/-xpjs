import { PluginOption } from "vite";
import { isAbsolute, resolve } from "path";
import { copyFileSync, statSync, existsSync, constants } from "fs";

interface CopyFileOptions {
  src: string;
  dest: string;
}

// 获取路径
const getUrl = (url: string): string => {
  return isAbsolute(url) ? url : resolve(process.cwd(), url);
};

// 判断文件类型
const isDir = (url: string): boolean => {
  return statSync(url).isDirectory();
};
const isFile = (url: string): boolean => {
  return statSync(url).isFile();
};

// 拷贝文件
const copy = (src: string, dest: string): void => {};

export const VitePluginCopyFile = (
  options: CopyFileOptions = {
    src: "static",
    dest: "dist/static",
  }
): PluginOption => {
  return {
    name: "vite-plugin-copy-file",
    closeBundle() {
      const src = getUrl(options?.src || "static");
      const dest = getUrl(options?.dest || "dist/static");
      if (existsSync(src)) {
        copy(src, dest);
      }
    },
  };
};
