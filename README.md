<div align="center">

![Would You Banner](https://i.imgur.com/HSsvZMe.png)

[Website](https://wouldyoubot.com) • [Support](https://wouldyoubot.gg/discord) • [Invite](https://wouldyoubot.gg/invite) • [Vote](https://top.gg/bot/981649513427111957/vote) • [ToS](https://wouldyoubot.gg/terms) • [Privacy](https://wouldyoubot.gg/privacy)

---

Would You bot provides activities and questions to keep your server active!

---

</div>

# Getting Started

## Starting the Development Environment

The development environment does not currently use Docker, so you will need to install the dependencies manually.

1. Install [Node.js](https://nodejs.org/en/) (version 17.9.x or higher) and npm.
2. Install all dependencies by running `npm install` in the root directory.
3. Create a `.env` file in the root directory, copy the contents of `.env.example` into `.env`, then fill in the values with your own values.
4. Run `npm run test` to start the development environment. This will run all of the applications in development mode.

### Formatting

Before committing, make sure to run `npm format` to format the code. This will also be run automatically when you commit, but it is better to run it manually to make sure you don't commit code that isn't formatted correctly. You can also run `npm format` to check if the code is formatted correctly. This will not format the code, it will only check if the code is formatted correctly.

Additionally, it is recommended to install the [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extension for VS Code. This will automatically format the code when you save (or based on the event you choose).

### Committing

Follow the Angular commit message format. See [here](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines) for more information.

### NPM Scripts

You can run the below scripts with `npm run <script>`.

| Script         | Description                                                          |
| -------------- | -------------------------------------------------------------------- |
| `start`        | Runs the code in production mode                                     |
| `dev`          | Runs the code using nodemon in dev mode                              |
| `format`       | Formats the code.                                                    |

### Discord logs

Logs are also sent to discord to allow for easier and more accessible debugging, as not everyone will have access to the host system, especially in production. The channels for the different log levels are defined in the `.env` file.

# Security and Protection

## Encryption

Sensitive data is encrypted using the `cryptr` module. The encryption info is defined in the `.env` file. The encrypted data is stored in the database. When the data is retrieved from the database, it is decrypted using the same key and iv that was used to encrypt it.

# Project Details

## Contributing

If you would like to contribute to the project, please read the [contributing guidelines](/.github/CODE_OF_CONDUCT.md). If you have any questions, feel free to ask in the [support server](https://wouldyoubot.gg/discord).

## License

This project is licensed under the [MIT License](/LICENSE).
