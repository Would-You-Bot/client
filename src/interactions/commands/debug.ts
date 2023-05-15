import {
  ChannelType,
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
    .setName('debug')
    .setDescription('Debug the would you bot')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDescriptionLocalizations({
      de: 'Debug den would you bot',
      'es-ES': 'Depurar el bot',
    })
    .addSubcommand((subcommand) =>
      subcommand
        .setName('mode')
        .setDescription(
          'Set the bot to debug mode. This allows our developers to use commands without permissions.'
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('webhook')
        .setDescription('Debug if the daily webhook work.')
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('channel')
        .setDescription(
          "Debug the current channel to view some permissons information's."
        )
    ),
  async execute(
    interaction: ChatInputCommandInteraction,
    client: ExtendedClient,
    guildDb: GuildProfileDocument
  ) {
    if (!interaction.guild || !interaction.guildId || !client.user?.id) return;
    if (!interaction.channel) return;
    if (interaction.channel?.type !== ChannelType.GuildText) return;

    if (client.checkDebug(guildDb, interaction.user?.id)) {
      const errorembed = new EmbedBuilder()
        .setColor(config.colors.danger)
        .setTitle('Error!')
        .setDescription(
          client.translation.get(guildDb?.language, 'Debug.permissions')
        );
      return interaction
        .reply({
          embeds: [errorembed],
          ephemeral: true,
        })
        .catch(client.logger.error);
    }

    switch (interaction.options.getSubcommand()) {
      case 'webhook': {
        if (
          !guildDb?.dailyChannel ||
          !interaction.guild.channels.cache.has(guildDb?.dailyChannel)
        )
          return interaction.reply({
            ephemeral: true,
            content: client.translation.get(
              guildDb?.language,
              'Debug.channelNotSet'
            ),
          });

        await client.webhookHandler.sendWebhook(null, guildDb?.dailyChannel, {
          content: client.translation.get(
            guildDb?.language,
            'Debug.testMessage'
          ),
        });

        return interaction.reply({
          ephemeral: true,
          content: client.translation.get(guildDb?.language, 'Debug.tryToSent'),
        });
      }
      case 'mode': {
        if (guildDb?.debugMode) {
          await client.database.updateGuild(
            interaction.guildId,
            {
              debugMode: false,
            },
            true
          );

          return interaction.reply({
            ephemeral: true,
            content: client.translation.get(
              guildDb?.language,
              'Debug.disabled'
            ),
          });
        } else {
          await client.database.updateGuild(
            interaction.guildId,
            {
              debugMode: true,
            },
            true
          );

          return interaction.reply({
            ephemeral: true,
            content: client.translation.get(guildDb?.language, 'Debug.enabled'),
          });
        }
      }
      case 'channel': {
        const debugEmbed = new EmbedBuilder()
          .setColor(config.colors.primary)
          .setTimestamp()
          .setTitle(
            client.translation.get(guildDb?.language, 'Debug.embed.title')
          )
          .setDescription(
            `**${client.translation.get(
              guildDb?.language,
              'Debug.embed.settings'
            )}:**\n` +
              `${client.translation.get(
                guildDb?.language,
                'Debug.embed.isChannel',
                {
                  is:
                    interaction?.channel?.id == guildDb?.dailyChannel
                      ? client.translation.get(
                          guildDb?.language,
                          'Debug.embed.is'
                        )
                      : client.translation.get(
                          guildDb?.language,
                          'Debug.embed.isnot'
                        ),
                }
              )}\n` +
              `**${client.translation.get(
                guildDb?.language,
                'Debug.embed.channel'
              )}:**\n` +
              `${client.translation.get(
                guildDb?.language,
                'Debug.embed.manageWebhook',
                {
                  can: interaction.channel
                    .permissionsFor(client.user.id)
                    ?.has([PermissionFlagsBits.ManageWebhooks])
                    ? client.translation.get(
                        guildDb?.language,
                        'Debug.embed.can'
                      )
                    : client.translation.get(
                        guildDb?.language,
                        'Debug.embed.cannot'
                      ),
                }
              )}\n` +
              `${client.translation.get(
                guildDb?.language,
                'Debug.embed.embedLinks',
                {
                  can: interaction.channel
                    .permissionsFor(client.user.id)
                    ?.has([PermissionFlagsBits.EmbedLinks])
                    ? client.translation.get(
                        guildDb?.language,
                        'Debug.embed.can'
                      )
                    : client.translation.get(
                        guildDb?.language,
                        'Debug.embed.cannot'
                      ),
                }
              )}\n` +
              `${client.translation.get(
                guildDb?.language,
                'Debug.embed.sendMessages',
                {
                  can: interaction.channel
                    .permissionsFor(client.user.id)
                    ?.has([PermissionFlagsBits.SendMessages])
                    ? client.translation.get(
                        guildDb?.language,
                        'Debug.embed.can'
                      )
                    : client.translation.get(
                        guildDb?.language,
                        'Debug.embed.cannot'
                      ),
                }
              )}\n` +
              `${client.translation.get(
                guildDb?.language,
                'Debug.embed.viewChannel',
                {
                  can: interaction.channel
                    .permissionsFor(client?.user.id)
                    ?.has([PermissionFlagsBits.ViewChannel])
                    ? client.translation.get(
                        guildDb?.language,
                        'Debug.embed.can'
                      )
                    : client.translation.get(
                        guildDb?.language,
                        'Debug.embed.cannot'
                      ),
                }
              )}\n` +
              `${client.translation.get(
                guildDb?.language,
                'Debug.embed.readMessageHistory',
                {
                  can: interaction.channel
                    .permissionsFor(client.user.id)
                    ?.has([PermissionFlagsBits.ReadMessageHistory])
                    ? client.translation.get(
                        guildDb?.language,
                        'Debug.embed.can'
                      )
                    : client.translation.get(
                        guildDb?.language,
                        'Debug.embed.cannot'
                      ),
                }
              )}\n` +
              '\n' +
              `**${client.translation.get(
                guildDb?.language,
                'Debug.embed.global'
              )}:**\n` +
              `${client.translation.get(
                guildDb?.language,
                'Debug.embed.g_manageWebhooks',
                {
                  can: interaction?.guild?.members?.me?.permissions?.has([
                    PermissionFlagsBits.ManageWebhooks,
                  ])
                    ? client.translation.get(
                        guildDb?.language,
                        'Debug.embed.can'
                      )
                    : client.translation.get(
                        guildDb?.language,
                        'Debug.embed.cannot'
                      ),
                }
              )}\n` +
              `${client.translation.get(
                guildDb?.language,
                'Debug.embed.g_embedLinks',
                {
                  can: interaction?.guild?.members?.me?.permissions?.has([
                    PermissionFlagsBits.EmbedLinks,
                  ])
                    ? client.translation.get(
                        guildDb?.language,
                        'Debug.embed.can'
                      )
                    : client.translation.get(
                        guildDb?.language,
                        'Debug.embed.cannot'
                      ),
                }
              )}\n` +
              `${client.translation.get(
                guildDb?.language,
                'Debug.embed.g_sendMessages',
                {
                  can: interaction?.guild?.members?.me?.permissions?.has([
                    PermissionFlagsBits.SendMessages,
                  ])
                    ? client.translation.get(
                        guildDb?.language,
                        'Debug.embed.can'
                      )
                    : client.translation.get(
                        guildDb?.language,
                        'Debug.embed.cannot'
                      ),
                }
              )}\n` +
              `${client.translation.get(
                guildDb?.language,
                'Debug.embed.g_viewChannel',
                {
                  can: interaction?.guild?.members?.me?.permissions?.has([
                    PermissionFlagsBits.ViewChannel,
                  ])
                    ? client.translation.get(
                        guildDb?.language,
                        'Debug.embed.can'
                      )
                    : client.translation.get(
                        guildDb?.language,
                        'Debug.embed.cannot'
                      ),
                }
              )}\n` +
              `${client.translation.get(
                guildDb?.language,
                'Debug.embed.g_readMessageHistory',
                {
                  can: interaction?.guild?.members?.me?.permissions?.has([
                    PermissionFlagsBits.ReadMessageHistory,
                  ])
                    ? client.translation.get(
                        guildDb?.language,
                        'Debug.embed.can'
                      )
                    : client.translation.get(
                        guildDb?.language,
                        'Debug.embed.cannot'
                      ),
                }
              )}\n`
          );

        return interaction
          .reply({
            embeds: [debugEmbed],
          })
          .catch(client.logger.error);
      }
    }
  },
};

export default command;
