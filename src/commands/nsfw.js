const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const guildLang = require('../util/Models/guildModel');

require("dotenv").config();

const Topgg = require(`@top-gg/sdk`)

const api = new Topgg.Api(process.env.TOPGGTOKEN)

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nsfw')
    .setDescription('Disabled or enable nsfw questions')
    .addBooleanOption((option) =>
      option
        .setName('enable')
        .setDescription('Disbaled or enable nsfw questions')
        .setRequired(true)
    ),

  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    console.log(await api.hasVoted(interaction.user.id))
    guildLang
      .findOne({ guildID: interaction.guild.id })
      .then(async (result) => {
        const { Nsfw } = require(`../languages/${result.language}.json`);
        if (
          interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)
        ) {
            if(interaction.options.getBoolean('enable') == true) {
              if(await api.hasVoted(interaction.user.id) == true ) {
                guildLang
                .findOne({ guildID: interaction.guild.id })
                .then(async () => {
                  await guildLang.findOneAndUpdate(
                    { guildID: interaction.guild.id },
                    {
                      nsfw: true,
                    }
                  );

                  const savedchannelEmbed = new EmbedBuilder()
                    .setColor("#2f3037")
                    .setTitle("Nsfw.savedchannel.title")
                    .setDescription(`${"Nsfw.savednsfw.description"} **${interaction.options.getBoolean('enable')}**`);
                  await interaction
                    .reply({
                      embeds: [savedchannelEmbed],
                      ephemeral: true,
                    })
                    .catch((err) => {
                      return;
                    });
                });
              } else {
                const novote = new EmbedBuilder()
                  .setColor("#F00505")
                  .setTitle("Error!")
                  .setImage("https://c.tenor.com/7YMBPBszTpEAAAAd/tenor.gif")
                  .setDescription("🦹You naughty, naughty🦹");
                await interaction
                  .reply({
                    embeds: [novote],
                    components: [novotebtn],
                    ephemeral: true,
                  })
                  .catch((err) => {
                    return;
                  });
                }
            }
            if(interaction.options.getBoolean('enable') == false) {
              guildLang
                .findOne({ guildID: interaction.guild.id })
                .then(async (result) => {
                  if (result.nsfw == false) {
                    const nochannelEmbed = new EmbedBuilder()
                      .setColor("#2f3037")
                      .setTitle("Nsfw.nochannel.title")
                      .setDescription("Nsfw questions are already disabled");
                    await interaction
                      .reply({
                        embeds: [nochannelEmbed],
                        ephemeral: true,
                      })
                      .catch((err) => {
                        return;
                      });
                  } else {
                    result.nsfw = false;
                    await result.save();

                    const removedchannelEmbed = new EmbedBuilder()
                      .setColor("#2f3037")
                      .setTitle("Nsfw.removeembed.title")
                      .setDescription("Nsfw.removeembed.description");
                    await interaction
                      .reply({
                        embeds: [removedchannelEmbed],
                        ephemeral: true,
                      })
                      .catch((err) => {
                        return;
                      });
                  }
                });
            }
        } else {
          const errorembed = new EmbedBuilder()
            .setColor("#F00505")
            .setTitle("Error!")
            .setDescription("Nsfw.error.description");
          await interaction
            .reply({
              embeds: [errorembed],
              ephemeral: true,
            })
            .catch((err) => {
              return;
            });
        }
      });
  },
};