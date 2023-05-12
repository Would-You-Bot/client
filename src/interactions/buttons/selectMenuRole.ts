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
  name: 'selectMenuRole',
  description: 'Select Menu Role',
  async execute(
    interaction: ButtonInteraction,
    client: ExtendedClient,
    guildDb: GuildProfileDocument
  ) {
    if (!interaction.guild) return;

    // ! This code was trying to get `values` from a button interaction

    /* const newRole = interaction.values[0];
    const dailyMsgs = new EmbedBuilder()
      .setTitle(
        client.translation.get(guildDb?.language, 'Settings.embed.dailyTitle')
      )
      .setDescription(
        `${client.translation.get(
          guildDb?.language,
          'Settings.embed.dailyMsg'
        )}: ${
          guildDb.dailyMsg ? config.emojis.check.full : config.emojis.close.full
        }\n${client.translation.get(
          guildDb?.language,
          'Settings.embed.dailyChannel'
        )}: ${
          guildDb.dailyChannel
            ? `<#${guildDb.dailyChannel}>`
            : config.emojis.close.full
        }\n${client.translation.get(
          guildDb?.language,
          'Settings.embed.dailyRole'
        )}: <@&${newRole}>\n${client.translation.get(
          guildDb?.language,
          'Settings.embed.dailyTimezone'
        )}: ${guildDb.dailyTimezone}\n${client.translation.get(
          guildDb?.language,
          'Settings.embed.dailyInterval'
        )}: ${guildDb.dailyInterval}\n${client.translation.get(
          guildDb?.language,
          'Settings.embed.dailyType'
        )}: ${guildDb.customTypes}`
      )
      .setColor(config.colors.primary);

    const dailyButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(
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
            guildDb.dailyChannel ? ButtonStyle.Success : ButtonStyle.Secondary
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
      ),
      dailyButtons2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
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
          .setStyle(ButtonStyle.Success),
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

    await client.database.updateGuild(interaction.guild.id, {
      dailyRole: newRole,
    });

    return interaction.update({
      content: '',
      embeds: [dailyMsgs],
      components: [dailyButtons, dailyButtons2],
    }); */
  },
};

export default button;
