# Would You Bot

Would You bot is an open-source discord bot that includes activities and questions to keep your server active!

## Resources

- [Documentation](https://slekup.github.io/would-you-bot/)
- [Website](https://wouldyoubot.com)
- [Support Server](https://wouldyoubot.gg/discord)
- [Bot Invite](https://wouldyoubot.gg/invite)
- [Vote](https://top.gg/bot/981649513427111957/vote)
- [Terms of Service](https://wouldyoubot.gg/terms)
- [Privacy Policy](https://wouldyoubot.gg/privacy)

## Table of Contents

- [Would You Bot](#would-you-bot)
  - [Resources](#resources)
- [Getting Started](#getting-started)
  - [Starting the Development Environment](#starting-the-development-environment)
    - [Linting](#linting)
    - [Formatting](#formatting)
    - [NPM Scripts](#npm-scripts)
  - [Starting the Production Environment](#starting-the-production-environment)
    - [Updating the Production Environment](#updating-the-production-environment)
    - [Viewing Logs](#viewing-logs)
  - [Logging and Debugging](#logging-and-debugging)
    - [Console Logs](#console-logs)
    - [Logs Folder](#logs-folder)
    - [Discord Logs](#discord-logs)
  - [Using VS Code](#using-vs-code)
    - [Highly Recommended Extensions](#highly-recommended-extensions)
    - [Optionally Recommended Extensions](#optionally-recommended-extensions)
    - [VS Code Snippets](#vs-code-snippets)
- [Protocols and Conventions](#protocols-and-conventions)
  - [Documentation](#documentation)
  - [Other](#other)
- [Technical Details](#technical-details)
  - [Technologies Used](#technologies-used)
  - [Configuration](#configuration)
    - [Private Configuration](#private-configuration)
    - [Public Configuration](#public-configuration)
  - [Project Structure](#project-structure)
  - [CI/CD Pipeline](#cicd-pipeline)
    - [Integration](#integration)
    - [Deployment](#deployment)
- [Project Details](#project-details)
  - [Contributing](#contributing)
  - [License](#license)

# Getting Started

## Starting the Development Environment

The development environment does not currently use Docker, so you will need to install the dependencies manually.

1. Install [Node.js](https://nodejs.org/en/) (version 18 or higher).
2. Install [MongoDB](https://www.mongodb.com/try/download/community) (version 4.4 or higher).
3. Install dependencies by running `npm install`
4. Create a `.env` file in the root directory of the project, copy the contents of `.env.example` into `.env`, then fill in the values with your own values.
5. Run `npm run dev` to start the development environment

### Linting

Before committing, make sure to run `npm run lint` to lint the code. This will also be run automatically when you commit, but it is better to run it manually to make sure you don't commit code that doesn't pass linting.

> **Warning:** Do not remove any of the linting rules. If you think a rule should be removed, open an issue and explain why you think it should be removed.

### Formatting

Before committing, make sure to run `npm run format` to format the code. This will also be run automatically when you commit, but it is better to run it manually to make sure you don't commit code that isn't formatted correctly. You can also run `npm run format:check` to check if the code is formatted correctly. This will not format the code, it will only check if the code is formatted correctly.

Additionally, it is recommended to install the [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extension for VS Code. This will automatically format the code when you save (or based on the event you choose).

### NPM Scripts

You can run the below scripts with `npm run <script>`.

| Script         | Description                                                          |
| -------------- | -------------------------------------------------------------------- |
| `lint`         | Lints the code.                                                      |
| `lint:fix`     | Lints the code and fixes any fixable errors.                         |
| `clean`        | Deletes the the build directory and cleans any cache.                |
| `build`        | Builds the project.                                                  |
| `copyfiles`    | Copies the config files to the `dist` folder.                        |
| `start`        | Builds the project, copies the config files, and starts the project. |
| `dev`          | Starts the project in development mode.                              |
| `docs`         | Generates the documentation.                                         |
| `format`       | Formats the code.                                                    |
| `format:check` | Checks if the code is formatted correctly.                           |
| `migrate`      | Runs the migrations.                                                 |

## Starting the Production Environment

These instructions are for the `ubuntu` operating system. If you are using a different operating system, you will need to modify the commands to work with your operating system.

1. Install Docker. [Instructions](https://docs.docker.com/engine/install/ubuntu/)
2. Install Docker Compose. [Instructions](https://docs.docker.com/compose/install/)
3. Install Git. [Instructions](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
4. Clone the repository by running `git clone https://github.com/Would-You-Bot/client`.
5. Create a `.env` file in the root directory of the project, copy the contents of `.env.example` into `.env`, then fill in the values with your own values.
6. Add a docker user group and add your user to it. See [here](https://docs.docker.com/engine/install/linux-postinstall/) for more information.
   ```bash
   # 1. Create the docker group.
   $ sudo groupadd docker
   # 2. Add your user to the docker group.
   $ sudo usermod -aG docker $USER
   # 3. Log out and log back in so that your group membership is re-evaluated.
   $ newgrp docker
   # 4. Verify that you can run docker commands without sudo.
   $ docker run hello-world
   ```
7. Run `docker-compose up --build -d` to start the production environment.

### Updating the Production Environment

You can run `./update.sh` file in the root directory. This will pull the latest changes from the repository, rebuild the images and restart the containers.

If you would like to update an individual service, you can run `./update <service>`.

### Viewing Logs

To view the logs on the server-side, type `docker-compose logs -t -f ` in the root directory. This will show the logs for all of the services. If you would like to view the logs for a specific service, you can run `docker-compose logs -t -f <service>`.

## Logging and Debugging

### Console Logs

Logs are always outputted to the console. Debug logs are only outputted to the console in development, and if the `DEBUG` environment variable is set to `'true'`.

### Logs folder

For each instance of the main process, a new folder will be created in the `tmp/logs` folder. This folder will contain the logs for that instance. The logs will be split into multiple files, each file represents a different level of logging. the levels are `error`, `warn`, `info`, and `debug`. The logs will be split into multiple files because it makes it easier to find the logs you are looking for.

For each cluster, a further sub-folder may be made with a new set of log files just for that cluster. For example, the mentioned log level files would be in the directory: `tmp/logs/cluster-0/`.

### Discord logs

Logs are also sent to discord to allow for easier and more accessible debugging, as not everyone will have access to the host system, especially in production. The channels for the different log levels are defined in the `.env` file.

## Using VS Code

### Highly Recommended Extensions

| Extension                                                                                         | Description                                                                             |
| ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)              | Integrates ESLint into VS Code.                                                         |
| [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)            | Code formatter.                                                                         |
| [Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments) | Brings new color styles to comments, better comments prefixes are used in this project. |

### Optionally Recommended Extensions

| Extension                                                                                                | Description                                                                                                              |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| [Complete JSDoc Tags](https://marketplace.visualstudio.com/items?itemName=HookyQR.JSDocTagComplete)      | Provides code completion for JS Doc tags, only within JS Doc comment blocks so it doesn't get in the way of your coding. |
| [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens)                   | Shows errors and warnings inline in the editor.                                                                          |
| [Pretty TypeScript Errors](https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors) | Makes TypeScript errors easier to read.                                                                                  |

### VS Code Snippets

In the `.vscode` folder, there are `*.code-snippets` files. These file contains snippets that can be used in VS Code. Type `$` followed by the name of the snippet to use it. This saves time writing boilerplate code and makes it easier to follow the conventions.

# Protocols and Conventions

## Documentation

For documentation, we use [TSdoc](https://tsdoc.org/). This is a standard for documenting TypeScript code. It is similar to JSDoc, but it is more strict and has more features. In VS Code, if you type `/**` above a class or function, it will automatically generate a template for you to fill out.

Run `npm run docs` to generate the documentation. The documentation will be generated in the `docs` folder. This will be available on the [documentation website](https://slekup.github.io/would-you-bot/) via GitHub Pages.

## Other

- When defining class functions, use `public` and `private` to indicate whether the function is meant to be used outside of the class or not.

# Technical Details

## Technologies Used

- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [MongoDB](https://www.mongodb.com/)
- [Docker](https://www.docker.com/)
- [Discord.js](https://discord.js.org/#/)

## Configuration

### Private configuration

Private configuration is done using environment variables. The environment variables are defined in the `.env.example` file. To use them, create a `.env` file in the root directory of the project, copy the contents of `.env.example` into `.env`, then fill in the values with your own values.

### Public configuration

Public configuration is done using the `config` folder. The `config` folder contains yaml files that contain configuration values. These values are loaded into the `Config` class in the `src/config.ts` file. The initialized `config` class is then used throughout the project to access the configuration values and custom functions. You can see what is expected in the yaml file by looking at `src/config.ts` and `src/typings/config.ts`.

The `emojis.yaml` file expects emoji values with the full discord emoji string. For example:

```yaml
# emojis.yaml
yes: <:yes:123456789012345678>
no: <:no:123456789012345678>
```

The config file will convert each emoji string into an emoji object which contains the id and full values.

## Project Structure

```
.
├── .git
├── .github
├── .vscode
│   ├── settings.json
│   └── *.code-snippets
├── config
├── dist
├── docs
├── node_modules
├── src
│   ├── constants
│   │   ├── fonts
│   │   ├── images
│   │   ├── languages
│   │   └── *.json
│   ├── events
│   ├── interactions
│   │   ├── buttons
│   │   └── commands
│   ├── interfaces
│   ├── models
│   ├── typings
│   ├── utils
│   │   ├── classes
│   │   ├── client
│   │   ├── functions
│   │   └── start
│   ├── app.ts
│   ├── client.ts
│   ├── cluster.ts
│   └── config.ts
├── .dockerignore
├── .env
├── .env.example
├── .eslintignore
├── .eslintrc.js
├── .gitattributes
├── .gitignore
├── .CODE_OF_CONDUCT.md
├── docker-compose.yml
├── Dockerfile
├── environment.d.ts
├── LICENSE
├── package-lock.json
├── package.json
├── prettier.config.js
├── README.md
├── register.cjs
├── tsconfig.json
└── update.sh
```

## CI/CD Pipeline

The CI/CD pipeline is done using GitHub Actions. The workflow files are located in the `.github/workflows` folder. The workflow files are named based on what they do or their purpose.

### Integration

**`pipeline-ci.yml`**

This workflow is run on every push and pull request to every branch in the repository. It will install dependencies, lint the code, compile the code, and format the code. If any of these steps fail, the workflow will send the error log to a discord channel via a webhook with some brief details and a pastebin link including the full error log.

These are the GitHub secrets you must add to your repository in order for it to work.

| Secret Name           | Description                                           |
| --------------------- | ----------------------------------------------------- |
| `DISCORD_WEBHOOK_URL` | The webhook URL to send the error logs to.            |
| PASTEBIN_API_KEY      | The Pastebin API key to use to upload the error logs. |

### Deployment

**`pipeline-cd.yml`**

This workflow is run on every pull request to the `main` branch. It will install dependencies, lint the code, compile the code, format the code, build the docker images, push the docker images to a docker registry, and deploy the new images to the production server. If any of these steps fail, the workflow will send the error log to a discord channel via a webhook with some brief details and a pastebin link including the full error log.

These are the GitHub secrets you must add to your repository in order for it to work.

| Secret Name           | Description                                           |
| --------------------- | ----------------------------------------------------- |
| `DISCORD_WEBHOOK_URL` | The webhook URL to send the error logs to.            |
| PASTEBIN_API_KEY      | The Pastebin API key to use to upload the error logs. |
| DOCKER_USERNAME       | The username to use to login to the docker registry.  |
| DOCKER_PASSWORD       | The password to use to login to the docker registry.  |

# Project Details

## Contributing

If you would like to contribute to the project, please read the [contributing guidelines](/CODE_OF_CONDUCT.md). If you have any questions, feel free to ask in the [support server](https://wouldyoubot.gg/discord).

## License

This project is licensed under a [Custom License](/LICENSE).
