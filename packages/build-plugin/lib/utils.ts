import {
  existsSync,
  statSync,
  mkdirSync,
  readdirSync,
  unlinkSync,
  createReadStream,
  createWriteStream,
  rmdirSync,
} from "fs";
import { isAbsolute, resolve, basename } from "path";

// 获取路径
export const getUrl = (url: string): string => {
  return isAbsolute(url) ? url : resolve(process.cwd(), url);
};

// 判断文件类型
export const isDir = (url: string): boolean => {
  return existsSync(getUrl(url)) && statSync(getUrl(url)).isDirectory();
};
export const isFile = (url: string): boolean => {
  return existsSync(getUrl(url)) && statSync(getUrl(url)).isFile();
};

// 判断目录是否存在，不存在则创建
export const dirIsExists = (url: string): boolean => {
  if (!isDir(url)) {
    if (dirIsExists(resolve(getUrl(url), ".."))) {
      mkdirSync(url);
    } else {
      return false;
    }
  }
  return true;
};

// 拷贝文件
export const copyFile = (
  src: string,
  dest: string,
  outFile?: boolean
): void => {
  src = getUrl(src);
  dest = getUrl(dest);
  if (isFile(src)) {
    if (outFile) {
      dirIsExists(resolve(dest, ".."));
      if (isFile(dest)) {
        unlinkSync(dest);
      }
      createReadStream(src).pipe(createWriteStream(dest));
    } else {
      const filename = basename(src);
      dirIsExists(dest);
      if (isFile(resolve(dest, filename))) {
        unlinkSync(resolve(dest, filename));
      }
      createReadStream(src).pipe(createWriteStream(resolve(dest, filename)));
    }
  } else if (isDir(src)) {
    const list = readdirSync(src);
    list.forEach((item) => {
      if (isFile(resolve(src, item))) {
        copyFile(resolve(src, item), dest, false);
      } else {
        copyFile(resolve(src, item), resolve(dest, item), false);
      }
    });
  }
};

// 删除文件
export const delFile = (url: string, force = true): boolean => {
  url = getUrl(url);
  if (isFile(url)) {
    unlinkSync(url);
    return true;
  }
  if (isDir(url)) {
    const list = readdirSync(url);
    if (list.length === 0) {
      rmdirSync(url);
      return true;
    } else {
      if (force) {
        if (list.every((i) => delFile(resolve(url, i), true))) {
          rmdirSync(url);
          return true;
        }
      }
    }
  }
  return false;
};
