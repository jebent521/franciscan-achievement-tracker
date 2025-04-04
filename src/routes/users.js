/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var express = require('express');
const router = express.Router();

var fetch = require('../utils/fetch');
var { GRAPH_ME_ENDPOINT } = require('../utils/auth-config');

const UserAchievementService = require('../services/user-achievement-service');
const UserService = require('../services/user-service');

// custom middleware to check auth state
function isAuthenticated(req, res, next) {
  if (!req.session.isAuthenticated) {
    return res.redirect('/auth/signin');
  }

  next();
}

router.get('/id', isAuthenticated, async function (req, res, next) {
  try {
    res.status(200).json({
      success: true,
      idTokenClaims: req.session.account.idTokenClaims || {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get('/profile', isAuthenticated, async function (req, res, next) {
  try {
    const graphResponse = await fetch(
      GRAPH_ME_ENDPOINT,
      req.session.accessToken
    );

    res.status(200).json({
      success: true,
      profile: graphResponse,
    });
  } catch (error) {
    if (
      error.message &&
      error.message.includes('AxiosError') &&
      error.message.includes('401')
    ) {
      return res.status(401).json({
        success: false,
        error: 'Access token expired or invalid',
        redirect: '/auth/acquireToken',
      });
    }

    // For other errors, return standard error response
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// User CRUD

router.get('/', async (_, res) => {
  const result = await new UserService().read();
  res.status(result.status).send(result.message);
});

router.get('/:id', async (req, res) => {
  const result = await new UserService().readById(req);
  res.status(result.status).send(result.message);
});

router.post('/', async (req, res) => {
  const result = await new UserService().create(req);
  res.status(result.status).send(result.message);
});

router.put('/:id', async (req, res) => {
  const result = await new UserService().update(req);
  res.status(result.status).send(result.message);
});

router.delete('/:id', async (req, res) => {
  const result = await new UserService().delete(req);
  res.status(result.status).send(result.message);
});

// Earned Achievements CRD

router.get('/:user_id/achievements', async (req, res) => {
  const result = await new UserAchievementService().read(req);
  res.status(result.status).send(result.message);
});

router.post('/:user_id/achievements', async (req, res) => {
  const result = await new UserAchievementService().create(req);
  res.status(result.status).send(result.message);
});

router.delete('/:user_id/achievements/:achievement_id', async (req, res) => {
  const result = await new UserAchievementService().delete(req);
  res.status(result.status).send(result.message);
});

module.exports = router;
