import winston from 'winston';
import 'winston-daily-rotate-file';
import { TransformableInfo } from 'logform';
import DatadogWinston, { DatadogTransportOptions } from 'datadog-winston'

interface ExtendedTransformableInfo extends TransformableInfo {
    query?: string;
    params?: any;
    duration?: number;
    model?: string;
    action?: string;
    target?: string;
    dd?: {
        service?: string;
        env?: string;
        version?: string;
        trace_id?: string;
    };
}

// Custom format for Datadog metadata
const datadogFormat = winston.format((info: ExtendedTransformableInfo) => {
    info.dd = {
        service: process.env.DD_SERVICE,
        env: process.env.DD_ENV,
        version: process.env.DD_VERSION,
    };
    return info;
});

// Create custom levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
    query: 5,
};

// Initialize transports array
const transports: winston.transport[] = [];

// Add production-only transports
if (process.env.NODE_ENV === 'production') {
    // File transport for queries
    transports.push(
        new winston.transports.DailyRotateFile({
            filename: 'logs/query-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'query',
            maxFiles: '14d',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    );

    // File transport for errors
    transports.push(
        new winston.transports.DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxFiles: '30d',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    );

    // File transport for combined logs
    transports.push(
        new winston.transports.DailyRotateFile({
            filename: 'logs/combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '30d',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    );

    // Datadog transport
    transports.push(
        new DatadogWinston({
            apiKey: process.env.DD_API_KEY,
            hostname: "demi.cosmium.ai",
            service: 'backend-service',
            ddsource: 'nodejs',
            ddtags: `env:${process.env.NODE_ENV}`
        } as DatadogTransportOptions)
    );
}

// Always add console transport for development
transports.push(
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    })
);

// Create the logger
const logger = winston.createLogger({
    levels,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        datadogFormat(),
        winston.format.json()
    ),
    transports
});

export default logger;