/**
 * ArcJet Rate Limiting Middleware
 * Protects API routes from abuse using ArcJet
 */

import { arcjet, detectBot, shield, tokenBucket } from "@arcjet/next";

// Initialize ArcJet with your key
const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    // Shield protects your app from common attacks
    shield({ mode: "LIVE" }),
    
    // Rate limiting for API routes
    tokenBucket({
      mode: "LIVE",
      refillRate: 5, // 5 tokens per interval
      interval: 10, // every 10 seconds
      capacity: 10, // maximum 10 tokens
    }),
    
    // Bot detection
    detectBot({
      mode: "LIVE",
      allow: [], // block all bots
    }),
  ],
});

/**
 * Rate limiting middleware for API routes
 * @param {Request} request - The incoming request
 * @returns {Promise<{ success: boolean; reason?: string }>} Rate limit decision
 */
export async function checkRateLimit(request: Request) {
  try {
    const decision = await aj.protect(request);
    
    if (decision.isDenied()) {
      const reasons = decision.reason;
      
      if (reasons) {
        if (reasons.isRateLimit()) {
          return {
            success: false,
            reason: "Rate limit exceeded",
          };
        }
        if (reasons.isBot()) {
          return {
            success: false,
            reason: "Bot detected",
          };
        }
        if (reasons.isShield()) {
          return {
            success: false,
            reason: "Shield blocked request",
          };
        }
      }
      
      return {
        success: false,
        reason: "Request blocked",
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error("ArcJet error:", error);
    // Fail open - allow request if rate limiting fails
    return { success: true };
  }
}

/**
 * Higher-order function to wrap API route handlers with rate limiting
 * @param {Function} handler - The API route handler
 * @returns {Function} Wrapped handler with rate limiting
 */
export function withRateLimit(handler: Function) {
  return async (request: Request, ...args: any[]) => {
    const rateLimitCheck = await checkRateLimit(request);
    
    if (!rateLimitCheck.success) {
      return new Response(
        JSON.stringify({
          error: rateLimitCheck.reason || "Too many requests",
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    return handler(request, ...args);
  };
}
