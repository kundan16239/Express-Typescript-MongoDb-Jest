import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../src/index'; // Import your Express app
import UserModel from '../src/models/user'; // Import your user model
import {generateToken} from '../src/helpers/authHelper'

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  await mongoServer.start();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('User Profile API', () => {
    it('should get user profile successfully', async () => {
      const userData = {
        name: 'kundan',
        email: 'kudan16238@gmail.com',
        password: 'test',
      };
  
      // Register a user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .set('User-Agent', 'Dart')
        .set('Content-Type', 'application/json');
  
      expect(registerResponse.status).toBe(201);

      const loginResponse = await request(app)
      .post('/api/auth/login')
      .send(userData)
      .set('User-Agent', 'Dart')
      .set('Content-Type', 'application/json');

      expect(loginResponse.status).toBe(200);
  
      const token = loginResponse.body.token;
      const userInfo = await UserModel.findOne({email: userData.email})
      const userId = userInfo?._id.toString()
      // Get user profile using the registered user's token
      const userProfileResponse = await request(app)
        .get(`/api/users/${userId}`)
        .set('User-Agent', 'Dart')
        .set('Authorization', `Bearer ${token}`);
  
      expect(userProfileResponse.status).toBe(200);
      expect(userProfileResponse.body).toEqual({ name: 'kundan' });
    });
  
    it('should handle invalid token', async () => {
      const invalidTokenResponse = await request(app)
        .get('/api/users/123')
        .set('User-Agent', 'Dart')
        .set('Authorization', 'Bearer invalidToken');
  
      expect(invalidTokenResponse.status).toBe(403);
    });
    
    it('should handle valid token and different user Id', async () => {
        const userInfo = await UserModel.findOne()
        const userId = userInfo?._id.toString()
        const token = generateToken(userId)
        const invalidTokenResponse = await request(app)
          .get('/api/users/123')
          .set('User-Agent', 'Dart')
          .set('Authorization', `Bearer ${token}`);
    
        expect(invalidTokenResponse.status).toBe(401);
      });
});
  