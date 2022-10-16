import { IndexHtmlTransformContext, Plugin as VitePlugin } from "vite";
import { getUrl } from "../utils";
import { basename } from "path";
import { Plugin } from "../typings";

export const VitePluginHtml = (
  options: Plugin.VitePlugin.HtmlOptions | Plugin.VitePlugin.HtmlOptions[] = {
    template: "index.html",
  }
): VitePlugin => {
  const list: Plugin.VitePlugin.HtmlOptions[] = [];
  const fixObj: Record<string, string> = {};
  if (Array.isArray(options)) {
    options.forEach((item) => {
      list.push({
        template: getUrl(item?.template || "index.html"),
        record: item?.record,
        replace: item?.replace,
        htmlPrefix: item?.htmlPrefix,
        fixed: item?.fixed,
      });
    });
  } else {
    list.push({
      template: getUrl(options?.template || "index.html"),
      record: options?.record,
      replace: options?.replace,
      htmlPrefix: options?.htmlPrefix,
      fixed: options?.fixed,
    });
  }
  return {
    name: "vite-plugin-html",
    enforce: "pre",
    config() {
      let input: Record<string, string> | string;
      if (list.length === 1) {
        input = list[0].template;
      } else {
        input = {};
        list.forEach((item) => {
          input[basename(item.template, ".html")] = item.template;
        });
      }
      return {
        build: {
          rollupOptions: {
            input,
          },
        },
      };
    },
    transform(code: string, id: string) {
      if (id.endsWith(".html")) {
        const item = list.find((i) => basename(i.template) === basename(id));
        if (item?.fixed) {
          item.fixed.forEach((tt) => {
            const key =
              basename(id, ".html") + Math.floor(Math.random() * 10000) + tt;
            fixObj[key] = tt;
            code = code.replace(new RegExp(tt, "g"), () => {
              return key;
            });
          });
        }
        return code;
      }
    },
    transformIndexHtml(code: string, ctx: IndexHtmlTransformContext) {
      const id = ctx.filename;
      const item = list.find((i) => basename(i.template) === basename(id));
      // 处理fixed
      if (item?.fixed) {
        for (const key in fixObj) {
          if (Object.prototype.hasOwnProperty.call(fixObj, key)) {
            code = code.replace(new RegExp(key, "g"), () => {
              return fixObj[key];
            });
          }
        }
      }
      // 处理record
      if (item?.record) {
        for (const key in item.record) {
          if (Object.prototype.hasOwnProperty.call(item.record, key)) {
            const content = item?.htmlPrefix ? item.htmlPrefix + key : key;
            code = code.replace(new RegExp(`<%= ${content} %>`, "g"), () => {
              return item.record[key];
            });
          }
        }
      }
      // 处理replace
      if (item?.replace) {
        if (Array.isArray(item.replace)) {
          item.replace.forEach((tt) => {
            code = code.replace(new RegExp(tt.test, "g"), () => {
              return tt.value;
            });
          });
        } else {
          for (const key in item.replace) {
            if (Object.prototype.hasOwnProperty.call(item.replace, key)) {
              const content = item?.htmlPrefix ? item.htmlPrefix + key : key;
              code = code.replace(new RegExp(content, "g"), () => {
                return item.replace[key];
              });
            }
          }
        }
      }
      return code;
    },
  };
};
