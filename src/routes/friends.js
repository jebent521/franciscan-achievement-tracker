/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var express = require('express');
const router = express.Router();

const FriendService = require('../services/friends-service');

router.get('/', async (_, res) => {
  const result = await new FriendService().read();
  res.status(result.status).send(result.message);
});

router.get('/:id', async (req, res) => {
  const result = await new FriendService().readById(req);
  res.status(result.status).send(result.message);
});

router.post('/', async (req, res) => {
  const result = await new FriendService().create(req);
  res.status(result.status).send(result.message);
});

router.put('/:id', async (req, res) => {
  const result = await new FriendService().update(req);
  res.status(result.status).send(result.message);
});

router.delete('/:id', async (req, res) => {
  const result = await new FriendService().delete(req);
  res.status(result.status).send(result.message);
});

module.exports = router;
