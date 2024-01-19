import { Request, Response } from 'express';
import UserModel from '../models/user';
import {generateToken, comparePassword, hashPassword} from '../helpers/authHelper'

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await UserModel.findOne({ email }, '_id');
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new UserModel({ name, email, password: hashedPassword });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email }, '_id password');

    if (user) {
      const validatePassword = await comparePassword(password, user.password);

      if (validatePassword) {
        const token = generateToken(user._id.toString());

        return res.json({ token });
      } else {
        return res.status(401).json({ error: 'Invalid password' });
      }
    } else {
      return res.status(401).json({ error: 'No User Exist With Given Email' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

