import {
  EmbedBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  MessageActionRowComponentBuilder,
} from "discord.js";
import dotenv from "dotenv";
dotenv.config();
import shuffle from "../../util/shuffle";
import { captureException } from "@sentry/node";
import { ChatInputCommand } from "../../models";
import { getWouldYouRather } from "../../util/Functions/jsonImport";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_TOKEN as string,
});

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("wouldyourather")
    .setDescription("Get a would you rather question.")
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: "Erhalte eine Würdest du eher Frage.",
      "es-ES": "Obtiene une pregunta ¿Qué prefieres?",
      fr: "Obtenez une question préférez-vous.",
    })
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("Enter a custom prompt to generate a question.")
        .setDescriptionLocalizations({
          de: "Geben Sie einen benutzerdefinierten Prompt ein, um eine Frage zu generieren.",
          "es-ES":
            "Ingrese un indicador personalizado para generar una pregunta.",
          fr: "Entrez un indicateur personnalisé pour générer une question.",
        })
        .setRequired(false)
    ),

  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   * @param {guildModel} guildDb
   */

  execute: async (interaction, client, guildDb) => {
    let AI = "";
    if (interaction.options.getString("prompt")) {
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content:
              "Generate a would you rather question that is 100% safe for work and pg-13 with the following theme: " +
              interaction.options.getString("prompt") +
              "make sure anything that is slightly not safe for work gets filtered out and replaced by a nice and pg 3 topic",
          },
        ],
        model: process.env.OPENAI_MODEL as string,
      });
      AI = chatCompletion.choices[0].message.content as string;
    }

    let General = await getWouldYouRather(guildDb.language);

    const dbquestions = guildDb.customMessages.filter(
      (c) => c.type !== "nsfw" && c.type === "wouldyourather"
    );

    let wouldyourather = [] as string[];

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
    const Random = Math.floor(Math.random() * wouldyourather.length);
    let ratherembed = new EmbedBuilder()
      .setColor("#0598F6")
      .setFooter({
        text: `Requested by ${interaction.user.username} | Type: ${
          interaction.options.getString("prompt")
            ? "AI Generated"
            : "General"
        } | ID: ${interaction.options.getString("prompt") ? "gpt-3.5-turbo" : Random}`,
        iconURL: interaction.user.avatarURL() || undefined,
      })
      .setDescription(`${interaction.options.getString("prompt") ? AI : wouldyourather[Random]}`);

    const mainRow = new ActionRowBuilder<MessageActionRowComponentBuilder>();
    if (Math.round(Math.random() * 15) < 3) {
      mainRow.addComponents([
        new ButtonBuilder()
          .setLabel("Invite")
          .setStyle(5)
          .setEmoji("1009964111045607525")
          .setURL(
            "https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=275415247936&scope=bot%20applications.commands"
          ),
      ]);
    }
    mainRow.addComponents([
      new ButtonBuilder()
        .setLabel("New Question")
        .setStyle(1)
        .setEmoji("1073954835533156402")
        .setCustomId(`wouldyourather`)
        .setDisabled(!guildDb.replay),
    ]);

    const time = 60_000;
    const three_minutes = 3 * 60 * 1e3;

    const { row, id } = await client.voting.generateVoting(
      interaction.guildId as string,
      interaction.channelId,
      time < three_minutes
        ? new Date(0)
        : new Date(~~((Date.now() + time) / 1000)),
      "wouldyourather"
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
