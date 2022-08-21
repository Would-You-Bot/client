const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  SlashCommandBuilder,
} = require('discord.js');
const guildLang = require('../util/Models/guildModel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Help command!'),

  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    guildLang
      .findOne({ guildID: interaction.guild.id })
      .then(async (result) => {
        const { Help } = require(`../languages/${result.language}.json`);

        const helpembed = new EmbedBuilder()
          .setColor('#0598F6')
          .setFooter({
            text: `${Help.embed.footer}`,
            iconURL: client.user.avatarURL(),
          })
          .setTimestamp()
          .setTitle(Help.embed.title)
          .addFields(
            {
              name: Help.embed.Fields.name,
              value: Help.embed.Fields.value,
              inline: false,
            },
            {
              name: Help.embed.Fields.privacyname,
              value: Help.embed.Fields.privacy,
              inline: false,
            },
          )
          .setDescription(Help.embed.description);

        const button = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel(Help.button.title)
            .setStyle(5)
            .setEmoji('💫')
            .setURL('https://discord.gg/vMyXAxEznS'),
          new ButtonBuilder()
            .setLabel('Invite')
            .setStyle(5)
            .setEmoji('🤖')
            .setURL('https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=274878294080&scope=bot%20applications.commands'),
        );
        try {
          await interaction.reply({
            embeds: [helpembed],
            components: [button],
          });
        } catch (error) {}
      });
  },
};
