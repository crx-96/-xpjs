import Redis from 'ioredis';
import { RedisBaseInterface } from './interface';

export class RedisService implements RedisBaseInterface {
  constructor() {
    console.log(666);
  }
  get(): string {
    throw new Error('Method not implemented.');
  }
}
