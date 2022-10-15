namespace Plugin {
  // 复制文件插件参数
  export interface CopyFileOptions {
    src: string; // 原文件路径，可以是目录或者文件
    dest: string; // 目标文件路径，目录类型
    outFile?: boolean; // dest默认为目录，此类型为true的情况下，dest为文件
    del?: string | string[]; // 删除文件/目录（目录清空下将会删除目录及目录下所有的内容）
    delay?: number;
  }

  export namespace VitePlugin {
    // vite的html插件参数
    export interface HtmlOptions {
      template?: string;
      record?: Record<string, string>;
      replace?:
        | Record<string, string>
        | Array<{ test: string | RegExp; value: string }>;
      // 兼容webpack的用法，比如htmlWebpackPlugin.options.title，则此值为htmlWebpackPlugin.options.
      htmlPrefix?: string; // 只针对Record<string, string>类型的record和replace
      fixed?: string[]; // 固定不变的内容，比如不想/static/xxx被转换，则使用该属性
    }
  }
}
