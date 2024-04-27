import {
  EmbedBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  MessageActionRowComponentBuilder,
  bold,
} from "discord.js";
import shuffle from "../../util/shuffle";
import { captureException } from "@sentry/node";
import { ChatInputCommand } from "../../interfaces";

import { getQuestionsByType } from "../../util/Functions/jsonImport";
import { IUserModel, UserModel } from "../../util/Models/userModel";

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
    }),
  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   * @param {guildModel} guildDb
   */
  execute: async (interaction, client, guildDb) => {
    const userDb = (await UserModel.findOne({
      userID: interaction.user?.id,
    })) as IUserModel;

    let WWYD = await getQuestionsByType(
      "whatwouldyoudo",
      guildDb,
      guildDb?.language != null
        ? guildDb.language
        : userDb?.language
          ? userDb.language
          : "en_EN",
    );

    const wwydembed = new EmbedBuilder()
      .setColor("#0598F6")
      .setFooter({
        text: `Requested by ${interaction.user.username} | Type: WWYD | ID: ${WWYD.id}`,
        iconURL: interaction.user.displayAvatarURL() || undefined,
      })
      .setDescription(bold(WWYD.question));

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

    interaction
      .reply({ embeds: [wwydembed], components: [row] })
      .catch((err) => {
        captureException(err);
      });
  },
};

export default command;
