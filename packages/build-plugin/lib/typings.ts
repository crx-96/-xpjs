namespace Plugin {
  // 复制文件插件参数
  export interface CopyFileOptions {
    src: string; // 原文件路径，可以是目录或者文件
    dest: string; // 目标文件路径，目录类型
    outFile?: boolean; // dest默认为目录，此类型为true的情况下，dest为文件
    del?: string | string[]; // 删除文件/目录（目录清空下将会删除目录及目录下所有的内容）
  }
}
