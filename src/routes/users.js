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
    return res.redirect('/api/login'); // redirect to sign-in route
  }

  next();
}

router.get(
  '/id',
  isAuthenticated, // check if user is authenticated
  async function (req, res, next) {
    res.render('id', { idTokenClaims: req.session.account.idTokenClaims });
  }
);

router.get(
  '/profile',
  isAuthenticated, // check if user is authenticated
  async function (req, res, next) {
    try {
      const graphResponse = await fetch(
        GRAPH_ME_ENDPOINT,
        req.session.accessToken
      );
      res.render('profile', { profile: graphResponse });
    } catch (error) {
      next(error);
    }
  }
);

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
