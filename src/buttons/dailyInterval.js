const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const modalObject = {
  title: "Daily Messages Interval",
  custom_id: "dailyInterval",
  components: [
    {
      type: 1,
      components: [
        {
          type: 4,
          style: 1,
          custom_id: "input",
          label: "Enter a 24 hour dailymsg interval (HH:MM).",
        },
      ],
    },
  ],
};

function isFormat(str) {
    return /^(?:[01]\d|2[0-3]):(?:00|30)$/.test(str);
  }

module.exports = {
  data: {
    name: "dailyInterval",
    description: "Daily Interval customization",
  },
  async execute(interaction, client, guildDb) {
    const { Settings } = await require(`../languages/${guildDb.language}.json`);
    interaction.showModal(modalObject);
    interaction
      .awaitModalSubmit({
        filter: (mInter) => mInter.customId === modalObject.custom_id,
        time: 60000,
      })
      .then(async (modalInteraction) => {
        const value = modalInteraction.components[0].components[0].value;

        if (guildDb.dailyInterval === value)
        return modalInteraction.reply({
          ephemeral: true,
          content: Settings.intervalSame,
        });
        if (isFormat(value) === false)
        return modalInteraction.reply({
          ephemeral: true,
          content: Settings.intervalInvalid,
        });

        const dailyMsgs = new EmbedBuilder()
        .setTitle(Settings.embed.dailyTitle)
        .setDescription(
          `${Settings.embed.dailyMsg}: ${
            guildDb.dailyMsg
              ? `<:check:1077962440815411241>`
              : `<:x_:1077962443013238814>`
          }\n` +
            `${Settings.embed.dailyChannel}: ${
              guildDb.dailyChannel
                ? `<#${guildDb.dailyChannel}>`
                : `<:x_:1077962443013238814>`
            }\n` +
            `${Settings.embed.dailyRole}: ${
              guildDb.dailyRole
                ? `<@&${guildDb.dailyRole}>`
                : `<:x_:1077962443013238814>`
            }\n` +
            `${Settings.embed.dailyTimezone}: ${guildDb.dailyTimezone}\n`
            +
            `${Settings.embed.dailyInterval}: ${value}\n`
        )
        .setColor("#0598F6")

        const dailyButtons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("dailyMsg")
            .setLabel(Settings.button.dailyMsg)
            .setStyle(guildDb.dailyMsg ? "Success" : "Secondary"),
          new ButtonBuilder()
            .setCustomId("dailyChannel")
            .setLabel(Settings.button.dailyChannel)
            .setStyle(guildDb.dailyChannel ? "Success" : "Secondary")
        ),
        dailyButtons2 = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("dailyTimezone")
            .setLabel(Settings.button.dailyTimezone)
            .setStyle("Primary")
            .setEmoji("🌍"),
          new ButtonBuilder()
            .setCustomId("dailyRole")
            .setLabel(Settings.button.dailyRole)
            .setStyle(guildDb.dailyRole ? "Success" : "Secondary"),
        new ButtonBuilder()
            .setCustomId("dailyInterval")
            .setLabel(Settings.button.dailyInterval)
            .setStyle(guildDb.dailyInterval ? "Success" : "Secondary")
            .setEmoji("⏰"),
        )

        await client.database.updateGuild(interaction.guild.id, {
          dailyInterval: value,
        });

        return modalInteraction.update({
          content: null,
          embeds: [dailyMsgs],
          components: [dailyButtons, dailyButtons2],
          ephemeral: true,
        });
      });
  },
};
