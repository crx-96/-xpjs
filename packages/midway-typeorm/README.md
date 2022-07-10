# `midway-typeorm`

## 使用

1. 引入组件

```ts
// configuration.ts
import { Configuration } from '@midwayjs/decorator';
import * as typeorm from '@xpjs/midway-typeorm';

@Configuration({
  imports: [typeorm],
})
export class ContainerLifeCycle {
  async onReady() {}
}
```

2. 配置

```ts
// config.default.ts
export default {
  typeorm: {
    default: {
      type: 'mysql',
      host: 'xxx',
      port: 3306,
      database: 'xxx',
      username: 'xxx',
      password: 'xxx',
      logging: true,
      dateStrings: true,
      synchronize: false,
      logger: 'advanced-console',
      entities: ['../entity/*{.js,.ts}'],
    },
  },
};

// 默认default，多数据源可配置多个
```

3. 定义表模型

```ts
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from '@xpjs/midway-typeorm';

export class XXXEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    comment: '主键',
  })
  id: number;

  @Column({
    type: 'int',
    unsigned: true,
    default: () => 0,
    comment: '创建人id',
  })
  create_user_id: number;

  @CreateDateColumn({
    type: 'timestamp',
    comment: '创建时间',
  })
  create_time: string;

  @Column({
    type: 'int',
    unsigned: true,
    default: () => 0,
    comment: '修改人id',
  })
  update_user_id: number;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: '修改时间',
  })
  update_time: string;
}
```

4. 服务中使用

```ts
import { Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { getConnection } from '@xpjs/midway-typeorm';

@Provide()
@Scope(ScopeEnum.Singleton)
export class XXXService {
  async test(): Promise<string> {
    console.log(await getConnection().getRepository(XXXEntity).findAndCount());
    return 'hello world';
  }
}

// 该组件使用的typeorm版本为0.3.x，有很多的装饰器方法都已弃用，getConnection方法是用0.3版本封装的
```

该组件基于 typeorm，更多用法请参考[typeorm](https://typeorm.io/)
