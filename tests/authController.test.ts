import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../src/index'; // Import your Express app
import UserModel from '../src/models/user'; // Import your user model
import { comparePassword, hashPassword} from '../src/helpers/authHelper'

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

beforeEach(async () => {
  await UserModel.deleteMany(); // Clear the users collection
});

describe('User Registration API', () => {
  it('should register a new user successfully', async () => {
    const userData = {
      name: 'kundan',
      email: 'kudan16239@gmail.com',
      password: 'test',
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .set('User-Agent', 'Dart')
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'User registered successfully' });

    const user = await UserModel.findOne({ email: userData.email });
    expect(user).toBeTruthy();
    expect(user?.name).toBe(userData.name);
  });

  it('should handle registration for an existing user', async () => {
    const existingUser = {
      name: 'existingUser',
      email: 'existing@example.com',
      password: 'test',
    };

    await new UserModel(existingUser).save();

    const response = await request(app)
      .post('/api/auth/register')
      .send(existingUser)
      .set('User-Agent', 'Dart')
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'User already exists' });
  });

  // body validation

  // it('should handle registration with invalid input', async () => {
  //   const invalidUserData = {
  //     // Missing 'password' field
  //     name: 'John Doe',
  //     email: 'john.doe@example.com',
  //   };

  //   const response = await request(app)
  //     .post('/api/auth/register')
  //     .send(invalidUserData)
  //     .set('User-Agent', 'Dart')
  //     .set('Content-Type', 'application/json');

  //   expect(response.status).toBe(400);
  //   expect(response.body).toEqual({ error: 'Invalid input data' });
  // });

  // Add more test cases as needed
});

describe('User Login API', () => {
  it('should log in a user with correct credentials', async () => {
    const password = await hashPassword('testpassword')
    const userData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: password,
    };
    const check = await comparePassword('testpassword', password)
    expect(check).toBe(true); 

    await new UserModel(userData).save();

    const loginCredentials = {
      email: 'john.doe@example.com',
      password: 'testpassword',
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(loginCredentials)
      .set('User-Agent', 'Dart')
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should handle login with incorrect password', async () => {
    const password = await hashPassword('testpassword')
    const userData = {
      name: 'forgot user',
      email: 'forgot@gmail.com',
      password: password,
    };

    await new UserModel(userData).save();

    const loginCredentials = {
      email: 'forgot@gmail.com',
      password: 'wrongpassword',
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(loginCredentials)
      .set('User-Agent', 'Dart')
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Invalid password' });
  });

  it('should handle login with non-existent user', async () => {
    const nonExistentUserCredentials = {
      email: 'nonexistent@gmail.com',
      password: 'testpassword',
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(nonExistentUserCredentials)
      .set('User-Agent', 'Dart')
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'No User Exist With Given Email' });
  });
});
