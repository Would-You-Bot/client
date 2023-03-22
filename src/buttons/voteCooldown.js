const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");

const modalObject = {
  title: "Vote Cooldown",
  custom_id: "votemodal",
  components: [
    {
      type: 1,
      components: [
        {
          type: 4,
          style: 1,
          custom_id: "input",
          label: "Provide a vote cooldown in milliseconds",
        },
      ],
    },
  ],
};

function isNumericRegex(str) {
    return /^[0-9]+$/.test(str);
}

module.exports = {
  data: {
    name: "voteCooldown",
    description: "Vote Cooldown",
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

        if (guildDb.voteCooldown === value)
        return modalInteraction.reply({
          ephemeral: true,
          content: Settings.voteSame,
        });
        if (isNumericRegex(value) === false)
        return modalInteraction.reply({
          ephemeral: true,
          content: Settings.cooldownInvalid,
        });

        const generalMsg = new EmbedBuilder()
          .setTitle(Settings.embed.generalTitle)
          .setDescription(
            `${Settings.embed.voteCooldown}: ${
              guildDb.voteCooldown
                ? `${value}`
                : `<:x_:1077962443013238814>`
            }\n${Settings.embed.replayCooldown}: ${
              guildDb.replayCooldown
                ? `${guildDb.replayCooldown}`
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
            voteCooldown: value,
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
