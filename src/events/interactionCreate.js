const Sentry = require("@sentry/node");

module.exports = async (client, interaction) => {
  const restrict = [
    "dailyChannel",
    "deleteDailyRole",
    "welcomeType",
    "welcomeTest",
    "selectMenuWelcomeType",
    "replayType",
    "replayDelete",
    "replayDeleteChannels",
    "replayChannels",
    "selectMenuReplay",
    "welcomeChannel",
    "dailyInterval",
    "dailyType",
    "replayCooldown",
    "welcomePing",
    "welcome",
    "welcomeChannel",
    "dailyRole",
    "dailyTimezone",
    "dailyMsg",
    "dailyThread",
    "votemodal",
    "paginateFirst",
    "paginatePrev",
    "paginateNext",
    "paginateLast",
  ];
  if (!interaction.guild) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      if (command?.requireGuild)
        return interaction.reply({
          content:
            "This command is only usable on a Discord Server!\nYou want to test Would You? Join the support server!\nhttps://discord.gg/vMyXAxEznS",
          ephemeral: true,
        });

      try {
        command.execute(interaction, client, null);
      } catch (err) {
        Sentry.captureException(err);
        return interaction.reply({
          content: "An error occurred while trying to execute that command.",
          ephemeral: true,
        });
      }
    }
  } else {
    const guildDb = await client.database.getGuild(interaction.guild.id, true);
    // const { inter } = require(`../languages/${guildDb.language || "en_EN"}.json`);
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        command.execute(interaction, client, guildDb);
      } catch (err) {
        Sentry.captureException(err);
        interaction.reply({
          content: "An error occurred while trying to execute that command.",
          ephemeral: true,
        });
      }
    } else if (interaction.isButton()) {
      let button = client.buttons.get(interaction.customId);
      if (interaction.customId.startsWith("voting_"))
        button = client.buttons.get("voting");
      if (interaction.customId.startsWith("result_"))
        button = client.buttons.get("result");
      if (!button)
        return interaction
          .reply({
            content: "Please use the command again.",
            ephemeral: true,
          })
          .catch((err) => {Sentry.captureException(err);});

      if (
        restrict.includes(interaction.customId) ||
        interaction.customId.startsWith("voting_") ||
        interaction.customId.startsWith("result_")
      )
        return button.execute(interaction, client, guildDb);
      if (
        guildDb.replayType === "Guild" &&
        client.used.has(interaction.user.id)
      ) {
        return interaction
          .reply({
            ephemeral: true,
            content: `You can use this button again <t:${Math.floor(
              client.used.get(interaction.user.id) / 1000,
            )}:R>!`,
          })
          .catch((err) => {Sentry.captureException(err);});
      } else if (
        guildDb.replayType === "Channels" &&
        client.used.has(`${interaction.user.id}-${interaction.channel.id}`) &&
        guildDb.replayChannels.find((x) => x.id === interaction.channel.id)
      ) {
        return interaction
          .reply({
            ephemeral: true,
            content: `<t:${Math.floor(
              guildDb.replayChannels.find(
                (x) => x.id === interaction.channel.id,
              ).cooldown /
                1000 +
                Date.now() / 1000,
            )}:R> you can use buttons again!`,
          })
          .catch((err) => {Sentry.captureException(err);});
      }

      try {
        if (
          !interaction.customId.startsWith("voting_") &&
          !interaction.customId.startsWith("result_")
        ) {
          if (
            guildDb.replayType === "Channels" &&
            guildDb.replayChannels.find((x) => x.id === interaction.channel.id)
          ) {
            client.used.set(
              `${interaction.user.id}-${interaction.channel.id}`,
              Date.now() +
                guildDb.replayChannels.find(
                  (x) => x.id === interaction.channel.id,
                ).cooldown,
            );
            setTimeout(
              () =>
                client.used.delete(
                  `${interaction.user.id}-${interaction.channel.id}`,
                ),
              guildDb.replayChannels.find(
                (x) => x.id === interaction.channel.id,
              ).cooldown,
            );
          } else {
            client.used.set(
              interaction.user.id,
              Date.now() + guildDb.replayCooldown,
            );
            setTimeout(
              () => client.used.delete(interaction.user.id),
              guildDb.replayCooldown,
            );
          }
        }

        return button.execute(interaction, client, guildDb);
      } catch (err) {
        Sentry.captureException(err);
        return interaction.reply({
          content: "An error occurred while trying to execute that command.",
          ephemeral: true,
        });
      }
    } else {
      const button = client.buttons.get(interaction.customId);
      if (button) return button.execute(interaction, client, guildDb);
    }
  }
};
