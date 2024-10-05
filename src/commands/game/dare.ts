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
    .setName("dare")
    .setDescription("Gives you a random dare to answer")
    .setContexts([0, 1, 2])
    .setIntegrationTypes([0, 1])
    .setDescriptionLocalizations({
      de: "Gibt dir eine zufällige pflicht Aufgabe, die du beantworten musst",
      "es-ES": "Publica un reto aleatorio que tienes que cumplir",
      fr: "Publie un défi aléatoire que tu dois relever",
      it: "Pubblica una sfida casuale che devi affrontare",
    }),

  execute: async (interaction, client, guildDb) => {
    const premium = await client.premium.check(interaction?.guildId);
    const userDb = await UserModel.findOne({
      userID: interaction.user?.id,
    });

    const DARE = await getQuestionsByType(
      "dare",
      guildDb,
      guildDb?.language != null
        ? guildDb.language
        : userDb?.language
          ? userDb.language
          : "en_EN",
      premium.result,
    );

    const dareEmbed = new DefaultGameEmbed(
      interaction,
      DARE.id,
      DARE.question,
      "dare",
    );

    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();
    const row2 = new ActionRowBuilder<MessageActionRowComponentBuilder>();
    let components = [];

    const randomValue = Math.round(Math.random() * 15);

    if (!premium.result && randomValue < 3) {
      row2.addComponents([
        new ButtonBuilder()
          .setLabel("Invite")
          .setStyle(5)
          .setEmoji("1009964111045607525")
          .setURL(
            "https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=275415247936&scope=bot%20applications.commands",
          ),
      ]);
      components = [row, row2];
    } else if (!premium.result && randomValue >= 3 && randomValue < 5) {
      row2.addComponents([
        new ButtonBuilder()
          .setLabel("Premium")
          .setStyle(5)
          .setEmoji("1256988872160710808")
          .setURL("https://wouldyoubot.gg/premium"),
      ]);
      components = [row, row2];
    } else {
      components = [row];
    }
    row.addComponents([
      new ButtonBuilder().setLabel("Truth").setStyle(3).setCustomId("truth"),
      new ButtonBuilder().setLabel("Dare").setStyle(4).setCustomId("dare"),
      new ButtonBuilder().setLabel("Random").setStyle(1).setCustomId("random"),
    ]);

    const classicData: InteractionReplyOptions = guildDb?.classicMode
      ? { content: DARE.question }
      : { embeds: [dareEmbed], components: components };

    interaction.reply(classicData).catch((err) => {
      captureException(err);
    });
  },
};

export default command;
