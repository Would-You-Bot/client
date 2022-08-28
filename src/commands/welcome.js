const {
  EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, ChannelType,
} = require('discord.js');

const guildProfile = require('../util/Models/guildModel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Change settings for the welcome')
    .addSubcommand((subcommand) => subcommand
      .setName('remove')
      .setDescription('Remove the welcome channel'))
    .addSubcommand((subcommand) => subcommand
      .setName('add')
      .setDescription('Add a welcome channel')
      .addChannelOption((option) => option.setName('channel').setDescription('Channel for the welcome text').addChannelTypes(ChannelType.GuildText).setRequired(true))),

  async execute(interaction) {
    if (
      interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)
    ) {
      switch (interaction.options.getSubcommand()) {
        case 'add': {
          await guildProfile.findOneAndUpdate({ guildID: interaction.guild.id }).then(async (result) => {
            result.welcome = true;
            result.welcomeChannel = interaction.options.getChannel('channel').id;
            await result.save();

            const savedchannelEmbed = new EmbedBuilder()
              .setColor('#2f3037')
              .setTitle('Welcome channel set!')
              .setDescription(
                `You successfully set the welcome channel to: **<#${interaction.options.get(
                  'channel',
                ).value}>**`,
              );
            await interaction.reply({
              embeds: [savedchannelEmbed],
              ephemeral: true,
            }).catch((err) => { return; });
          });
          break;
        }
        case 'remove': {
          guildProfile
            .findOne({ guildID: interaction.guild.id, welcome: true })
            .then(async (result) => {
              if (!result) {
                const nochannelEmbed = new EmbedBuilder()
                  .setColor('#2f3037')
                  .setTitle('Welcome channel removed!')
                  .setDescription(
                    'Can\'t remove the welcome channel because there is no welcome channel set!',
                  );
                await interaction.reply({
                  embeds: [nochannelEmbed],
                  ephemeral: true,
                }).catch((err) => { return; });
              }

              const removedchannelEmbed = new EmbedBuilder()
                .setColor('#2f3037')
                .setTitle('Welcome channel set!')
                .setDescription(
                  'You successfully removed the welcome channel!',
                );
              await interaction.reply({
                embeds: [removedchannelEmbed],
                ephemeral: true,
              }).catch((err) => { return; });
            });
        }
      }
    } else {
      const errorembed = new EmbedBuilder()
        .setColor('#F00505')
        .setTitle('Error!')
        .setDescription("You don't have the permission to use this command!");
      await interaction.reply({
        embeds: [errorembed],
        ephemeral: true,
      }).catch((err) => { return; });
    }
  },
};
