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
    .setNameLocalizations({
      de: 'würdest-du-eher',
    })
    .setDescription('Get a would you rather question.')
    .setDescriptionLocalizations({
      de: 'Erhalte eine würdest du eher Frage.',
    })
    .addSubcommand((subcommand) => subcommand
      .setName('useful')
      .setNameLocalizations({
        de: 'nützlich',
      })
      .setDescription('Get a useful would you rather question')
      .setDescriptionLocalizations({
        de: 'Erhalte eine nützliche würdest du eher Frage.',
      })
      .addBooleanOption((option) => option
        .setName('voting')
        .setNameLocalizations({
          de: 'würdest-du-eher',
        })
        .setDescription('Do you want the users to be able to vote?'))
        .setDescriptionLocalizations({
          de: 'Möchtest du, dass die Nutzer abstimmen können?',
        }))
    .addSubcommand((subcommand) => subcommand
      .setName('useless')
      .setNameLocalizations({
        de: 'nutzlos',
      })
      .setDescription('Get a useless would you rather question')
      .addBooleanOption((option) => option
        .setName('voting')
        .setNameLocalizations({
          de: 'wählen',
        })
        .setDescription('Do you want the users to be able to vote?'))
        .setDescriptionLocalizations({
          de: 'Erhalte eine würdest du eher Frage.',
        }))
    .addSubcommand((subcommand) => subcommand
    .setName('nsfw')
    .setNameLocalizations({
      de: 'nsfw',
    })
    .setDescription('Get a borderline nsfw would you rather question')
    .setDescriptionLocalizations({
      de: 'Erhalte eine nsfw würdest du eher Frage.',
    })
    .addBooleanOption((option) => option
      .setName('voting')
      .setNameLocalizations({
        de: 'würdest-du-eher',
      })
      .setDescription('Do you want the users to be able to vote?'))
      .setDescriptionLocalizations({
        de: 'Möchtest du, dass die Nutzer abstimmen können?',
      })),

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
        const { Rather, NSFW } = await require(`../languages/${result.language}.json`);
        const { Useless_Powers, Useful_Powers, Nsfw } = await require(`../data/power-${result.language}.json`);

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
              let usefulpower1;
              let usefulpower2;
              if (result.customTypes === "regular") {
                usefulpower1 = Useful_Powers[Math.floor(Math.random() * Useful_Powers.length)];
                usefulpower2 = Useful_Powers[Math.floor(Math.random() * Useful_Powers.length)];
              } else if (result.customTypes === "mixed") {
                if (result.customMessages.filter(c => c.type === "useful") != 0) {
                  usefulpower1 = result.customMessages.filter(c => c.type === "useful")[Math.floor(Math.random() * result.customMessages.filter(c => c.type === "useful").length)].msg || Useful_Powers[Math.floor(Math.random() * Useful_Powers.length)];
                } else {
                  usefulpower1 = Useful_Powers[Math.floor(Math.random() * Useful_Powers.length)];
                  usefulpower2 = Useful_Powers[Math.floor(Math.random() * Useful_Powers.length)];
                }
                usefulpower2 = Useful_Powers[Math.floor(Math.random() * Useful_Powers.length)];
              } else if (result.customTypes === "custom") {
                if (result.customMessages.filter(c => c.type === "useful") == 0) return await interaction.reply({ ephemeral: true, content: `${Rather.button.nocustom}` })
                usefulpower1 = result.customMessages.filter(c => c.type === "useful")[Math.floor(Math.random() * result.customMessages.filter(c => c.type === "useful").length)].msg;
                usefulpower2 = result.customMessages.filter(c => c.type === "useful")[Math.floor(Math.random() * result.customMessages.filter(c => c.type === "useful").length)].msg;
              }

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
              let uselesspower1;
              let uselesspower2;
              if (result.customTypes === "regular") {
                uselesspower1 = Useless_Powers[Math.floor(Math.random() * Useless_Powers.length)];
                uselesspower2 = Useless_Powers[Math.floor(Math.random() * Useless_Powers.length)];
              } else if (result.customTypes === "mixed") {
                if (result.customMessages.filter(c => c.type === "useless") != 0) {
                  uselesspower1 = result.customMessages.filter(c => c.type === "useless")[Math.floor(Math.random() * result.customMessages.filter(c => c.type === "useless").length)].msg || Useless_Powers[Math.floor(Math.random() * Useless_Powers.length)];
                } else {
                uselesspower1 = Useless_Powers[Math.floor(Math.random() * Useless_Powers.length)];
                uselesspower2 = Useless_Powers[Math.floor(Math.random() * Useless_Powers.length)];
                }
                uselesspower2 = Useless_Powers[Math.floor(Math.random() * Useless_Powers.length)];
              } else if (result.customTypes === "custom") {
                if (result.customMessages.filter(c => c.type === "useless") == 0) return await interaction.reply({ ephemeral: true, content: `${Rather.button.nocustom}` })
                uselesspower1 = result.customMessages.filter(c => c.type === "useless")[Math.floor(Math.random() * result.customMessages.filter(c => c.type === "useless").length)].msg;
                uselesspower2 = result.customMessages.filter(c => c.type === "useless")[Math.floor(Math.random() * result.customMessages.filter(c => c.type === "useless").length)].msg;
              }


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

        case 'nsfw':
          if(interaction.channel.nsfw == false) return await interaction.reply({ ephemeral: true, content: NSFW.embed.nonsfw })
          // if statement only work when user votes 
          if(!result.nsfw == true) return await interaction.reply({ ephemeral: true, content: NSFW.embed.nochannel })
          {
            let nsfwpower1;
            let nsfwpower2;
            if (result.customTypes === "regular") {
              nsfwpower1 = Nsfw[Math.floor(Math.random() * Nsfw.length)];
              nsfwpower2 = Nsfw[Math.floor(Math.random() * Nsfw.length)];
            } else if (result.customTypes === "mixed") {
              if (result.customMessages.filter(c => c.type === "nsfw") != 0) {
                nsfwpower1 = result.customMessages.filter(c => c.type === "nsfw")[Math.floor(Math.random() * result.customMessages.filter(c => c.type === "nsfw").length)].msg || Nsfw[Math.floor(Math.random() * Nsfw.length)]
              } else {
                nsfwpower1 = Nsfw[Math.floor(Math.random() * Nsfw.length)];
                nsfwpower2 = Nsfw[Math.floor(Math.random() * Nsfw.length)];
              }
              nsfwpower2 = Nsfw[Math.floor(Math.random() * Nsfw.length)];
            } else if (result.customTypes === "custom") {
              if (result.customMessages.filter(c => c.type === "nsfw") == 0) return await interaction.reply({ ephemeral: true, content: `${Rather.button.nocustom}` })
              nsfwpower1 = result.customMessages.filter(c => c.type === "nsfw")[Math.floor(Math.random() * result.customMessages.filter(c => c.type === "nsfw").length)].msg;
              nsfwpower2 = result.customMessages.filter(c => c.type === "nsfw")[Math.floor(Math.random() * result.customMessages.filter(c => c.type === "nsfw").length)].msg;
            }


            let ratherembed = new EmbedBuilder()
              .setColor('#F00505')
              .addFields(
                {
                  name: Rather.embed.uselessname,
                  value: `> 1️⃣ ${nsfwpower1}`,
                  inline: false,
                },
                {
                  name: Rather.embed.uselessname2,
                  value: `> 2️⃣ ${nsfwpower2}`,
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
                        value: `> 1️⃣ ${nsfwpower1}`,
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
                        value: `> 2️⃣ ${nsfwpower2}`,
                        inline: false,
                      });
                  } else {
                    ratherembed = new EmbedBuilder()
                      .setColor('#ffffff')
                      .addFields(
                        {
                          name: Rather.embed.uselessname,
                          value: `> 1️⃣ ${nsfwpower1}`,
                          inline: false,
                        },
                        {
                          name: Rather.embed.uselessname2,
                          value: `> 2️⃣ ${nsfwpower2}`,
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
