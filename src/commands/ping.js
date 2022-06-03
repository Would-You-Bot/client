const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const guildLang = require("../util/Models/guildModel");


module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Displays the clients ping"),

  async execute(interaction, client) {

    guildLang
    .findOne({ guildID: interaction.guild.id })
    .then(async (result) => {
       const { Ping } = require(`../languages/${result.language}.json`);

    const pingembed = new MessageEmbed()
    
    .setColor("#0598F6")
      .setAuthor({
        name: `${client.user.username}`,
        iconURL: client.user.avatarURL(),
      })
      .setFooter({ text: `${Ping.embed.footer}` })
      .setTimestamp()
      .setTitle(Ping.embed.title)
      .addFields(
        {
          name: Ping.embed.client,
          value: `> **${Math.abs(
            Date.now() - interaction.createdTimestamp
          )}**ms`,
          inline: false,
        },
        {
          name: Ping.embed.api,
          value: `> **${Math.round(client.ws.ping)}**ms`,
          inline: false,
        }
      );
    const button = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel(Ping.button.title)
        .setStyle("LINK")
        .setEmoji("💻")
        .setURL("https://discordstatus.com/")
    );

    await interaction.reply({
      embeds: [pingembed],
      components: [button],
    });
    setTimeout(function () {
      button.components[0].setDisabled(true);
      interaction.editReply({ embeds: [pingembed], components: [button] });
    }, 120000);
  });
  },
};
