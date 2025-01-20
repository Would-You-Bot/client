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
      // Cooldown handling
      let cooldownKey: string | undefined;
      let cooldown: number;

      if (
        guildDb != null &&
        command?.cooldown &&
        guildDb?.commandCooldown !== 0
      ) {
        if (guildDb?.commandBy === "Guild") {
          if (guildDb.commandType === "Command") {
            cooldownKey = `${interaction.guild?.id}-${interaction.commandName}`;
            cooldown = Number(
              guildDb?.commandCooldown != null ? guildDb.commandCooldown : 0,
            );
          } else if (guildDb.commandType === "User") {
            cooldownKey = `${interaction.guild?.id}`;
            cooldown = Number(
              guildDb?.commandCooldown != null ? guildDb.commandCooldown : 0,
            );
          }
        } else if (guildDb?.commandBy === "User") {
          if (guildDb.commandType === "Command") {
            cooldownKey = `${interaction.user?.id}-${interaction.commandName}`;
            cooldown = Number(
              guildDb?.commandCooldown != null ? guildDb.commandCooldown : 0,
            );
          } else if (guildDb.commandType === "User") {
            cooldownKey = `${interaction.guild?.id}`;
            cooldown = Number(
              guildDb?.commandCooldown != null ? guildDb.commandCooldown : 0,
            );
          }
        }

        if (cooldownKey && cooldown!) {
          if (
            client.used.has(cooldownKey) &&
            client.used.get(cooldownKey)! > Date.now()
          ) {
            interaction
              .reply({
                content: `${guildDb.commandType === "Command" ? "You can use this command again" : "You can use commands again"} <t:${Math.floor(client.used.get(cooldownKey) / 1000)}:R>!`,
                ephemeral: true,
              })
              .catch((err) => {
                captureException(err);
              });
            return;
          }
          client.used.set(cooldownKey, Date.now() + cooldown);
          setTimeout(() => client.used.delete(cooldownKey!), cooldown);
        }
      }

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
  autocomplete: async (client, interaction) => {
    const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

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

		try {
			await command.autocomplete(interaction, guildDb);
		} catch (error) {
			console.error(error);
		}
	}
};

export default commandInteractionEvent;
