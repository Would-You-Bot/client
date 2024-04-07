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
import { getNeverHaveIEver } from "../../util/Functions/jsonImport";
import { UserModel, IUserModel } from "../../util/Models/userModel";

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
    let userDb = (await UserModel.findOne({
      userID: interaction.user?.id,
    })) as IUserModel;

    let { Funny, Basic, Young, Food, RuleBreak } = await getNeverHaveIEver(
      guildDb?.language != null ? guildDb.language : userDb.language,
    );

    let dbquestions;

    let nererhaveIever = [] as string[];

    if (guildDb != null) {
      dbquestions = guildDb.customMessages.filter((c) => c.type === "truth");

      if (!dbquestions.length) guildDb.customTypes = "regular";

      switch (guildDb.customTypes) {
        case "regular":
          nererhaveIever = shuffle([
            ...Funny,
            ...Basic,
            ...Young,
            ...Food,
            ...RuleBreak,
          ]);
          break;
        case "mixed":
          nererhaveIever = shuffle([
            ...Funny,
            ...Basic,
            ...Young,
            ...Food,
            ...RuleBreak,
            ...dbquestions.map((c) => c.msg),
          ]);
          break;
        case "custom":
          nererhaveIever = shuffle(dbquestions.map((c) => c.msg));
          break;
      }
    } else {
      nererhaveIever = shuffle([
        ...Funny,
        ...Basic,
        ...Young,
        ...Food,
        ...RuleBreak,
      ]);
    }

    const Random = Math.floor(Math.random() * nererhaveIever.length);

    let ratherembed = new EmbedBuilder()
      .setColor("#0598F6")
      .setFooter({
        text: `Requested by ${interaction.user.username} | Type: NHIE | ID: ${Random}`,
        iconURL: interaction.user.displayAvatarURL() || undefined,
      })
      .setDescription(bold(nererhaveIever[Random]));

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
      .reply({ embeds: [ratherembed], components: [row, mainRow] })
      .catch((err) => {
        captureException(err);
      });
  },
};

export default command;
