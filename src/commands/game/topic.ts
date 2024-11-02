import { captureException } from "@sentry/node";
import {
  ActionRowBuilder,
  ButtonBuilder,
  type InteractionReplyOptions,
  type MessageActionRowComponentBuilder,
  SlashCommandBuilder,
} from "discord.js";
import type { ChatInputCommand } from "../../interfaces";
import { DefaultGameEmbed } from "../../util/Defaults/Embeds/Games/DefaultGameEmbed";
import { getQuestionsByType } from "../../util/Functions/jsonImport";
import { UserModel } from "../../util/Models/userModel";

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("topic")
    .setDescription("Gives you a random topic to talk about")
    .setContexts([0, 1, 2])
    .setIntegrationTypes([0, 1])
    .setDescriptionLocalizations({
      de: "Gibt dir ein zufälliges Thema, über das du sprechen kannst",
      "es-ES": "Te da un tema aleatorio sobre el que hablar",
      fr: "Vous donne un sujet aléatoire sur lequel parler",
      it: "Ti dà un argomento casuale su cui parlare",
    }),

  execute: async (interaction, client, guildDb) => {
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
        .setDisabled(guildDb?.replay != null ? !guildDb.replay : false)
        .setEmoji("1073954835533156402")
        .setCustomId("topic"),
    ]);

    const classicData: InteractionReplyOptions = guildDb?.classicMode
      ? { content: TOPIC.question, fetchReply: true }
      : {
          embeds: [ratherEmbed],
          components: [mainRow],
        };
    interaction.reply(classicData).catch((err: Error) => {
      captureException(err);
    });
  },
};

export default command;
