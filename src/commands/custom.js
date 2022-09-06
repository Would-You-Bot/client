const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const guildLang = require('../util/Models/guildModel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('custom')
    .setDescription('Send a custom would you message')
    .addSubcommand((subcommand) => subcommand
      .setName('wouldyou')
      .setDescription('Custom /wouldyou message')
      .addStringOption((option) => option
        .setName('message')
        .setDescription('Input for the custom message')
        .setRequired(true))
      .addBooleanOption((option) => option
        .setName('voting')
        .setDescription('Do you want the users to be able to vote?')))
    .addSubcommand((subcommand) => subcommand
      .setName('wwyd')
      .setDescription('Custom what would you do message')
      .addStringOption((option) => option
        .setName('message')
        .setDescription('Input for the custom message')
        .setRequired(true)))
    .addSubcommand((subcommand) => subcommand
      .setName('rather')
      .setDescription('Custom would you rather message')
      .addStringOption((option) => option
        .setRequired(true)
        .setName('messagetop')
        .setDescription('Input for the custom'))
      .addStringOption((option) => option
        .setRequired(true)
        .setName('messagebottom')
        .setDescription('Input for the custom'))
      .addBooleanOption((option) => option
        .setName('voting')
        .setDescription('Do you want the users to be able to vote?'))),

  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    guildLang
      .findOne({ guildID: interaction.guild.id })
      .then(async (result) => {
        const {
          Custom, WouldYou, Rather, Wwyd,
        } = await require(`../languages/${result.language}.json`);
        switch (interaction.options.getSubcommand()) {
          case 'wouldyou': {
            let wouldyouembed = new EmbedBuilder()
              .setTitle(Custom.embed.title)
              .setDescription(`> ${interaction.options.getString('message')}`)
              .setColor('#0598F6')
              .setFooter({
                text: `${Custom.embed.footer}`,
                iconURL: client.user.avatarURL(),
              })
              .setTimestamp();
            const message = await interaction
              .reply({
                embeds: [wouldyouembed],
                fetchReply: true,
              })
              .catch((err) => {
                return;
              });
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
                    .setFooter({
                      text: `${WouldYou.embed.footer}`,
                      iconURL: client.user.avatarURL(),
                    })
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
                  await interaction
                    .editReply({
                      embeds: [wouldyouembed],
                    })
                    .catch((err) => {
                      return;
                    });

                  collector.stop();
                });
              } catch (error) {}
            }
            break;
          }
          case 'rather': {
            let ratherembed = new EmbedBuilder()
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

            let message = await interaction
              .reply({
                embeds: [ratherembed],
                fetchReply: true,
              })
              .catch((err) => {
                return;
              });

            if (interaction.options.getBoolean('voting') == true) {
              try {
                await message.react('1️⃣');
                await message.react('2️⃣');
                const filter = (reaction) => reaction.emoji.name == '1️⃣' || reaction.emoji.name == '2️⃣';

                const collector = message.createReactionCollector({
                  filter,
                  time: 20000,
                });
                collector.on('collect', async () => {});

                collector.on('end', async () => {
                  if (
                    message.reactions.cache.get('1️⃣').count - 1
                    > message.reactions.cache.get('2️⃣').count - 1
                  ) {
                    ratherembed = new EmbedBuilder()
                      .setColor('#0598F6')
                      .setFooter({
                        text: `${WouldYou.embed.footer}`,
                        iconURL: client.user.avatarURL(),
                      })
                      .setTimestamp()
                      .addFields({
                        name: Rather.embed.thispower,
                        value: `> 1️⃣ ${interaction.options.getString(
                          'messagetop',
                        )}`,
                        inline: false,
                      });
                  } else if (
                    message.reactions.cache.get('1️⃣').count - 1
                    < message.reactions.cache.get('2️⃣').count - 1
                  ) {
                    ratherembed = new EmbedBuilder()
                      .setColor('#0598F6')
                      .setFooter({
                        text: `${WouldYou.embed.footer}`,
                        iconURL: client.user.avatarURL(),
                      })
                      .setTimestamp()
                      .addFields({
                        name: Rather.embed.thispower,
                        value: `> 2️⃣ ${interaction.options.getString(
                          'messagebottom',
                        )}`,
                        inline: false,
                      });
                  } else {
                    ratherembed = new EmbedBuilder()
                      .setColor('#0598F6')
                      .setDescription('Nobody gave a vote')
                      .setFooter({
                        text: `${Rather.embed.footer}`,
                        iconURL: client.user.avatarURL(),
                      })
                      .setTimestamp();
                  }

                  try {
                    await message.reactions.removeAll();
                  } catch (error) {}
                  await interaction
                    .editReply({
                      embeds: [ratherembed],
                    })
                    .catch((err) => {
                      return;
                    });

                  collector.stop();
                });
              } catch (error) {}
            }
            break;
          }
          case 'wwyd': {
            const wwydembed = new EmbedBuilder()

              .setColor('#0598F6')
              .setFooter({
                text: `${Wwyd.embed.footer}`,
                iconURL: client.user.avatarURL(),
              })
              .setTimestamp()
              .setTitle(Wwyd.embed.title)
              .setDescription(`> ${interaction.options.getString('message')}`);

            await interaction.reply({ embeds: [wwydembed] }).catch((err) => {
              return;
            });
            break;
          }
        }
      });
  },
};
