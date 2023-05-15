import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';

import config from '@config';
import { GuildProfileDocument } from '@models/guildProfile.model';
import { CoreCommand } from '@typings/core';
import { ExtendedClient } from 'src/client';

const command: CoreCommand = {
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Change settings for Daily Messages and Welcomes')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDescriptionLocalizations({
      de: 'TBA',
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
  async execute(
    interaction: ChatInputCommandInteraction,
    client: ExtendedClient,
    guildDb: GuildProfileDocument
  ) {
    switch (interaction.options.getString('choose')) {
      case 'dailyMsgs':
        {
          const dailyMsgs = new EmbedBuilder()
            .setTitle(
              client.translation.get(
                guildDb?.language,
                'Settings.embed.dailyTitle'
              )
            )
            .setDescription(
              `${client.translation.get(
                guildDb?.language,
                'Settings.embed.dailyMsg'
              )}: ${
                guildDb.dailyMsg
                  ? config.emojis.check.full
                  : config.emojis.close.full
              }\n` +
                `${client.translation.get(
                  guildDb?.language,
                  'Settings.embed.dailyChannel'
                )}: ${
                  guildDb.dailyChannel
                    ? `<#${guildDb.dailyChannel}>`
                    : config.emojis.close.full
                }\n` +
                `${client.translation.get(
                  guildDb?.language,
                  'Settings.embed.dailyRole'
                )}: ${
                  guildDb.dailyRole
                    ? `<@&${guildDb.dailyRole}>`
                    : config.emojis.close.full
                }\n` +
                `${client.translation.get(
                  guildDb?.language,
                  'Settings.embed.dailyTimezone'
                )}: ${guildDb.dailyTimezone}\n` +
                `${client.translation.get(
                  guildDb?.language,
                  'Settings.embed.dailyInterval'
                )}: ${guildDb.dailyInterval}\n` +
                `${client.translation.get(
                  guildDb?.language,
                  'Settings.embed.dailyType'
                )}: ${guildDb?.customTypes}\n` +
                `${client.translation.get(
                  guildDb?.language,
                  'Settings.embed.dailyThread'
                )}: ${
                  guildDb.dailyThread
                    ? config.emojis.check.full
                    : config.emojis.close.full
                }`
            )
            .setColor(config.colors.primary);

          const dailyButtons =
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setCustomId('dailyMsg')
                .setLabel(
                  client.translation.get(
                    guildDb?.language,
                    'Settings.button.dailyMsg'
                  )
                )
                .setStyle(
                  guildDb.dailyMsg ? ButtonStyle.Success : ButtonStyle.Secondary
                ),
              new ButtonBuilder()
                .setCustomId('dailyChannel')
                .setLabel(
                  client.translation.get(
                    guildDb?.language,
                    'Settings.button.dailyChannel'
                  )
                )
                .setStyle(
                  guildDb.dailyChannel
                    ? ButtonStyle.Success
                    : ButtonStyle.Secondary
                ),
              new ButtonBuilder()
                .setCustomId('dailyType')
                .setLabel(
                  client.translation.get(
                    guildDb?.language,
                    'Settings.button.dailyType'
                  )
                )
                .setStyle(ButtonStyle.Primary)
                .setEmoji('📝')
            );

          const dailyButtons2 =
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setCustomId('dailyTimezone')
                .setLabel(
                  client.translation.get(
                    guildDb?.language,
                    'Settings.button.dailyTimezone'
                  )
                )
                .setStyle(ButtonStyle.Primary)
                .setEmoji('🌍'),
              new ButtonBuilder()
                .setCustomId('dailyRole')
                .setLabel(
                  client.translation.get(
                    guildDb?.language,
                    'Settings.button.dailyRole'
                  )
                )
                .setStyle(
                  guildDb.dailyRole
                    ? ButtonStyle.Success
                    : ButtonStyle.Secondary
                ),
              new ButtonBuilder()
                .setCustomId('dailyInterval')
                .setLabel(
                  client.translation.get(
                    guildDb?.language,
                    'Settings.button.dailyInterval'
                  )
                )
                .setStyle(ButtonStyle.Primary)
                .setEmoji('⏰')
            );

          const dailyButtons3 =
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setCustomId('dailyThread')
                .setLabel(
                  client.translation.get(
                    guildDb?.language,
                    'Settings.button.dailyThread'
                  )
                )
                .setStyle(
                  guildDb.dailyThread
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
            .setTitle(
              client.translation.get(
                guildDb?.language,
                'Settings.embed.generalTitle'
              )
            )
            .setDescription(
              `${client.translation.get(
                guildDb?.language,
                'Settings.embed.replayType'
              )}: ${guildDb.replayType}\n${
                guildDb.replayType === 'Channels'
                  ? `${client.translation.get(
                      guildDb?.language,
                      'Settings.embed.replayChannels'
                    )}: ${
                      guildDb.replayChannels.length > 0
                        ? `\n${guildDb.replayChannels
                            .map((c) => `<#${c.id}>: ${c.cooldown}`)
                            .join('\n')}`
                        : client.translation.get(
                            guildDb?.language,
                            `Settings.embed.replayChannelsNone`
                          )
                    }`
                  : `${client.translation.get(
                      guildDb?.language,
                      'Settings.embed.replayCooldown'
                    )}: ${guildDb.replayCooldown}`
              }`
            )
            .setColor(config.colors.primary)
            .setFooter({
              text: client.translation.get(
                guildDb?.language,
                'Settings.embed.footer'
              ),
              iconURL: client.user?.avatarURL() || undefined,
            });

          const generalButtons =
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setCustomId(
                  guildDb.replayType === 'Channels'
                    ? 'replayChannels'
                    : 'replayCooldown'
                )
                .setLabel(
                  client.translation.get(
                    guildDb?.language,
                    'Settings.button.replayCooldown'
                  )
                )
                .setStyle(
                  guildDb.replayCooldown
                    ? ButtonStyle.Success
                    : ButtonStyle.Secondary
                ),
              new ButtonBuilder()
                .setCustomId('replayType')
                .setLabel(
                  client.translation.get(
                    guildDb?.language,
                    'Settings.button.replayType'
                  )
                )
                .setStyle(ButtonStyle.Primary)
                .setEmoji('📝')
            );

          const chanDelete =
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setCustomId('replayDeleteChannels')
                .setLabel(
                  client.translation.get(
                    guildDb?.language,
                    'Settings.button.replayDeleteChannels'
                  )
                )
                .setStyle(ButtonStyle.Danger)
            );

          interaction
            .reply({
              embeds: [generalMsg],
              components:
                guildDb.replayType === 'Channels'
                  ? [generalButtons, chanDelete]
                  : [generalButtons],
              ephemeral: true,
            })
            .catch(client.logger.error);
        }
        break;

      case 'welcomes':
        {
          const welcomes = new EmbedBuilder()
            .setTitle(
              client.translation.get(
                guildDb?.language,
                'Settings.embed.welcomeTitle'
              )
            )
            .setDescription(
              `${client.translation.get(
                guildDb?.language,
                'Settings.embed.welcome'
              )}: ${
                guildDb.welcome
                  ? config.emojis.check.full
                  : config.emojis.close.full
              }\n` +
                `${client.translation.get(
                  guildDb?.language,
                  'Settings.embed.welcomePing'
                )}: ${
                  guildDb.welcomePing
                    ? config.emojis.check.full
                    : config.emojis.close.full
                }\n` +
                `${client.translation.get(
                  guildDb?.language,
                  'Settings.embed.welcomeChannel'
                )}: ${
                  guildDb.welcomeChannel
                    ? `<#${guildDb.welcomeChannel}>`
                    : config.emojis.close.full
                }`
            )
            .setColor(config.colors.primary)
            .setFooter({
              text: client.translation.get(
                guildDb?.language,
                'Settings.embed.footer'
              ),
              iconURL: client.user?.avatarURL() || undefined,
            });

          const welcomeButtons =
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setCustomId('welcome')
                .setLabel(
                  client.translation.get(
                    guildDb?.language,
                    'Settings.button.welcome'
                  )
                )
                .setStyle(
                  guildDb.welcome ? ButtonStyle.Success : ButtonStyle.Secondary
                ),
              new ButtonBuilder()
                .setCustomId('welcomeChannel')
                .setLabel(
                  client.translation.get(
                    guildDb?.language,
                    'Settings.button.welcomeChannel'
                  )
                )
                .setStyle(
                  guildDb.welcomeChannel
                    ? ButtonStyle.Success
                    : ButtonStyle.Secondary
                )
            );

          const welcomeButtons2 =
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setCustomId('welcomePing')
                .setLabel(
                  client.translation.get(
                    guildDb?.language,
                    'Settings.button.welcomePing'
                  )
                )
                .setStyle(
                  guildDb.welcomePing
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
      default: {
        const errorEmbed = new EmbedBuilder()
          .setTitle(
            client.translation.get(
              guildDb?.language,
              'Settings.embed.errorTitle'
            )
          )
          .setDescription(
            client.translation.get(
              guildDb?.language,
              'Settings.embed.errorDescription'
            )
          )
          .setColor(config.colors.danger)
          .setFooter({
            text: client.translation.get(
              guildDb?.language,
              'Settings.embed.footer'
            ),
            iconURL: client.user?.avatarURL() || undefined,
          });

        interaction.reply({
          embeds: [errorEmbed],
          ephemeral: true,
        });
      }
    }
  },
};

export default command;
