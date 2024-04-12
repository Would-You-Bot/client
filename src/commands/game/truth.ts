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
import { getTruth } from "../../util/Functions/jsonImport";
import { UserModel, IUserModel } from "../../util/Models/userModel";

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

    let Truth = await getTruth(
      guildDb?.language != null ? guildDb.language : userDb?.language ? userDb.language : "en_EN",,
    );

    let dbquestions;

    let truthordare = [] as string[];

    if (guildDb != null) {
      dbquestions = guildDb.customMessages.filter((c) => c.type === "truth");

      if (!dbquestions.length) guildDb.customTypes = "regular";

      switch (guildDb.customTypes) {
        case "regular":
          truthordare = shuffle([...Truth]);
          break;
        case "mixed":
          truthordare = shuffle([...Truth, ...dbquestions.map((c) => c.msg)]);
          break;
        case "custom":
          truthordare = shuffle(dbquestions.map((c) => c.msg));
          break;
      }
    } else {
      truthordare = shuffle([...Truth]);
    }

    const Random = Math.floor(Math.random() * truthordare.length);

    const truthembed = new EmbedBuilder()
      .setColor("#0598F6")
      .setFooter({
        text: `Requested by ${interaction.user.username} | Type: Truth | ID: ${Random}`,
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
      .reply({ embeds: [truthembed], components: components })
      .catch((err) => {
        captureException(err);
      });
  },
};

export default command;
