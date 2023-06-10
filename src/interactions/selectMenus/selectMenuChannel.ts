import { ButtonInteraction } from 'discord.js';

import { GuildProfileDocument } from '@models/GuildProfile.model';
import { ICoreButton } from '@typings/core';
import { ExtendedClient } from 'src/client';

const button: ICoreButton = {
  name: 'selectMenuChannel',
  description: 'Select Menu Channel',
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
    // ! temp if statement to prevent eslint warning
    if (!interaction.guild || !client.user || !guildDb) return null;

    // ! This code was trying to get `values` from a button interaction

    /* const newChannel = interaction.values[0];
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
        )}: <#${newChannel}>\n${client.translation.get(
          guildDb?.language,
          'Settings.embed.dailyRole'
        )}: ${
          guildDb.dailyRole
            ? `<@&${guildDb.dailyRole}>`
            : config.emojis.close.full
        }\n${client.translation.get(
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
          .setStyle(ButtonStyle.Success),
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
          .setStyle(
            guildDb.dailyRole ? ButtonStyle.Success : ButtonStyle.Secondary
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

    await client.database.updateGuild(interaction.guild.id, {
      dailyChannel: newChannel,
    });

    return interaction.update({
      content: '',
      embeds: [dailyMsgs],
      components: [dailyButtons, dailyButtons2],
    }); */
  },
};

export default button;
