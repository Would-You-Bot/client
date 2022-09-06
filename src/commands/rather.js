const {
  EmbedBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require('discord.js');
const guildLang = require('../util/Models/guildModel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rather')
    .setDescription('Get a would you rather question.')
    .addSubcommand((subcommand) => subcommand
      .setName('useful')
      .setDescription('Get a useful would you rather')
      .addBooleanOption((option) => option
        .setName('voting')
        .setDescription('Do you want the users to be able to vote?')))
    .addSubcommand((subcommand) => subcommand
      .setName('useless')
      .setDescription('Get a useless would you rather')
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
        let voting = true;
        if (interaction.options.getBoolean('voting') == false) voting = false;
        const { Rather } = await require(`../languages/${result.language}.json`);
        const { Useless_Powers, Useful_Powers } = await require(`../data/power-${result.language}.json`);

        const button = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel('Invite')
            .setStyle(5)
            .setEmoji('🤖')
            .setURL(
              'https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=274878294080&scope=bot%20applications.commands',
            ),
        );
        const newButton = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel('Replay')
            .setStyle(1)
            .setEmoji('🔄')
            .setCustomId(voting ? `rather_${interaction.options.getSubcommand()}_voting` : `rather_${interaction.options.getSubcommand()}`),
        );
        let rbutton;
        if (Math.round(Math.random() * 15) < 3) {
          rbutton = [button, newButton];
        } else rbutton = [newButton];
        switch (interaction.options.getSubcommand()) {
          case 'useful':
            {
              let usefulpower1 = Useful_Powers[Math.floor(Math.random() * Useful_Powers.length)];
              let usefulpower2 = Useful_Powers[Math.floor(Math.random() * Useful_Powers.length)];

              let ratherembed = new EmbedBuilder()
                .setColor('#0598F6')
                .addFields(
                  {
                    name: Rather.embed.usefulname,
                    value: `> 1️⃣ ${usefulpower1}`,
                    inline: false,
                  },
                  {
                    name: Rather.embed.usefulname2,
                    value: `> 2️⃣ ${usefulpower2}`,
                    inline: false,
                  },
                )
                .setFooter({
                  text: `${Rather.embed.footer}`,
                  iconURL: client.user.avatarURL(),
                })
                .setTimestamp();

              let message = await interaction
                .reply({
                  embeds: [ratherembed],
                  components: rbutton,
                  fetchReply: true,
                })
                .catch((err) => {
                  return;
                });
              if (interaction.options.getBoolean('voting') == false) {
              } else {
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
                          text: `${Rather.embed.footer}`,
                          iconURL: client.user.avatarURL(),
                        })
                        .setTimestamp()
                        .addFields({
                          name: Rather.embed.thispower,
                          value: `> 1️⃣ ${usefulpower1}`,
                          inline: false,
                        });
                    } else if (
                      message.reactions.cache.get('1️⃣').count - 1
                      < message.reactions.cache.get('2️⃣').count - 1
                    ) {
                      ratherembed = new EmbedBuilder()
                        .setColor('#0598F6')
                        .setFooter({
                          text: `${Rather.embed.footer}`,
                          iconURL: client.user.avatarURL(),
                        })
                        .setTimestamp()
                        .addFields({
                          name: Rather.embed.thispower,
                          value: `> 2️⃣ ${usefulpower2}`,
                          inline: false,
                        });
                    } else {
                      ratherembed = new EmbedBuilder()
                        .setColor('#ffffff')
                        .addFields(
                          {
                            name: Rather.embed.usefulname,
                            value: `> 1️⃣ ${usefulpower1}`,
                            inline: false,
                          },
                          {
                            name: Rather.embed.usefulname2,
                            value: `> 2️⃣ ${usefulpower2}`,
                            inline: false,
                          },
                        )
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
                        components: rbutton || [],
                      })
                      .catch((err) => {
                        return;
                      });

                    collector.stop();
                  });
                } catch (error) {}
              }
            }
            break;

          case 'useless':
            {
              let uselesspower1 = Useless_Powers[
                Math.floor(Math.random() * Useless_Powers.length)
              ];
              let uselesspower2 = Useless_Powers[
                Math.floor(Math.random() * Useless_Powers.length)
              ];

              let ratherembed = new EmbedBuilder()
                .setColor('#F00505')
                .addFields(
                  {
                    name: Rather.embed.uselessname,
                    value: `> 1️⃣ ${uselesspower1}`,
                    inline: false,
                  },
                  {
                    name: Rather.embed.uselessname2,
                    value: `> 2️⃣ ${uselesspower2}`,
                    inline: false,
                  },
                )
                .setFooter({
                  text: `${Rather.embed.footer}`,
                  iconURL: client.user.avatarURL(),
                })
                .setTimestamp();

              let message = await interaction
                .reply({
                  embeds: [ratherembed],
                  fetchReply: true,
                  components: rbutton || [],
                })
                .catch((err) => {
                  return;
                });
              if (interaction.options.getBoolean('voting') == false) {
              } else {
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
                        .setColor('#F00505')
                        .setFooter({
                          text: `${Rather.embed.footer}`,
                          iconURL: client.user.avatarURL(),
                        })
                        .setTimestamp()
                        .addFields({
                          name: Rather.embed.thispower,
                          value: `> 1️⃣ ${uselesspower1}`,
                          inline: false,
                        });
                    } else if (
                      message.reactions.cache.get('1️⃣').count - 1
                      < message.reactions.cache.get('2️⃣').count - 1
                    ) {
                      ratherembed = new EmbedBuilder()
                        .setColor('#F00505')
                        .setFooter({
                          text: `${Rather.embed.footer}`,
                          iconURL: client.user.avatarURL(),
                        })
                        .setTimestamp()
                        .addFields({
                          name: Rather.embed.thispower,
                          value: `> 2️⃣ ${uselesspower2}`,
                          inline: false,
                        });
                    } else {
                      ratherembed = new EmbedBuilder()
                        .setColor('#ffffff')
                        .addFields(
                          {
                            name: Rather.embed.uselessname,
                            value: `> 1️⃣ ${uselesspower1}`,
                            inline: false,
                          },
                          {
                            name: Rather.embed.uselessname2,
                            value: `> 2️⃣ ${uselesspower2}`,
                            inline: false,
                          },
                        )
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
                        components: rbutton || [],
                      })
                      .catch((err) => {
                        return;
                      });

                    collector.stop();
                  });
                } catch (error) {}
              }
            }
            break;
        }
      });
  },
};
