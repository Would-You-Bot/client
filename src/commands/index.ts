import { captureException } from "@sentry/node";
import type {
  CacheType,
  ChatInputCommandInteraction,
  Interaction,
} from "discord.js";
import type { Event } from "../interfaces";
import type { IGuildModel } from "../util/Models/guildModel";
import { UserModel } from "../util/Models/userModel";
import type WouldYou from "../util/wouldYou";

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
        `[INFO] INTERACTION ${interaction.id} RUN BY (${interaction.user.id}, ${interaction.user.username}) COMMAND ${interaction.commandName}`,
      );
      const command = client.commands.get(interaction.commandName);

      let guildDb: IGuildModel | null;

      if (interaction.guildId !== null) {
        guildDb = await client.database.getGuild(
          interaction.guildId as string,
          true,
        );
        client.database
          .updateGuild(interaction.guildId as string, {
            lastUsageTimestamp: Date.now(),
          })
          .then(() => {});
      } else {
        guildDb = null;
      }

      if (!command) return;
      const statsMap = {
        wouldyourather: "wouldyourather.used.command",
        neverhaveiever: "neverhaveiever.used.command",
        higherlower: "higherlower.used.command",
        wwyd: "whatwouldyoudo.used.command",
        truth: "truth.used.command",
        dare: "dare.used.command",
        random: "random.used.command",
        topic: "topic.used.command",
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

      // Check if the command is only allowed in guilds
      const allowedInDMs = [
        "dare",
        "truth",
        "random",
        "wouldyourather",
        "neverhaveiever",
        "higherlower",
        "whatwouldyoudo",
        "topic",
        "leaderboard",
        "privacy",
        "language",
      ];
      if (
        !interaction.guild &&
        !allowedInDMs.includes(interaction.commandName)
      ) {
        interaction.reply({
          content:
            "This command is only usable on a Discord Server!\nYou want to test Would You? Join the support server!\nhttps://discord.gg/vMyXAxEznS",
          ephemeral: true,
        });
        return;
      }

      await command
        .execute(
          interaction as ChatInputCommandInteraction<CacheType>,
          client,
          guildDb as IGuildModel,
        )
        .catch((err: Error) => {
          captureException(err);
          return interaction.reply({
            content: "An error occurred while trying to execute that command.",
            ephemeral: true,
          });
        });
    }
  },
};

export default commandInteractionEvent;
