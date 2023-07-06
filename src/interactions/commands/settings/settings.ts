import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';

import config from '@config';
import CoreCommand from '@utils/builders/CoreCommand';

export default new CoreCommand({
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Change settings for Daily Messages and Welcomes')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDescriptionLocalizations({
      'de': 'TBA',
      'es-ES': 'TBA',
    })
    .addStringOption((option) =>
      option
        .setName('choose')
        .setDescription('Enable/disable daily Would You messages.')
        .setRequired(true)
        .addChoices(
          { name: 'General Settings', value: 'general' },
          { name: 'Daily Messages', value: 'dailyMsgs' },
          { name: 'Welcomes', value: 'welcomes' }
        )
    ),
}).execute(async (client, interaction) => {
  if (!interaction.guildId) return;

  const guildProfile = await client.guildProfiles.fetch(interaction.guildId);

  const translations = client.translations[guildProfile.language];

  /**
   * Replace the variables in a string.
   * @param input The input.
   * @returns The input with the variables replaced.
   */
  const replaceVars = (input: string): string =>
    input.replaceAll('{name}', client.user?.username ?? 'Would You');

  switch (interaction.options.getString('choose')) {
    case 'dailyMsgs':
      {
        const dailyMsgs = new EmbedBuilder()
          .setTitle(translations.dailySettings.embed.title)
          .setDescription(
            `${translations.dailySettings.embed.description}: ${
              guildProfile.daily.enabled
                ? config.emojis.check.full
                : config.emojis.close.full
            }\n` +
              `${translations.dailySettings.embed.dailyChannel}: ${
                guildProfile.daily.channel
                  ? `<#${guildProfile.daily.channel}>`
                  : config.emojis.close.full
              }\n` +
              `${translations.dailySettings.embed.dailyRole}: ${
                guildProfile.daily.role
                  ? `<@&${guildProfile.daily.role}>`
                  : config.emojis.close.full
              }\n` +
              `${translations.dailySettings.embed.dailyTime}: ${guildProfile.daily.time}\n` +
              `${translations.dailySettings.embed.dailyChannel}: ${
                guildProfile.daily.channel
                  ? config.emojis.check.full
                  : config.emojis.close.full
              }`
          )
          .setColor(config.colors.primary);

        const dailyButtons =
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId('daily*message')
              .setLabel(
                translations.dailySettings.buttons[
                  guildProfile.daily.enabled ? 'disable' : 'enable'
                ]
              )
              .setStyle(
                guildProfile.daily.enabled
                  ? ButtonStyle.Success
                  : ButtonStyle.Secondary
              ),
            new ButtonBuilder()
              .setCustomId('daily*channel')
              .setLabel(translations.dailySettings.buttons.channel)
              .setStyle(
                guildProfile.daily.channel
                  ? ButtonStyle.Success
                  : ButtonStyle.Secondary
              )
          );

        const dailyButtons2 =
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId('dailyRole')
              .setLabel(translations.dailySettings.buttons.role)
              .setStyle(
                guildProfile.daily.role
                  ? ButtonStyle.Success
                  : ButtonStyle.Secondary
              ),
            new ButtonBuilder()
              .setCustomId('dailyInterval')
              .setLabel(translations.dailySettings.buttons.time)
              .setStyle(ButtonStyle.Primary)
              .setEmoji('⏰')
          );

        const dailyButtons3 =
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId('dailyThread')
              .setLabel(
                translations.dailySettings.buttons.thread[
                  guildProfile.daily.thread ? 'disable' : 'enable'
                ]
              )
              .setStyle(
                guildProfile.daily.thread
                  ? ButtonStyle.Success
                  : ButtonStyle.Secondary
              )
          );

        interaction
          .reply({
            embeds: [dailyMsgs],
            components: [dailyButtons, dailyButtons2, dailyButtons3],
            ephemeral: true,
          })
          .catch(client.logger.error);
      }
      break;

    case 'general':
      {
        const generalMsg = new EmbedBuilder()
          .setTitle(replaceVars(translations.generalSettings.embed.title))
          .setDescription(
            `
            ${translations.generalSettings.embed.timezone}: ${guildProfile.timezone}
            ${translations.generalSettings.embed.packType}: ${guildProfile.packType}
            `
          )
          .setColor(config.colors.primary);

        const generalButtons =
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId(`general-timezone`)
              .setLabel('Timezone')
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId(`general-packType`)
              .setLabel('Pack Type')
              .setStyle(ButtonStyle.Primary)
          );

        interaction
          .reply({
            embeds: [generalMsg],
            components: [generalButtons],
            ephemeral: true,
          })
          .catch(client.logger.error);
      }
      break;

    case 'welcome':
      {
        const welcomes = new EmbedBuilder()
          .setTitle(translations.welcomeSettings.embed.title)
          .setDescription(
            `${translations.welcomeSettings.embed.description}: ${
              guildProfile.welcome.enabled
                ? config.emojis.check.full
                : config.emojis.close.full
            }\n` +
              `${translations.welcomeSettings.embed.ping}: ${
                guildProfile.welcome.ping
                  ? config.emojis.check.full
                  : config.emojis.close.full
              }\n` +
              `${translations.welcomeSettings.embed.channel}: ${
                guildProfile.welcome.channel
                  ? `<#${guildProfile.welcome.channel}>`
                  : config.emojis.close.full
              }`
          )
          .setColor(config.colors.primary);

        const welcomeButtons =
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId('welcome')
              .setLabel('Welcome')
              .setStyle(
                guildProfile.welcome.enabled
                  ? ButtonStyle.Success
                  : ButtonStyle.Secondary
              ),
            new ButtonBuilder()
              .setCustomId('welcome*channel')
              .setLabel('Channel')
              .setStyle(
                guildProfile.welcome.channel
                  ? ButtonStyle.Success
                  : ButtonStyle.Secondary
              )
          );

        const welcomeButtons2 =
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId('welcome*ping')
              .setLabel('Ping')
              .setStyle(
                guildProfile.welcome.ping
                  ? ButtonStyle.Success
                  : ButtonStyle.Secondary
              )
          );

        interaction.reply({
          embeds: [welcomes],
          components: [welcomeButtons, welcomeButtons2],
          ephemeral: true,
        });
      }
      break;
    default:
      return null;
  }
});
