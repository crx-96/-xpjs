# `nest-redis`

## 用法

#### 1、引入日志模块

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { RedisModule } from '@xpjs/nest-redis';

@Module({
  imports: [
    // redis模块
    RedisModule.register({ host: '127.0.0.1', port: 6379, password: '123456', db: 0 }),
  ],
})
export class AppModule {}
```

日志的具体配置可查看[log4js](https://log4js-node.github.io/log4js-node/)

#### 2、在服务中使用

```ts
// service.ts
import { RedisService } from '@xpjs/nest-redis';
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class LogTestService {
  @Inject()
  private readonly logger: RedisService;
}
```
