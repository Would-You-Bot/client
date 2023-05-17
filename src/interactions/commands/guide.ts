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
    .setName('guide')
    .setDescription('guide to use the bot and increase activity')
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: 'Anleitung, um den Bot zu verwenden und die Aktivität zu erhöhen',
      'es-ES': 'Guía para usar el bot y aumentar la actividad',
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
    const guideEmbed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setFooter({
        text: client.translation.get(guildDb.language, 'Guide.embed.footer'),
        iconURL: client.user?.avatarURL() || undefined,
      })
      .setTimestamp()
      .setTitle(client.translation.get(guildDb.language, 'Guide.embed.title'))
      .addFields(
        {
          name: client.translation.get(guildDb.language, 'Guide.embed.name1'),
          value: client.translation.get(
            guildDb.language,
            'Guide.embed.value1'
          ),
          inline: false,
        },
        {
          name: client.translation.get(guildDb.language, 'Guide.embed.name2'),
          value: client.translation.get(
            guildDb.language,
            'Guide.embed.value2'
          ),
          inline: false,
        },
        {
          name: client.translation.get(guildDb.language, 'Guide.embed.name3'),
          value: client.translation.get(
            guildDb.language,
            'Guide.embed.value3'
          ),
          inline: false,
        }
      )
      .setDescription(
        client.translation.get(guildDb.language, 'Guide.embed.description')
      );

    interaction
      .reply({
        embeds: [guideEmbed],
      })
      .catch(client.logger.error);
  },
};

export default command;
