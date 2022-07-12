# `midway-validate`

######函数式编程请使用其他的包

## 使用

1. 引入组件

```ts
// configuration.ts
import { Configuration } from '@midwayjs/decorator';
import * as validate from '@xpjs/midway-validate';

@Configuration({
  imports: [validate],
})
export class ContainerLifeCycle {
  async onReady() {}
}
```

2. 定义模型

```ts
// pojo/test.ts
import {
  Expose,
  IsNotEmpty,
  Length,
  Matches,
  Type,
} from '@xpjs/midway-validate';

class TestDTO {
  @Matches(new RegExp('xxx'), {
    message: '账号必须为手机号码或者邮箱',
  })
  @IsNotEmpty({ message: 'xxx不能为空' })
  @Type(() => String)
  @Expose()
  test1: string;

  @IsNotEmpty({ message: 'xxx不能为空' })
  @Type(() => String)
  @Expose()
  test2: string;

  @Length(4, 4, { message: 'xxx有误' })
  @IsNotEmpty({ message: 'xxx不能为空' })
  @Type(() => String)
  @Expose()
  test3: string;
}
```

3. 控制器中使用

```ts
// controller/xxx.ts
import { Controller, Post, Body } from '@midwayjs/decorator';
import { TestDTO } from 'pojo/model/test';
import { Validate } from '@xpjs/midway-validate';

@Controller('/xxx/xxx')
export class XXXController {
  @Post('/xxxx')
  @Validate({ type: TestDTO }) // 加上此装饰器验证，model如果定义了类型可不用传type参数，类型需要是类对象
  async test(@Body() model: TestDTO): Promise<string> {
    console.log(model);
    return 'hello world!';
  }
}

// 验证失败之后会触发BadRequestError异常
```

具体用法参考[class-validator](https://www.npmjs.com/package/class-validator)与[class-transformer](https://www.npmjs.com/package/class-transformer)
