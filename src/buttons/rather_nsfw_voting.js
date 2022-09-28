const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
  } = require('discord.js');
  const guildLang = require('../util/Models/guildModel');
  
  module.exports = {
    data: {
      name: 'rather_nsfw_voting',
      description: 'rather nsfw voting',
    },
    async execute(interaction, client) {
      guildLang
        .findOne({ guildID: interaction.guild.id })
        .then(async (result) => {
          const { Rather } = await require(`../languages/${result.language}.json`);
          const { Nsfw } = await require(`../data/power-${result.language}.json`);
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
              .setCustomId('rather_nsfw_voting'),
          );
          let rbutton;
          if (Math.round(Math.random() * 15) < 3) {
            rbutton = [button, newButton];
          } else rbutton = [newButton];
          {
            let nsfwpower1;
            let nsfwpower2;
            if (result.customTypes === "regular") {
                nsfwpower1 = Nsfw[Math.floor(Math.random() * Nsfw.length)];
                nsfwpower2 = Nsfw[Math.floor(Math.random() * Nsfw.length)];
            } else if (result.customTypes === "mixed") {
              if (result.customMessages.filter(c => c.type === "nsfw") != 0) {
                nsfwpower1 = result.customMessages.filter(c => c.type === "nsfw")[Math.floor(Math.random() * result.customMessages.filter(c => c.type === "nsfw").length)].msg || Useful_Powers[Math.floor(Math.random() * Nsfw.length)];
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
              .setColor('#0598F6')
              .addFields(
                {
                  name: Rather.embed.usefulname,
                  value: `> 1️⃣ ${nsfwpower1}`,
                  inline: false,
                },
                {
                  name: Rather.embed.usefulname2,
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
                components: rbutton,
              })
              .catch((err) => {
                return;
              });
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
                      value: `> 1️⃣ ${nsfwpower1}`,
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
                      value: `> 2️⃣ ${nsfwpower2}`,
                      inline: false,
                    });
                } else {
                  ratherembed = new EmbedBuilder()
                    .setColor('#ffffff')
                    .addFields(
                      {
                        name: Rather.embed.usefulname,
                        value: `> 1️⃣ ${nsfwpower1}`,
                        inline: false,
                      },
                      {
                        name: Rather.embed.usefulname2,
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
        });
    },
  };
  