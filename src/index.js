// imports achievements class from seperate file
const Achievement = require('./achievement');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const app = express();

const swaggerDocument = YAML.load('src/swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ... rest of your code

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/',
    (req, res) => res.send('Barons of Progress 📈 Homepage'))

app.get('/api/achievements', (req, res) => {
    console.log('achievemets');

    res.send(allAchievementsList);
});

app.get('/api/achievements/:id', (req, res) => {
    const Achievement = allAchievementsList.find(a => a.id === parseInt(req.params.id));
    if (Achievement) {
        res.send(achievement);
    } else {
        res.status(404).send('Achievement not found');
    }
});

const allAchievementsList = [
    new Achievement(1, 'The Source and The Summit', "Franny Basics", 'Attend Mass on Campus', null, 10),
    new Achievement(2, 'Cafarrhea', "Franny Basics", 'Eat at the Caf', null, 20),
    new Achievement(3, 'Lets Shake Things Up', "Franny Basics", 'Eat at the Pub', null, 20)
];

app.listen(5007,
    () => console.log(`⚡[bootup]: Server is running at port: 5007`));