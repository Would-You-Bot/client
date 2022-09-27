const {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require('discord.js');
const guildLang = require('../util/Models/guildModel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wytype')
    .setDescription('Changes the type of messages that will be used for WWYD.')
    .addSubcommand((subcommand) => subcommand.setName('regular').setDescription('This changes it to use only default messages.'))
    .addSubcommand((subcommand) => subcommand.setName('mixed').setDescription('This changes it to use both custom & default messages.'))
    .addSubcommand((subcommand) => subcommand.setName('custom').setDescription('This changes it to use only custom messages.')),

  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    let typeEmbed;
    guildLang
      .findOne({ guildID: interaction.guild.id })
      .then(async (result) => {
        const { Language, wyType } = require(`../languages/${result.language}.json`);
        if (
          interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)
        ) {
          switch (interaction.options.getSubcommand()) {
            case 'regular': {
              guildLang
                .findOne({ guildID: interaction.guild.id })
                .then(async (d) => {
                  await d
                    .updateOne(
                      {
                        customTypes: 'regular',
                      },
                    )
                    .catch();
                  d.save()
                });
              typeEmbed = new EmbedBuilder()
                .setTitle(wyType.embed.title)
                .setDescription(wyType.embed.descDef)
                .setFooter({
                  text: 'Would You',
                  iconURL: client.user.avatarURL(),
                });
              break;
            }

            case 'mixed': {
              guildLang
                .findOne({ guildID: interaction.guild.id })
                .then(async (d) => {
                  await d
                    .updateOne(
                      {
                        customTypes: 'mixed',
                      },
                    )
                    .catch();
                  d.save()
                });
              typeEmbed = new EmbedBuilder()
                .setTitle(wyType.embed.title)
                .setDescription(wyType.embed.descBoth)
                .setFooter({
                  text: 'Would You',
                  iconURL: client.user.avatarURL(),
                });
              break;
            }

            case 'custom': {
              guildLang
                .findOne({ guildID: interaction.guild.id })
                .then(async (d) => {
                  await d
                    .updateOne(
                      {
                        customTypes: 'custom',
                      },
                    )
                    .catch();
                  d.save()
                });
              typeEmbed = new EmbedBuilder()
                .setTitle(wyType.embed.title)
                .setDescription(wyType.embed.descCust)
                .setFooter({
                  text: 'Would You',
                  iconURL: client.user.avatarURL(),
                });
              break;
            }
          }
          await interaction.reply({
            embeds: [typeEmbed],
            ephemeral: true,
          }).catch((err) => { return; });
        } else {
          const errorembed = new EmbedBuilder()
            .setColor('#F00505')
            .setTitle('Error!')
            .setDescription(Language.embed.error);
          await interaction.reply({
            embeds: [errorembed],
            ephemeral: true,
          }).catch((err) => { return; });
        }
      });
  },
};
