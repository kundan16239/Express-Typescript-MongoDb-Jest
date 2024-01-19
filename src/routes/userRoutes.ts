import express from 'express';
import { getUserProfile } from '../controllers/userController';
import { authenticateUser } from '../middlewares/authMiddleware';
import { param } from 'express-validator';
import validate from '../middlewares/validateMiddleware';
import {rateLimit} from '../middlewares/rateLimitMiddleware'
const userRouter = express.Router();

const validateUserId = [
    param('id').isMongoId().withMessage('Invalid userId'),
    validate,
]

userRouter.get('/:id', validateUserId, authenticateUser, rateLimit(100), getUserProfile);

export default userRouter;
