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
  name: 'wycustom_decline',
  description: 'WyCustom Decline',
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
    const typeEmbed = new EmbedBuilder()
      .setTitle(
        client.translation.get(
          guildDb.language,
          'wyCustom.success.embedRemoveAll.decline'
        )
      )
      .setColor(config.colors.primary)
      .setFooter({
        text: 'Would You',
        iconURL: client.user?.avatarURL() || undefined,
      });

    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel('Accept')
        .setStyle(ButtonStyle.Danger)
        .setDisabled(true)
        .setCustomId('accept'),
      new ButtonBuilder()
        .setLabel('Decline')
        .setStyle(ButtonStyle.Success)
        .setDisabled(true)
        .setCustomId('decline')
    );

    return interaction.update({ embeds: [typeEmbed], components: [buttons] });
  },
};

export default button;
