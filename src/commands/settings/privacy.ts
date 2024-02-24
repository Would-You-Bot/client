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
import { ChatInputCommand } from "../../models";

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("privacy")
    .setDescription("Privacy settings")
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: "Lorem ipsum",
      "es-ES": "Lorem ipsum",
      fr: "Lorem ipsum",
    }),

  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   * @param {IGuildModel} guildDb
   */

  execute: async (interaction, client, guildDb) => {
    const db = await client.database.getUser(interaction.user.id);

    const setting = new EmbedBuilder()
      .setTitle(client.translation.get(guildDb?.language, "Privacy.settings"))
      .setDescription(
        `${client.translation.get(
          guildDb?.language,
          "Privacy.desc",
        )}\n\n${client.translation.get(guildDb?.language, "Privacy.status")} ${
          db?.votePrivacy
            ? client.translation.get(guildDb?.language, "Privacy.on")
            : client.translation.get(guildDb?.language, "Privacy.off")
        }`,
      )
      .setColor("#0598F6")
      .setFooter({
        text: client.translation.get(
          guildDb?.language,
          "Settings.embed.footer",
        ),
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
