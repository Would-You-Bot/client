import { ActionRowBuilder, ButtonInteraction, RoleSelectMenuBuilder } from 'discord.js';

import { GuildProfileDocument } from '@models/GuildProfile.model';
import { CoreButton } from '@typings/core';
import { ExtendedClient } from 'src/client';

const button: CoreButton = {
  name: 'dailyRole',
  description: 'Daily Role',
  /**
   * @param interaction
   * @param client
   * @param guildDb
   */
  async execute(interaction: ButtonInteraction, client: ExtendedClient, guildDb: GuildProfileDocument) {
    const inter = new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
      new RoleSelectMenuBuilder().setCustomId('selectMenuRole').setPlaceholder('Select a role')
    );

    interaction.update({
      embeds: [],
      content: client.translation.get(guildDb.language, 'Settings.dailyRole'),
      components: [inter],
    });
  },
};

export default button;
