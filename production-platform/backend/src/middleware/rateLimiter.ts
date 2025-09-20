import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory, RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'redis';

// Rate limiter configurations
const rateLimiterConfigs = {
  // General API rate limiting
  general: {
    keyPrefix: 'general_rl',
    points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10), // Number of requests
    duration: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900', 10), // Per 15 minutes (900 seconds)
  },
  
  // Authentication endpoints (more restrictive)
  auth: {
    keyPrefix: 'auth_rl',
    points: 5, // 5 attempts
    duration: 900, // Per 15 minutes
    blockDuration: 1800, // Block for 30 minutes after limit exceeded
  },
  
  // Treatment creation (high-value operations)
  treatmentCreation: {
    keyPrefix: 'treatment_rl',
    points: 3, // 3 treatment requests
    duration: 3600, // Per hour
    blockDuration: 3600, // Block for 1 hour
  },
  
  // Sponsorship operations
  sponsorship: {
    keyPrefix: 'sponsor_rl',
    points: 10, // 10 sponsorship actions
    duration: 3600, // Per hour
  },
  
  // Research data access
  research: {
    keyPrefix: 'research_rl',
    points: 50, // 50 research queries
    duration: 3600, // Per hour
  },
};

// Initialize rate limiters
let redisClient: any = null;
let rateLimiters: { [key: string]: any } = {};

// Try to connect to Redis, fallback to memory
const initializeRateLimiters = async (): Promise<void> => {
  try {
    if (process.env.REDIS_URL) {
      redisClient = Redis.createClient({
        url: process.env.REDIS_URL,
        password: process.env.REDIS_PASSWORD,
      });
      
      await redisClient.connect();
      console.log('Rate limiter using Redis backend');
      
      // Create Redis-based rate limiters
      Object.entries(rateLimiterConfigs).forEach(([key, config]) => {
        rateLimiters[key] = new RateLimiterRedis({
          storeClient: redisClient,
          ...config,
        });
      });
    } else {
      throw new Error('No Redis configuration found');
    }
  } catch (error) {
    console.warn('Redis not available, using memory-based rate limiting:', error);
    
    // Create memory-based rate limiters
    Object.entries(rateLimiterConfigs).forEach(([key, config]) => {
      rateLimiters[key] = new RateLimiterMemory(config);
    });
  }
};

// Initialize rate limiters
initializeRateLimiters();

// Rate limiting middleware factory
const createRateLimitMiddleware = (limiterKey: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const limiter = rateLimiters[limiterKey] || rateLimiters.general;
    const key = `${req.ip}_${req.get('User-Agent') || 'unknown'}`;
    
    try {
      await limiter.consume(key);
      next();
    } catch (rateLimiterRes: any) {
      const secs = Math.round(rateLimiterRes.msBeforeNext / 1000) || 1;
      
      // Set rate limit headers
      res.set('Retry-After', String(secs));
      res.set('X-RateLimit-Limit', String(limiter.points));
      res.set('X-RateLimit-Remaining', String(rateLimiterRes.remainingPoints || 0));
      res.set('X-RateLimit-Reset', String(new Date(Date.now() + rateLimiterRes.msBeforeNext)));
      
      // Log rate limit event
      console.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: req.path,
        limiterKey,
        remainingPoints: rateLimiterRes.remainingPoints,
        msBeforeNext: rateLimiterRes.msBeforeNext,
      });
      
      res.status(429).json({
        error: {
          message: 'Too many requests',
          code: 'RATE_LIMIT_EXCEEDED',
          statusCode: 429,
          retryAfter: secs,
          limit: limiter.points,
          remaining: rateLimiterRes.remainingPoints || 0,
          resetTime: new Date(Date.now() + rateLimiterRes.msBeforeNext).toISOString(),
        },
      });
    }
  };
};

// Export middleware functions
export const rateLimiter = createRateLimitMiddleware('general');
export const authRateLimiter = createRateLimitMiddleware('auth');
export const treatmentRateLimiter = createRateLimitMiddleware('treatmentCreation');
export const sponsorshipRateLimiter = createRateLimitMiddleware('sponsorship');
export const researchRateLimiter = createRateLimitMiddleware('research');

// IP-based blocking for suspicious activity
const suspiciousActivity = new RateLimiterMemory({
  keyPrefix: 'suspicious_rl',
  points: 1, // 1 suspicious action
  duration: 3600, // Block for 1 hour
});

export const blockSuspiciousActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const key = req.ip;
  
  try {
    await suspiciousActivity.consume(key);
    next();
  } catch (rateLimiterRes) {
    console.error('Suspicious activity blocked', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      endpoint: req.path,
      method: req.method,
    });
    
    res.status(403).json({
      error: {
        message: 'Access denied due to suspicious activity',
        code: 'SUSPICIOUS_ACTIVITY_BLOCKED',
        statusCode: 403,
      },
    });
  }
};

// Manually trigger suspicious activity blocking
export const triggerSuspiciousActivity = async (ip: string): Promise<void> => {
  try {
    await suspiciousActivity.penalty(ip, 1);
    console.warn('IP marked as suspicious:', ip);
  } catch (error) {
    console.error('Failed to mark IP as suspicious:', error);
  }
};

// Check rate limit status without consuming
export const checkRateLimit = async (
  limiterKey: string,
  identifier: string
): Promise<{ allowed: boolean; remaining: number; resetTime: Date }> => {
  const limiter = rateLimiters[limiterKey] || rateLimiters.general;
  
  try {
    const resRateLimiter = await limiter.get(identifier);
    
    return {
      allowed: resRateLimiter.remainingPoints > 0,
      remaining: resRateLimiter.remainingPoints || 0,
      resetTime: new Date(Date.now() + resRateLimiter.msBeforeNext),
    };
  } catch (error) {
    return {
      allowed: true,
      remaining: limiter.points,
      resetTime: new Date(Date.now() + limiter.duration * 1000),
    };
  }
};