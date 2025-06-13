import { Response, NextFunction } from 'express';
import { AppError } from '../utils/customErrors';
import { ErrorCode } from '../types/error';
import { Prisma } from '../../generated/prisma';
import logger from '../utils/logger';
import { CustomRequest } from '../types/customRequest';
import { ErrorResponse } from '../types/error';
import { JsonWebTokenError } from 'jsonwebtoken';

export const errorHandler = (
    error: AppError | Prisma.PrismaClientKnownRequestError | JsonWebTokenError,
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    let errorResponse: ErrorResponse;

    // Handle our custom AppError instances
    if (error instanceof AppError) {
        errorResponse = {
            success: false,
            status_code: error.status_code,
            error_code: error.error_code,
            message: error.message,
            metadata: error?.metadata
        };

        // Detailed error logging
        logger.error('Application error', {
            status_code: error.status_code,
            error_code: error.error_code,
            message: error.message,
            metadata: error?.metadata,
        });
    }

    // Handle Prisma Errors
    else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        errorResponse = handlePrismaError(error);

        // Log Prisma error with context
        logger.error('Database error', {
            prisma_code: error.code,
            status_code: errorResponse.status_code,
            error_code: errorResponse.error_code,
            message: errorResponse.message,
            metadata: error.meta
        });
    }

    //handle Jwt errors
    else if (error instanceof JsonWebTokenError) {
        let message = "";
        if(error.name === "TokenExpiredError"){
            message = "Token has expired. Please log in again."
        }else if (error.name === "JsonWebTokenError"){
            message = "Invalid token. Unauthorized."
        }

        errorResponse = {
            success: false,
            error_code: 40001,
            status_code: 401,
            message: message
        }
    }

    // Default error response for unhandled errors
    else {
        errorResponse = {
            success: false,
            status_code: 500,
            error_code: 50001,
            message: 'Internal server error',
        };

        logger.error('Internal Server Error', {
            error: errorResponse.message,
            stack: (error as Error)?.stack ?? 'No stack trace available'
        });
    }

    // Don't send error details in production
    if (process.env.NODE_ENV === 'production') {
        delete errorResponse.metadata;
        if (errorResponse.status_code === 500) {
            errorResponse.message = 'Internal server error';
        }
    }

    return res.status(errorResponse.status_code).json(errorResponse) as any;
};

// Helper function to handle Prisma errors with logging
function handlePrismaError(error: Prisma.PrismaClientKnownRequestError): ErrorResponse {
    let errorResponse: ErrorResponse;

    switch (error.code) {
        case 'P2000':
            errorResponse = {
                success: false,
                status_code: 400,
                error_code: ErrorCode.VALIDATION_ERROR,
                message: 'Value too long for column',
                metadata: { column: error.meta?.column_name }
            };
            break;

        case 'P2001':
            errorResponse = {
                success: false,
                status_code: 404,
                error_code: ErrorCode.RECORD_NOT_FOUND,
                message: 'Record not found',
                metadata: error.meta
            };
            break;

        case 'P2002':
            errorResponse = {
                success: false,
                status_code: 409,
                error_code: ErrorCode.UNIQUE_CONSTRAINT_CONFLICT,
                message: 'Resource already exists',
                metadata: { fields: error.meta?.target }
            };
            break;

        case 'P2003':
            errorResponse = {
                success: false,
                status_code: 400,
                error_code: ErrorCode.FOREIGN_KEY_CONSTRAINT,
                message: 'Invalid relationship reference',
                metadata: { field: error.meta?.field_name }
            };
            break;

        case 'P2004':
            errorResponse = {
                success: false,
                status_code: 400,
                error_code: ErrorCode.VALIDATION_ERROR,
                message: 'Database constraint failed',
                metadata: { details: error.meta?.database_error }
            };
            break;

        case 'P2005':
            errorResponse = {
                success: false,
                status_code: 400,
                error_code: ErrorCode.VALIDATION_ERROR,
                message: 'Invalid field value',
                metadata: {
                    field: error.meta?.field_name,
                    value: error.meta?.field_value
                }
            };
            break;

        case 'P2006':
            errorResponse = {
                success: false,
                status_code: 400,
                error_code: ErrorCode.VALIDATION_ERROR,
                message: 'Invalid field value provided',
                metadata: error.meta
            };
            break;

        case 'P2007':
            errorResponse = {
                success: false,
                status_code: 400,
                error_code: ErrorCode.VALIDATION_ERROR,
                message: 'Data validation error',
                metadata: { details: error.meta?.database_error }
            };
            break;

        case 'P2008':
            errorResponse = {
                success: false,
                status_code: 400,
                error_code: ErrorCode.QUERY_ERROR,
                message: 'Query parsing failed',
                metadata: error.meta
            };
            break;

        case 'P2009':
            errorResponse = {
                success: false,
                status_code: 400,
                error_code: ErrorCode.QUERY_ERROR,
                message: 'Query validation failed',
                metadata: error.meta
            };
            break;

        case 'P2010':
            errorResponse = {
                success: false,
                status_code: 500,
                error_code: ErrorCode.DATABASE_ERROR,
                message: 'Raw query failed',
                metadata: {
                    code: error.meta?.code,
                    details: error.meta?.message
                }
            };
            break;

        case 'P2011':
            errorResponse = {
                success: false,
                status_code: 400,
                error_code: ErrorCode.NULL_CONSTRAINT_VIOLATION,
                message: 'Null constraint violation',
                metadata: { constraint: error.meta?.constraint }
            };
            break;

        case 'P2012':
            errorResponse = {
                success: false,
                status_code: 400,
                error_code: ErrorCode.VALIDATION_ERROR,
                message: 'Missing required value',
                metadata: { path: error.meta?.path }
            };
            break;

        case 'P2013':
            errorResponse = {
                success: false,
                status_code: 400,
                error_code: ErrorCode.VALIDATION_ERROR,
                message: 'Missing required argument',
                metadata: error.meta
            };
            break;

        case 'P2014':
            errorResponse = {
                success: false,
                status_code: 400,
                error_code: ErrorCode.RELATIONSHIP_ERROR,
                message: 'Required relation not satisfied',
                metadata: { details: error.meta }
            };
            break;

        case 'P2015':
            errorResponse = {
                success: false,
                status_code: 404,
                error_code: ErrorCode.RECORD_NOT_FOUND,
                message: 'Related record not found',
                metadata: { details: error.meta }
            };
            break;

        case 'P2016':
            errorResponse = {
                success: false,
                status_code: 400,
                error_code: ErrorCode.QUERY_ERROR,
                message: 'Query interpretation error',
                metadata: { details: error.meta }
            };
            break;

        case 'P2017':
            errorResponse = {
                success: false,
                status_code: 400,
                error_code: ErrorCode.RELATIONSHIP_ERROR,
                message: 'Records not connected',
                metadata: error.meta
            };
            break;

        case 'P2018':
            errorResponse = {
                success: false,
                status_code: 404,
                error_code: ErrorCode.RECORD_NOT_FOUND,
                message: 'Required connected records not found',
                metadata: { details: error.meta }
            };
            break;

        case 'P2019':
            errorResponse = {
                success: false,
                status_code: 400,
                error_code: ErrorCode.VALIDATION_ERROR,
                message: 'Input error',
                metadata: { details: error.meta }
            };
            break;

        case 'P2020':
            errorResponse = {
                success: false,
                status_code: 400,
                error_code: ErrorCode.VALIDATION_ERROR,
                message: 'Value out of range',
                metadata: { details: error.meta }
            };
            break;

        case 'P2021':
            errorResponse = {
                success: false,
                status_code: 404,
                error_code: ErrorCode.DATABASE_ERROR,
                message: 'Table does not exist',
                metadata: { table: error.meta?.table }
            };
            break;

        case 'P2022':
            errorResponse = {
                success: false,
                status_code: 404,
                error_code: ErrorCode.DATABASE_ERROR,
                message: 'Column does not exist',
                metadata: { column: error.meta?.column }
            };
            break;

        case 'P2023':
            errorResponse = {
                success: false,
                status_code: 500,
                error_code: ErrorCode.DATABASE_ERROR,
                message: 'Inconsistent column data',
                metadata: { details: error.meta?.message }
            };
            break;

        case 'P2024':
            errorResponse = {
                success: false,
                status_code: 503,
                error_code: ErrorCode.TIMEOUT_ERROR,
                message: 'Connection pool timeout',
                metadata: {
                    timeout: error.meta?.timeout,
                    limit: error.meta?.connection_limit
                }
            };
            break;

        case 'P2025':
            errorResponse = {
                success: false,
                status_code: 404,
                error_code: ErrorCode.RECORD_NOT_FOUND,
                message: 'Resource not found',
                metadata: { details: error.meta }
            };
            break;

        case 'P2026':
            errorResponse = {
                success: false,
                status_code: 501,
                error_code: ErrorCode.DATABASE_ERROR,
                message: 'Feature not supported',
                metadata: { feature: error.meta?.feature }
            };
            break;

        case 'P2027':
            errorResponse = {
                success: false,
                status_code: 500,
                error_code: ErrorCode.DATABASE_ERROR,
                message: 'Multiple database errors',
                metadata: { errors: error.meta?.errors }
            };
            break;

        case 'P2028':
            errorResponse = {
                success: false,
                status_code: 500,
                error_code: ErrorCode.TRANSACTION_ERROR,
                message: 'Transaction API error',
                metadata: { details: error.meta?.error }
            };
            break;

        case 'P2029':
            errorResponse = {
                success: false,
                status_code: 400,
                error_code: ErrorCode.QUERY_ERROR,
                message: 'Query parameter limit exceeded',
                metadata: { details: error.meta?.message }
            };
            break;

        case 'P2030':
            errorResponse = {
                success: false,
                status_code: 400,
                error_code: ErrorCode.QUERY_ERROR,
                message: 'Fulltext index not found',
                metadata: {}
            };
            break;

        case 'P2031':
            errorResponse = {
                success: false,
                status_code: 500,
                error_code: ErrorCode.DATABASE_ERROR,
                message: 'MongoDB replica set required',
                metadata: {}
            };
            break;

        case 'P2033':
            errorResponse = {
                success: false,
                status_code: 400,
                error_code: ErrorCode.VALIDATION_ERROR,
                message: 'Number too large for 64-bit integer',
                metadata: {}
            };
            break;

        case 'P2034':
            errorResponse = {
                success: false,
                status_code: 409,
                error_code: ErrorCode.TRANSACTION_ERROR,
                message: 'Transaction conflict or deadlock',
                metadata: {}
            };
            break;

        case 'P2035':
            errorResponse = {
                success: false,
                status_code: 500,
                error_code: ErrorCode.DATABASE_ERROR,
                message: 'Database assertion violation',
                metadata: { details: error.meta?.database_error }
            };
            break;

        case 'P2036':
            errorResponse = {
                success: false,
                status_code: 500,
                error_code: ErrorCode.DATABASE_ERROR,
                message: 'External connector error',
                metadata: { connector_id: error.meta?.id }
            };
            break;

        case 'P2037':
            errorResponse = {
                success: false,
                status_code: 503,
                error_code: ErrorCode.CONNECTION_ERROR,
                message: 'Too many database connections',
                metadata: { details: error.meta?.message }
            };
            break;

        default:
            errorResponse = {
                success: false,
                status_code: 500,
                error_code: ErrorCode.DATABASE_ERROR,
                message: 'Database error',
                metadata: {
                    code: error.code,
                    meta: error.meta
                }
            };
    }

    return errorResponse;
}