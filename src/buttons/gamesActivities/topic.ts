import { captureException } from "@sentry/node";
import {
  ActionRowBuilder,
  ButtonBuilder,
  type InteractionReplyOptions,
  type MessageActionRowComponentBuilder,
  PermissionFlagsBits,
} from "discord.js";

import type { Button } from "../../interfaces";

import { DefaultGameEmbed } from "../../util/Defaults/Embeds/Games/DefaultGameEmbed";
import { getQuestionsByType } from "../../util/Functions/jsonImport";
import { UserModel } from "../../util/Models/userModel";

const button: Button = {
  name: "topic",
  cooldown: true,
  execute: async (interaction: any, client, guildDb) => {
    await interaction.deferUpdate();
    await interaction.editReply({
      components: [interaction.message.components[0]],
    });
    if (interaction.guild) {
      if (interaction.channel.isThread()) {
        if (
          !interaction.channel
            ?.permissionsFor(interaction.user.id)
            .has(PermissionFlagsBits.SendMessagesInThreads)
        ) {
          return interaction.followUp({
            content:
              "You don't have permission to use this button in this channel!",
            ephemeral: true,
          });
        }
      } else if (
        !interaction.channel
          ?.permissionsFor(interaction.user.id)
          .has(PermissionFlagsBits.SendMessages)
      ) {
        return interaction.followUp({
          content:
            "You don't have permission to use this button in this channel!",
          ephemeral: true,
        });
      }
    }

    const premium = await client.premium.check(interaction?.guildId);

    const userDb = await UserModel.findOne({
      userID: interaction.user?.id,
    });

    const TOPIC = await getQuestionsByType(
      interaction.channelId,
      "topic",
      guildDb,
      guildDb?.language != null
        ? guildDb.language
        : userDb?.language
          ? userDb.language
          : "en_EN",
      premium.result
    );

    const ratherEmbed = new DefaultGameEmbed(
      interaction,
      TOPIC.id,
      TOPIC.question,
      "topic"
    );

    if (guildDb && !guildDb.replay)
      return interaction.followUp({
        ephemeral: true,
        content: client.translation.get(
          guildDb?.language,
          "Rather.replays.disabled"
        ),
      });

    const mainRow = new ActionRowBuilder<MessageActionRowComponentBuilder>();

    const randomValue = Math.round(Math.random() * 15);

    if (!premium.result && randomValue < 3) {
      mainRow.addComponents([
        new ButtonBuilder()
          .setLabel("Invite")
          .setStyle(5)
          .setEmoji("1009964111045607525")
          .setURL(
            "https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=275415247936&scope=bot%20applications.commands"
          ),
      ]);
    } else if (!premium.result && randomValue >= 3 && randomValue < 5) {
      mainRow.addComponents([
        new ButtonBuilder()
          .setLabel("Premium")
          .setStyle(5)
          .setEmoji("1256988872160710808")
          .setURL("https://wouldyoubot.gg/premium"),
      ]);
    }
    mainRow.addComponents([
      new ButtonBuilder()
        .setLabel("New Question")
        .setStyle(1)
        .setEmoji("1073954835533156402")
        .setCustomId("topic")
        .setDisabled(guildDb?.replay != null ? !guildDb.replay : false),
    ]);

    const classicData: InteractionReplyOptions = guildDb?.classicMode
      ? { content: TOPIC.question, fetchReply: true }
      : {
          embeds: [ratherEmbed],
          components: [mainRow],
        };

    interaction
      .followUp(classicData)
      .then(async (msg: any) => {
        if (!guildDb?.classicMode) return;
        await msg.react("🅰️"), await msg.react("🇧");
      })
      .catch((err: Error) => {
        captureException(err);
      });
    return;
  },
};

export default button;
