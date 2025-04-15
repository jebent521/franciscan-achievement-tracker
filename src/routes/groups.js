const express = require('express');
const router = express.Router();

const GroupService = require('../services/group-service');
const {
  GroupMembersService,
  GroupOfficersService,
} = require('../services/group-member-services');

// Group CRUD

router.get('/', async (req, res) => {
  const result = await new GroupService().read(req);
  res.status(result.status).send(result.message);
});

router.get('/:id', async (req, res) => {
  const result = await new GroupService().readById(req);
  res.status(result.status).send(result.message);
});

router.post('/', async (req, res) => {
  const result = await new GroupService().create(req);
  res.status(result.status).send(result.message);
});

router.put('/:id', async (req, res) => {
  const result = await new GroupService().update(req);
  res.status(result.status).send(result.message);
});

router.delete('/:id', async (req, res) => {
  const result = await new GroupService().delete(req);
  res.status(result.status).send(result.message);
});

// Group Member CRD

router.get('/:group_id/members', async (req, res) => {
  const result = await new GroupMembersService().read(req);
  res.status(result.status).send(result.message);
});

router.post('/:group_id/members', async (req, res) => {
  const result = await new GroupMembersService().create(req);
  res.status(result.status).send(result.message);
});

router.delete('/:group_id/members/:user_id', async (req, res) => {
  const result = await new GroupMembersService().delete(req);
  res.status(result.status).send(result.message);
});

// Group Officer CRD

router.get('/:group_id/officers', async (req, res) => {
  const result = await new GroupOfficersService().read(req);
  res.status(result.status).send(result.message);
});

router.post('/:group_id/officers', async (req, res) => {
  const result = await new GroupOfficersService().create(req);
  res.status(result.status).send(result.message);
});

router.delete('/:group_id/officers/:user_id', async (req, res) => {
  const result = await new GroupOfficersService().delete(req);
  res.status(result.status).send(result.message);
});

module.exports = router;
