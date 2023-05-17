import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';

import config from '@config';
import { GuildProfileDocument } from '@models/guildProfile.model';
import { CoreCommand } from '@typings/core';
import { ExtendedClient } from 'src/client';

const command: CoreCommand = {
  data: new SlashCommandBuilder()
    .setName('vote')
    .setDescription('Vote for me!')
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: 'Stimme für mich ab!',
      'es-ES': '¡Vota por mí!',
    }),
  /**
   * @param interaction
   * @param client
   * @param guildDb
   */
  async execute(
    interaction: ChatInputCommandInteraction,
    client: ExtendedClient,
    guildDb: GuildProfileDocument
  ) {
    const votemebed = new EmbedBuilder()
      .setColor(config.colors.blurple)
      .setTitle(client.translation.get(guildDb.language, 'Vote.embed.title'))
      .addFields(
        {
          name: 'Top.gg',
          value: `> [ ${client.translation.get(
            guildDb.language,
            'Vote.embed.value'
          )}  ](https://top.gg/bot/${config.productionId}/vote)`,
          inline: true,
        },
        {
          name: 'Voidbots',
          value: `> [ ${client.translation.get(
            guildDb.language,
            'Vote.embed.value'
          )}  ](https://voidbots.net/bot/${config.productionId})`,
          inline: true,
        }
      )
      .setThumbnail(client.user?.displayAvatarURL() || null)
      .setFooter({
        text: client.translation.get(guildDb.language, 'Vote.embed.footer'),
        iconURL: client.user?.avatarURL() || undefined,
      });

    return interaction
      .reply({
        embeds: [votemebed],
      })
      .catch(client.logger.error);
  },
};

export default command;
