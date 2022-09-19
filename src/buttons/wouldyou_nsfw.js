const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const guildLang = require('../util/Models/guildModel');

module.exports = {
  data: {
    name: 'wouldyou_nsfw',
    description: 'Would you nsfw',
  },
  async execute(interaction, client) {
    let power;
    let wouldyouembed;
    guildLang
      .findOne({ guildID: interaction.guild.id })
      .then(async (result) => {
        const { WouldYou } = await require(`../languages/${result.language}.json`);
        const { Nsfw } = await require(`../data/power-${result.language}.json`);
        const button = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel('Invite')
            .setStyle(5)
            .setEmoji('🤖')
            .setURL('https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=274878294080&scope=bot%20applications.commands'),
        );
        const newbutton = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel('Replay')
            .setStyle(1)
            .setEmoji('🔄')
            .setCustomId('wouldyou_nsfw'),
        );
        let rbutton;
        if (Math.round(Math.random() * 15) < 3) {
          rbutton = [button, newbutton];
        } else {
          rbutton = [newbutton];
        }

        if (result.customTypes === "regular") {
          power = Nsfw[Math.floor(Math.random() * Nsfw.length)];
        } else if (result.customTypes === "mixed") {
          let array = [];
          if (result.customMessages.filter(c => c.type === "nsfw") != 0) {
            array.push(result.customMessages.filter(c => c.type === "nsfw")[Math.floor(Math.random() * result.customMessages.filter(c => c.type === "nsfw").length)].msg || Nsfw[Math.floor(Math.random() * Nsfw.length)]);
          } else {
            power = Nsfw[Math.floor(Math.random() * Nsfw.length)];
          }
          array.push(Nsfw[Math.floor(Math.random() * Nsfw.length)]);
          power = array[Math.floor(Math.random() * array.length)]
          array = [];
        } else if (result.customTypes === "custom") {
          if (result.customMessages.filter(c => c.type === "nsfw") == 0) return await interaction.reply({ ephemeral: true, content: "There's currently no custom WouldYou messages to be displayed! Either make some or change the type using \`/wytype <type>\`" })
          power = result.customMessages.filter(c => c.type === "nsfw")[Math.floor(Math.random() * result.customMessages.filter(c => c.type === "nsfw").length)].msg;
        }

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
        await interaction.reply({
          embeds: [wouldyouembed],
          fetchReply: true,
          components: rbutton,
        }).catch((err) => { return; });
      });
  },
};
