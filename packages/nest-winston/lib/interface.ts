import { Logger } from './logger';

export interface Format {
    align?: boolean;
    timeFormat?: string;
    printf?: (i: any) => string;
    colorize?: {
        level?: boolean;
        all?: boolean;
        message?: boolean;
        colors?: {
            debug: string;
            info: string;
            warn: string;
            warning: string;
            error: string;
            [key: string]: string;
        };
    };
}

export interface ConsoleOptions {
    type: 'console';
    consoleWarnLevels?: string[];
    stderrLevels?: string[];
    debugStdout?: boolean;
    eol?: string;
    format?: Format;
    level?: string;
    silent?: boolean;
    handleExceptions?: boolean;
    handleRejections?: boolean;
    log?(info: any, next: () => void): any;
    logv?(info: any, next: () => void): any;
    close?(): void;
}

export interface FileOptions {
    type: 'file';
    format?: Format;
}

export type LoggerLevel = 'debug' | 'info' | 'warn' | 'warning' | 'error';

export interface LoggerOptions {
    name: string;
    logger: ClassConstructor<Logger>;
    level: LoggerLevel;
    transports: (ConsoleOptions | FileOptions)[];
    format: Format;
}

type ClassConstructor<T> = {
    new (...args: any[]): T;
};
