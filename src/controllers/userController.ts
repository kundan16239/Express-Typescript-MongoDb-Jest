import { Request, Response } from 'express';
import UserModel from '../models/user';
import logger from '../utils/logger';

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    if (userId !== req.headers["userId"]) {
      return res.status(401).json({ error: 'User Id not match with token' });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ name: user.name });
  } catch (error) {
    logger.error(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
