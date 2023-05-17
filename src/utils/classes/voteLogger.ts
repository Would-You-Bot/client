import config from '@config';
import { Api, Webhook } from '@top-gg/sdk';
import axios from 'axios';
import colors from 'colors';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  User,
  WebhookClient,
  hideLinkEmbed,
} from 'discord.js';
import express from 'express';

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
 *
 */
export default class VoteLogger {
  client: ExtendedClient;
  api: Api;
  votes: Map<string, any>;

  /**
   * @param client
   */
  constructor(client: ExtendedClient) {
    this.client = client;
    this.api = new Api(config.env.TOPGG_TOKEN);
    this.votes = new Map();

    this.getVotes().then(() => {
      this.client.logger.info(colors.green('Successfully updated votes'));
    });

    setInterval(() => {
      this.getVotes().then(() => {
        this.client.logger.info(colors.green('Successfully updated votes'));
      });
    }, 15 * 60 * 1000);
  }

  /**
   * Get all votes from top.gg.
   */
  async getVotes() {
    const votes = await this.api.getVotes();

    this.votes = new Map();

    for (const vote of votes) {
      this.votes.set(vote.id, vote);
    }
  }

  /**
   * Start the api for the vote tracker.
   */
  public startAPI() {
    app.post(
      '/dblwebhook',
      webhook.listener(async (vote) => {
        let userData: TopGGUserData | User | null;

        userData = await axios
          .get(`https://japi.rest/discord/v1/user/${vote.user}`, {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          })
          .then((res) => res.data?.data)
          .catch(() => {
            userData = this.client.users.cache.get(vote.user) ?? null;
            return userData; // Return the value to be assigned to userData
          });

        if (!userData) return;
        if (userData.username) return;

        const button = new ActionRowBuilder<ButtonBuilder>().addComponents([
          new ButtonBuilder()
            .setLabel('Vote!')
            .setStyle(ButtonStyle.Link)
            .setEmoji('💻')
            .setURL('https://top.gg/bot/981649513427111957/vote'),
        ]);

        const emojisRandom =
          config.voteEmojis[
            Math.floor(Math.random() * config.voteEmojis.length)
          ];

        const webhookClient = new WebhookClient({
          url: config.env.VOTE_WEBHOOK,
        });

        this.client.logger.info(colors.green(`${userData.tag} voted for me!`));

        webhookClient
          .send({
            content: `${emojisRandom} Voted for me on ${hideLinkEmbed(
              'https://top.gg/bot/981649513427111957/vote'
            )}`,
            components: [button],
            username: `${userData.tag
              .replace('Discord', '')
              .replace('discord', '')
              .replace('Everyone', '')
              .replace('everyone', '')}`,
            ...(userData.avatarURL && typeof userData.avatarURL === 'string'
              ? { avatarURL: userData.avatarURL }
              : {}),
          })
          .catch(this.client.logger.error);
      })
    );

    app.listen(8090);
  }
}
