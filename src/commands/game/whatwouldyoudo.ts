import { captureException } from "@sentry/node";
import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  MessageActionRowComponentBuilder,
  InteractionReplyOptions,
} from "discord.js";

import { getQuestionsByType } from "../../util/Functions/jsonImport";
import { DefaultGameEmbed } from "../../util/Defaults/Embeds/Games/DefaultGameEmbed";
import { ChatInputCommand } from "../../interfaces";
import { UserModel } from "../../util/Models/userModel";

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("whatwouldyoudo")
    .setDescription("Gives you a 'What Would You Do' question")
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: "Was würdest du in dieser Situation tun",
      "es-ES": "¿Qué harías en esta situación?",
      fr: "Que feriez-vous dans cette situation",
      it: "Cosa faresti in questa situazione",
    }),
  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   * @param {guildModel} guildDb
   */
  execute: async (interaction, client, guildDb) => {
    const userDb = await UserModel.findOne({
      userID: interaction.user?.id,
    });

    let WWYD = await getQuestionsByType(
      "whatwouldyoudo",
      guildDb,
      guildDb?.language != null
        ? guildDb.language
        : userDb?.language
          ? userDb.language
          : "en_EN",
    );
    console.log(WWYD);

    const wwydEmbed = new DefaultGameEmbed(
      interaction,
      WWYD.id,
      WWYD.question,
      "wwyd",
    );

    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();
    if (Math.round(Math.random() * 15) < 3) {
      row.addComponents([
        new ButtonBuilder()
          .setLabel("Invite")
          .setStyle(5)
          .setEmoji("1009964111045607525")
          .setURL(
            "https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=275415247936&scope=bot%20applications.commands",
          ),
      ]);
    }
    row.addComponents([
      new ButtonBuilder()
        .setLabel("New Question")
        .setStyle(1)
        .setEmoji("1073954835533156402")
        .setDisabled(guildDb?.replay != null ? !guildDb.replay : false)
        .setCustomId(`wwyd`),
    ]);

    const classicData: InteractionReplyOptions = guildDb.classicMode
      ? { content: WWYD.question, fetchReply: true }
      : {embeds: [wwydEmbed], components: [row] };

      interaction
      .reply(classicData)
      .then(async (msg: any) => {
        if (!guildDb.classicMode) return;
        msg.react("🇦"), msg.react("🇧");
      })
      .catch((err) => {
        captureException(err);
      });
  },
};

export default command;
