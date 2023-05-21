import { ActionRowBuilder, ButtonInteraction, ChannelSelectMenuBuilder, ChannelType } from 'discord.js';

import { GuildProfileDocument } from '@models/GuildProfile.model';
import { CoreButton } from '@typings/core';
import { ExtendedClient } from 'src/client';

const button: CoreButton = {
  name: 'dailyChannel',
  description: 'Daily Channel',
  /**
   * @param interaction
   * @param client
   * @param guildDb
   */
  async execute(interaction: ButtonInteraction, client: ExtendedClient, guildDb: GuildProfileDocument) {
    const inter = new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
      new ChannelSelectMenuBuilder()
        .setCustomId('selectMenuChannel')
        .setPlaceholder('Select a channel')
        .addChannelTypes(ChannelType.GuildText)
    );

    interaction.update({
      embeds: [],
      content: client.translation.get(guildDb.language, 'Settings.dailyChannel'),
      components: [inter],
    });
  },
};

export default button;
