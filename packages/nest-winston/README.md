# `nest-log4`

## 用法

#### 1、引入日志模块

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { LogModule } from '@xpjs/nest-log4';

@Module({
  imports: [
    // 日志模块
    LogModule.register({
      appenders: { console: { type: 'stdout' } },
      categories: {
        default: { appenders: ['console'], level: 'info' },
      },
    }),
  ],
})
export class AppModule {}
```

日志的具体配置可查看[log4js](https://log4js-node.github.io/log4js-node/)

#### 2、在服务中使用

```ts
// service.ts
import { LogService } from '@xpjs/nest-log4';
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class LogTestService {
  @Inject()
  private readonly logger: LogService;
}
```
