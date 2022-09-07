const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require('discord.js');
const guildLang = require('../util/Models/guildModel');

module.exports = {
  data: {
    name: 'rather_useless_voting',
    description: 'rather useless voting',
  },
  async execute(interaction, client) {
    guildLang
      .findOne({ guildID: interaction.guild.id })
      .then(async (result) => {
        const { Rather } = await require(`../languages/${result.language}.json`);
        const { Useless_Powers } = await require(`../data/power-${result.language}.json`);
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
            .setCustomId('rather_useless_voting'),
        );
        let rbutton;
        if (Math.round(Math.random() * 15) < 3) {
          rbutton = [button, newButton];
        } else rbutton = [newButton];
        {
          
          let uselesspower1;
          let uselesspower2;
          if (result.customTypes === "regular") {
            uselesspower1 = Useless_Powers[Math.floor(Math.random() * Useless_Powers.length)];
            uselesspower2 = Useless_Powers[Math.floor(Math.random() * Useless_Powers.length)];
          } else if (result.customTypes === "mixed") {
            if (result.customMessages.length > 0) {
              uselesspower1 = result.customMessages.filter(c => c.type === "useful")[Math.floor(Math.random() * result.customMessages.filter(c => c.type === "useful").length)].msg
            } else {
              return await interaction.reply({ ephemeral: true, content: "There's currently no custom WouldYou messages to be displayed! Either make some or change the type using \`/wytype <type>\`" })
            }
            uselesspower2 = Useless_Powers[Math.floor(Math.random() * Useless_Powers.length)];
          } else if (result.customTypes === "custom") {
            if (result.customMessages.length === 0) return await interaction.reply({ ephemeral: true, content: "There's currently no custom WouldYou messages to be displayed! Either make some or change the type using \`/wytype <type>\`" })
            uselesspower1 = result.customMessages.filter(c => c.type === "useful")[Math.floor(Math.random() * result.customMessages.filter(c => c.type === "useful").length)].msg;
            uselesspower2 = result.customMessages.filter(c => c.type === "useful")[Math.floor(Math.random() * result.customMessages.filter(c => c.type === "useful").length)].msg;
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
                    value: `> 1️⃣ ${uselesspower1}`,
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
      });
  },
};
