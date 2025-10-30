import { NextRequest } from 'next/server';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(config: RateLimitConfig) {
  return (request: NextRequest): { success: boolean; remaining: number; resetTime: number } => {
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    const now = Date.now();
    const key = `${ip}:${Math.floor(now / config.windowMs)}`;
    
    const current = rateLimitStore.get(key);
    
    if (!current || now > current.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      });
      
      return {
        success: true,
        remaining: config.maxRequests - 1,
        resetTime: now + config.windowMs
      };
    }
    
    if (current.count >= config.maxRequests) {
      return {
        success: false,
        remaining: 0,
        resetTime: current.resetTime
      };
    }
    
    current.count++;
    rateLimitStore.set(key, current);
    
    return {
      success: true,
      remaining: config.maxRequests - current.count,
      resetTime: current.resetTime
    };
  };
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  const keysToDelete: string[] = [];
  
  rateLimitStore.forEach((value, key) => {
    if (now > value.resetTime) {
      keysToDelete.push(key);
    }
  });
  
  keysToDelete.forEach(key => rateLimitStore.delete(key));
}, 60000); // Clean up every minute
