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

#### Install net-tools and psql

```
sudo apt update
sudo apt install net-tools
sudo apt install postgresql-client
```

#### Install Flyway

Create a directory to put flyway's files. I would recommend putting it in
`~/dev` (outside the project directory).

Run this command from `~/dev` to download Flyway and addd it to your path:

```
wget -qO- https://download.red-gate.com/maven/release/com/redgate/flyway/flyway-commandline/11.3.0/flyway-commandline-11.3.0-linux-x64.tar.gz | tar -xvz && sudo ln -s `pwd`/flyway-11.3.0/flyway /usr/local/bin
```

#### Recommended settings.json:

```JSON
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "terminal.integrated.env.linux": {
    "PATH": "${workspaceFolder}/bin:${env:PATH}"
  }
}
```

## Development

### Starting the Database

```
bin/database_setup.sh
```

### Starting the Server (in Docker)

```
bin/build_and_run_server.sh
```

#### Starting the Server (locally)

```
npm install
npm run dev
```

- `npm run dev` runs in dev mode with nodemon
- `npm run start` runs without nodemon

### View API Documentation

After starting the backend you should be able to navigate to this URL:
http://localhost:5007/api-docs to view the API documentation.

## Run Tests:

Run all tests:

```
npm test
```

Run API tests:

```
npm run test:api
```

Run Unit tests:

```
npm run test:unit
```
