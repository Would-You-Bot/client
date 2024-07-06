import { captureException } from "@sentry/node";
import { ButtonInteraction } from "discord.js";
import { Event } from "../interfaces";
import { IGuildModel } from "../util/Models/guildModel";
import { UserModel } from "../util/Models/userModel";
import WouldYou from "../util/wouldYou";

const buttonInteractionEvent: Event = {
  event: "interactionCreate",
  execute: async (client: WouldYou, interaction: ButtonInteraction) => {
    console.log(
      `[INFO] INTERACTION ${interaction.id} RUN BY (${interaction.user.id}, ${interaction.user.username}) CLICKED ${interaction.customId}`,
    );

    let guildDb;

    if (interaction.guildId !== null) {
      guildDb = await client.database.getGuild(interaction.guildId, true, true);
    }
    let button = client.buttons.get(interaction.customId);

    const customId = interaction.customId.split("_");

    if (customId[3]) {
      if (
        customId[2] === "neverhaveiever" ||
        customId[2] === "wouldyourather"
      ) {
        const action = Number(customId[3]) == 0 ? "yes" : "no";
        const buttonName = customId[2];
        const fieldName = `${buttonName}.${action}`;
        // Increment the specified field using $inc
        await UserModel.updateOne(
          { userID: interaction.user?.id },
          { $inc: { [fieldName]: 1 } },
        );
      }
    }

    const replyMap: Record<string, string> = {
      wouldyourather: "wouldyourather.used.replay",
      neverhaveiever: "neverhaveiever.used.replay",
      higherlower: "higherlower.used.replay",
      wwyd: "whatwouldyoudo.used.replay",
      truth: "truth.used.replay",
      dare: "dare.used.replay",
      random: "random.used.replay",
    };

    // Get the field path based on the command name
    const fieldPath = replyMap[interaction.customId];
    if (fieldPath) {
      // Increment the specified field using $inc
      await UserModel.updateOne(
        { userID: interaction.user?.id }, // Specify the query to find the user
        { $inc: { [fieldPath]: 1 } }, // Use computed fieldPath
      );
    }

    // Button identification logic
    let bypass = false;
    const buttonMap: Record<string, string> = {
      wycustom_add: "wycustom_add",
      wycustom_remove: "wycustom_remove",
      voting_: "voting",
      result_: "result",
      higher_: "higher",
      lower_: "lower",
    };

    for (const [key, value] of Object.entries(buttonMap)) {
      if (interaction.customId.startsWith(key)) {
        bypass = true;
        button = client.buttons.get(value);
        break;
      }
    }

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

    // Cooldown handling
    let cooldownKey: string | undefined;
    let cooldown: number;

    const excludedButtons = await client.buttons
      .filter((button) => button.cooldown === false)
      .map((button) => button.name);

    const isExcludedButton = excludedButtons.includes(interaction.customId);
    if (
      guildDb != null &&
      !bypass &&
      guildDb.replayType === "Channels" &&
      guildDb.replayChannels.find((x) => x.id === interaction.channelId) &&
      !isExcludedButton
    ) {
      cooldownKey = `${interaction.user?.id}-${interaction.channelId}`;
      cooldown = Number(
        guildDb.replayChannels.find((x) => x.id === interaction.channelId)
          ?.cooldown,
      );
    } else if (!isExcludedButton && !bypass) {
      cooldownKey = interaction.user?.id;
      cooldown = Number(
        guildDb?.replayCooldown != null ? guildDb.replayCooldown : 0,
      );
    }

    if (cooldownKey && cooldown!) {
      if (
        client.used.has(cooldownKey) &&
        client.used.get(cooldownKey)! > Date.now()
      ) {
        interaction
          .reply({
            content: `You can use this button again <t:${Math.floor(
              client.used.get(cooldownKey) / 1000,
            )}:R>!`,
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

    if (guildDb == null) return;

    const guildDB: IGuildModel = guildDb;

    return button.execute(interaction, client, guildDB);
  },
};

export default buttonInteractionEvent;
