const { CommandInteraction, EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const guildLang = require("../util/Models/guildModel.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wouldyou")
    .setDescription("Would you")
    .addSubcommand((subcommand) =>
      subcommand.setName("useless").setDescription("Useless superpower")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("useful").setDescription("Useful superpower")
    ),

    /**
     * @param {CommandInteraction} interaction
     */
  async execute(interaction, client) {
    let wouldyouembed;
    guildLang
      .findOne({ guildID: interaction.guild.id })
      .then(async (result) => {
        const { WouldYou } =
          await require(`../languages/${result.language}.json`);
        const { Useless_Superpowers, Useful_Superpowers } =
          await require(`../data/superpower-${result.language}.json`);

        switch (interaction.options.getSubcommand()) {
          case "useful": {

            var superpower;

            superpower = Useful_Superpowers[
              Math.floor(Math.random() * Useful_Superpowers.length)
            ]

            wouldyouembed = new EmbedBuilder()
              .setColor("#0598F6")
              .setFooter({ text: `${WouldYou.embed.footer}` })
              .setTimestamp()
              .addFields({
                name: WouldYou.embed.Usefulname,
                value: `> ${superpower}`,
                inline: false,
              });
            break;
          }
          case "useless": {

            superpower = Useless_Superpowers[
              Math.floor(Math.random() * Useless_Superpowers.length)
            ]

            wouldyouembed = new EmbedBuilder()
              .setColor("#F00505")
              .setFooter({ text: `${WouldYou.embed.footer}` })
              .setTimestamp()
              .addFields({
                name: WouldYou.embed.Uselessname,
                value: `> ${superpower}`,
                inline: false,
              });
          }
        }

        const message = await interaction.reply({
          embeds: [wouldyouembed],
          fetchReply: true,
        });
        try {
          await message.react("✅");
          await message.react("❌");
          const filter = (reaction) => {
            return reaction.emoji.name == "✅" || reaction.emoji.name == "❌";
          };

          const collector = message.createReactionCollector({filter, time: 60000});
          collector.on("collect", async () => {
          });

          collector.on("end", async () => {

            let totalreactions = message.reactions.cache.get('✅').count -1 + message.reactions.cache.get('❌').count - 1;

            let percentage = Math.round(((message.reactions.cache.get('✅').count - 1) / (totalreactions)) * 100)
            let emoji = null;
            let color = null;
            let userstotal = (totalreactions < 2) ? "user" : "users";

            if(percentage > 50) {
              color = "#0598F6"
              emoji = '✅'
            } else if(percentage < 50) {
              color = "#F00505"
              emoji = '❌'
            } else {
              color = "#F0F0F0"
              emoji = '🤷'
            }

            wouldyouembed = new EmbedBuilder()
            .setColor(color)
            .setFooter({ text: `${WouldYou.embed.footer}` })
            .setTimestamp()
            .addFields({
              name: WouldYou.embed.Uselessname,
              value: `> ${superpower}`,
              inline: false,
            }, 
            {
              name: "Stats",
              value: `> **${percentage}%** of **${totalreactions} ${userstotal}** would take this superpower. ${emoji}`,
            }
            );

            try {
                await message.reactions.removeAll()
            } catch (error) {
                console.log(error)
            }

            await interaction.editReply({
              embeds: [wouldyouembed],
            });

            collector.stop();
          });
        } catch (error) {
          return;
        }
      });
  },
};
