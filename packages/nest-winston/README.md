# `nest-winston`

## 用法

#### 1、引入日志模块

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { Logger } from '@xpjs/nest-winston';

@Module({
    imports: [
        // 日志模块
        Logger.register(),
    ],
})
export class AppModule {}
```

#### 2、在服务中使用

```ts
// service.ts
import { Logger } from '@xpjs/nest-winston';
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class LogTestService {
    @Inject()
    private readonly logger: Logger;
}
```
