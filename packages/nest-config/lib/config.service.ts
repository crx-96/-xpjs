import { ConfigOptions } from './config.interface';
import { statSync, existsSync } from 'fs';
import { resolve } from 'path';
import { deepMerge, isArray, isObject, MergeEnum } from '@xpjs/common';

export class ConfigService {
  private config: any = {};

  constructor(options?: ConfigOptions) {
    // 读取默认目录下的配置内容
    this.config = this.getConfigOfDefaultDir();
    if (options?.folder) {
      // 读取配置目录下的配置内容
      this.config = deepMerge(this.config, this.getConfigOfDefaultDir(options.folder), MergeEnum.Override, true);
    }
    // 读取配置文件的内容
    if (options?.path) {
      const paths = (isArray(options.path) ? options.path : [options.path]) as string[];
      if (paths.length > 0) {
        this.config = deepMerge(this.config, this.readConfig(paths), MergeEnum.Override, true);
      }
    }
  }

  // 获取默认/配置目录下的配置内容
  private getConfigOfDefaultDir(folder?: string): object {
    // 默认配置路径
    const url = folder || resolve(process.cwd(), './config');
    if (existsSync(url) && statSync(url).isDirectory()) {
      // 读取的路径数组
      const urls = [
        resolve(url, 'config.default.js'),
        ...this.getEnv().map((item) => resolve(url, `config.${item}.js`)),
      ];
      return this.readConfig(urls);
    }
    return {};
  }

  // 获取运行环境NODE_ENV
  private getEnv(): string[] {
    const result: string[] = [];
    const env = process.env.NODE_ENV || 'production';
    if (env === 'production') {
      result.push('prod', 'production');
    } else if (env === 'prod') {
      result.push('production', 'prod');
    } else if (env === 'development') {
      result.push('dev', 'development');
    } else if (env === 'dev') {
      result.push('development', 'dev');
    } else {
      result.push(env);
    }
    return result;
  }

  // 读取配置文件内容并合并
  private readConfig(urls: string[]): object {
    let result = {};
    urls.forEach((item) => {
      if (existsSync(item) && statSync(item).isFile()) {
        const data = require(item).default;
        result = deepMerge(result, isObject(data) ? data : {}, MergeEnum.Override, true);
      }
    });
    return result;
  }

  // 获取配置信息
  get<T = any>(key?: string): T | undefined {
    if (key) {
      try {
        let result = this.config;
        const keys = key.split('.');
        keys.forEach((item) => {
          result = result?.[item];
        });
        return result;
      } catch (error) {
        return undefined;
      }
    }
    return this.config;
  }

  // 设置整个配置内容
  set<T extends object>(value: T): void;
  // 设置配置的某个字段（当赋值深层次时，会把前面的字段设置为对象）
  set<T = any>(key: string, value: T): void;
  // 实现配置设置
  set(arg1: any, arg2?: any): void {
    if (arg2) {
      // 设置配置中的某一项
      const keys = (arg1 as string).split('.');
      let temp = this.config;
      keys.forEach((item, index) => {
        if (index === keys.length - 1) {
          temp[item] = arg2;
        } else {
          if (!isObject(temp[item])) {
            temp[item] = {};
          }
          temp = temp[item];
        }
      });
    } else {
      // 替换整个配置信息
      if (!isObject(arg1)) {
        throw new Error('Invalid parameter');
      }
      this.config = arg1;
    }
  }
}
