import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import logger from '../utils/logger';
import * as configJson from '../../config.json';

const jwtSecret = configJson.jwtSecret;
const saltRounds = 10

export const generateToken = (userId: string): string => {
  const token = jwt.sign({ userId }, jwtSecret, { expiresIn: '1h' });
  return token;
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    try {
      const match = await bcrypt.compare(password, hashedPassword);
      return match;
    } catch (error) {
      logger.error(error)
      return false;
    }
};

export const hashPassword = async (password: string): Promise<string> => {
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      throw new Error('Error hashing password');
    }
};