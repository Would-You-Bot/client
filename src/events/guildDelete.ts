import { EmbedBuilder, Events, Guild, WebhookClient } from 'discord.js';

import config from '@config';
import { CoreEvent } from '@typings/core';
import { ExtendedClient } from 'src/client';

const event: CoreEvent = {
  name: Events.GuildDelete,
  async execute(client: ExtendedClient, guild: Guild) {
    if (!guild?.name) return;

    // Only delete the guild settings from the cache we don't want a data lose but also don't need not used data in the cache :)
    await client.database.deleteGuild(guild?.id, true);

    const webhookPrivate = new WebhookClient({
      url: config.env.PRIVATE_WEBHOOK,
    });

    let features: string | undefined;
    if ((guild.features && guild.verified) || guild.partnered) {
      features = guild.verified
        ? config.emojis.verified.full
        : config.emojis.partner.full;
    }

    await webhookPrivate.send({
      avatarURL: config.links.logo, // Make sure to update this if you ever change the link thx <3
      username: config.envName,
      embeds: [
        new EmbedBuilder()
          .setTitle(`← Left Server`)
          .setColor(config.colors.danger)
          .setThumbnail(guild.iconURL())
          .setDescription(
            `**Name**: ${
              guild.name
            }\n**Users**: ${guild.memberCount.toLocaleString()}${
              features ? `\n**Features**: ${features}` : ``
            }`
          )
          .setFooter({
            text: config.envName,
          }),
      ],
      allowedMentions: { parse: [] },
    });

    if (config.isProduction()) {
      const webhookClient = new WebhookClient({
        url: config.env.PUBLIC_WEBHOOK,
      });

      await webhookClient
        .send({
          content: `${config.emojis.badCheck.full} Left ${guild.name}. I'm now in ${client.guilds.cache.size} guilds.`,
          username: filterGuildName(guild.name),
          avatarURL:
            guild.iconURL({
              size: 1024,
            }) || undefined,
          allowedMentions: { parse: [] },
        })
        .catch((err) => console.log(err));
    }
  },
};

const filterGuildName = (name: string) => {
  return name
    .replace('Discord', '')
    .replace('discord', '')
    .replace('Everyone', '')
    .replace('everyone', '');
};

export default event;
