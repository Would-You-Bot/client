const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require('discord.js');
const guildLang = require('../util/Models/guildModel');

module.exports = {
  data: {
    name: 'rather_useless',
    description: 'rather useless',
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
            .setCustomId('rather_useless'),
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
              uselesspower1 = result.customMessages.filter(c => c.type === "useless")[Math.floor(Math.random() * result.customMessages.filter(c => c.type === "useless").length)].msg
            } else {
              return await interaction.reply({ ephemeral: true, content: "There's currently no custom WouldYou messages to be displayed! Either make some or change the type using \`/wytype <type>\`" })
            }
            uselesspower2 = Useless_Powers[Math.floor(Math.random() * Useless_Powers.length)];
          } else if (result.customTypes === "custom") {
            if (result.customMessages.length === 0) return await interaction.reply({ ephemeral: true, content: "There's currently no custom WouldYou messages to be displayed! Either make some or change the type using \`/wytype <type>\`" })
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

          await interaction
            .reply({
              embeds: [ratherembed],
              components: rbutton,
              fetchReply: true,
            })
            .catch((err) => {
              return;
            });
        }
      });
  },
};
