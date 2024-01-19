import express from 'express';
import { getUserProfile } from '../controllers/userController';
import { authenticateUser } from '../middlewares/authMiddleware';

const userRouter = express.Router();

userRouter.get('/:id', authenticateUser, getUserProfile);

export default userRouter;
