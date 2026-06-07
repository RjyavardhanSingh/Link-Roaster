import rateLimit from 'express-rate-limit';

export const roastLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => {
    return req.ip || req.socket.remoteAddress || 'unknown';
  },
  message: { error: 'Too many requests. Limit is 5 per hour per IP.' },
  standardHeaders: true,
  legacyHeaders: false,
});
