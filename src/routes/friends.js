const express = require('express');
const router = express.Router();

const FriendService = require('../services/friends-service');

router.post('/', async (req, res) => {
  const result = await new FriendService().create(req);
  res.status(result.status).send(result.message);
});

router.delete('/:id', async (req, res) => {
  const result = await new FriendService().delete(req);
  res.status(result.status).send(result.message);
});

module.exports = router;
