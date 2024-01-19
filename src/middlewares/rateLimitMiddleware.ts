import { Request, Response, NextFunction } from 'express';

export const rateLimit = (requestsPerMinute: number) => {
  const interval = 60 * 1000; 
  let tokens = requestsPerMinute;

  return (req: Request, res: Response, next: NextFunction) => {
    if (tokens > 0) {
      tokens -= 1;
      next();
    } else {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    }

    setTimeout(() => {
      tokens = requestsPerMinute;
    }, interval);
  };
};

