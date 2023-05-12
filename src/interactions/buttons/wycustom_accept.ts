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
  name: 'wycustom_accept',
  description: 'WyCustom Accept',
  async execute(
    interaction: ButtonInteraction,
    client: ExtendedClient,
    guildDb: GuildProfileDocument
  ) {
    if (!interaction.guild) return;

    const typeEmbed = new EmbedBuilder()
      .setTitle(
        client.translation.get(
          guildDb?.language,
          'wyCustom.success.embedRemoveAll.accept'
        )
      )
      .setColor(config.colors.primary)
      .setFooter({
        text: 'Would You',
        iconURL: client.user?.avatarURL() || undefined,
      });

    const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel('Accept')
        .setStyle(ButtonStyle.Danger)
        .setDisabled(true)
        .setCustomId('accept'),
      new ButtonBuilder()
        .setLabel('Decline')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true)
        .setCustomId('decline')
    );

    await client.database.updateGuild(interaction.guild.id, {
      customMessages: [],
    });

    return interaction.update({ embeds: [typeEmbed], components: [button] });
  },
};

export default button;
