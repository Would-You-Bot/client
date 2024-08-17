import { captureException } from "@sentry/node";
import {
  ActionRowBuilder,
  ButtonBuilder,
  InteractionReplyOptions,
  MessageActionRowComponentBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { ChatInputCommand } from "../../interfaces";

import { DefaultGameEmbed } from "../../util/Defaults/Embeds/Games/DefaultGameEmbed";
import { getQuestionsByType } from "../../util/Functions/jsonImport";

import { UserModel } from "../../util/Models/userModel";

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("truth")
    .setDescription("Gives you a random truth question to answer")
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: "Postet eine zufällige Wahrheitsfrage, die du beantworten musst",
      "es-ES": "Publica una pregunta de verdad aleatoria que debes responder",
      fr: "Publie une question de vérité aléatoire que vous devez répondre",
      it: "Pubblica una domanda di verità casuale che devi rispondere",
    }),

  execute: async (interaction, client, guildDb) => {
    const premium = await client.premium.check(interaction?.guildId);
    const userDb = await UserModel.findOne({
      userID: interaction.user?.id,
    });

    let TRUTH = await getQuestionsByType(
      "truth",
      guildDb,
      guildDb?.language != null
        ? guildDb.language
        : userDb?.language
          ? userDb.language
          : "en_EN",
      premium.result,
    );

    const truthEmbed = new DefaultGameEmbed(
      interaction,
      TRUTH.id,
      TRUTH.question,
      "truth",
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
      ? { content: TRUTH.question }
      : { embeds: [truthEmbed], components: components };

    interaction.reply(classicData).catch((err) => {
      captureException(err);
    });
  },
};

export default command;
