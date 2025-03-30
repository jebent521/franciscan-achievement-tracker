const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
var path = require('path');
var session = require('express-session');

var authRouter = require('./routes/auth');
var usersRouter = require('./routes/users');

const connection = require('./data/connection');
const achievementsRouter = require('./routes/achievements');
const groupsRouter = require('./routes/groups');
const SearchService = require('./services/search-service');

const app = express();

// Set up middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // set this to true on production
    },
  })
);

app.get('/', (_, res) => res.send('Barons of Progress 📈 Homepage'));

const swaggerDocument = YAML.load('src/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/achievements', achievementsRouter);

app.use('/api/groups', groupsRouter);

app.use('/api/users', usersRouter);

app.use('/auth', authRouter);

app.use('/users', usersRouter);

// Search
app.get('/api/search/:query', async (req, res) => {
  const result = await new SearchService().search(req);
  res.status(result.status).send(result.message);
});

app.listen(5007, () =>
  console.log(`⚡[bootup]: Server is running at port: 5007`)
);

module.exports = app;
