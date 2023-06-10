import { EmbedBuilder, Events, Guild, WebhookClient } from 'discord.js';

import config from '@config';
import { CoreEventOptions } from '@typings/core';

/**
 * Filters the guild name to remove certain words.
 * @param name The name of the guild.
 * @returns The filtered guild name.
 */
const filterGuildName = (name: string): string =>
  name
    .replace('Discord', '')
    .replace('discord', '')
    .replace('Everyone', '')
    .replace('everyone', '');

export default <CoreEventOptions>{
  name: Events.GuildDelete,
  /**
   * Executes the event.
   * @param client The extended client.
   * @param guild The guild that was deleted.
   * @returns A promise.
   */
  async execute(client, guild: Guild) {
    if (!guild.name) return;

    // Initialize the private webhook client
    const webhookPrivate = new WebhookClient({
      url: config.env.GUILD_CHANNEL,
    });

    // Emojis string
    const emojis = `${guild.verified ? config.emojis.verified.full : ''} ${
      guild.partnered ? config.emojis.partner.full : ''
    }`;

    // Send the guild leave message to the private guild channel
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
              **Features:** ${guild.features
                .map((feature) => `${feature}`)
                .join(', ')}
              **Server Count:** ${client.guilds.cache.size}
              `
          )
          .setFooter({
            text: config.envName,
          }),
      ],
      allowedMentions: { parse: [] },
    });

    // Initialize the public webhook client
    const publicWebhook = new WebhookClient({
      url: config.env.PUBLIC_GUILD_CHANNEL,
    });

    // Send the leave message to the public guild channel
    publicWebhook.send({
      username: filterGuildName(guild.name),
      avatarURL: guild.iconURL({ size: 1024 }) ?? undefined,
      content: `${config.emojis.badCheck.full} Left ${guild.name}. I'm now in ${client.guilds.cache.size} servers.`,
    });
  },
};
