const {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require('discord.js');

const guildProfile = require('../util/Models/guildModel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Change settings for the welcome')
    .addSubcommand((subcommand) => subcommand.setName('remove').setDescription('Remove the welcome channel'))
    .addSubcommand((subcommand) => subcommand
      .setName('add')
      .setDescription('Add a welcome channel')
      .addChannelOption((option) => option
        .setName('channel')
        .setDescription('Channel for the welcome text')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true))),

  async execute(interaction) {
    guildProfile
      .findOne({ guildID: interaction.guild.id })
      .then(async (result) => {
        const { Welcome } = require(`../languages/${result.language}.json`);
        if (
          interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)
        ) {
          switch (interaction.options.getSubcommand()) {
            case 'add': {
              guildProfile
                .findOne({ guildID: interaction.guild.id })
                .then(async () => {
                  await guildProfile.findOneAndUpdate(
                    { guildID: interaction.guild.id },
                    {
                      welcome: true,
                      welcomeChannel: interaction.options.get('channel').value,
                    },
                  );

                  const savedchannelEmbed = new EmbedBuilder()
                    .setColor('#2f3037')
                    .setTitle(Welcome.savedchannel.title)
                    .setDescription(`${Welcome.savedchannel.description} **<#${interaction.options.get('channel').value}>** ${Welcome.savedchannel.description2}`);
                  await interaction
                    .reply({
                      embeds: [savedchannelEmbed],
                      ephemeral: true,
                    })
                    .catch((err) => {
                      return;
                    });
                });
              break;
            }
            case 'remove': {
              guildProfile
                .findOne({ guildID: interaction.guild.id })
                .then(async (result) => {
                  if (result.welcome == false) {
                    const nochannelEmbed = new EmbedBuilder()
                      .setColor('#2f3037')
                      .setTitle(Welcome.nochannel.title)
                      .setDescription(Welcome.nochannel.description);
                    await interaction
                      .reply({
                        embeds: [nochannelEmbed],
                        ephemeral: true,
                      })
                      .catch((err) => {
                        return;
                      });
                  } else {
                    result.welcome = false;
                    await result.save();

                    const removedchannelEmbed = new EmbedBuilder()
                      .setColor('#2f3037')
                      .setTitle(Welcome.removeembed.title)
                      .setDescription(Welcome.removeembed.description);
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
          }
        } else {
          const errorembed = new EmbedBuilder()
            .setColor('#F00505')
            .setTitle('Error!')
            .setDescription(Welcome.error.description);
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
