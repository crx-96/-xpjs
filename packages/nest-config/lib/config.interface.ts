// 配置选项
export interface ConfigOptions {
  /**
   * 配置文件所在的目录
   * 1、默认加载main.js（运行文件）所在的目录下的config文件下的文件（process.cwd()）
   * 2、默认加载config.default.js（不管什么环境）
   * 3、根据运行环境加载对应的文件配置，如process.env.NODE_ENV为production是加载config.production.js
   */
  folder?: string;

  /**
   * 配置文件，如为数组，后面的配置内容将覆盖前面的配置内容
   * 1、配置此项之后，此层级比folder高
   */
  path?: string | string[];
}
