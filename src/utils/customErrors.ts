import { ErrorCode } from "../types/error";

function getHttpStatusFromErrorCode(errorCode: ErrorCode): number {
    const statusCode = Math.floor(errorCode / 100);
    return statusCode;
}

export class AppError extends Error {
    public readonly status_code: number;
    public readonly error_code: ErrorCode;
    public readonly metadata?: any;

    constructor(
        message: string,
        error_code: ErrorCode,
        metadata?: any
    ) {
        super(message);
        this.error_code = error_code;
        this.status_code = getHttpStatusFromErrorCode(error_code);
        this.metadata = metadata;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

//Business Error
export class BadRequestError extends AppError {
    constructor(message: string, error_code: ErrorCode = ErrorCode.VALIDATION_FAILED, metadata?: any) {
        super(message, error_code, metadata);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string, error_code: ErrorCode = ErrorCode.SESSION_EXPIRED, metadata?: any) {
        super(message, error_code, metadata);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string, error_code: ErrorCode = ErrorCode.INSUFFICIENT_PERMISSIONS, metadata?: any) {
        super(message, error_code, metadata);
    }
}