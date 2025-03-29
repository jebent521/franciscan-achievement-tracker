const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const connection = require('./data/connection');
const AchievementService = require('./services/achievement-service');
const GroupService = require('./services/group-service');
const SearchService = require('./services/search-service');
const UserAchievementService = require('./services/user-achievement-service');
const UserService = require('./services/user-service');
const {
  GroupMembersService,
  GroupOfficersService,
} = require('./services/group-member-services');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connection.testConnection();

app.get('/', (_, res) => res.send('Barons of Progress 📈 Homepage'));

// Documentation
const swaggerDocument = YAML.load('src/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Achievements
app.get('/api/achievements', async (_, res) => {
  const result = await new AchievementService().read();
  res.status(result.status).send(result.message);
});
app.get('/api/achievements/:id', async (req, res) => {
  const result = await new AchievementService().readById(req);
  res.status(result.status).send(result.message);
});
app.post('/api/achievements', async (req, res) => {
  const result = await new AchievementService().create(req);
  res.status(result.status).send(result.message);
});
app.put('/api/achievements/:id', async (req, res) => {
  const result = await new AchievementService().update(req);
  res.status(result.status).send(result.message);
});
app.delete('/api/achievements/:id', async (req, res) => {
  const result = await new AchievementService().delete(req);
  res.status(result.status).send(result.message);
});

// Groups
app.get('/api/groups', async (_, res) => {
  const result = await new GroupService().read();
  res.status(result.status).send(result.message);
});
app.get('/api/groups/:id', async (req, res) => {
  const result = await new GroupService().readById(req);
  res.status(result.status).send(result.message);
});
app.post('/api/groups', async (req, res) => {
  const result = await new GroupService().create(req);
  res.status(result.status).send(result.message);
});
app.put('/api/groups/:id', async (req, res) => {
  const result = await new GroupService().update(req);
  res.status(result.status).send(result.message);
});
app.delete('/api/groups/:id', async (req, res) => {
  const result = await new GroupService().delete(req);
  res.status(result.status).send(result.message);
});

// Users
app.get('/api/users', async (_, res) => {
  const result = await new UserService().read();
  res.status(result.status).send(result.message);
});
app.get('/api/users/:id', async (req, res) => {
  const result = await new UserService().readById(req);
  res.status(result.status).send(result.message);
});
app.post('/api/users', async (req, res) => {
  const result = await new UserService().create(req);
  res.status(result.status).send(result.message);
});
app.put('/api/users/:id', async (req, res) => {
  const result = await new UserService().update(req);
  res.status(result.status).send(result.message);
});
app.delete('/api/users/:id', async (req, res) => {
  const result = await new UserService().delete(req);
  res.status(result.status).send(result.message);
});

// Earned Achievements
app.get('/api/users/:user_id/achievements', async (req, res) => {
  const result = await new UserAchievementService().read(req);
  res.status(result.status).send(result.message);
});
app.post('/api/users/:user_id/achievements', async (req, res) => {
  const result = await new UserAchievementService().create(req);
  res.status(result.status).send(result.message);
});
app.delete(
  '/api/users/:user_id/achievements/:achievement_id',
  async (req, res) => {
    const result = await new UserAchievementService().delete(req);
    res.status(result.status).send(result.message);
  }
);

// Search
app.get('/api/search/:query', async (req, res) => {
  const result = await new SearchService().search(req);
  res.status(result.status).send(result.message);
});

app.get('/api/groups/:group_id/members', async (req, res) => {
  const result = await new GroupMembersService().read(req);
  res.status(result.status).send(result.message);
});
app.post('/api/groups/:group_id/members', async (req, res) => {
  const result = await new GroupMembersService().create(req);
  res.status(result.status).send(result.message);
});
app.delete('/api/groups/:group_id/members/:user_id', async (req, res) => {
  const result = await new GroupMembersService().delete(req);
  res.status(result.status).send(result.message);
});

app.get('/api/groups/:group_id/officers', async (req, res) => {
  const result = await new GroupOfficersService().read(req);
  res.status(result.status).send(result.message);
});
app.post('/api/groups/:group_id/officers', async (req, res) => {
  const result = await new GroupOfficersService().create(req);
  res.status(result.status).send(result.message);
});
app.delete('/api/groups/:group_id/officers/:user_id', async (req, res) => {
  const result = await new GroupOfficersService().delete(req);
  res.status(result.status).send(result.message);
});

app.listen(5007, () =>
  console.log(`⚡[bootup]: Server is running at port: 5007`)
);

module.exports = app;
