import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
} from 'discord.js';

import config from '@config';
import { GuildProfileDocument } from '@models/guildProfile.model';
import { CoreButton } from '@typings/core';
import { ExtendedClient } from 'src/client';

const button: CoreButton = {
  name: 'dailyThread',
  description: 'Daily Message Thread Toggle',
  /**
   * @param interaction
   * @param client
   * @param guildDb
   */
  async execute(
    interaction: ButtonInteraction,
    client: ExtendedClient,
    guildDb: GuildProfileDocument
  ) {
    if (!interaction.guild) return;

    const check = guildDb.dailyThread;
    const dailyThreads = new EmbedBuilder()
      .setTitle(
        client.translation.get(guildDb.language, 'Settings.embed.dailyTitle')
      )
      .setDescription(
        `${client.translation.get(
          guildDb.language,
          'Settings.embed.dailyMsg'
        )}: ${
          guildDb.dailyMsg ? config.emojis.check.full : config.emojis.close.full
        }\n${client.translation.get(
          guildDb.language,
          'Settings.embed.dailyChannel'
        )}: ${
          guildDb.dailyChannel
            ? `<#${guildDb.dailyChannel}>`
            : config.emojis.close.full
        }\n${client.translation.get(
          guildDb.language,
          'Settings.embed.dailyRole'
        )}: ${
          guildDb.dailyRole
            ? `<@&${guildDb.dailyRole}>`
            : config.emojis.close.full
        }\n${client.translation.get(
          guildDb.language,
          'Settings.embed.dailyTimezone'
        )}: ${guildDb.dailyTimezone}\n${client.translation.get(
          guildDb.language,
          'Settings.embed.dailyInterval'
        )}: ${guildDb.dailyInterval}\n${client.translation.get(
          guildDb.language,
          'Settings.embed.dailyType'
        )}: ${guildDb.customTypes}\n` +
          `${client.translation.get(
            guildDb.language,
            'Settings.embed.dailyThread'
          )}: ${check ? config.emojis.close.full : config.emojis.check.full}`
      )
      .setColor(config.colors.primary);

    const dailyButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('dailyMsg')
        .setLabel(
          client.translation.get(guildDb.language, 'Settings.button.dailyMsg')
        )
        .setStyle(
          guildDb.dailyMsg ? ButtonStyle.Success : ButtonStyle.Secondary
        ),
      new ButtonBuilder()
        .setCustomId('dailyChannel')
        .setLabel(
          client.translation.get(
            guildDb.language,
            'Settings.button.dailyChannel'
          )
        )
        .setStyle(
          guildDb.dailyChannel ? ButtonStyle.Success : ButtonStyle.Secondary
        ),
      new ButtonBuilder()
        .setCustomId('dailyType')
        .setLabel(
          client.translation.get(guildDb.language, 'Settings.button.dailyType')
        )
        .setStyle(ButtonStyle.Primary)
        .setEmoji('📝')
    );

    const dailyButtons2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('dailyTimezone')
        .setLabel(
          client.translation.get(
            guildDb.language,
            'Settings.button.dailyTimezone'
          )
        )
        .setStyle(ButtonStyle.Primary)
        .setEmoji('🌍'),
      new ButtonBuilder()
        .setCustomId('dailyRole')
        .setLabel(
          client.translation.get(guildDb.language, 'Settings.button.dailyRole')
        )
        .setStyle(
          guildDb.dailyRole ? ButtonStyle.Success : ButtonStyle.Secondary
        ),
      new ButtonBuilder()
        .setCustomId('dailyInterval')
        .setLabel(
          client.translation.get(
            guildDb.language,
            'Settings.button.dailyInterval'
          )
        )
        .setStyle(ButtonStyle.Primary)
        .setEmoji('⏰')
    );

    const dailyButtons3 = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('dailyThread')
        .setLabel(
          client.translation.get(
            guildDb.language,
            'Settings.button.dailyThread'
          )
        )
        .setStyle(check ? ButtonStyle.Secondary : ButtonStyle.Success)
    );

    await client.database.updateGuild(interaction.guild.id, {
      dailyThread: check ? false : true,
    });

    return interaction.update({
      content: null,
      embeds: [dailyThreads],
      components: [dailyButtons, dailyButtons2, dailyButtons3],
    });
  },
};

export default button;
