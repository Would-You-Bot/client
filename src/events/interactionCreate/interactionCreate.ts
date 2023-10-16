import { ButtonInteraction, CacheType, Interaction } from "discord.js";
import { Event } from "../../models/event";
import { IGuildModel } from "../../util/Models/guildModel";
import { UserModel } from "../../util/Models/userModel";
import WouldYou from "../../util/wouldYou";

const event: Event = {
  event: "interactionCreate",
  execute: async (client: WouldYou, interaction: Interaction<CacheType>) => {
    const user = await UserModel.findOne({ userID: interaction.user.id });
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
      "paginateLast",
      "paginateNext",
      "paginatePrev",
    ];
    if (!interaction.guild) {
      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        if (command?.requireGuild) {
          interaction.reply({
            content:
              "This command is only usable on a Discord Server!\nYou want to test Would You? Join the support server!\nhttps://discord.gg/vMyXAxEznS",
            ephemeral: true,
          });
          return;
        }

        try {
          await command.execute(interaction, client, {} as IGuildModel);
          return;
        } catch (err) {
          if (err) console.error(err);
          interaction.reply({
            content: "An error occurred while trying to execute that command.",
            ephemeral: true,
          });
          return;
        }
      }
    } else {
      const guildDb = await client.database.getGuild(
        interaction.guild.id,
        true,
      );
      if (!guildDb) return;
      // const { inter } = require(`../languages/${guildDb.language || "en_EN"}.json`);
      if (interaction.isChatInputCommand()) {
        const statsMap = {
          wouldyourather: "wouldyou.used.command",
          neverhaveiever: "neverhaveiever.used.command",
          higherlower: "higherlower.used.command",
          wwyd: "whatwouldyoudo.used.command",
        } as any;

        if (!user) {
          await UserModel.create({
            userID: interaction.user.id,
            [statsMap[interaction.commandName]]: 1,
          });
        } else {
          // Get the field path based on the command name
          const fieldPath = statsMap[interaction.commandName];

          if (fieldPath) {
            // Increment the specified field using $inc
            await UserModel.updateOne(
              { userID: interaction.user.id }, // Specify the query to find the user
              { $inc: { [fieldPath]: 1 } }, // Use computed fieldPath
              { upsert: true },
            );
          }
        }

        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        try {
          await command.execute(interaction, client, guildDb);
          return;
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
            const action = Number(customId[3]) == 0 ? "yes" : "no";
            const commandName = customId[2];
            const fieldName = `${commandName}.${action}`;

            if (!user) {
              // If the user doesn't exist, create a new one with the userID

              await UserModel.create(
                { userID: interaction.user.id }, // Specify the query to find the user
                { $inc: { [fieldName]: 1 } }, // Use computed fieldPath
                { upsert: true },
              );
            } else {
              // Increment the specified field using $inc
              await UserModel.updateOne(
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
        } as any;

        if (!user) {
          await UserModel.create({
            userID: interaction.user.id,
            [replyMap[interaction.customId]]: 1,
          });
        } else {
          // Get the field path based on the command name
          const fieldPath = replyMap[(interaction as any).commandName];

          if (fieldPath) {
            // Increment the specified field using $inc
            await UserModel.updateOne(
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
        if (!button) {
          interaction
            .reply({
              content: "Please use the command again.",
              ephemeral: true,
            })
            .catch(() => {});
          return;
        }

        if (
          restrict.includes(interaction.customId) ||
          interaction.customId.startsWith("voting_") ||
          interaction.customId.startsWith("result_") ||
          interaction.customId.startsWith("higher_") ||
          interaction.customId.startsWith("lower_")
        ) {
          button.execute(interaction, client, guildDb);
          return;
        }
        if (
          guildDb.replayType === "Guild" &&
          client.used.has(interaction.user.id)
        ) {
          interaction
            .reply({
              ephemeral: true,
              content: `You can use this button again <t:${Math.floor(
                client.used.get(interaction.user.id) / 1000,
              )}:R>!`,
            })
            .catch(() => {});
          return;
        } else if (
          guildDb.replayType === "Channels" &&
          client.used.has(
            `${interaction.user.id}-${interaction.channel?.id}`,
          ) &&
          guildDb.replayChannels.find((x) => x.id === interaction.channel?.id)
        ) {
          var cooldown = Number(
            guildDb.replayChannels.find((x) => x.id === interaction.channel?.id)
              ?.cooldown,
          );
          interaction
            .reply({
              ephemeral: true,
              content: `<t:${Math.floor(
                cooldown / 1000 + Date.now() / 1000,
              )}:R> you can use buttons again!`,
            })
            .catch(() => {});
          return;
        }

        try {
          if (
            !interaction.customId.startsWith("voting_") &&
            !interaction.customId.startsWith("result_")
          ) {
            if (
              guildDb.replayType === "Channels" &&
              guildDb.replayChannels.find(
                (x) => x.id === interaction.channel?.id,
              )
            ) {
              client.used.set(
                `${interaction.user.id}-${interaction.channel?.id}`,
                Date.now() +
                  (Number(
                    guildDb.replayChannels.find(
                      (x) => x.id === interaction.channel?.id,
                    )?.cooldown,
                  ) || 0),
              );
              setTimeout(
                () =>
                  client.used.delete(
                    `${interaction.user.id}-${interaction.channel?.id}`,
                  ),
                Number(
                  guildDb.replayChannels.find(
                    (x) => x.id === interaction.channel?.id,
                  )?.cooldown,
                ),
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

          button.execute(interaction, client, guildDb);
          return;
        } catch (err) {
          if (err) console.error(err);
          interaction.reply({
            content: "An error occurred while trying to execute that command.",
            ephemeral: true,
          });
          return;
        }
      } else {
        const button = client.buttons.get((interaction as any).customId);
        if (button)
          return await button.execute(interaction as any, client, guildDb);
      }
    }
  },
};

export default event;
