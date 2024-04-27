import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  PermissionFlagsBits,
  MessageActionRowComponentBuilder,
  bold,
} from "discord.js";
import { captureException } from "@sentry/node";
import { Button } from "../../interfaces";

import { getQuestionsByType } from "../../util/Functions/jsonImport";
import { DefaultGameEmbed } from "../../util/Defaults/Embeds/Games/DefaultGameEmbed";
import { UserModel, IUserModel } from "../../util/Models/userModel";

const button: Button = {
  name: "wouldyourather",
  cooldown: true,
  execute: async (interaction: any, client, guildDb) => {
    if (interaction.guild) {
      await interaction.message.edit({
        components: [interaction.message.components[0]],
      });
      if (interaction.channel.isThread()) {
        if (
          !interaction.channel
            ?.permissionsFor(interaction.user.id)
            .has(PermissionFlagsBits.SendMessagesInThreads)
        ) {
          return interaction.reply({
            content:
              "You don't have permission to use this button in this channel!",
            ephemeral: true,
          });
        }
      } else {
        if (
          !interaction.channel
            ?.permissionsFor(interaction.user.id)
            .has(PermissionFlagsBits.SendMessages)
        ) {
          return interaction.reply({
            content:
              "You don't have permission to use this button in this channel!",
            ephemeral: true,
          });
        }
      }
    }

    const userDb = (await UserModel.findOne({
      userID: interaction.user?.id,
    })) as IUserModel;

    let WYR = await getQuestionsByType(
      "wouldyourather",
      guildDb,
      guildDb?.language != null
        ? guildDb.language
        : userDb?.language
          ? userDb.language
          : "en_EN",
    );

    const ratherembed = new DefaultGameEmbed(
      interaction,
      WYR.id,
      WYR.question,
      "wyr",
    );

    if (guildDb && !guildDb.replay)
      return interaction.reply({
        ephemeral: true,
        content: client.translation.get(
          guildDb?.language,
          "Rather.replays.disabled",
        ),
      });

    const mainRow = new ActionRowBuilder<MessageActionRowComponentBuilder>();
    if (Math.round(Math.random() * 15) < 3) {
      mainRow.addComponents([
        new ButtonBuilder()
          .setLabel("Invite")
          .setStyle(5)
          .setEmoji("1009964111045607525")
          .setURL(
            "https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=275415247936&scope=bot%20applications.commands",
          ),
      ]);
    }
    mainRow.addComponents([
      new ButtonBuilder()
        .setLabel("New Question")
        .setStyle(1)
        .setEmoji("1073954835533156402")
        .setCustomId(`wouldyourather`)
        .setDisabled(guildDb?.replay != null ? !guildDb.replay : false),
    ]);

    const time = 60_000;
    const three_minutes = 3 * 60 * 1e3;

    const { row, id } = await client.voting.generateVoting(
      interaction.guildId ? (interaction.guildId as string) : null,
      interaction.channelId,
      time < three_minutes
        ? new Date(0)
        : new Date(~~((Date.now() + time) / 1000)),
      "wouldyourather",
    );

    interaction
      .reply({
        embeds: [ratherembed],
        components: [row, mainRow],
      })
      .catch((err: Error) => {
        captureException(err);
      });
    return;
  },
};

export default button;
