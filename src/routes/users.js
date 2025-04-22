/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var express = require('express');
const router = express.Router();

const UserAchievementService = require('../services/user-achievement-service');
const UserService = require('../services/user-service');
const UserFriendService = require('../services/user-friend-service');
const AchievementService = require('../services/achievement-service');

// User CRUD

router.get('/', async (req, res) => {
  const result = await new UserService().read(req);
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

router.get('/:id/friends', async (req, res) => {
  const result = await new UserFriendService().read(req);
  res.status(result.status).send(result.message);
});

router.post('/:id/friends', async (req, res) => {
  const result = await new UserFriendService().create(req);
  res.status(result.status).send(result.message);
});

router.delete('/:id/friends/:friend_id', async (req, res) => {
  const result = await new UserFriendService().delete(req);
  res.status(result.status).send(result.message);
});

module.exports = router;
