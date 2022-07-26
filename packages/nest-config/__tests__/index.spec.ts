import { ConfigModule } from '../lib/config.module';
import { Test } from '@nestjs/testing';
import { ConfigService } from '../lib/config.service';
import { resolve } from 'path';

describe('测试配置模块', () => {
  let service: ConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        // 测试服务1
        // ConfigModule.register({ path: resolve(__dirname, './config.js') }),
        // 测试服务2
        // ConfigModule.registerAsync(() => {
        //   return { test: 123 };
        // }),
        // 测试服务3
        // ConfigModule.registerAsync(() => {
        //   return new Promise((resolve) => {
        //     setTimeout(() => {
        //       resolve({ test3: 'aaa' });
        //     }, 1000);
        //   });
        // }),
        // 测试服务4
        ConfigModule.registerAsync({
          providers: [{ provide: 'xxx', useValue: { test4: 'bbb' } }],
          useFactory: (config) => {
            return config;
          },
          inject: ['xxx'],
        }),
      ],
    }).compile();

    service = moduleRef.get(ConfigService);
  });

  it('测试服务1', () => {
    expect(service.get('server.port')).toBe(3000);
  });

  it('测试服务2', () => {
    expect(service.get('test')).toBe(123);
  });

  it('测试服务3', () => {
    expect(service.get('test3')).toBe('aaa');
  });

  it('测试服务4', () => {
    expect(service.get('test4')).toBe('bbb');
  });
});
