import arcjet, { tokenBucket } from "@arcjet/next";

// Per-user rate limit for write actions (creating accounts / transactions).
// Arcjet is optional: without ARCJET_KEY (e.g. local development) every
// request is allowed instead of failing.
const allowAll = {
  protect: async () => ({
    isDenied: () => false,
    reason: { isRateLimit: () => false },
  }),
};

const aj = process.env.ARCJET_KEY
  ? arcjet({
      key: process.env.ARCJET_KEY,
      characteristics: ["userId"], // Track based on Clerk userId
      rules: [
        tokenBucket({
          mode: "LIVE",
          refillRate: 10, // 10 tokens
          interval: 3600, // per hour
          capacity: 10, // maximum burst capacity
        }),
      ],
    })
  : allowAll;

export default aj;
