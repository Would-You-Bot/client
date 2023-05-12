import {
  ActionRowBuilder,
  ButtonInteraction,
  ChannelSelectMenuBuilder,
  ChannelType,
} from 'discord.js';

import { GuildProfileDocument } from '@models/guildProfile.model';
import { CoreButton } from '@typings/core';
import { ExtendedClient } from 'src/client';

const button: CoreButton = {
  name: 'replayChannels',
  description: 'Replay Channels',
  async execute(
    interaction: ButtonInteraction,
    client: ExtendedClient,
    guildDb: GuildProfileDocument
  ) {
    if (guildDb.replayChannels.length >= 15)
      return interaction.reply({
        content: client.translation.get(
          guildDb?.language,
          'Settings.replayChannelLimit'
        ),
        ephemeral: true,
      });

    const inter =
      new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
        new ChannelSelectMenuBuilder()
          .setCustomId('selectMenuReplay')
          .setPlaceholder('Select a channel')
          .addChannelTypes(ChannelType.GuildText)
      );

    interaction.update({
      embeds: [],
      content: client.translation.get(
        guildDb?.language,
        'Settings.replayChannel'
      ),
      components: [inter],
    });
  },
};

export default button;
