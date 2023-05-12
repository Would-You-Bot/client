import {
  ActionRowBuilder,
  ButtonInteraction,
  StringSelectMenuBuilder,
} from 'discord.js';

import { GuildProfileDocument } from '@models/guildProfile.model';
import { CoreButton } from '@typings/core';
import { ExtendedClient } from 'src/client';

const button: CoreButton = {
  name: 'dailyType',
  description: 'Daily Type',
  async execute(
    interaction: ButtonInteraction,
    client: ExtendedClient,
    guildDb: GuildProfileDocument
  ) {
    const inter = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('selectMenuType')
        .setPlaceholder('Select a type')
        .addOptions([
          {
            label: 'Regular',
            value: 'regular',
            description: 'This changes it to use only default messages.',
          },
          {
            label: 'Mixed',
            value: 'mixed',
            description:
              'This changes it to use both custom & default messages.',
          },
          {
            label: 'Custom',
            value: 'custom',
            description: 'This changes it to use only custom messages.',
          },
        ])
    );

    interaction.update({
      embeds: [],
      content: client.translation.get(guildDb?.language, 'Settings.dailyType'),
      components: [inter],
    });
  },
};

export default button;
