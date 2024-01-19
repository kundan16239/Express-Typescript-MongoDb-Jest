import express from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import {rateLimit} from '../middlewares/rateLimitMiddleware'
import { body } from 'express-validator';
import validate from '../middlewares/validateMiddleware';
const authRouter = express.Router();

// Validation middleware for registration
const validateRegistration = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters'),
    validate,
];
  
// Validation middleware for login
const validateLogin = [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
];
  

authRouter.post('/register', validateRegistration, registerUser);
authRouter.post('/login', validateLogin, loginUser);

export default authRouter;