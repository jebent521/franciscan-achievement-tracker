const express = require('express'),
app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/',
  (req, res) => res.send('Barons of Progress 📈 Homepage'))

app.get('/api/achievements', (req, res) => {
  console.log('achievemets');

  res.send(allAchievementsList);
});

app.get('/api/achievements/:id', (req, res) => {
  const achievement = allAchievementsList.find(a => a.id === parseInt(req.params.id));
  res.send(achievement || { error: 'Achievement not found', id: "404"});
});

class PossibleAchievements {
  constructor(id, name, description, points) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.points = points;
  }
}

const allAchievementsList = [
  new PossibleAchievements(1, 'The Source and The Summit', 'Attend Mass on Campus', 10),
  new PossibleAchievements(2, 'Cafarrhea', 'Eat at the Caf', 20),
  new PossibleAchievements(3, 'Lets Shake Things Up', 'Eat at the Pub', 20)
];

app.listen(5007,
  () => console.log(`⚡[bootup]: Server is running at port: 5007`));