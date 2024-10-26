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
  name: "wwyd",
  cooldown: true,
  execute: async (interaction: any, client, guildDb) => {
    await interaction.deferUpdate();
    await interaction.editReply({
      components: [],
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

    const WWYD = await getQuestionsByType(
      interaction.channelId,
      "whatwouldyoudo",
      guildDb,
      guildDb?.language != null
        ? guildDb.language
        : userDb?.language
          ? userDb.language
          : "en_EN",
      premium.result
    );

    const wwydEmbed = new DefaultGameEmbed(
      interaction,
      WWYD.id,
      WWYD.question,
      "wwyd",
    );

    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();

    const randomValue = Math.round(Math.random() * 15);

    if (!premium.result && randomValue < 3) {
      row.addComponents([
        new ButtonBuilder()
          .setLabel("Invite")
          .setStyle(5)
          .setEmoji("1009964111045607525")
          .setURL(
            "https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=275415247936&scope=bot%20applications.commands",
          ),
      ]);
    } else if (!premium.result && randomValue >= 3 && randomValue < 5) {
      row.addComponents([
        new ButtonBuilder()
          .setLabel("Premium")
          .setStyle(5)
          .setEmoji("1256988872160710808")
          .setURL("https://wouldyoubot.gg/premium"),
      ]);
    }
    row.addComponents([
      new ButtonBuilder()
        .setLabel("New Question")
        .setStyle(1)
        .setEmoji("1073954835533156402")
        .setDisabled(guildDb?.replay != null ? !guildDb.replay : false)
        .setCustomId("wwyd"),
    ]);

    const classicData: InteractionReplyOptions = guildDb?.classicMode
      ? { content: WWYD.question, fetchReply: true }
      : {
          content:
            !premium.result && randomValue >= 3 && randomValue < 5
              ? client.translation.get(guildDb?.language, "Premium.message")
              : undefined,
          embeds: [wwydEmbed],
          components: [row],
        };

    interaction.followUp(classicData).catch((err: Error) => {
      captureException(err);
    });
    return;
  },
};

export default button;
