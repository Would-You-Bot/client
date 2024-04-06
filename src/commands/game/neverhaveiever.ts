import {
  EmbedBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  MessageActionRowComponentBuilder,
  bold,
} from "discord.js";
import { captureException } from "@sentry/node";
import shuffle from "../../util/shuffle";
import { ChatInputCommand } from "../../interfaces";
import { Questions } from "../../util/Functions/queueHandler";
import { getQuestionsByType } from "../../util/Functions/jsonImport";

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("neverhaveiever")
    .setDescription("Gives you a 'Never Have I Ever' question")
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: "Bekomme eine nie habe ich jemals Nachricht",
      "es-ES": "Consigue un mensaje Nunca he tenido",
      fr: "Afficher une question que je n'ai jamais posée",
    }),

  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   * @param {guildModel} guildDb
   */

  execute: async (interaction, client, guildDb) => {
    let NHIE = await getQuestionsByType( "neverhaveiever", 
    guildDb != null ? guildDb : null,
    );
    
        if (interaction.guild) {
          // @ts-ignore
          NHIE = await Questions(NHIE, null, guildDb, {
            quest: "nhieQuestions",
            questType: "neverhaveiever",
          });
        }

    let nhieEmbed = new EmbedBuilder()
      .setColor("#0598F6")
      .setFooter({
        text: `Requested by ${interaction.user.username} | Type: NHIE | ID: ${NHIE.id}`,
        iconURL: interaction.user.displayAvatarURL() || undefined,
      })
      .setDescription(bold(NHIE.question));

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
        .setCustomId(`neverhaveiever`),
    ]);

    const time = 60_000;
    const three_minutes = 3 * 60 * 1e3;

    const { row, id } = await client.voting.generateVoting(
      interaction.guildId as string,
      interaction.channelId,
      time < three_minutes
        ? new Date(0)
        : new Date(~~((Date.now() + time) / 1000)),
      "neverhaveiever",
    );

    interaction
      .reply({ embeds: [nhieEmbed], components: [row, mainRow] })
      .catch((err) => {
        captureException(err);
      });
  },
};

export default command;
