const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
  data: {
    name: "selectMenuWelcomeType",
    description: "Select Menu Type",
  },
  async execute(interaction, client, guildDb) {
    const newType = interaction.values[0];
    const dailyMsgs = new EmbedBuilder()
      .setTitle(
        client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomeTitle",
        ),
      )
      .setDescription(
        `${client.translation.get(
          guildDb?.language,
          "Settings.embed.welcome",
        )}: ${
          guildDb.welcome
            ? `<:check:1077962440815411241>`
            : `<:x_:1077962443013238814>`
        }\n` +
          `${client.translation.get(
            guildDb?.language,
            "Settings.embed.welcomePing",
          )}: ${
            guildDb.welcomePing
              ? `<:check:1077962440815411241>`
              : `<:x_:1077962443013238814>`
          }\n` +
          `${client.translation.get(
            guildDb?.language,
            "Settings.embed.welcomeChannel",
          )}: ${
            guildDb.welcomeChannel
              ? `<#${guildDb.welcomeChannel}>`
              : `<:x_:1077962443013238814>`
          }\n` +
          `${client.translation.get(
            guildDb?.language,
            "Settings.embed.dailyType",
          )}: ${newType}`,
      )
      .setColor("#0598F6")
      .setFooter({
        text: client.translation.get(
          guildDb?.language,
          "Settings.embed.footer",
        ),
        iconURL: client.user.avatarURL(),
      });

    const welcomeButtons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("welcome")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.welcome",
            ),
          )
          .setStyle(guildDb.welcome ? "Success" : "Secondary"),
        new ButtonBuilder()
          .setCustomId("welcomeChannel")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.welcomeChannel",
            ),
          )
          .setStyle(guildDb.welcomeChannel ? "Success" : "Secondary"),
      ),
      welcomeButtons2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("welcomePing")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.welcomePing",
            ),
          )
          .setStyle(guildDb.welcomePing ? "Success" : "Secondary"),
        new ButtonBuilder()
          .setCustomId("welcomeType")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.dailyType",
            ),
          )
          .setStyle("Primary")
          .setEmoji("📝"),
        new ButtonBuilder()
          .setCustomId("welcomeTest")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.welcomeTest",
            ),
          )
          .setStyle("Success")
          .setEmoji("▶"),
      );

    await client.database.updateGuild(interaction.guild.id, {
      welcomeType: newType,
    });

    return interaction.update({
      content: null,
      embeds: [dailyMsgs],
      components: [welcomeButtons, welcomeButtons2],
      ephemeral: true,
    });
  },
};
