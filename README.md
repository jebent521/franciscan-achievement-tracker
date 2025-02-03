# Franciscan Achievement Tracker

## Team Members
- Miguel Lock
- Evan Whitmer
- Jonah Ebent

## Project Summary
App where Franciscan students can track achievements earned in their time at Franciscan. Achievemnts range from simple to silly & elaborate.

## Technical Details

### Data Storage
- All JSON

### Server Stack
- **Database:** PostgreSQL
  - **Database Version Control**: Flyway
- **Backend:** Express.js

### Development
- **IDE:** VS Code

#### Installing Flyway
Create a directory to put flyway's files. I would recommend putting it in `~/dev`.

Run this command from `~/dev`:
```bash
wget -qO- https://download.red-gate.com/maven/release/com/redgate/flyway/flyway-commandline/11.3.0/flyway-commandline-11.3.0-linux-x64.tar.gz | tar -xvz && sudo ln -s `pwd`/flyway-11.3.0/flyway /usr/local/bin
```
It downloads Flyway and adds it to your path.

#### Installing Docker
Visit the official site [here](https://docs.docker.com/desktop/)

#### Starting the Database
Run `./database_setup.sh`

### Resources
- [Connect Express to Postgres](https://medium.com/@eslmzadpc13/how-to-connect-a-postgres-database-to-express-a-step-by-step-guide-b2fffeb8aeac)
- Basic Express Setup:
  - [MDN Express/Node.js Development Environment](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/development_environment)
  - [Creating a Basic Website with Express.js](https://dev.to/aurelkurtula/creating-a-basic-website-with-expressjs-j92)
  - [Setting up Node.js and Express Development Environment](https://www.geeksforgeeks.org/how-to-set-up-your-node-js-and-express-development-environment/)