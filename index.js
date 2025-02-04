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

class Achievements {
  constructor(id, title, category, description, prerequisite, points) {
    this.id = id;
    this.title = title;
    this.category = category;
    this.description = description;
    this.prerequisite = prerequisite;
    this.points = points;
  }
}

const allAchievementsList = [
  new Achievements(1, 'The Source and The Summit', "Franny Basics", 'Attend Mass on Campus', null, 10),
  new Achievements(2, 'Cafarrhea', "Franny Basics", 'Eat at the Caf', null, 20),
  new Achievements(3, 'Lets Shake Things Up', "Franny Basics", 'Eat at the Pub', null, 20)
];

app.listen(5007,
  () => console.log(`⚡[bootup]: Server is running at port: 5007`));