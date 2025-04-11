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

### Install Dependencies

```sh
sudo apt update
sudo apt install net-tools postgresql-client
```

### Install Flyway

Create a directory to put flyway's files. I would recommend putting it in
`~/dev` (outside the project directory).

Run this command from `~/dev` to download Flyway and addd it to your path:

```sh
wget -qO- https://download.red-gate.com/maven/release/com/redgate/flyway/flyway-commandline/11.3.0/flyway-commandline-11.3.0-linux-x64.tar.gz | tar -xvz && sudo ln -s `pwd`/flyway-11.3.0/flyway /usr/local/bin
```

### Create a .env.keys file in the root directory

The content of this file must not be checked into source control for security. dotenvx requires the .env.keys file to unencrypt the .env file contents.

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

**Note**: this project is using `Prettier` to ensure consistent formatting
throughout. The recommended `settings.json` should set VSCode to automatically
format the files each time you save them. You can check the project's formatting
and format it from the command line with:

```sh
npx prettier -c . # to check formatting
npx prettier -w . # to automatically format the project
```

#### Recommended launch.json:

```JSON
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program with dotenvx and nodemon",
      "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/dotenvx",
      "runtimeArgs": [
        "run",
        "-f",
        ".env.dev",
        "--",
        "${workspaceFolder}/node_modules/.bin/nodemon"
      ],
      "args": ["${workspaceFolder}/src/index.js"],
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

## Development

The database should only need to be re-built if there are schema changes,
and the server should only need to be rebuilt if there are changes made to
the Dockerfile.

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

## OAuth Integration

The application uses Microsoft Identity Platform for authentication.
Contact mlock002@student.franciscan.edu (203) 300-0237 to have Microsoft application settings changed.
The following routes handle the OAuth flow and user information:

### Authentication Routes

| Route                | Method | Description                                                |
| -------------------- | ------ | ---------------------------------------------------------- |
| `/auth/signin`       | GET    | Initiates the OAuth sign-in flow with Microsoft Identity   |
| `/auth/success`      | GET    | Handles successful authentication and user creation/lookup |
| `/auth/acquireToken` | GET    | Acquires a fresh access token when the current one expires |
| `/auth/redirect`     | POST   | Callback endpoint that handles the OAuth response          |
| `/auth/id`           | GET    | Returns the user's ID token claims                         |
| `/auth/profile`      | GET    | Returns the user profile from Microsoft Graph API          |

### Authentication Flow

1. User is redirected to `/auth/signin` to begin authentication
2. After successful authentication, the callback redirects to `/auth/success`
3. `/auth/success` retrieves the user profile and creates/finds the user in the database
4. If an access token expires when accessing protected resources, the API returns a 401 with `redirect: '/auth/acquireToken'`
5. Protected routes will return a 401 error with `redirect: '/auth/signin'` if a user is not authenticated
