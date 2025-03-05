const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const connection = require('./data/connection');
const AchievementService = require('./services/achievement-service');
const GroupService = require('./services/group-service');
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
app.delete('/api/groups/:id', async (req, res) =>
  new GroupService().delete(req, res)
);

app.get('/api/user', async (_, res) => new UserService().read(res));
app.get('/api/user/:id', async (req, res) =>
  new UserService().readById(req, res)
);
app.post('/api/user', async (req, res) => new UserService().create(req, res));
app.delete('/api/user/:id', async (req, res) =>
  new UserService().delete(req, res)
);

app.listen(5007, () =>
  console.log(`⚡[bootup]: Server is running at port: 5007`)
);

module.exports = app;
