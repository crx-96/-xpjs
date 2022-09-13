import { Logger } from './logger';

export interface LoggerOptions {
    name: string;
    logger: ClassConstructor<Logger>;
}

type ClassConstructor<T> = {
    new (...args: any[]): T;
};
