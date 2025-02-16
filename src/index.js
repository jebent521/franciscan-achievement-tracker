// imports achievements class from seperate file
const Achievement = require('./models/achievement');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const connection = require('./data/connection');

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

connection.testConnection();

const swaggerDocument = YAML.load('src/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/',
    (req, res) => res.send('Barons of Progress 📈 Homepage'))

app.get('/api/achievements', async (req, res) => {
    console.log('achievements');
    try {
        const achievements = await connection.getAchievements();
        res.send(achievements);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/achievements/:id', async (req, res) => {
    // const achievement = allAchievementsList.find(a => a.id === parseInt(req.params.id));
    try {
        const achievement = await connection.getAchievements(req.params.id);
        if (achievement.length == 1) {
            res.send(achievement[0]);
        } else {
            res.status(404).send('Achievement not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

const allAchievementsList = [
    new Achievement(1, 'The Source and The Summit', "Franny Basics", 'Attend Mass on Campus', null, 10),
    new Achievement(2, 'Cafarrhea', "Franny Basics", 'Eat at the Caf', null, 20),
    new Achievement(3, 'Lets Shake Things Up', "Franny Basics", 'Eat at the Pub', null, 20)
];

app.listen(5007,
    () => console.log(`⚡[bootup]: Server is running at port: 5007`));