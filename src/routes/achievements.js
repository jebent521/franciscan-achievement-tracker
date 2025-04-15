const express = require('express');
const router = express.Router();

const AchievementService = require('../services/achievement-service');

router.get('/', async (req, res) => {
  const result = await new AchievementService().read(req);
  res.status(result.status).send(result.message);
});

router.get('/:id', async (req, res) => {
  const result = await new AchievementService().readById(req);
  res.status(result.status).send(result.message);
});

router.post('/', async (req, res) => {
  const result = await new AchievementService().create(req);
  res.status(result.status).send(result.message);
});

router.put('/:id', async (req, res) => {
  const result = await new AchievementService().update(req);
  res.status(result.status).send(result.message);
});

router.delete('/:id', async (req, res) => {
  const result = await new AchievementService().delete(req);
  res.status(result.status).send(result.message);
});

module.exports = router;
