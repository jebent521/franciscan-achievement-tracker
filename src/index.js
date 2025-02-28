const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const connection = require('./data/connection');
const Repository = require('./data/repository');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connection.testConnection();

const swaggerDocument = YAML.load('src/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => res.send('Barons of Progress 📈 Homepage'));

app.get('/api/achievements', async (req, res) => {
  const repository = new Repository('achievements');
  const result = await repository.read();
  if (result.error) console.error(result.error);
  res.status(result.status).send(result.message);
});

app.get('/api/achievements/:id', async (req, res) => {
  const repository = new Repository('achievements');
  const result = await repository.readById(req.params.id);
  if (result.error) console.error(result.error);
  res.status(result.status).send(result.message);
});

app.listen(5007, () =>
  console.log(`⚡[bootup]: Server is running at port: 5007`)
);
