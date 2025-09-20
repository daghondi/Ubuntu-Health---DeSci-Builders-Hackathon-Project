import { Request, Response, NextFunction } from 'express';
import winston from 'winston';

// Configure Winston logger
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

export const winstonLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'ubuntu-health-api' },
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    
    // Write error logs to file
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    
    // Write all logs to file
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
});

// HTTP Request logging middleware
export const logger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  
  // Log incoming request
  winstonLogger.info('Incoming Request', {
    method: req.method,
    url: req.url,
    path: req.path,
    query: req.query,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    contentType: req.get('Content-Type'),
    contentLength: req.get('Content-Length'),
    timestamp: new Date().toISOString(),
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any, cb?: any) {
    const responseTime = Date.now() - startTime;
    
    // Log response
    winstonLogger.info('Response Sent', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      contentType: res.get('Content-Type'),
      contentLength: res.get('Content-Length'),
      timestamp: new Date().toISOString(),
    });

    // Log slow requests
    if (responseTime > 1000) {
      winstonLogger.warn('Slow Request Detected', {
        method: req.method,
        url: req.url,
        responseTime: `${responseTime}ms`,
        threshold: '1000ms',
      });
    }

    // Call original end function
    originalEnd.call(this, chunk, encoding, cb);
  };

  next();
};

// Database query logger
export const logDatabaseQuery = (query: string, params?: any[], duration?: number): void => {
  winstonLogger.debug('Database Query', {
    query,
    params,
    duration: duration ? `${duration}ms` : undefined,
    timestamp: new Date().toISOString(),
  });
};

// Blockchain transaction logger
export const logBlockchainTransaction = (
  type: string,
  txHash?: string,
  amount?: number,
  status?: string,
  error?: string
): void => {
  const logLevel = error ? 'error' : 'info';
  
  winstonLogger.log(logLevel, 'Blockchain Transaction', {
    type,
    txHash,
    amount,
    status,
    error,
    timestamp: new Date().toISOString(),
  });
};

// Security event logger
export const logSecurityEvent = (
  event: string,
  userId?: string,
  ip?: string,
  details?: any
): void => {
  winstonLogger.warn('Security Event', {
    event,
    userId,
    ip,
    details,
    timestamp: new Date().toISOString(),
  });
};

// Business metric logger
export const logBusinessMetric = (
  metric: string,
  value: number,
  userId?: string,
  metadata?: any
): void => {
  winstonLogger.info('Business Metric', {
    metric,
    value,
    userId,
    metadata,
    timestamp: new Date().toISOString(),
  });
};