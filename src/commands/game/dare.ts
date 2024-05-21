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
import { getDare } from "../../util/Functions/jsonImport";
import { UserModel, IUserModel } from "../../util/Models/userModel";

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("dare")
    .setDescription("Gives you a random dare to answer")
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: "Gibt dir eine zufällige pflicht Aufgabe, die du beantworten musst",
      "es-ES": "Publica un reto aleatorio que tienes que cumplir",
      fr: "Publie un défi aléatoire que tu dois relever",
      it: "Pubblica una sfida casuale che devi affrontare",
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

    let Dare = await getDare(
      guildDb?.language != null
        ? guildDb.language
        : userDb?.language
          ? userDb.language
          : "en_EN",
    );

    let dbquestions;

    let truthordare = [] as string[];

    if (guildDb != null) {
      dbquestions = guildDb.customMessages.filter((c) => c.type === "dare");

      if (!dbquestions.length) guildDb.customTypes = "regular";

      switch (guildDb.customTypes) {
        case "regular":
          truthordare = shuffle([...Dare]);
          break;
        case "mixed":
          truthordare = shuffle([...Dare, ...dbquestions.map((c) => c.msg)]);
          break;
        case "custom":
          truthordare = shuffle(dbquestions.map((c) => c.msg));
          break;
      }
    } else {
      truthordare = shuffle([...Dare]);
    }

    const Random = Math.floor(Math.random() * truthordare.length);

    const dareembed = new EmbedBuilder()
      .setColor("#0598F6")
      .setFooter({
        text: `Requested by ${
          interaction.user.username || "Anonymous"
        } | Type: Dare | ID: ${Random}`,
        iconURL: interaction.user.displayAvatarURL() || undefined,
      })
      .setDescription(bold(truthordare[Random]));

    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();
    const row2 = new ActionRowBuilder<MessageActionRowComponentBuilder>();
    let components = [] as any[];
    if (Math.round(Math.random() * 15) < 3) {
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
    } else {
      components = [row];
    }
    row.addComponents([
      new ButtonBuilder().setLabel("Truth").setStyle(3).setCustomId("truth"),
      new ButtonBuilder().setLabel("Dare").setStyle(4).setCustomId("dare"),
      new ButtonBuilder().setLabel("Random").setStyle(1).setCustomId("random"),
    ]);

    interaction
      .reply({ embeds: [dareembed], components: components })
      .catch((err) => {
        captureException(err);
      });
  },
};

export default command;
