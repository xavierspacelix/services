const request = require('supertest');
const app = require('../app'); // Assuming you have your Express app exported here
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock the User model
jest.mock('../models/User');

describe('User Controller Tests', () => {
  describe('POST /register', () => {
    it('should register a user successfully', async () => {
      const userData = { username: 'testuser', password: 'testpassword', role: 'user' };
      
      User.prototype.save = jest.fn().mockResolvedValue(userData);
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);
      
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully.');
    });

    it('should return error if username or password is missing', async () => {
      const userData = { username: 'testuser' };  
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);
      
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Username and password are required.');
    });
  });

  describe('POST /login', () => {
    it('should log in a user and return a token', async () => {
      const userData = { username: 'testuser', password: 'testpassword', role: 'user' };
      const hashedPassword = await bcrypt.hash('testpassword', 10);
      const user = { ...userData, password: hashedPassword };

      User.findOne = jest.fn().mockResolvedValue(user);

      
      jwt.sign = jest.fn().mockReturnValue('mock-token');
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'testpassword' });
      
      expect(response.status).toBe(200);
      expect(response.body.token).toBe('mock-token');
    });

    it('should return error if username or password is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser' });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Username and password are required.');
    });

    it('should return error if user is not found', async () => {
      User.findOne = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'nonexistentuser', password: 'testpassword' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found.');
    });

    it('should return error if password is incorrect', async () => {
      const userData = { username: 'testuser', password: 'testpassword' };
      const hashedPassword = await bcrypt.hash('wrongpassword', 10);
      const user = { ...userData, password: hashedPassword };

      User.findOne = jest.fn().mockResolvedValue(user);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'testpassword' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid password.');
    });
  });

  describe('GET /profile', () => {
    it('should return user profile if authenticated', async () => {
      const userData = { username: 'testuser', role: 'user', _id: 'user123' };

      User.findById = jest.fn().mockResolvedValue(userData);

      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer mock-token'); 

      expect(response.status).toBe(200);
      expect(response.body.username).toBe(userData.username);
    });

    it('should return error if user not found', async () => {
      User.findById = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer mock-token'); 

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found.');
    });
  });
});
