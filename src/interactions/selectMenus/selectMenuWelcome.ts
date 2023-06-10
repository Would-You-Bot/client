import { ButtonInteraction } from 'discord.js';

import { GuildProfileDocument } from '@models/GuildProfile.model';
import { ICoreButton } from '@typings/core';
import { ExtendedClient } from 'src/client';

const button: ICoreButton = {
  name: 'seletcMenuWelcome',
  description: 'Select Menu Welcome',
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

    const welcomes = new EmbedBuilder()
      .setTitle(
        client.translation.get(guildDb?.language, 'Settings.embed.welcomeTitle')
      )
      .setDescription(
        `${client.translation.get(
          guildDb?.language,
          'Settings.embed.welcome'
        )}: ${
          guildDb.welcome ? config.emojis.check.full : config.emojis.close.full
        }\n${client.translation.get(
          guildDb?.language,
          'Settings.embed.welcomePing'
        )}: ${
          guildDb.welcomePing
            ? config.emojis.check.full
            : config.emojis.close.full
        }\n${client.translation.get(
          guildDb?.language,
          'Settings.embed.welcomeChannel'
        )}: <#${newChannel}>`
      )
      .setColor(config.colors.primary)
      .setFooter({
        text: client.translation.get(
          guildDb?.language,
          'Settings.embed.footer'
        ),
        iconURL: client.user?.avatarURL() || undefined,
      });

    const welcomeButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId('welcome')
          .setLabel(
            client.translation.get(guildDb?.language, 'Settings.button.welcome')
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
          .setStyle(ButtonStyle.Success)
      ),
      welcomeButtons2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId('welcomePing')
          .setLabel(
            client.translation.get(
              guildDb?.language,
              'Settings.button.welcomePing'
            )
          )
          .setStyle(
            guildDb.welcomePing ? ButtonStyle.Success : ButtonStyle.Secondary
          )
      );

    await client.database.updateGuild(interaction.guild.id, {
      welcomeChannel: newChannel,
    });

    return interaction.update({
      content: '',
      embeds: [welcomes],
      components: [welcomeButtons, welcomeButtons2],
    }); */
  },
};

export default button;
