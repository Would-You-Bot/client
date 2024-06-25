import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  MessageActionRowComponentBuilder,
} from "discord.js";
import shuffle from "../../util/shuffle";
import { captureException } from "@sentry/node";
import { ChatInputCommand } from "../../interfaces";
import { getRandomTod } from "../../util/Functions/jsonImport";
import { UserModel, IUserModel } from "../../util/Models/userModel";
import { DefaultGameEmbed } from "../../util/Defaults/Embeds/Games/DefaultGameEmbed";

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("random")
    .setDescription("Gives you a random truth or dare question to answer")
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: "Posted eine zufällig Wahrheits- oder Pflichtfrage, die du beantworten musst",
      "es-ES":
        "Publica una pregunta de verdad o reto aleatoria que debes responder",
      fr: "Publie une question de vérité ou de défi aléatoire que vous devez répondre",
      it: "Pubblica una domanda di verità o di sfida casuale che devi rispondere",
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

    const random = await getRandomTod(
      guildDb,
      guildDb?.language != null
        ? guildDb.language
        : userDb?.language
          ? userDb.language
          : "en_EN",
    );

    const randomEmbed = new DefaultGameEmbed(
      interaction,
      random.id,
      random.question,
      "random",
    );

    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();
    const row2 = new ActionRowBuilder<MessageActionRowComponentBuilder>();
    let components = [];
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
      .reply({ embeds: [randomEmbed], components: components })
      .catch((err) => {
        captureException(err);
      });
  },
};

export default command;
