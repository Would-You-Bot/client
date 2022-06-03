const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const guildLang = require("../util/Models/guildModel");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Help command!"),

  async execute(interaction, client) {
    guildLang
      .findOne({ guildID: interaction.guild.id })
      .then(async (result) => {
        const { Help } = require(`../languages/${result.language}.json`);

        var helpembed = new MessageEmbed()
        .setColor("#0598F6")
          .setAuthor({
            name: `${client.user.username}`,
            iconURL: client.user.avatarURL(),
          })
          .setFooter({ text: `${Help.embed.footer}` })
          .setTimestamp()
          .setTitle(Help.embed.title)
          .addFields(
              {
                name: Help.embed.Fields.name,
                value: Help.embed.Fields.value,
              }
          )
          .setDescription(Help.embed.description);


        const button = new MessageActionRow().addComponents(
          new MessageButton()
            .setLabel(Help.button.title)
            .setStyle("LINK")
            .setEmoji("💫")
            .setURL("https://discord.developersdungeon.xyz"),
        new MessageButton()
            .setLabel("Source code")
            .setStyle("LINK")
            .setEmoji("🤖")
            .setURL("https://github.com/Developer-Dungeon-Studio/Would-You")
        );

        await interaction.reply({
          embeds: [helpembed],
          components: [button],
        });
      });
  },
};
