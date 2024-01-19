import { Request, Response, NextFunction } from 'express';

export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const userAgent = req.get('User-Agent');
  if (userAgent?.includes('Dart')) {
    next();
  } else {
    return res.status(403).json({ error: 'Forbidden' });
  }
};