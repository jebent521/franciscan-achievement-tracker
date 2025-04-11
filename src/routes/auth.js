/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const express = require('express');
const fetch = require('../utils/fetch');
const {
  GRAPH_ME_ENDPOINT,
  REDIRECT_URI,
  // POST_LOGOUT_REDIRECT_URI,
} = require('../utils/auth-config');

const authProvider = require('../services/auth-provider');
const UserService = require('../services/user-service');

const router = express.Router();

function isAuthenticated(req, res, next) {
  if (!req.session.isAuthenticated) {
    return res.status(401).json({
      error: 'User not authenticated',
      redirect: '/auth/signin',
    });
  }

  next();
}

router.get(
  '/signin',
  authProvider.login({
    scopes: ['User.Read'],
    redirectUri: REDIRECT_URI,
    successRedirect: '/auth/success',
  })
);

router.get('/success', isAuthenticated, async (req, res) => {
  try {
    // Get the user profile from Microsoft Graph API
    const graphResponse = await fetch(
      GRAPH_ME_ENDPOINT,
      req.session.accessToken
    );

    // Check if user already exists in our database
    const userService = new UserService();

    const existingUserQuery = await userService.repository.readByCustom(
      'oauth_id',
      graphResponse.id
    );
    const existingEmailQuery = await userService.repository.readByCustom(
      'email',
      graphResponse.mail
    );

    let userCreated = false;
    let userData = null;

    // Check if user exists by OAuth ID
    if (
      existingUserQuery.status === 200 &&
      existingUserQuery.message.length > 0
    ) {
      userCreated = false;
      userData = existingUserQuery.message[0];
    }
    // Check if user exists by email
    else if (
      existingEmailQuery.status === 200 &&
      existingEmailQuery.message.length > 0
    ) {
      userCreated = false;
      userData = existingUserQuery.message[0];
    }
    // Create new user with Microsoft profile data
    else {
      const createResult = await userService.repository.create({
        name: graphResponse.displayName,
        email: graphResponse.mail,
        oauth_id: graphResponse.id,
      });

      if (createResult.status !== 201) {
        throw new Error(
          `Failed to create user: ${JSON.stringify(createResult.message)}`
        );
      }

      userCreated = true;
      userData = createResult.message;
    }

    return res.status(200).json({
      success: true,
      userCreated: userCreated,
      userExists: !userCreated,
      user: {
        id: userData?.id,
        name: graphResponse.displayName,
        email: graphResponse.mail,
        oauth_id: graphResponse.id,
      },
    });
  } catch (error) {
    // If token expired, include special error info
    if (error.message && error.message.includes('401')) {
      return res.status(401).json({
        error: 'Access token expired or invalid',
        userCreated: false,
        userExists: false,
        redirect: '/auth/acquireToken',
      });
    }

    // For other errors, return standard error response
    return res.status(500).json({
      error: error.message,
      userCreated: false,
      userExists: false,
    });
  }
});

router.get(
  '/acquireToken',
  isAuthenticated,
  authProvider.acquireToken({
    scopes: ['User.Read'],
    redirectUri: REDIRECT_URI,
  })
);

router.post('/redirect', authProvider.handleRedirect());

router.get('/id', isAuthenticated, async (req, res) => {
  try {
    res.status(200).json(req.session.account.idTokenClaims || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/profile', isAuthenticated, async (req, res) => {
  try {
    const graphResponse = await fetch(
      GRAPH_ME_ENDPOINT,
      req.session.accessToken
    );

    res.status(200).json(graphResponse);
  } catch (error) {
    if (
      error.message &&
      error.message.includes('AxiosError') &&
      error.message.includes('401')
    ) {
      return res.status(401).json({
        error: 'Access token expired or invalid',
        redirect: '/auth/acquireToken',
      });
    }

    // For other errors, return standard error response
    res.status(500).json({ error: error.message });
  }
});

// router.get(
//   '/signout',
//   authProvider.logout({
//     postLogoutRedirectUri: POST_LOGOUT_REDIRECT_URI,
//   })
// );

module.exports = router;
