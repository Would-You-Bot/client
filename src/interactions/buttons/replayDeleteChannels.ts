import {
  ActionRowBuilder,
  ButtonInteraction,
  StringSelectMenuBuilder,
} from 'discord.js';

import { GuildProfileDocument } from '@models/guildProfile.model';
import { CoreButton } from '@typings/core';
import { ExtendedClient } from 'src/client';

const button: CoreButton = {
  name: 'replayDeleteChannels',
  description: 'Replay Channels',
  async execute(
    interaction: ButtonInteraction,
    client: ExtendedClient,
    guildDb: GuildProfileDocument
  ) {
    if (guildDb.replayChannels.length <= 0)
      return interaction.reply({
        content: client.translation.get(
          guildDb?.language,
          'Settings.replayChannelNone'
        ),
        ephemeral: true,
      });

    const inter = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('replayDelete')
        .setPlaceholder('Select a channel to remove cooldown from')
        .addOptions(
          guildDb.replayChannels.map((channel) => ({
            label: channel.name,
            value: channel.id,
          }))
        )
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
