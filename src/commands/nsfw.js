const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const guildLang = require('../util/Models/guildModel');

require("dotenv").config();

const Topgg = require(`@top-gg/sdk`)

const api = new Topgg.Api(process.env.TOPGGTOKEN)

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nsfw')
    .setNameLocalizations({
      de: "nsfw"
    })
    .setDescription('Disabled or enable nsfw questions')
    .setDescriptionLocalizations({
      de: "Deaktiviere oder aktiviere nsfw fragen"
    })
    .addBooleanOption((option) =>
      option
        .setName('enable')
        .setNameLocalizations({
          de: "aktivieren"
        })
        .setDescription('Disbaled or enable nsfw questions')
        .setDescriptionLocalizations({
          de:  "Deaktiviere oder aktiviere nsfw fragen"
        })
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
        const { NSFW } = require(`../languages/${result.language}.json`);
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
                    .setTitle(NSFW.embed.title)
                    .setDescription(`${NSFW.embed.description} **${interaction.options.getBoolean('enable')}**`);
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
                const novotebtn = new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setLabel('Vote')
                    .setStyle(5)
                    .setEmoji('❤️')
                    .setURL(
                      'https://top.gg/bot/981649513427111957/vote',
                    ),
                );

                const novote = new EmbedBuilder()
                  .setColor("#F00505")
                  .setTitle("Error!")
                  .setDescription(NSFW.embed.errorDesc);
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
                      .setTitle("Error!")
                      .setDescription(NSFW.embed.errorAlready);
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

                    const removednsfwembed = new EmbedBuilder()
                      .setColor("#2f3037")
                      .setTitle("Sucess!")
                      .setDescription(NSFW.embed.success);
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
            .setDescription(NSFW.embed.missingPerms);
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