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
    .setName("wouldyourather")
    .setDescription("Gives you a 'Would You Rather' question")
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: "Erhalte eine Würdest du eher Frage",
      "es-ES": "Obtiene une pregunta ¿Qué prefieres?",
      fr: "Obtenez une question préférez-vous",
      it: "Ottieni una domanda Preferiresti",
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

    let WYR = await getQuestionsByType(
      "wouldyourather",
      guildDb,
      guildDb?.language != null
        ? guildDb.language
        : userDb?.language
          ? userDb.language
          : "en_EN",
    );

    const ratherEmbed = new DefaultGameEmbed(
      interaction,
      WYR.id,
      WYR.question,
      "wyr",
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
        .setDisabled(guildDb?.replay != null ? !guildDb.replay : false)
        .setEmoji("1073954835533156402")
        .setCustomId(`wouldyourather`),
    ]);

    const time = 60_000;
    const three_minutes = 3 * 60 * 1e3;

    const { row, id } = await client.voting.generateVoting(
      interaction.guildId as string,
      interaction.channelId,
      time < three_minutes
        ? new Date(0)
        : new Date(~~((Date.now() + time) / 1000)),
      "wouldyourather",
    );

    const classicData: InteractionReplyOptions = guildDb?.classicMode
      ? { content: WYR.question, fetchReply: true }
      : { embeds: [ratherEmbed], components: [row, mainRow] };

    interaction
      .reply(classicData)
      .then(async (msg: any) => {
        if (!guildDb?.classicMode) return;
        msg.react("🅰️"), msg.react("🇧");
      })
      .catch((err: Error) => {
        captureException(err);
      });
  },
};

export default command;
