const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "wycustom_accept",
    description: "WyCustom Accept",
  },
  async execute(interaction, client, guildDb) {
    const typeEmbed = new EmbedBuilder()
      .setTitle(
        client.translation.get(
          guildDb?.language,
          "wyCustom.success.embedRemoveAll.accept",
        ),
      )
      .setColor("#0598F4")
      .setFooter({
        text: "Would You",
        iconURL: client.user.avatarURL(),
      });

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Accept")
        .setStyle(4)
        .setDisabled(true)
        .setCustomId("accept"),
      new ButtonBuilder()
        .setLabel("Decline")
        .setStyle(2)
        .setDisabled(true)
        .setCustomId("decline"),
    );

    await client.database.updateGuild(interaction.guild.id, {
      customMessages: [],
    });

    return interaction.update({ embeds: [typeEmbed], components: [button] });
  },
};
