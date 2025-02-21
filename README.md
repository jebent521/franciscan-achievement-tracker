# Franciscan Achievement Tracker

App where Franciscan students can track achievements earned in their time at
Franciscan. Achievements range from simple to silly & elaborate.

### Team Members

- Miguel Lock
- Evan Whitmer
- Jonah Ebent

## Technical Details

### Server Stack

- **Database:** PostgreSQL (with Flyway for version control)
- **Backend:** Express.js
- **Data Storage:** All JSON

### Development Tools

- **IDE:** VS Code
- **Database Client:** [dBeaver](https://dbeaver.io/download/)

## Getting Started

#### Install Dependencies

```sh
sudo apt update
sudo apt install net-tools postgresql-client
```

#### Install Flyway

Create a directory to put flyway's files. I would recommend putting it in
`~/dev` (outside the project directory).

Run this command from `~/dev` to download Flyway and addd it to your path:

```sh
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
You must delete old docker containers and run the "Starting the Database" and "Starting the Server" sh files after each merge.

### Starting the Database

```sh
bin/database_setup.sh
```

Run `database_setup.sh -h` for usage options.

### Starting the Server

#### In Docker

```sh
bin/build_and_run_server.sh
```

#### Locally

```sh
npm install
npm run dev
```

- `npm run dev` runs in dev mode with nodemon
- `npm run start` runs without nodemon

### View API Documentation

Navigate to: http://localhost:5007/api-docs after starting the backend.

## Run Tests:

Run all tests:

```sh
npm test
```

Run API tests:

```sh
npm run test:api
```

Run Unit tests:

```sh
npm run test:unit
```
