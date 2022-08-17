const { CommandInteraction, EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const guildLang = require("../util/Models/guildModel.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("custom")
    .setDescription("Send a custom would you message")
    .addStringOption((option) => option.setName("custom").setDescription("Custom what would you do.").setRequired(true)),

  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    guildLang
      .findOne({ guildID: interaction.guild.id })
      .then(async (result) => {
        const { Custom } =
          await require(`../languages/${result.language}.json`);

          let customembed = new EmbedBuilder()
          .setTitle(Custom.embed.title)
          .setDescription(`> ${interaction.options.get("custom").value}`)
          .setColor("#0598F6")
          .setFooter({ text: `${Custom.embed.footer}` })
          .setTimestamp()
        try  {
        const message = await interaction.reply({
          embeds: [customembed],
          fetchReply: true,
        });

        try {
          await message.react("✅");
          await message.react("❌");
        } catch (error) {}
      } catch (error) {}
      });
  },
};
