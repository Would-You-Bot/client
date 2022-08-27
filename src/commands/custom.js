const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const guildLang = require('../util/Models/guildModel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('custom')
    .setDescription('Send a custom would you message')
    .addSubcommand((subcommand) => subcommand
      .setName('wouldyou')
      .setDescription('Set the language to english')
      .addStringOption((option) => option
        .setName('message')
        .setDescription('Input for the custom')
        .setRequired(true))
    .addBooleanOption(option => option.setName('voting').setDescription('Do you want users to vote?')))
    .addSubcommand((subcommand) => subcommand
      .setName('rather')
      .setDescription('Set the language to english')
      .addStringOption((option) => option
        .setRequired(true)
        .setName('messagetop')
        .setDescription('Input for the custom'))
      .addStringOption((option) => option
        .setRequired(true)
        .setName('messagebottom')
        .setDescription('Input for the custom'))
        .addBooleanOption(option => option.setName('voting').setDescription('Do you want users to vote?'))),

  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    guildLang
      .findOne({ guildID: interaction.guild.id })
      .then(async (result) => {
        const { Custom, WouldYou, Rather } = await require(`../languages/${result.language}.json`);
        switch (interaction.options.getSubcommand()) {
          case 'wouldyou': {
            const wouldyouembed = new EmbedBuilder()
              .setTitle(Custom.embed.title)
              .setDescription(`> ${interaction.options.getString('message')}`)
              .setColor('#0598F6')
              .setFooter({
                text: `${Custom.embed.footer}`,
                iconURL: client.user.avatarURL(),
              })
              .setTimestamp();
            const message = await interaction.reply({
              embeds: [wouldyouembed],
              fetchReply: true,
            }).catch((err) => { return; });
            if (interaction.options.getBoolean('voting') == true) {
            try {
              await message.react('✅');
              await message.react('❌');
              const filter = (reaction) => reaction.emoji.name == '✅' || reaction.emoji.name == '❌';

              const collector = message.createReactionCollector({
                filter,
                time: 20000,
              });
              collector.on('collect', async () => {});
    
              collector.on('end', async () => {
                const totalreactions = message.reactions.cache.get('✅').count
                    - 1
                    + message.reactions.cache.get('❌').count
                    - 1;
                let percentage = Math.round(
                  ((message.reactions.cache.get('✅').count - 1)
                      / totalreactions)
                      * 100,
                );
                let emoji = null;
                let color = null;
                const userstotal = totalreactions < 2
                  ? `${WouldYou.stats.user}`
                  : `${WouldYou.stats.users}`;
    
                if (
                  message.reactions.cache.get('✅').count
                      - 1
                      + message.reactions.cache.get('❌').count
                      - 1
                    == 0
                ) {
                  percentage = 0;
                  emoji = '🤷';
                  color = '#F0F0F0';
                }
    
                if (percentage > 50) {
                  color = '#0598F6';
                  emoji = '✅';
                } else if (percentage < 50) {
                  color = '#F00505';
                  emoji = '❌';
                } else {
                  color = '#F0F0F0';
                  emoji = '🤷';
                }
    
                wouldyouembed = new EmbedBuilder()
                  .setColor(color)
                  .setFooter({ text: `${WouldYou.embed.footer}`, iconURL: client.user.avatarURL() })
                  .setTimestamp()
                  .addFields(
                    {
                      name: WouldYou.embed.Uselessname,
                      value: `> ${interaction.options.getString('message')}`,
                      inline: false,
                    },
                    {
                      name: 'Stats',
                      value: `> **${percentage}%** ${WouldYou.stats.of} **${totalreactions} ${userstotal}** ${WouldYou.stats.taking} ${emoji}`,
                    },
                  );
    
                try {
                  await message.reactions.removeAll();
                } catch (error) {}
                await interaction.editReply({
                  embeds: [wouldyouembed],
                }).catch((err) => { return; });
    
                collector.stop();
              });
            } catch (error) {}
          }
            break;
          }
          case 'rather': {
            ratherEmebed = new EmbedBuilder()
            .setColor('#0598F6')
            .addFields({
              name: Rather.embed.usefulname,
              value: `> 1️⃣ ${interaction.options.getString('messagetop')}`,
              inline: false,
            })
            .addFields({
              name: Rather.embed.usefulname2,
              value: `> 2️⃣ ${interaction.options.getString('messagebottom')}`,
              inline: false,
            })
            .setFooter({
              text: `${Rather.embed.footer}`,
              iconURL: client.user.avatarURL(),
            })
            .setTimestamp();

             let message = await interaction.reply({
              embeds: [ratherEmebed],
              fetchReply: true,
            }).catch((err) => { return; });
        const customembed = new EmbedBuilder()
          .setTitle(Custom.embed.title)
          .setDescription(`> ${interaction.options.getString('message')}`)
          .setColor('#0598F6')
          .setFooter({
            text: `${Custom.embed.footer}`,
            iconURL: client.user.avatarURL(),
          })
          .setTimestamp();
        try {
          const message = await interaction.reply({
            embeds: [customembed],
            fetchReply: true,
          });
            if (interaction.options.getBoolean('voting') == true) {
            try {
              await message.react('1️⃣');
              await message.react('2️⃣');
              const filter = (reaction) => reaction.emoji.name == '✅' || reaction.emoji.name == '❌';

              const collector = message.createReactionCollector({
                filter,
                time: 20000,
              });
              collector.on('collect', async () => {});
    
              collector.on('end', async () => {
                const totalreactions = message.reactions.cache.get('✅').count
                    - 1
                    + message.reactions.cache.get('❌').count
                    - 1;
                let percentage = Math.round(
                  ((message.reactions.cache.get('✅').count - 1)
                      / totalreactions)
                      * 100,
                );
                let emoji = null;
                let color = null;
                const userstotal = totalreactions < 2
                  ? `${WouldYou.stats.user}`
                  : `${WouldYou.stats.users}`;
    
                if (
                  message.reactions.cache.get('✅').count
                      - 1
                      + message.reactions.cache.get('❌').count
                      - 1
                    == 0
                ) {
                  percentage = 0;
                  emoji = '🤷';
                  color = '#F0F0F0';
                }
    
                if (percentage > 50) {
                  color = '#0598F6';
                  emoji = '✅';
                } else if (percentage < 50) {
                  color = '#F00505';
                  emoji = '❌';
                } else {
                  color = '#F0F0F0';
                  emoji = '🤷';
                }
    
                rathermebed = new EmbedBuilder()
                  .setColor(color)
                  .setFooter({ text: `${WouldYou.embed.footer}`, iconURL: client.user.avatarURL() })
                  .setTimestamp()
                  .addFields({
                    name: Rather.embed.usefulname,
                    value: `> 1️⃣ ${interaction.options.getString('messagetop')}`,
                    inline: false,
                  })
                  .addFields({
                    name: Rather.embed.usefulname2,
                    value: `> 2️⃣ ${interaction.options.getString('messagebottom')}`,
                    inline: false,
                  })
    
                try {
                  await message.reactions.removeAll();
                } catch (error) {}
                await interaction.editReply({
                  embeds: [rathermebed],
                }).catch((err) => { return; });
    
                collector.stop();
              });
             
            } catch (error) {}
          }
            break;
          }
        }
      });
  },
};
