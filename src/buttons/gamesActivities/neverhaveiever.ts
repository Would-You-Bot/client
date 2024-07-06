import { captureException } from "@sentry/node";
import {
  ActionRowBuilder,
  ButtonBuilder,
  InteractionReplyOptions,
  MessageActionRowComponentBuilder,
  PermissionFlagsBits,
} from "discord.js";
import { Button } from "../../interfaces";
import { DefaultGameEmbed } from "../../util/Defaults/Embeds/Games/DefaultGameEmbed";
import { getQuestionsByType } from "../../util/Functions/jsonImport";
import { UserModel } from "../../util/Models/userModel";

const button: Button = {
  name: "neverhaveiever",
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
      } else {
        if (
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
    }
    const userDb = await UserModel.findOne({
      userID: interaction.user?.id,
    });

    let NHIE = await getQuestionsByType(
      "neverhaveiever",
      guildDb,
      guildDb?.language != null
        ? guildDb.language
        : userDb?.language
          ? userDb.language
          : "en_EN",
    );

    const nhieEmbed = new DefaultGameEmbed(
      interaction,
      NHIE.id,
      NHIE.question,
      "nhie",
    );

    const mainRow = new ActionRowBuilder<MessageActionRowComponentBuilder>();

    const randomValue = Math.round(Math.random() * 15);

    const premium = await client.premium.check(interaction?.guildId);

    if (!premium.result && randomValue < 3) {
      mainRow.addComponents([
        new ButtonBuilder()
          .setLabel("Invite")
          .setStyle(5)
          .setEmoji("1009964111045607525")
          .setURL(
            "https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=275415247936&scope=bot%20applications.commands",
          ),
      ]);
    } else if (!premium.result && randomValue >= 3 && randomValue < 8) {
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
        .setCustomId(`neverhaveiever`)
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
      "neverhaveiever",
    );

    const classicData: InteractionReplyOptions = guildDb?.classicMode
      ? { content: NHIE.question, fetchReply: true }
      : { embeds: [nhieEmbed], components: [row, mainRow] };

    interaction
      .followUp(classicData)
      .then(async (msg: any) => {
        if (!guildDb?.classicMode) return;
        msg.react(":white_check_mark:"), msg.react(":x:");
      })
      .catch((err: Error) => {
        captureException(err);
      });
    return;
  },
};

export default button;
