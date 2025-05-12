import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export interface ErrorResponse {
  status: number;
  message: string;
  errors?: any[];
  timestamp: string;
  path: string;
}

export class AppError extends Error {
  status: number;
  errors?: any[];

  constructor(message: string, status: number = 500, errors?: any[]) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorInterceptor = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorResponse: ErrorResponse = {
    status: err instanceof AppError ? err.status : 500,
    message: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  };

  // Add validation errors if they exist
  if (err instanceof AppError && err.errors) {
    errorResponse.errors = err.errors;
  }

  // Log error
  logger.error('Error occurred', {
    ...errorResponse,
    stack: err.stack,
    method: req.method,
    ip: req.ip || req.socket.remoteAddress,
    userAgent: req.get('user-agent')
  });

  // Send error response
  res.status(errorResponse.status).json(errorResponse);
};

// Common error types
export const ErrorTypes = {
  NOT_FOUND: (message: string = 'Resource not found') => 
    new AppError(message, 404),
  
  BAD_REQUEST: (message: string = 'Bad request', errors?: any[]) => 
    new AppError(message, 400, errors),
  
  UNAUTHORIZED: (message: string = 'Unauthorized access') => 
    new AppError(message, 401),
  
  FORBIDDEN: (message: string = 'Forbidden access') => 
    new AppError(message, 403),
  
  CONFLICT: (message: string = 'Resource conflict') => 
    new AppError(message, 409),
  
  INTERNAL_SERVER: (message: string = 'Internal server error') => 
    new AppError(message, 500),
}; 