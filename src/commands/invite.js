const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    SlashCommandBuilder,
  } = require('discord.js');
  const guildLang = require('../util/Models/guildModel');
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('invite')
      .setDescription('Invite Would You to your server!')
      .setDescriptionLocalizations({
        de: "Lade Would You auf deinem Server ein!"
      }),
  
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
  
    async execute(interaction, client) {
      guildLang
        .findOne({ guildID: interaction.guild.id })
        .then(async (result) => {
          const { Invite } = require(`../languages/${result.language}.json`);
  
          const inviteembed = new EmbedBuilder()
  
            .setColor('#0598F6')
            .setFooter({
              text: `${Invite.embed.footer}`,
              iconURL: client.user.avatarURL(),
            })
            .setTimestamp()
            .setTitle(Invite.embed.title)
            .addFields(
              {
                name: Invite.embed.client,
                value: `> **${Math.abs(
                  Date.now() - interaction.createdTimestamp,
                )}**ms`,
                inline: false,
              },

            );
          const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setLabel(Invite.button.title)
              .setStyle(5)
              .setEmoji('💻')
              .setURL('https://wouldyoubot.com/invite'),
          );
          await interaction.reply({
            embeds: [inviteembed],
            components: [button],
          }).catch((err) => { return; });
          setTimeout(() => {
            button.components[0].setDisabled(true);
            interaction.editReply({
              embeds: [inviteembed],
              components: [button],
            }).catch((err) => { return; });
          }, 120000);
        });
    },
  };
  