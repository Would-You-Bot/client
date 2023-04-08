const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const guildModel = require("../util/Models/guildModel");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("settings")
    .setDescription("Change settings for Daily Messages and Welcomes")
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: "TBA",
      "es-ES": "TBA",
    })
    .addStringOption((option) =>
      option
        .setName("choose")
        .setDescription("Enable/disable daily Would You messages.")
        .setRequired(true)
        .addChoices(
          { name: "General Settings", value: "general" },
          { name: "Daily Messages", value: "dailyMsgs" },
          { name: "Welcomes", value: "welcomes" }
        )
    ),

  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   * @param {guildModel} guildDb
   */
  async execute(interaction, client, guildDb) {
    if (interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      switch (interaction.options.getString("choose")) {
        case "dailyMsgs":
          const dailyMsgs = new EmbedBuilder()
          .setTitle(client.translation.get(guildDb?.language, 'Settings.embed.dailyTitle'))
          .setDescription(
            `${client.translation.get(guildDb?.language, 'Settings.embed.dailyMsg')}: ${
              guildDb.dailyMsg
                ? `<:check:1077962440815411241>`
                : `<:x_:1077962443013238814>`
            }\n` +
              `${client.translation.get(guildDb?.language, 'Settings.embed.dailyChannel')}: ${
                guildDb.dailyChannel
                  ? `<#${guildDb.dailyChannel}>`
                  : `<:x_:1077962443013238814>`
              }\n` +
              `${client.translation.get(guildDb?.language, 'Settings.embed.dailyRole')}: ${
                guildDb.dailyRole
                  ? `<@&${guildDb.dailyRole}>`
                  : `<:x_:1077962443013238814>`
              }\n` +
              `${client.translation.get(guildDb?.language, 'Settings.embed.dailyTimezone')}: ${guildDb.dailyTimezone}\n`
              +
            `${client.translation.get(guildDb?.language, 'Settings.embed.dailyInterval')}: ${guildDb.dailyInterval}\n`
            +
            `${client.translation.get(guildDb?.language, 'Settings.embed.dailyType')}: ${guildDb.customTypes}`
          )
          .setColor("#0598F6")
            const dailyButtons = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("dailyMsg")
                .setLabel(client.translation.get(guildDb?.language, 'Settings.button.dailyMsg'))
                .setStyle(guildDb.dailyMsg ? "Success" : "Secondary"),
              new ButtonBuilder()
                .setCustomId("dailyChannel")
                .setLabel(client.translation.get(guildDb?.language, 'Settings.button.dailyChannel'))
                .setStyle(guildDb.dailyChannel ? "Success" : "Secondary"),
              new ButtonBuilder()
                .setCustomId("dailyType")
                .setLabel(client.translation.get(guildDb?.language, 'Settings.button.dailyType'))
                .setStyle("Primary")
                .setEmoji("📝"),
            ),
            dailyButtons2 = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("dailyTimezone")
                .setLabel(client.translation.get(guildDb?.language, 'Settings.button.dailyTimezone'))
                .setStyle("Primary")
                .setEmoji("🌍"),
              new ButtonBuilder()
                .setCustomId("dailyRole")
                .setLabel(client.translation.get(guildDb?.language, 'Settings.button.dailyRole'))
                .setStyle(guildDb.dailyRole ? "Success" : "Secondary"),
            new ButtonBuilder()
                .setCustomId("dailyInterval")
                .setLabel(client.translation.get(guildDb?.language, 'Settings.button.dailyInterval'))
              .setStyle('Primary')
                .setEmoji("⏰"),
            )

          interaction
            .reply({
              embeds: [dailyMsgs],
              components: [dailyButtons, dailyButtons2],
              ephemeral: true,
            })
            .catch(() => {});
          break;

        case "general":
          const generalMsg = new EmbedBuilder()
            .setTitle(client.translation.get(guildDb?.language, 'Settings.embed.generalTitle'))
            .setDescription(
              `${client.translation.get(guildDb?.language, 'Settings.embed.voteCooldown')}: ${
                guildDb.voteCooldown
                  ? `${guildDb.voteCooldown}`
                  : `<:x_:1077962443013238814>`
              }\n` +
                `${client.translation.get(guildDb?.language, 'Settings.embed.replayCooldown')}: ${
                  guildDb.replayCooldown
                    ? `${guildDb.replayCooldown}`
                    : `<:x_:1077962443013238814>`
                }\n`
            )
            .setColor("#0598F6")
            .setFooter({
              text: client.translation.get(guildDb?.language, 'Settings.embed.footer'),
              iconURL: client.user.avatarURL(),
            });

          const generalButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("voteCooldown")
              .setLabel(client.translation.get(guildDb?.language, 'Settings.button.voteCooldown'))
              .setStyle(guildDb.voteCooldown ? "Success" : "Secondary"),
            new ButtonBuilder()
              .setCustomId("replayCooldown")
              .setLabel(client.translation.get(guildDb?.language, 'Settings.button.replayCooldown'))
              .setStyle(guildDb.replayCooldown ? "Success" : "Secondary")
          );

          interaction
            .reply({
              embeds: [generalMsg],
              components: [generalButtons],
              ephemeral: true,
            })
            .catch(() => {});
          break;

        case "welcomes":
          const welcomes = new EmbedBuilder()
            .setTitle(client.translation.get(guildDb?.language, 'Settings.embed.welcomeTitle'))
            .setDescription(
              `${client.translation.get(guildDb?.language, 'Settings.embed.welcome')}: ${
                guildDb.welcome
                  ? `<:check:1077962440815411241>`
                  : `<:x_:1077962443013238814>`
              }\n` +
                `${client.translation.get(guildDb?.language, 'Settings.embed.welcomePing')}: ${
                  guildDb.welcomePing
                    ? `<:check:1077962440815411241>`
                    : `<:x_:1077962443013238814>`
                }\n` +
                `${client.translation.get(guildDb?.language, 'Settings.embed.welcomeChannel')}: ${
                  guildDb.welcomeChannel
                    ? `<#${guildDb.welcomeChannel}>`
                    : `<:x_:1077962443013238814>`
                }`
            )
            .setColor("#0598F6")
            .setFooter({
              text: client.translation.get(guildDb?.language, 'Settings.embed.footer'),
              iconURL: client.user.avatarURL(),
            });

          const welcomeButtons = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("welcome")
                .setLabel(client.translation.get(guildDb?.language, 'Settings.button.welcome'))
                .setStyle(guildDb.welcome ? "Success" : "Secondary"),
              new ButtonBuilder()
                .setCustomId("welcomeChannel")
                .setLabel(client.translation.get(guildDb?.language, 'Settings.button.welcomeChannel'))
                .setStyle(guildDb.welcomeChannel ? "Success" : "Secondary")
            ),
            welcomeButtons2 = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("welcomePing")
                .setLabel(client.translation.get(guildDb?.language, 'Settings.button.welcomePing'))
                .setStyle(guildDb.welcomePing ? "Success" : "Secondary")
            );

          interaction.reply({
            embeds: [welcomes],
            components: [welcomeButtons, welcomeButtons2],
            ephemeral: true,
          });
          break;
      }
    } else {
      const errorEmbed = new EmbedBuilder()
        .setColor("#F00505")
        .setTitle("Error!")
        .setDescription(client.translation.get(guildDb?.language, 'Settings.embed.error'));
      await interaction
        .reply({
          embeds: [errorEmbed],
          ephemeral: true,
        })
        .catch((err) => {
        });
    }
  },
};
