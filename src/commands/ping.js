const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  SlashCommandBuilder,
} = require("discord.js");
const guildModel = require("../util/Models/guildModel");

module.exports = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Displays the clients ping")
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: "Zeigt den Ping des Clients an",
      "es-ES": "Muestra el ping del cliente",
    }),

  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   * @param {guildModel} guildDb
   */
  async execute(interaction, client, guildDb) {
    const pingembed = new EmbedBuilder()

      .setColor("#0598F6")
      .setFooter({
        text: client.translation.get(guildDb?.language, "Ping.embed.footer"),
        iconURL: client.user.avatarURL(),
      })
      .setTimestamp()
      .setTitle(client.translation.get(guildDb?.language, "Ping.embed.title"))
      .addFields(
        {
          name: client.translation.get(guildDb?.language, "Ping.embed.client"),
          value: `> **${Math.abs(
            Date.now() - interaction.createdTimestamp
          )}**ms`,
          inline: false,
        },
        {
          name: client.translation.get(guildDb?.language, "Ping.embed.api"),
          value: `> **${Math.round(client.ws.ping)}**ms`,
          inline: false,
        }
      );
    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel(
          client.translation.get(guildDb?.language, "Ping.button.title")
        )
        .setStyle(5)
        .setEmoji("💻")
        .setURL("https://discordstatus.com/")
    );
    await interaction
      .reply({
        embeds: [pingembed],
        components: [button],
      })
      .catch((err) => {
        return console.log(err);
      });
    setTimeout(() => {
      button.components[0].setDisabled(true);
      interaction
        .editReply({
          embeds: [pingembed],
          components: [button],
        })
        .catch((err) => {
          return;
        });
    }, 120000);
  },
};
