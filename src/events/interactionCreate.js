const userModel = require("../util/Models/userModel");
module.exports = async (client, interaction) => {
  const user = await userModel.findOne({ userID: interaction.user.id });

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
        if (err) console.error(err);
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
      const statsMap = {
        wouldyourather: "wouldyou.used.command",
        neverhaveiever: "neverhaveiever.used.command",
        higherlower: "higherlower.used.command",
        wwyd: "whatwouldyoudo.used.command",
      };

      if (!user) {
        await userModel.create({
          userID: interaction.user.id,
          [statsMap[interaction.commandName]]: 1,
        });
      } else {
        // Get the field path based on the command name
        const fieldPath = statsMap[interaction.commandName];

        if (fieldPath) {
          // Increment the specified field using $inc
          await userModel.updateOne(
            { userID: interaction.user.id }, // Specify the query to find the user
            { $inc: { [fieldPath]: 1 } }, // Use computed fieldPath
            { upsert: true },
          );
        }
      }

      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        command.execute(interaction, client, guildDb);
      } catch (err) {
        if (err) console.error(err);
        interaction.reply({
          content: "An error occurred while trying to execute that command.",
          ephemeral: true,
        });
      }
    } else if (interaction.isButton()) {
      let button = client.buttons.get(interaction.customId);

      const customId = interaction.customId.split("_");

      if (customId[3]) {
        if (
          customId[2] === "neverhaveiever" ||
          customId[2] === "wouldyourather"
        ) {
          const action = customId[3] == 0 ? "yes" : "no";
          const commandName = customId[2];
          const fieldName = `${commandName}.${action}`;

          if (!user) {
            // If the user doesn't exist, create a new one with the userID

            await userModel.create(
              { userID: interaction.user.id }, // Specify the query to find the user
              { $inc: { [fieldName]: 1 } }, // Use computed fieldPath
              { upsert: true },
            );
          } else {
            // Increment the specified field using $inc
            await userModel.updateOne(
              { userID: interaction.user.id },
              { $inc: { [fieldName]: 1 } },
              { upsert: true },
            );
          }
        }
      }

      const replyMap = {
        wouldyourather: "wouldyou.used.replay",
        neverhaveiever: "neverhaveiever.used.replay",
        higherlower: "higherlower.used.replay",
        wwyd: "whatwouldyoudo.used.replay",
      };

      if (!user) {
        await userModel.create({
          userID: interaction.user.id,
          [replyMap[interaction.customId]]: 1,
        });
      } else {
        // Get the field path based on the command name
        const fieldPath = replyMap[interaction.commandName];

        if (fieldPath) {
          // Increment the specified field using $inc
          await userModel.updateOne(
            { userID: interaction.user.id }, // Specify the query to find the user
            { $inc: { [fieldPath]: 1 } }, // Use computed fieldPath
            { upsert: true },
          );
        }
      }

      if (interaction.customId.startsWith("voting_"))
        button = client.buttons.get("voting");
      if (interaction.customId.startsWith("result_"))
        button = client.buttons.get("result");
      if (interaction.customId.startsWith("higher_"))
        button = client.buttons.get("higher");
      if (interaction.customId.startsWith("lower_"))
        button = client.buttons.get("lower");
      if (!button)
        return interaction
          .reply({
            content: "Please use the command again.",
            ephemeral: true,
          })
          .catch(() => {});

      if (
        restrict.includes(interaction.customId) ||
        interaction.customId.startsWith("voting_") ||
        interaction.customId.startsWith("result_") ||
        interaction.customId.startsWith("higher_") ||
        interaction.customId.startsWith("lower_")
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
          .catch(() => {});
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
          .catch(() => {});
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
        if (err) console.error(err);
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
