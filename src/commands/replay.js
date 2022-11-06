const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const guildLang = require('../util/Models/guildModel');

require("dotenv").config();

const Topgg = require(`@top-gg/sdk`)

const api = new Topgg.Api(process.env.TOPGGTOKEN)

module.exports = {
  data: new SlashCommandBuilder()
    .setName('replay')
    .setDescription('Change up the replay system')
    .addBooleanOption((option) =>
      option
        .setName('enable')
        .setDescription('Disbaled or enable the replay button.')
        .setRequired(true)
    ),

  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    guildLang
      .findOne({ guildID: interaction.guild.id })
      .then(async (result) => {
        const { REPLAY } = require(`../languages/${result.language}.json`);
        if (
          interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)
        ) {
            if(interaction.options.getBoolean('enable') == true) {
                guildLang
                .findOne({ guildID: interaction.guild.id })
                .then(async () => {
                  await guildLang.findOneAndUpdate(
                    { guildID: interaction.guild.id },
                    {
                      replay: true,
                    }
                  );

                  const savedchannelEmbed = new EmbedBuilder()
                    .setColor("#2f3037")
                    .setTitle(REPLAY.embed.title)
                    .setDescription(`${REPLAY.embed.description} **${interaction.options.getBoolean('enable')}**`);
                  await interaction
                    .reply({
                      embeds: [savedchannelEmbed],
                      ephemeral: true,
                    })
                    .catch((err) => {
                      return;
                    });
                });
            }
            if(interaction.options.getBoolean('enable') == false) {
              guildLang
                .findOne({ guildID: interaction.guild.id })
                .then(async (result) => {
                  if (result.replay == false) {
                    const nochannelEmbed = new EmbedBuilder()
                      .setColor("#2f3037")
                      .setTitle("Error!")
                      .setDescription(REPLAY.embed.errorAlready);
                    await interaction
                      .reply({
                        embeds: [nochannelEmbed],
                        ephemeral: true,
                      })
                      .catch((err) => {
                        return;
                      });
                  } else {
                    result.replay = false;
                    await result.save();

                    const removednsfwembed = new EmbedBuilder()
                      .setColor("#2f3037")
                      .setTitle("Sucess!")
                      .setDescription(REPLAY.embed.success);
                    await interaction
                      .reply({
                        embeds: [removednsfwembed],
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
            .setDescription(REPLAY.embed.missingPerms);
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