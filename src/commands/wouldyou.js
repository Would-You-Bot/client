const {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} = require('discord.js');
const guildLang = require('../util/Models/guildModel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wouldyou')
    .setDescription('Would you')
    .addSubcommand((subcommand) => subcommand.setName('useless').setDescription('Useless Power'))
    .addSubcommand((subcommand) => subcommand.setName('useful').setDescription('Useful Power')),

  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    var power;
    let wouldyouembed;
    guildLang
      .findOne({ guildID: interaction.guild.id })
      .then(async (result) => {
        const { WouldYou } = await require(`../languages/${result.language}.json`);
        const { Useless_Powers, Useful_Powers } = await require(`../data/power-${result.language}.json`);

        switch (interaction.options.getSubcommand()) {
          case 'useful': {
            power = Useful_Powers[Math.floor(Math.random() * Useful_Powers.length)];

            wouldyouembed = new EmbedBuilder()
              .setColor('#0598F6')
              .setFooter({
                text: `${WouldYou.embed.footer}`,
                iconURL: client.user.avatarURL(),
              })
              .setTimestamp()
              .addFields({
                name: WouldYou.embed.Usefulname,
                value: `> ${power}`,
                inline: false,
              });
            break;
          }
          case 'useless': {
            power = Useless_Powers[Math.floor(Math.random() * Useless_Powers.length)];

            wouldyouembed = new EmbedBuilder()
              .setColor('#F00505')
              .setFooter({
                text: `${WouldYou.embed.footer}`,
                iconURL: client.user.avatarURL(),
              })
              .setTimestamp()
              .addFields({
                name: WouldYou.embed.Uselessname,
                value: `> ${power}`,
                inline: false,
              });
          }
        }
        const message = await interaction.reply({
          embeds: [wouldyouembed],
          fetchReply: true,
        }).catch((err) => { return; });

        try {
          await message.react('✅');
          await message.react('❌');
          const filter = (reaction) => reaction.emoji.name == '✅' || reaction.emoji.name == '❌';

          const collector = message.createReactionCollector({
            filter,
            time: 200000,
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
                  value: `> ${power}`,
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
      });
  },
};
