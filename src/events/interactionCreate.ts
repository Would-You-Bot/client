import { ButtonInteraction, Interaction } from "discord.js";
import { Event } from "../models";
import { UserModel } from "../util/Models/userModel";
import WouldYou from "../util/wouldYou";
import { captureException } from "@sentry/node";

const event: Event = {
  event: "interactionCreate",
  execute: async (client: WouldYou, interaction: Interaction) => {
    if (!interaction || !interaction.channel) return;

    const user = await UserModel.findOne({ userID: interaction.user.id });

    if (!user) {
      await UserModel.create({
        userID: interaction.user.id,
      });
    }

    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!interaction.guild) {
        if (command?.requireGuild) {
          interaction.reply({
            content:
              "This command is only usable on a Discord Server!\nYou want to test Would You? Join the support server!\nhttps://discord.gg/vMyXAxEznS",
            ephemeral: true,
          });
        }
      }

      const guildDb = await client.database.getGuild(
        interaction.guild?.id as string,
        true,
      );

      client.database
        .updateGuild(interaction.guildId as string, {
          lastUsageTimestamp: Date.now(),
        })
        .then(() => {});

      if (!guildDb || !command) return;
      const statsMap = {
        wouldyourather: "wouldyourather.used.command",
        neverhaveiever: "neverhaveiever.used.command",
        higherlower: "higherlower.used.command",
        wwyd: "whatwouldyoudo.used.command",
        truth: "truth.used.command",
        dare: "dare.used.command",
        random: "random.used.command",
      } as Record<string, string>;
      // Get the field path based on the command name
      const fieldPath = statsMap[interaction.commandName];
      if (fieldPath) {
        // Increment the specified field using $inc

        await UserModel.updateOne(
          { userID: interaction.user.id }, // Specify the query to find the user
          { $inc: { [fieldPath]: 1 } }, // Use computed fieldPath
        );
      }

      await command.execute(interaction, client, guildDb).catch((err) => {
        captureException(err);
        interaction.reply({
          content: "An error occurred while trying to execute that command.",
          ephemeral: true,
        });
        return;
      });
    } else if (interaction.isButton()) {
      const guildDb = await client.database.getGuild(
        interaction.guild?.id as string,
        true,
      );
      if (!guildDb) return;
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

          // Increment the specified field using $inc
          await UserModel.updateOne(
            { userID: interaction.user.id },
            { $inc: { [fieldName]: 1 } },
          );
        }
      }

      const replyMap = {
        wouldyourather: "wouldyourather.used.replay",
        neverhaveiever: "neverhaveiever.used.replay",
        higherlower: "higherlower.used.replay",
        wwyd: "whatwouldyoudo.used.replay",
        truth: "truth.used.replay",
        dare: "dare.used.replay",
        random: "random.used.replay",
      } as Record<string, string>;

      // Get the field path based on the command name
      const fieldPath = replyMap[interaction.customId];

      if (fieldPath) {
        // Increment the specified field using $inc
        await UserModel.updateOne(
          { userID: interaction.user.id }, // Specify the query to find the user
          { $inc: { [fieldPath]: 1 } }, // Use computed fieldPath
        );
      }

      if (interaction.customId.startsWith("wycustom_add"))
        button = client.buttons.get("wycustom_add");
      if (interaction.customId.startsWith("wycustom_remove"))
        button = client.buttons.get("wycustom_remove");
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
          .catch((err) => {
            captureException(err);
          });
        return;
      }

      const restrict = [
        "dailyChannel",
        "deleteDailyRole",
        "welcomeType",
        "welcomeTest",
        "selectMenuWelcomeType",
        "replayType",
        "replayBy",
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
        "privacy",
      ];

      if (
        restrict.includes(interaction.customId) ||
        interaction.customId.startsWith("voting_") ||
        interaction.customId.startsWith("result_") ||
        interaction.customId.startsWith("higher_") ||
        interaction.customId.startsWith("lower_")
      ) {
        return button.execute(
          interaction as ButtonInteraction,
          client,
          guildDb,
        );
      }

      if (
        guildDb.replayBy === "Guild" &&
        client.used.has(interaction.guild?.id)
      ) {
        interaction
          .reply({
            ephemeral: true,
            content: `You can use this button again <t:${Math.floor(
              client.used.get(interaction.guild?.id) / 1000,
            )}:R>!`,
          })
          .catch((err) => {
            captureException(err);
          });
        return;
      } else {
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
            .catch((err) => {
              captureException(err);
            });
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
            .catch((err) => {
              captureException(err);
            });
          return;
        }
      }

      try {
        if (
          !interaction.customId.startsWith("voting_") &&
          !interaction.customId.startsWith("result_")
        ) {
          if (guildDb.replayBy === "User") {
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
          } else {
            client.used.set(
              interaction.guild?.id,
              Date.now() + guildDb.replayCooldown,
            );

            setTimeout(
              () => client.used.delete(interaction?.guild!.id),
              guildDb.replayCooldown,
            );
          }
        }

        return button.execute(
          interaction as ButtonInteraction,
          client,
          guildDb,
        );
      } catch (err) {
        if (err) console.error(err);
        interaction.reply({
          content: "An error occurred while trying to execute that command.",
          ephemeral: true,
        });
        return;
      }
    } else if (
      interaction.isStringSelectMenu() ||
      interaction.isUserSelectMenu() ||
      interaction.isRoleSelectMenu() ||
      interaction.isMentionableSelectMenu() ||
      interaction.isChannelSelectMenu()
    ) {
      const guildDb = await client.database.getGuild(
        interaction.guild?.id as string,
        true,
      );
      if (!guildDb) return;

      const selectMenu = client.buttons!.get(interaction.customId);

      if (!selectMenu) {
        interaction.reply({
          content: "An error occurred while trying to execute that command.",
          ephemeral: true,
        });

        return;
      }

      return selectMenu.execute(interaction as any, client, guildDb);
    }
  },
};

export default event;
