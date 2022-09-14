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
    daily?: boolean;
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
    daily?: boolean;
    level?: string;
    silent?: boolean;
    handleExceptions?: boolean;
    handleRejections?: boolean;
    log?(info: any, next: () => void): any;
    logv?(info: any, next: () => void): any;
    close?(): void;
    filename?: string;
    dirname?: string;
    options?: object;
    maxsize?: number;
    zippedArchive?: boolean;
    maxFiles?: number | string;
    eol?: string;
    tailable?: boolean;
    json?: boolean;
    datePattern?: string;
    maxSize?: string | number;
    auditFile?: string;
    frequency?: string;
    utc?: boolean;
    extension?: string;
    createSymlink?: boolean;
    symlinkName?: string;
    watchLog?: boolean;
    auditHashType?: string;
}

export type LoggerLevel = 'debug' | 'info' | 'warn' | 'warning' | 'error';

export interface LoggerOptions {
    name: string;
    logger: ClassConstructor<Logger>;
    level: LoggerLevel;
    levels: { [key: string]: number };
    transports: (ConsoleOptions | FileOptions)[];
    format: Format;
}

type ClassConstructor<T> = {
    new (...args: any[]): T;
};
