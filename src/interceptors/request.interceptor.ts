import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

interface RequestLog {
  timestamp: string;
  method: string;
  path: string;
  query: any;
  body: any;
  ip: string;
  userAgent: string;
  duration?: number;
}

export const requestInterceptor = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const requestLog: RequestLog = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.originalUrl,
    query: req.query || {},
    body: req.body || {},
    ip: req.ip || req.socket.remoteAddress || 'unknown',
    userAgent: req.get('user-agent') || 'unknown'
  };

  // Log request
  logger.http('Incoming Request', {
    timestamp: requestLog.timestamp,
    method: requestLog.method,
    path: requestLog.path,
    ip: requestLog.ip,
    userAgent: requestLog.userAgent,
    query: Object.keys(requestLog.query).length > 0 ? requestLog.query : undefined,
    body: Object.keys(requestLog.body).length > 0 ? requestLog.body : undefined
  });

  // Capture response
  const originalSend = res.send;
  res.send = function (body: any): Response {
    const duration = Date.now() - startTime;
    requestLog.duration = duration;

    // Log response
    logger.http('Response', {
      status: res.statusCode,
      duration: `${duration}ms`,
      body: body
    });

    return originalSend.call(this, body);
  };

  next();
}; 