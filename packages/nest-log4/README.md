# `nest-config`

## 用法

#### 1、配置文件

```ts
// config/config.default.ts
export default {
  server: {
    port: 3000,
  },
};

// config/config.local.ts
export default {
  server: {
    port: 39000,
  },
};
```

#### 2、引入配置模块

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@xpjs/nest-config';
import { resolve } from 'path';

@Module({
  imports: [
    // 配置模块
    ConfigModule.register({ folder: resolve(__dirname, './config'), path: 'xxxxx.js' }),
  ],
})
export class AppModule {}
```

#### 3、读取文件说明

```ts
1、读取项目config目录下的文件
2、读取选项folder目录下的文件
3、读取选项path的文件
4、目录下默认加载config.default.ts，正式环境下加载config.prod.ts和config.production.ts，其他根据NODE_ENV读取配置，比如NODE_ENV为local，则读取config.local.ts
```

#### 4、异步加载配置模块

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@xpjs/nest-config';
import { resolve } from 'path';

@Module({
  imports: [
    // 配置模块
    ConfigModule.registerAsync(() => {
      return new Promise((resolve) => {
        resolve({
          server: {
            port: 3000,
          },
        });
      });
    }),
  ],
})
export class AppModule {}
```

#### 5、在 main 中使用

```ts
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ConfigService } from '@xpjs/nest-config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // 获取配置服务
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('server.port'));
}
bootstrap();

/**
 * 在其他服务中使用与普通的服务类一致，在constructor中注入或者使用@Inject注入
 */
```
