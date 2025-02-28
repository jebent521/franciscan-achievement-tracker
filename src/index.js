require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const connection = require('./data/connection');
const Repository = require('./data/repository');

const PORT = +process.env.PORT || 5007;
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

// Post Method to create new achievement
app.post('/api/achievements', async (req, res) => {
  const repository = new Repository('achievements');
  const result = await repository.create(req.body);
  if (result.error) console.error(result.error);
  res.status(result.status).send(result.message);
});

app.delete('/api/achievements/:id', async (req, res) => {
  const repository = new Repository('achievements');
  const result = await repository.delete(req.params.id);
  if (result.error) console.error(result.error);
  res.status(result.status).send(result.message);
});

if (require.main === module) {
  app.listen(5007, () =>
    console.log(`⚡[bootup]: Server is running at port: 5007`)
  );
}

module.exports = app;
