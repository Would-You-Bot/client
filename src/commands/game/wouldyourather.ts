import { captureException } from "@sentry/node";
import {
  ActionRowBuilder,
  ButtonBuilder,
  MessageActionRowComponentBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { ChatInputCommand } from "../../interfaces";
import { DefaultGameEmbed } from "../../util/Defaults/Embeds/Games/DefaultGameEmbed";
import { getWouldYouRather } from "../../util/Functions/jsonImport";
import { IUserModel, UserModel } from "../../util/Models/userModel";
import shuffle from "../../util/shuffle";

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
    const userDb = (await UserModel.findOne({
      userID: interaction.user?.id,
    })) as IUserModel;

    let General = await getWouldYouRather(
      guildDb?.language != null
        ? guildDb.language
        : userDb?.language
          ? userDb.language
          : "en_EN",
    );

    let dbquestions;

    let wouldyourather = [] as string[];

    if (guildDb != null) {
      dbquestions = guildDb.customMessages.filter(
        (c) => c.type === "wouldyourather",
      );

      if (!dbquestions.length) guildDb.customTypes = "regular";

      switch (guildDb.customTypes) {
        case "regular":
          wouldyourather = shuffle([...General]);
          break;
        case "mixed":
          wouldyourather = shuffle([
            ...General,
            ...dbquestions.map((c) => c.msg),
          ]);
          break;
        case "custom":
          wouldyourather = shuffle(dbquestions.map((c) => c.msg));
          break;
      }
    } else {
      wouldyourather = shuffle([...General]);
    }

    const Random = Math.floor(Math.random() * wouldyourather.length);

    const ratherembed = new DefaultGameEmbed(
      interaction,
      Random,
      wouldyourather,
      "wyr",
    );

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
      interaction.guildId as string,
      interaction.channelId,
      time < three_minutes
        ? new Date(0)
        : new Date(~~((Date.now() + time) / 1000)),
      "wouldyourather",
    );

    await interaction
      .reply({
        embeds: [ratherembed],
        components: [row, mainRow],
        fetchReply: true,
      })
      .catch((err) => {
        captureException(err);
      });
  },
};

export default command;
