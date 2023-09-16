const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const Sentry = require("@sentry/node");
const modalObject = {
  title: "Replay Cooldown",
  custom_id: "replaymodal",
  components: [
    {
      type: 1,
      components: [
        {
          type: 4,
          style: 1,
          custom_id: "input",
          label: "Provide a replay cooldown in milliseconds",
        },
      ],
    },
  ],
};

function isNumericRegex(str) {
  return /^[0-9]+$/.test(str); // regex for extra 0,00000002% speeds :trol:
}
module.exports = {
  data: {
    name: "selectMenuReplay",
    description: "Select Menu Replay",
  },
  async execute(interaction, client, guildDb) {
    if (guildDb.replayChannels.find((c) => c.id === interaction.values[0]))
      return interaction.reply({
        content: client.translation.get(
          guildDb?.language,
          "Settings.replayChannelAlready",
        ),
        ephemeral: true,
      });

    interaction.showModal(modalObject);
    interaction
      .awaitModalSubmit({
        filter: (mInter) => mInter.customId === modalObject.custom_id,
        time: 60000,
      })
      .then(async (modalInteraction) => {
        const value = modalInteraction.components[0].components[0].value;
        if (isNumericRegex(value) === false)
          return modalInteraction.reply({
            ephemeral: true,
            content: client.translation.get(
              guildDb?.language,
              "Settings.cooldownInvalid",
            ),
          });

        if (value < 2000)
          return modalInteraction.reply({
            ephemeral: true,
            content: client.translation.get(
              guildDb?.language,
              "Settings.cooldownMin",
            ),
          });

        if (value > 21600000)
          return modalInteraction.reply({
            ephemeral: true,
            content: client.translation.get(
              guildDb?.language,
              "Settings.cooldownTooLong",
            ),
          });

        const arr =
          guildDb.replayChannels.length > 0
            ? [{ id: interaction.values[0], cooldown: value }].concat(
                guildDb.replayChannels,
              )
            : [{ id: interaction.values[0], cooldown: value }];

        const generalMsg = new EmbedBuilder()
          .setTitle(
            client.translation.get(
              guildDb?.language,
              "Settings.embed.generalTitle",
            ),
          )
          .setDescription(
            `${client.translation.get(
              guildDb?.language,
              "Settings.embed.replayType",
            )}: ${guildDb.replayType}\n ${client.translation.get(
              guildDb?.language,
              "Settings.embed.replayChannels",
            )}:\n${arr.map((c) => `<#${c.id}>: ${c.cooldown}`).join("\n")}`,
          )
          .setColor("#0598F6")
          .setFooter({
            text: client.translation.get(
              guildDb?.language,
              "Settings.embed.footer",
            ),
            iconURL: client.user.avatarURL(),
          });

        const generalButtons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("replayChannels")
            .setLabel(
              client.translation.get(
                guildDb?.language,
                "Settings.button.replayCooldown",
              ),
            )
            .setStyle(guildDb.replayCooldown ? "Success" : "Secondary"),
          new ButtonBuilder()
            .setCustomId("replayType")
            .setLabel(
              client.translation.get(
                guildDb?.language,
                "Settings.button.replayType",
              ),
            )
            .setStyle("Primary")
            .setEmoji("📝"),
        );

        const chanDelete = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("replayDeleteChannels")
            .setLabel(
              client.translation.get(
                guildDb?.language,
                "Settings.button.replayDeleteChannels",
              ),
            )
            .setStyle("Danger"),
        );

        const channel = client.channels.cache.get(interaction.values[0]);
        guildDb.replayChannels.push({
          id: interaction.values[0],
          cooldown: value,
          name: channel.name.slice(0, 25),
        });
        await client.database.updateGuild(interaction.guild.id, {
          replayChannels: guildDb.replayChannels,
        });
        return modalInteraction.update({
          content: null,
          embeds: [generalMsg],
          components: [generalButtons, chanDelete],
          ephemeral: true,
        });
      })
      .catch((err) => {
        Sentry.captureException(err);
      });
  },
};
