import { Format, LoggerOptions } from './interface';
import {
    DynamicModule,
    ForwardReference,
    InjectionToken,
    OptionalFactoryDependency,
    Provider,
    Scope,
    Type,
} from '@nestjs/common';
import winston, { createLogger, transports, format } from 'winston';
import 'winston-daily-rotate-file';

export class Logger {
    protected readonly logger: winston.Logger;

    public constructor(options?: Partial<LoggerOptions>) {
        const config: winston.LoggerOptions = {
            level: options?.level || 'info',
            transports: [],
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                format.colorize(),
                format.printf((i) => `[${i.timestamp}][${i.level}]:${i.message}`),
            ),
        };
        if (options?.levels) {
            config.levels = options.levels;
        }
        config.format = format.combine(...this.getFormat(options?.format));
        // 设置默认通道
        if (!options?.transports || options.transports.length === 0) {
            config.transports = [new transports.Console()];
        } else {
            // 设置传输通道
            config.transports = options.transports.map((i): any => {
                const { type, format: mFormat, daily, ...other } = i;
                if (type === 'console') {
                    return new transports.Console({
                        ...other,
                        format: mFormat?.printf ? format.combine(...this.getFormat(mFormat)) : undefined,
                    });
                } else if (type === 'file') {
                    if (daily) {
                        return new transports.DailyRotateFile({
                            ...other,
                            format: mFormat?.printf ? format.combine(...this.getFormat(mFormat)) : undefined,
                        });
                    } else {
                        return new transports.File({
                            ...other,
                            format: mFormat?.printf ? format.combine(...this.getFormat(mFormat)) : undefined,
                        } as any);
                    }
                }
            });
        }
        this.logger = createLogger(config);
    }

    // 获取格式化配置
    private getFormat(ff?: Format): winston.Logform.Format[] {
        const combineFormats: winston.Logform.Format[] = [];
        if (ff?.printf) {
            combineFormats.push(format.printf(ff.printf));
            if (ff?.align) {
                combineFormats.unshift(format.align());
            }
            if (ff?.timeFormat) {
                combineFormats.unshift(format.timestamp({ format: ff.timeFormat }));
            }
            if (ff?.colorize) {
                combineFormats.unshift(format.colorize(ff.colorize));
            }
        } else {
            combineFormats.push(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                format.printf(({ timestamp, message }) => `[==========${timestamp}==========]：\n${message}`),
            );
        }
        return combineFormats;
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

    public log(level: string, message: string): this;
    public log(level: string, message: string, meta: any): this;
    public log(level: string, message: string, ...meta: any[]): this;
    public log(level: string, message: any): this;
    public log(entry: winston.LogEntry): this;
    public log(level: any, message?: any, ...args: any[]): this {
        this.logger.log(level, message, ...args);
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
