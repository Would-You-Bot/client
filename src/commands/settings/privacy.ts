import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
  PermissionsBitField,
  ButtonStyle,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { ChatInputCommand } from "../../interfaces";

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("privacy")
    .setDescription("Changes your privacy settings")
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: "Ändert deine Datenschutzeinstellungen",
      "es-ES": "Cambia tu configuración de privacidad",
      fr: "Modifie vos paramètres de confidentialité",
      it: "Modifica le impostazioni sulla privacy",
    }),

  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   * @param {IGuildModel} guildDb
   */

  execute: async (interaction, client, guildDb) => {
    const language = guildDb?.language != null ? guildDb.language : "en_EN";
    const db = await client.database.getUser(interaction.user.id);

    const setting = new EmbedBuilder()
      .setTitle(client.translation.get(language, "Privacy.settings"))
      .setDescription(
        `${client.translation.get(
          language,
          "Privacy.desc",
        )}\n\n${client.translation.get(language, "Privacy.status")} ${
          db?.votePrivacy
            ? client.translation.get(language, "Privacy.on")
            : client.translation.get(language, "Privacy.off")
        }`,
      )
      .setColor("#0598F6")
      .setFooter({
        text: client.translation.get(language, "Settings.embed.footer"),
        iconURL: client?.user?.displayAvatarURL() || undefined,
      });

    const button =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("privacy")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              db?.votePrivacy ? "Privacy.turnOff" : "Privacy.turnOn",
            ),
          )
          .setStyle(db?.votePrivacy ? ButtonStyle.Danger : ButtonStyle.Success),
      );

    await interaction.reply({
      embeds: [setting],
      components: [button],
      ephemeral: true,
    });
  },
};

export default command;
