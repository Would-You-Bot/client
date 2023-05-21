import { Api, ShortUser, Webhook } from '@top-gg/sdk';
import axios from 'axios';
import colors from 'colors';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, User, WebhookClient, hideLinkEmbed } from 'discord.js';
import express from 'express';

import config from '@config';
import { ExtendedClient } from 'src/client';

const app = express();
const webhook = new Webhook(config.env.PUBLIC_WEBHOOK);

interface TopGGUserData {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  banner: string;
  banner_color: string;
  accent_color: number;
  tag: string;
  createdAt: string;
  createdTimestamp: number;
  public_flags_array: string[];
  defaultAvatarURL: string;
  avatarURL: string;
  bannerURL: string;
}

/* 
* Not required for now
interface TopGGUser {
  cache_expiry: number;
  cached: boolean;
  data: TopGGUserData;
  presence: {
    status: string;
    activities: any[];
    clientStatus: string[];
  };
  connections: object;
}
 */

/**
 * The vote logger class.
 * @param client The extended client.
 */
const initializeVoteLog = (client: ExtendedClient): void => {
  if (!config.env.VOTE_WEBHOOK) return;

  const api = new Api(config.env.TOPGG_TOKEN);
  let votes = new Map();

  app.post('/dblwebhook', () => {
    webhook.listener(async (vote): Promise<void> => {
      let userData: TopGGUserData | User | null;

      userData = (await axios
        .get(`https://japi.rest/discord/v1/user/${vote.user}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        })
        .then((res) => (res.data as { data: TopGGUserData } | undefined)?.data)
        .catch(() => {
          userData = client.users.cache.get(vote.user) ?? null;
          return userData; // Return the value to be assigned to userData
        })) as TopGGUserData | User | null;

      if (!userData) return;
      if (userData.username) return;

      const button = new ActionRowBuilder<ButtonBuilder>().addComponents([
        new ButtonBuilder()
          .setLabel('Vote!')
          .setStyle(ButtonStyle.Link)
          .setEmoji('💻')
          .setURL('https://top.gg/bot/981649513427111957/vote'),
      ]);

      const emojisRandom = config.voteEmojis[Math.floor(Math.random() * config.voteEmojis.length)];

      const webhookClient = new WebhookClient({
        url: String(config.env.VOTE_WEBHOOK),
      });

      client.logger.info(colors.green(`${userData.tag} voted for me!`));

      webhookClient
        .send({
          content: `${emojisRandom} Voted for me on ${hideLinkEmbed('https://top.gg/bot/981649513427111957/vote')}`,
          components: [button],
          username: `${userData.tag
            .replace('Discord', '')
            .replace('discord', '')
            .replace('Everyone', '')
            .replace('everyone', '')}`,
          ...(userData.avatarURL && typeof userData.avatarURL === 'string' ? { avatarURL: userData.avatarURL } : {}),
        })
        .catch(client.logger.error);
    });
  });

  app.listen(8090);

  /**
   * Get the votes.
   */
  const getVotes = async (): Promise<void> => {
    const votesData: ShortUser[] = await api.getVotes();

    votes = new Map();

    for (const vote of votesData) {
      votes.set(vote.id, vote);
    }

    client.logger.debug('Successfully updated votes');
  };

  setInterval(() => {
    getVotes();
  }, 1000 * 60 * 15);
};

export default initializeVoteLog;
