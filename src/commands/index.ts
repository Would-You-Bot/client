import { Interaction } from "discord.js";
import { Event } from "../interfaces";
import { UserModel } from "../util/Models/userModel";
import WouldYou from "../util/wouldYou";
import { captureException } from "@sentry/node";

const commandInteractionEvent: Event = {
  event: "interactionCreate",
  execute: async (client: WouldYou, interaction: Interaction) => {
    const user = await UserModel.findOne({ userID: interaction.user?.id });
    if (!user) {
      await UserModel.create({
        userID: interaction.user?.id,
      });
    }

    if (interaction.isCommand()) {
      console.log(
        `[INFO] INTERACTION ${interaction.id} RUN BY (${interaction.user.id}, ${interaction.user.globalName}) COMMAND ${interaction.commandName}`,
      );
      const command = client.commands.get(interaction.commandName);

      const guildDb = await client.database.getGuild(
        interaction.guildId as string,
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
          { userID: interaction.user?.id }, // Specify the query to find the user
          { $inc: { [fieldPath]: 1 } }, // Use computed fieldPath
        );
      }

      if (command.requireGuild && !interaction.guild) {
        interaction.reply({
          content:
            "This command is only usable on a Discord Server!\nYou want to test Would You? Join the support server!\nhttps://discord.gg/vMyXAxEznS",
          ephemeral: true,
        });
        return;
      }

      await command // @ts-ignore
        .execute(interaction, client, guildDb || null)
        .catch((err) => {
          captureException(err);
          interaction.reply({
            content: "An error occurred while trying to execute that command.",
            ephemeral: true,
          });
          return;
        });
    }
  },
};

export default commandInteractionEvent;
