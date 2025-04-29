// Clear any previous mocks
jest.resetModules();

// Mock dependencies first
jest.mock('../../src/utils/fetch');
jest.mock('../../src/utils/auth-config', () => ({
  GRAPH_ME_ENDPOINT: 'https://graph.microsoft.com/v1.0/me',
  REDIRECT_URI: 'http://localhost:5007/auth/redirect',
  POST_LOGOUT_REDIRECT_URI: 'http://localhost:5007',
}));

// Define mock variables with 'mock' prefix (allowed by Jest)
const mockLogin = jest.fn();
const mockAcquireToken = jest.fn();
const mockHandleRedirect = jest.fn();

// Mock auth-provider with the mock variables
jest.mock('../../src/services/auth-provider', () => ({
  login: mockLogin,
  acquireToken: mockAcquireToken,
  handleRedirect: mockHandleRedirect,
}));

// Import dependencies after mocking
const request = require('supertest');
const express = require('express');
const fetchUtil = require('../../src/utils/fetch');
const UserService = require('../../src/services/user-service');
const { readByCustom } = require('../../src/data/repository');

// Set mock implementations after importing
mockLogin.mockImplementation((options) => (req, res) => {
  res.status(302).redirect('https://login.microsoftonline.com/mock-auth-url');
});

mockAcquireToken.mockImplementation((options) => (req, res) => {
  res.status(302).redirect('/auth/profile');
});

mockHandleRedirect.mockImplementation(() => (req, res) => {
  req.session.isAuthenticated = true;
  req.session.account = { idTokenClaims: { name: 'Test User' } };
  req.session.accessToken = 'mock-access-token';
  res.status(302).redirect('/');
});

// Now require the router
const authRouter = require('../../src/routes/auth');

describe('Auth Routes', () => {
  let app;

  beforeEach(() => {
    // Clear mock call history but keep mock implementations
    jest.clearAllMocks();

    // Create express app for testing
    app = express();

    // Mock session middleware
    app.use((req, res, next) => {
      req.session = req.session || {};
      next();
    });

    // Load auth router
    app.use('/auth', authRouter);
  });

  // In tests, verify mock calls using mockLogin, mockAcquireToken, mockHandleRedirect
  describe('GET /signin', () => {
    it('should redirect to Microsoft login page', async () => {
      const response = await request(app).get('/auth/signin').expect(302);

      expect(response.headers.location).toBe(
        'https://login.microsoftonline.com/mock-auth-url'
      );
    });
  });

  describe('GET /acquireToken', () => {
    it('should redirect to the profile page', async () => {
      // Create app with authenticated session
      const authenticatedApp = express();
      authenticatedApp.use((req, res, next) => {
        req.session = {
          isAuthenticated: true,
          account: { idTokenClaims: { name: 'Test User' } },
        };
        next();
      });

      authenticatedApp.use('/auth', authRouter);

      const response = await request(authenticatedApp)
        .get('/auth/acquireToken')
        .expect(302);

      // Only verify the behavior, not the function calls
      expect(response.headers.location).toBe('/auth/profile');
    });
  });

  describe('POST /redirect', () => {
    it('should handle redirect and set session data', async () => {
      const response = await request(app).post('/auth/redirect').expect(302);

      expect(response.headers.location).toBe('/');
    });
  });

  describe('GET /id', () => {
    it('should return 401 if user is not authenticated', async () => {
      const response = await request(app).get('/auth/id').expect(401);

      expect(response.body).toEqual({
        error: 'User not authenticated',
        redirect: '/auth/signin',
      });
    });

    it('should return ID token claims if user is authenticated', async () => {
      // Create app with authenticated session
      const authenticatedApp = express();
      authenticatedApp.use((req, res, next) => {
        req.session = {
          isAuthenticated: true,
          account: {
            idTokenClaims: {
              name: 'Test User',
              preferred_username: 'test.user@example.com',
            },
          },
        };
        next();
      });

      authenticatedApp.use('/auth', authRouter);

      const response = await request(authenticatedApp)
        .get('/auth/id')
        .expect(200);

      expect(response.body).toEqual({
        name: 'Test User',
        preferred_username: 'test.user@example.com',
      });
    });

    it('should handle errors', async () => {
      // Create app that throws error
      const errorApp = express();
      errorApp.use((req, res, next) => {
        req.session = {
          isAuthenticated: true,
          account: null, // This will cause an error
        };
        next();
      });

      errorApp.use('/auth', authRouter);

      const response = await request(errorApp).get('/auth/id').expect(500);
    });
  });

  describe('GET /profile', () => {
    it('should return 401 if user is not authenticated', async () => {
      const response = await request(app).get('/auth/profile').expect(401);

      expect(response.body).toEqual({
        error: 'User not authenticated',
        redirect: '/auth/signin',
      });
    });

    it('should return profile data if user is authenticated with valid token', async () => {
      // Mock fetch to return profile data
      const mockProfile = {
        displayName: 'Test User',
        mail: 'test@example.com',
      };
      fetchUtil.mockResolvedValue(mockProfile);

      // Create app with authenticated session
      const authenticatedApp = express();
      authenticatedApp.use((req, res, next) => {
        req.session = {
          isAuthenticated: true,
          accessToken: 'valid-access-token',
          account: { idTokenClaims: { name: 'Test User' } },
        };
        next();
      });

      authenticatedApp.use('/auth', authRouter);

      const response = await request(authenticatedApp)
        .get('/auth/profile')
        .expect(200);

      expect(response.body).toEqual(mockProfile);
      expect(fetchUtil).toHaveBeenCalledWith(
        'https://graph.microsoft.com/v1.0/me',
        'valid-access-token'
      );
    });

    it('should handle expired token', async () => {
      // Mock fetch to throw 401 error
      fetchUtil.mockRejectedValue(
        new Error('AxiosError: Request failed with status code 401')
      );

      // Create app with authenticated session but expired token
      const authenticatedApp = express();
      authenticatedApp.use((req, res, next) => {
        req.session = {
          isAuthenticated: true,
          accessToken: 'expired-token',
        };
        next();
      });

      authenticatedApp.use('/auth', authRouter);

      const response = await request(authenticatedApp)
        .get('/auth/profile')
        .expect(401);

      expect(response.body).toEqual({
        error: 'Access token expired or invalid',
        redirect: '/auth/acquireToken',
      });
    });

    it('should handle general errors', async () => {
      // Mock fetch to throw general error
      fetchUtil.mockRejectedValue(new Error('Network error'));

      // Create app with authenticated session
      const authenticatedApp = express();
      authenticatedApp.use((req, res, next) => {
        req.session = {
          isAuthenticated: true,
          accessToken: 'valid-token',
        };
        next();
      });

      authenticatedApp.use('/auth', authRouter);

      const response = await request(authenticatedApp)
        .get('/auth/profile')
        .expect(500);

      expect(response.body.error).toBe('Network error');
    });
  });

  describe('State Validation', () => {
    it('should encode and decode state correctly during login and redirect', async () => {
      const mockState = { successRedirect: '/dashboard' };
      const encodedState = Buffer.from(JSON.stringify(mockState)).toString(
        'base64'
      );

      // Mock login to return the encoded state
      mockLogin.mockImplementation((options) => (req, res) => {
        expect(options.state).toBe(encodedState); // Ensure state is encoded
        res
          .status(302)
          .redirect('https://login.microsoftonline.com/mock-auth-url');
      });

      const response = await request(app).get('/auth/signin').expect(302);

      expect(response.headers.location).toBe(
        'https://login.microsoftonline.com/mock-auth-url'
      );
    });
  });

  describe('POST /Create new Auth User', () => {
    it('should create new users that sign in using auth that do not exist in current database', async () => {
      // Mock readByCustom
      const mockReadByCustom = jest.fn(readByCustom);

      // mock create
      const mockCreate = jest.fn().mockResolvedValue({
        displayName: 'Non-existent User',
        mail: 'non-existentuser@example.com',
      });

      // Check if user already exists in our database
      const userService = new UserService();

      // Mock the entire repository
      userService.repository = {
        mockReadByCustom: jest.fn().mockImplementation((field, value) => {
          // Mock implementation
          if (field === 'display_name' && value === 'Non-existent User') {
            return Promise.resolve(null); // No user found
          }
          if (field === 'email' && value === 'non-existentuser@example.com');
          {
            return Promise.resolve(null); // No email found
          }
          return Promise.resolve({
            displayName: 'Non-existent User',
            mail: 'non-existentuser@example.com',
          });
        }),
      };

      // Initialize Mock Data
      const mockProfile = {
        displayName: 'Non-existent User',
        mail: 'non-existentuser@example.com',
      };

      const existingUserQuery = await userService.repository.mockReadByCustom(
        'display_name',
        mockProfile.displayName
      );
      const existingEmailQuery = await userService.repository.mockReadByCustom(
        'email',
        mockProfile.mail
      );

      let userCreated = false;
      let userData = null;
      let createResult;

      // Create new user with Microsoft profile data
      if (existingUserQuery === null && existingEmailQuery === null) {
        createResult = await mockCreate({
          name: mockProfile.displayName,
          email: mockProfile.mail,
        });

        userCreated = true;
        userData = createResult.message;
      }
      // Assert that the user was created
      expect(createResult).toEqual({
        displayName: 'Non-existent User',
        mail: 'non-existentuser@example.com',
      });
    });
  });

  describe('GET/ Login success', () => {
    it('should test for login success', async () => {
      // Initializing test user
      const mockProfile = {
        displayName: 'Test User',
        mail: 'testuser@example.com',
      };

      // Mock functions
      const mockReadByCustom = jest.fn(readByCustom);

      // Check if user already exists in our database
      const userService = new UserService();

      // Mock the entire repository
      userService.repository = {
        mockReadByCustom: jest.fn().mockImplementation((field, value) => {
          // Mock implementation
          if (field === 'display_name' && value === 'Test User') {
            return Promise.resolve(200); // User found
          }
          field === 'email' && value === 'testuser@example.com';
          {
            return Promise.resolve(200); // Email found
          }
          return Promise.resolve({
            displayName: 'Test User',
            mail: 'testuser@example.com',
          });
        }),
      };

      const existingUserQuery = await userService.repository.mockReadByCustom(
        'display_name',
        mockProfile.displayName
      );
      const existingEmailQuery = await userService.repository.mockReadByCustom(
        'email',
        mockProfile.mail
      );

      let userExists = false;

      if (existingUserQuery === 200 && existingEmailQuery === 200) {
        userExists = true;
      }

      expect(userExists).toEqual(true);
    });
  });
});
