import express from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import {rateLimit} from '../middlewares/rateLimitMiddleware'
const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', rateLimit(100), loginUser);

export default authRouter;