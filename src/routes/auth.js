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
    successRedirect: '/',
  })
);

router.get(
  '/acquireToken',
  authProvider.acquireToken({
    scopes: ['User.Read'],
    redirectUri: REDIRECT_URI,
    successRedirect: '/auth/profile',
  })
);

router.post('/redirect', authProvider.handleRedirect());

router.get('/id', isAuthenticated, async (req, res) => {
  try {
    res.status(200).json(req.session.account.idTokenClaims || {});
  } catch (error) {
    res.status(500).json(error.message);
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
    res.status(500).json(error.message);
  }
});

// router.get(
//   '/signout',
//   authProvider.logout({
//     postLogoutRedirectUri: POST_LOGOUT_REDIRECT_URI,
//   })
// );

module.exports = router;
