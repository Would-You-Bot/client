const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const guildLang = require("../util/Models/guildModel");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sideeffect")
    .setDescription("You get a superpower but with a sideeffect from a random user"),

  async execute(interaction, client) {
    guildLang
      .findOne({ guildID: interaction.guild.id })
      .then(async (result) => {
        const { Random } = require(`../languages/${result.language}.json`);
        const {
          usefull_superpowers,
        } = require(`../data/superpower-${result.language}.json`);

        let randMember;
        let members = await interaction.guild.members.fetch();

        randMember = members.random();

        const randomEmbed = new MessageEmbed()
          .setColor("#0598F6")
          .setFooter({ text: `${Random.embed.footer}` })
          .setTimestamp()
          .setAuthor({
            name: `${client.user.username}`,
            iconURL: client.user.avatarURL(),
          })
          .addFields({
            name: `${Random.embed.text1} **${randMember.user.username}** ${Random.embed.text2}`,
            value: `${
              usefull_superpowers[
                Math.floor(Math.random() * (usefull_superpowers.length + 1))
              ]
            }`,
            inline: false,
          });

        await interaction.reply({
          embeds: [randomEmbed],
        });
      });
  },
};
