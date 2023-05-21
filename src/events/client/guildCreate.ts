import { EmbedBuilder, Events, Guild, WebhookClient } from 'discord.js';

import config from '@config';
import { CoreEvent, CoreLanguage } from '@typings/core';
import { ExtendedClient } from 'src/client';

/**
 * Filters the guild name to remove certain words.
 * @param name The name of the guild.
 * @returns The filtered guild name.
 */
const filterGuildName = (name: string) =>
  name.replace('Discord', '').replace('discord', '').replace('Everyone', '').replace('everyone', '');

const event: CoreEvent<ExtendedClient, [Guild]> = {
  name: Events.GuildCreate,
  /**
   * Executes the event.
   * @param client The extended client.
   * @param guild The guild that was created.
   * @returns A promise.
   */
  async execute(client: ExtendedClient, guild: Guild): Promise<unknown> {
    if (!guild.name) return;

    // Create and save the settings in the cache so that we don't need to do that at a command run
    await client.guildProfiles.create({
      guildId: guild.id,
      timezone: 'America/New_York',
      language: CoreLanguage.English,
      premium: {
        enabled: false,
      },
      welcome: {
        enabled: false,
      },
      daily: {
        enabled: false,
        time: '12:00',
        thread: false,
      },
      botJoined: Date.now(),
      debug: false,
    });

    // Create a webhook client
    const webhook = new WebhookClient({
      url: config.env.GUILD_CHANNEL,
    });

    // Emojis string
    const emojis = `${guild.verified ? config.emojis.verified.full : ''} ${
      guild.partnered ? config.emojis.partner.full : ''
    }`;

    // Send the webhook with the embed
    await webhook.send({
      username: filterGuildName(guild.name),
      avatarURL: guild.iconURL({ size: 1024 }) ?? undefined,
      embeds: [
        new EmbedBuilder()
          .setTitle(`Joined Server`)
          .setColor(config.colors.success)
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
