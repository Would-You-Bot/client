const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
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
    name: "replayCooldown",
    description: "Daily Message Toggle",
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

        if (guildDb.replayCooldown === value)
        return await modalInteraction.reply({
          ephemeral: true,
          content: Settings.replaySame,
        });
        if (isNumericRegex(value) === false)
        return await modalInteraction.reply({
          ephemeral: true,
          content: Settings.cooldownInvalid,
        });

        const generalMsg = new EmbedBuilder()
          .setTitle(Settings.embed.generalTitle)
          .setDescription(
            `${Settings.embed.voteCooldown}: ${
              guildDb.voteCooldown
                ? `${guildDb.voteCooldown}`
                : `<:x_:1077962443013238814>`
            }\n${Settings.embed.replayCooldown}: ${
              guildDb.replayCooldown
                ? `${value}`
                : `<:x_:1077962443013238814>`
            }\n`
          )
          .setColor("#0598F6")
          .setFooter({
            text: Settings.embed.footer,
            iconURL: client.user.avatarURL(),
          });

        const generalButtons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("voteCooldown")
            .setLabel(Settings.button.voteCooldown)
            .setStyle(guildDb.voteCooldown ? "Success" : "Secondary"),
          new ButtonBuilder()
            .setCustomId("replayCooldown")
            .setLabel(Settings.button.replayCooldown)
            .setStyle(guildDb.replayCooldown ? "Success" : "Secondary")
        );

        await client.database.updateGuild(interaction.guild.id, {
          replayCooldown: value,
        });

        return modalInteraction.update({
          content: null,
          embeds: [generalMsg],
          components: [generalButtons],
          ephemeral: true,
        });
      });
  },
};
