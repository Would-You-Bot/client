import { EmbedBuilder, Events, Guild, WebhookClient } from 'discord.js';

import config from '@config';
import { CoreEvent } from '@typings/core';
import { ExtendedClient } from 'src/client';

const event: CoreEvent = {
  name: Events.GuildCreate,
  async execute(client: ExtendedClient, guild: Guild) {
    if (!guild?.name) return;

    // Create and save the settings in the cache so that we don't need to do that at a command run
    await client.database.getGuild(guild?.id, true);

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
      avatarURL: config.links.logo,
      username: config.envName,
      embeds: [
        new EmbedBuilder()
          .setTitle(`→ Joined Server`)
          .setColor(config.colors.primary)
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
          content: `${config.emojis.goodCheck.full} Joined ${guild.name}. I'm now in ${client.guilds.cache.size} guilds.`,
          username: filterGuildName(guild.name),
          avatarURL: guild.iconURL({ size: 1024 }) || undefined,
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
