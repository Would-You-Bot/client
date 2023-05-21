import { EmbedBuilder, Events, Guild, WebhookClient } from 'discord.js';

import config from '@config';
import { CoreEvent } from '@typings/core';
import { ExtendedClient } from 'src/client';

/**
 * Filters the guild name to remove certain words.
 * @param name The name of the guild.
 * @returns The filtered guild name.
 */
const filterGuildName = (name: string) =>
  name.replace('Discord', '').replace('discord', '').replace('Everyone', '').replace('everyone', '');

const event: CoreEvent<ExtendedClient, [Guild]> = {
  name: Events.GuildDelete,
  /**
   * Executes the event.
   * @param client The extended client.
   * @param guild The guild that was deleted.
   * @returns A promise.
   */
  async execute(client: ExtendedClient, guild: Guild) {
    if (!guild.name) return;

    // Only delete the guild settings from the cache we don't want a data lose but also don't need not used data in the cache :)
    await client.guildProfiles.delete(guild.id);

    const webhookPrivate = new WebhookClient({
      url: config.env.GUILD_CHANNEL,
    });

    // Emojis string
    const emojis = `${guild.verified ? config.emojis.verified.full : ''} ${
      guild.partnered ? config.emojis.partner.full : ''
    }`;

    await webhookPrivate.send({
      username: filterGuildName(guild.name),
      avatarURL: guild.iconURL({ size: 1024 }) ?? undefined,
      embeds: [
        new EmbedBuilder()
          .setTitle(`← Left Server`)
          .setColor(config.colors.danger)
          .setThumbnail(guild.iconURL())
          .setDescription(
            `
              ${emojis}
              **Name:** ${filterGuildName(guild.name)}
              **Users:** ${guild.memberCount.toLocaleString()}
              **Features:** ${guild.features.map((feature) => `${feature}`).join(', ')}
              **Server Count:** ${client.guilds.cache.size}
              `
          )
          .setFooter({
            text: config.envName,
          }),
      ],
      allowedMentions: { parse: [] },
    });
  },
};

export default event;
