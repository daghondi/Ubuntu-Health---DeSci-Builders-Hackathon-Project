import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export const errorHandler = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error details
  console.error('API Error:', {
    message: error.message,
    stack: error.stack,
    statusCode: error.statusCode,
    code: error.code,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  });

  // Set default error values
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  const code = error.code || 'INTERNAL_ERROR';

  // Prepare error response
  const errorResponse: any = {
    error: {
      message,
      code,
      statusCode,
      timestamp: new Date().toISOString(),
    },
  };

  // Add additional details in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = error.stack;
    errorResponse.error.details = error.details;
  }

  // Add request context
  errorResponse.error.path = req.path;
  errorResponse.error.method = req.method;

  // Handle specific error types
  switch (error.name) {
    case 'ValidationError':
      errorResponse.error.statusCode = 400;
      errorResponse.error.code = 'VALIDATION_ERROR';
      break;
    
    case 'UnauthorizedError':
      errorResponse.error.statusCode = 401;
      errorResponse.error.code = 'UNAUTHORIZED';
      break;
    
    case 'ForbiddenError':
      errorResponse.error.statusCode = 403;
      errorResponse.error.code = 'FORBIDDEN';
      break;
    
    case 'NotFoundError':
      errorResponse.error.statusCode = 404;
      errorResponse.error.code = 'NOT_FOUND';
      break;
    
    case 'ConflictError':
      errorResponse.error.statusCode = 409;
      errorResponse.error.code = 'CONFLICT';
      break;
    
    case 'RateLimitError':
      errorResponse.error.statusCode = 429;
      errorResponse.error.code = 'RATE_LIMIT_EXCEEDED';
      break;
    
    default:
      // Keep the original status code for unknown errors
      break;
  }

  // Handle Prisma errors
  if (error.code?.startsWith('P')) {
    switch (error.code) {
      case 'P2002':
        errorResponse.error.statusCode = 409;
        errorResponse.error.code = 'UNIQUE_CONSTRAINT_VIOLATION';
        errorResponse.error.message = 'A record with this information already exists';
        break;
      
      case 'P2025':
        errorResponse.error.statusCode = 404;
        errorResponse.error.code = 'RECORD_NOT_FOUND';
        errorResponse.error.message = 'The requested record was not found';
        break;
      
      default:
        errorResponse.error.statusCode = 500;
        errorResponse.error.code = 'DATABASE_ERROR';
        errorResponse.error.message = 'A database error occurred';
        break;
    }
  }

  // Handle Solana/Web3 errors
  if (error.message?.includes('Transaction failed') || error.message?.includes('Solana')) {
    errorResponse.error.statusCode = 503;
    errorResponse.error.code = 'BLOCKCHAIN_ERROR';
    errorResponse.error.message = 'Blockchain transaction failed';
  }

  // Send error response
  res.status(errorResponse.error.statusCode).json(errorResponse);
};

// Error factory functions
export const createError = (message: string, statusCode = 500, code?: string): ApiError => {
  const error = new Error(message) as ApiError;
  error.statusCode = statusCode;
  error.code = code;
  return error;
};

export const createValidationError = (message: string, details?: any): ApiError => {
  const error = createError(message, 400, 'VALIDATION_ERROR');
  error.details = details;
  return error;
};

export const createUnauthorizedError = (message = 'Unauthorized access'): ApiError => {
  return createError(message, 401, 'UNAUTHORIZED');
};

export const createForbiddenError = (message = 'Forbidden access'): ApiError => {
  return createError(message, 403, 'FORBIDDEN');
};

export const createNotFoundError = (message = 'Resource not found'): ApiError => {
  return createError(message, 404, 'NOT_FOUND');
};

export const createConflictError = (message: string): ApiError => {
  return createError(message, 409, 'CONFLICT');
};