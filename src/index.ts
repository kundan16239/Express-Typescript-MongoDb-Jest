import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRoutes';
import userRouter from './routes/userRoutes';
import { corsMiddleware } from './middlewares/corsMiddleware';
import * as configJson from '../config.json'

const app = express();

app.use(express.json());

// CORS configuration
const allowedOrigins = configJson.allowedOrigins

app.use(cors({
  origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
    // handle for android and ios case
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }

    return callback(null, true);
  }
}));

app.use(corsMiddleware)

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

export default app;
