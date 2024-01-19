import { Request, Response, NextFunction } from 'express';
import * as configJson from '../../config.json';

const jwtSecret = configJson.jwtSecret;

import jwt, { VerifyErrors } from 'jsonwebtoken';
import logger from '../utils/logger';

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (authorization?.startsWith('Bearer ')) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return res.sendStatus(401);
    }

    jwt.verify(token, jwtSecret, (err: VerifyErrors | null, user: any) => {
      if (err) {
        if (err.name === 'JsonWebTokenError') {
          return res.sendStatus(403);
        } else if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ error: 'Token expired' });
        } else {
          logger.error('Error verifying token:', err)
          return res.sendStatus(500);
        }
      }

      req.headers['userId'] = user?.userId;
      next();
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

