const Sentry = require("@sentry/node");

module.exports = {
  data: {
    name: "welcomeTest",
    description: "Welcome Test",
  },
  async execute(interaction, client, guildDb) {
      client.emit("guildMemberAdd", interaction);

      interaction.reply({content: "Welcome test has been sent!", ephemeral: true }).catch((err) => { Sentry.captureException(err) });
  },
};
