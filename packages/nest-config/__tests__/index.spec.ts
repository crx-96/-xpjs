import { ConfigModule } from '../lib/config.module';
import { Test } from '@nestjs/testing';
import { ConfigService } from '../lib/config.service';
import { resolve } from 'path';

describe('测试配置模块', () => {
  let service: ConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        // ConfigModule.registerAsync(() => {
        //   return new Promise((resolve) => {
        //     resolve({ a: 1, b: 2 });
        //   });
        // }),
        ConfigModule.register({ path: resolve(__dirname, './config.js') }),
      ],
    }).compile();

    service = moduleRef.get(ConfigService);
  });

  it('测试服务', () => {
    expect(service.get('server.port')).toBe(3000);
  });
});
