const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const connection = require('./data/connection');
const AchievementService = require('./services/achievement-service');
const GroupService = require('./services/group-service');
const UserAchievementService = require('./services/user-achievement-service');
const UserService = require('./services/user-service');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connection.testConnection();

app.get('/', (_, res) => res.send('Barons of Progress 📈 Homepage'));

const swaggerDocument = YAML.load('src/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/api/achievements', async (_, res) =>
  new AchievementService().read(res)
);
app.get('/api/achievements/:id', async (req, res) =>
  new AchievementService().readById(req, res)
);
app.post('/api/achievements', async (req, res) =>
  new AchievementService().create(req, res)
);
app.put('/api/achievements/:id', async (req, res) =>
  new AchievementService().update(req, res)
);
app.delete('/api/achievements/:id', async (req, res) =>
  new AchievementService().delete(req, res)
);

app.get('/api/groups', async (_, res) => new GroupService().read(res));
app.get('/api/groups/:id', async (req, res) =>
  new GroupService().readById(req, res)
);
app.post('/api/groups', async (req, res) =>
  new GroupService().create(req, res)
);
app.put('/api/groups/:id', async (req, res) =>
  new GroupService().update(req, res)
);
app.delete('/api/groups/:id', async (req, res) =>
  new GroupService().delete(req, res)
);

app.get('/api/users', async (_, res) => new UserService().read(res));
app.get('/api/users/:id', async (req, res) =>
  new UserService().readById(req, res)
);
app.post('/api/users', async (req, res) => new UserService().create(req, res));
app.put('/api/users/:id', async (req, res) =>
  new UserService().update(req, res)
);
app.delete('/api/users/:id', async (req, res) =>
  new UserService().delete(req, res)
);

app.get('/api/users/:user_id/achievements', async (req, res) =>
  new UserAchievementService().read(req, res)
);
app.post('/api/users/:user_id/achievements', async (req, res) =>
  new UserAchievementService().create(req, res)
);
app.delete(
  '/api/users/:user_id/achievements/:achievement_id',
  async (req, res) => new UserAchievementService().delete(req, res)
);

app.listen(5007, () =>
  console.log(`⚡[bootup]: Server is running at port: 5007`)
);

module.exports = app;
