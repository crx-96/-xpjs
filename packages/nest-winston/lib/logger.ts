import { LoggerOptions } from './interface';
import {
    DynamicModule,
    ForwardReference,
    InjectionToken,
    OptionalFactoryDependency,
    Provider,
    Scope,
    Type,
} from '@nestjs/common';
import winston, { createLogger, transports } from 'winston';

export class Logger {
    protected readonly logger: winston.Logger;

    public constructor(options?: Partial<LoggerOptions>) {
        this.logger = createLogger({
            transports: [new transports.Console()],
        });
    }

    public info(message: string): this;
    public info(message: string, meta: any): this;
    public info(message: string, ...meta: any[]): this;
    public info(message: any): this;
    public info(infoObject: object): this;
    public info(message: any, ...args: any[]): this {
        this.logger.info(message, ...args);
        return this;
    }

    public debug(message: string): this;
    public debug(message: string, meta: any): this;
    public debug(message: string, ...meta: any[]): this;
    public debug(message: any): this;
    public debug(infoObject: object): this;
    public debug(message: any, ...args: any[]): this {
        this.logger.debug(message, ...args);
        return this;
    }

    public error(message: string): this;
    public error(message: string, meta: any): this;
    public error(message: string, ...meta: any[]): this;
    public error(message: any): this;
    public error(infoObject: object): this;
    public error(message: any, ...args: any[]): this {
        this.logger.error(message, ...args);
        return this;
    }

    public warn(message: string): this;
    public warn(message: string, meta: any): this;
    public warn(message: string, ...meta: any[]): this;
    public warn(message: any): this;
    public warn(infoObject: object): this;
    public warn(message: any, ...args: any[]): this {
        this.logger.warn(message, ...args);
        return this;
    }

    public warning(message: string): this;
    public warning(message: string, meta: any): this;
    public warning(message: string, ...meta: any[]): this;
    public warning(message: any): this;
    public warning(infoObject: object): this;
    public warning(message: any, ...args: any[]): this {
        this.logger.warning(message, ...args);
        return this;
    }

    public static register(options?: Partial<LoggerOptions>): DynamicModule {
        return {
            module: Logger,
            global: true,
            providers: [
                {
                    provide: options?.name && options?.name !== 'default' ? options?.name : Logger,
                    useValue: options?.logger ? new options.logger(options) : new Logger(options),
                },
            ],
            exports: [options?.name && options?.name !== 'default' ? options?.name : Logger],
        };
    }

    public static registerAsync(
        options?: {
            inject?: Array<InjectionToken | OptionalFactoryDependency>;
            useFactory: (...args: any[]) => Partial<LoggerOptions> | Promise<Partial<LoggerOptions>>;
            providers?: Provider<any>[];
            imports?: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>;
        },
        name?: InjectionToken,
    ): DynamicModule {
        return {
            module: Logger,
            global: true,
            exports: [name && name !== 'default' ? name : Logger],
            imports: [...(options?.imports || [])],
            providers: [
                ...(options?.providers || []),
                {
                    provide: name && name !== 'default' ? name : Logger,
                    useFactory: async (...args: any[]) => {
                        if (options?.useFactory) {
                            const config = await options.useFactory(...args);
                            if (config.logger) {
                                return new config.logger(config);
                            }
                            return new Logger(config);
                        }
                        return new Logger();
                    },
                    inject: [...(options?.inject || [])],
                    scope: Scope.DEFAULT,
                },
            ],
        };
    }
}
