# Franciscan Achievement Tracker

App where Franciscan students can track achievements earned in their time at
Franciscan. Achievements range from simple to silly & elaborate.

### Team Members
- Miguel Lock
- Evan Whitmer
- Jonah Ebent

## Technical Details
### Server Stack
- **Database:** PostgreSQL
  - **Database Version Control:** Flyway
- **Backend:** Express.js

### Data Storage
- All JSON

### Development
- **IDE:** VS Code
- **Database Client:** [dBeaver](https://dbeaver.io/download/)

## Getting Started
### Installation Instructions
#### Installing psql
```
sudo apt update
sudo apt install postgresql-client
```

#### Installing Flyway
Create a directory to put flyway's files. I would recommend putting it in
`~/dev` (outside the project directory).

Run this command from `~/dev`:
```
wget -qO- https://download.red-gate.com/maven/release/com/redgate/flyway/flyway-commandline/11.3.0/flyway-commandline-11.3.0-linux-x64.tar.gz | tar -xvz && sudo ln -s `pwd`/flyway-11.3.0/flyway /usr/local/bin
```
It downloads Flyway and adds it to your path.

#### Installing Docker
Visit the official site [here](https://docs.docker.com/desktop/)

### Development
#### Starting the Database
```
./database_setup.sh
```

#### Starting the Server (in Docker)
```
./build_and_run_server.sh
```
#### Starting the Server (locally)
```
npm install
npm run dev
```
Note:
 - npm run dev runs in dev mode with nodemon
 - npm run start runs without nodemon

### Run Test with Jest
```
npm test
```

### View API Documentation
After starting the backend you should be able to navigate to this URL:
http://localhost:5007/api-docs to view the API documentation.

### Resources
- [Connect Express to Postgres](https://medium.com/@eslmzadpc13/how-to-connect-a-postgres-database-to-express-a-step-by-step-guide-b2fffeb8aeac)
- Basic Express Setup:
  - [MDN Express/Node.js Development Environment](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/development_environment)
  - [Creating a Basic Website with Express.js](https://dev.to/aurelkurtula/creating-a-basic-website-with-expressjs-j92)
  - [Setting up Node.js and Express Development Environment](https://www.geeksforgeeks.org/how-to-set-up-your-node-js-and-express-development-environment/)