import {
  MessagePayload,
  PermissionFlagsBits,
  TextChannel,
  WebhookClient,
  WebhookMessageCreateOptions,
} from 'discord.js';

import webhookModel from '@models/webhookCache.model';
import { ExtendedClient } from 'src/client';

export default class WebhookHandler {
  client: ExtendedClient;
  webhooks: Map<string, any>;
  webhookModel = webhookModel;

  constructor(client: ExtendedClient) {
    this.client = client;
    this.webhooks = new Map();
    this.webhookModel = require('../util/Models/webhookCache');
  }

  /**
   * Get a webhook from the cache and if not in cache fetch it
   * @param channelId The channel id
   * @returns The webhook or null
   */
  private async getWebhook(channelId: string) {
    if (this.webhooks.has(`${channelId}`)) return this.webhooks.get(channelId);

    const data = await this.webhookModel.findOne({
      channelId: channelId,
    });
    if (data) {
      this.webhooks.set(`${channelId}`, {
        id: data.webhookId,
        token: data.webhookToken,
      });

      return {
        id: data.webhookId,
        token: data.webhookToken,
      };
    } else return null;
  }

  /**
   * Create a webhook in a channel & save it to the database and cache
   * @param channel the channel to create the webhook in
   * @param channelId the channel id
   * @param name the name of the webhook
   * @param avatar the avatar of the webhook (url)
   * @param reason the reason for creating the webhook
   * @returns The webhook or null
   */
  private async createWebhook(
    channel: TextChannel | null = null,
    channelId: string,
    name: string,
    avatar: string | undefined,
    reason: string
  ) {
    if (!channel)
      channel = (await this.client.channels
        .fetch(channelId)
        .catch((err) => {})) as TextChannel | null;
    if (!channel || !this.client.user?.id) return;

    const clientMember = await channel.guild.members.fetch(this.client.user.id);

    if (
      !channel
        .permissionsFor(clientMember)
        .has([PermissionFlagsBits.ManageWebhooks])
    )
      return null;

    const webhook = await channel
      .createWebhook({
        name: name ?? 'Would You',
        avatar: avatar ?? this.client.user.displayAvatarURL(),
        reason: reason ?? 'Would You Webhook',
      })
      .catch((err) => {
        return err;
      });

    if (webhook?.id) {
      this.webhooks.set(`${channelId}`, {
        id: webhook.id,
        token: webhook.token,
      });

      const oldData = await this.webhookModel.findOne({
        channelId: channelId,
      });

      if (oldData) {
        await oldData.updateOne({
          channelId: channelId,
          webhookId: webhook.id,
          webhookToken: webhook.token,
        });
      } else {
        await this.webhookModel.create({
          channelId: channelId,
          webhookId: webhook.id,
          webhookToken: webhook.token,
        });
      }

      return {
        id: webhook.id,
        token: webhook.token,
      };
    } else return null;
  }

  async webhookFallBack(
    channel: TextChannel | null = null,
    channelId: string,
    message: MessagePayload | WebhookMessageCreateOptions,
    error: any | boolean = false
  ): Promise<any> {
    if (!channel)
      channel = (await this.client.channels.fetch(channelId).catch((err) => {
        console.error(err);
      })) as TextChannel | null;

    if (!channel || !this.client.user?.id) return;

    const clientMember = await channel.guild.members.fetch(this.client.user.id);

    if (
      error &&
      (error?.code === 10015 ||
        (typeof error.message === 'string' &&
          error.message.includes('Unknown Webhook'))) &&
      channel
        ?.permissionsFor(clientMember)
        .has([PermissionFlagsBits.ManageWebhooks])
    ) {
      const webhooks = await channel.fetchWebhooks();

      if (webhooks && webhooks.size > 0) {
        let i = 0;
        webhooks.forEach((web) => {
          i++;
          setInterval(() => {
            if (web?.owner?.id === this.client.user?.id) {
              web
                .delete('Deleting old webhook, to create a new one')
                .catch((err) => {});
            }
          }, 1000 * i);
        });
      }

      const webhook = await this.createWebhook(
        channel,
        channelId,
        'Would You',
        this.client.user.displayAvatarURL(),
        'Webhook token unavailable, creating new webhook'
      );

      if (!webhook?.id || !webhook.token)
        return this.webhookFallBack(channel, channelId, message, false);

      const webhookClient = new WebhookClient({
        id: webhook.id,
        token: webhook.token,
      });

      // ! Note quite sure this is safe
      if (!webhookClient)
        return this.webhookFallBack(channel, channelId, message, false);

      // ! Note quite sure this is safe
      webhookClient.send(message).catch(async (err) => {
        return this.webhookFallBack(channel, channelId, message, false);
      });
    } else {
      if (
        channel
          ?.permissionsFor(clientMember)
          .has([PermissionFlagsBits.EmbedLinks])
      ) {
        const guildSettings = await this.client.database.getGuild(
          channel.guild.id
        );

        // ! Not sure what this is
        /* message.embeds = message?.embeds ?? [];

        message.embeds.unshift(
          new EmbedBuilder()
            .setColor('#FE0001')
            .setDescription(
              '🛑 ' +
                this.c.translation.get(
                  guildSettings?.language ?? 'en_EN',
                  'webhookManager.noWebhook'
                )
            )
        ); */

        return channel.send(message).catch((err) => {
          console.log(err);
          console.log(message);
        });
      }
    }
  }

  /**
   * Send a message to a channel with a webhook
   * @param {object} channel the channel to send the message to
   * @param {string} channelId the channel id
   * @param {object} message the message to send
   * @returns void
   */
  async sendWebhook(
    channel: TextChannel | null = null,
    channelId: string,
    message: MessagePayload | WebhookMessageCreateOptions,
    thread?: boolean
  ) {
    if (!channelId && channel?.id) channelId = channel.id;

    if (!channelId) return;

    const webhookData = await this.getWebhook(channelId);

    if (webhookData?.webhookId) webhookData.id = webhookData.webhookId;
    if (webhookData?.webhookToken) webhookData.token = webhookData.webhookToken;

    if (!webhookData?.id || !webhookData?.token) {
      let webhook = await this.createWebhook(
        channel,
        channelId,
        'Would You',
        this.client.user?.displayAvatarURL(),
        'Webhook token unavailable, creating new webhook'
      );

      if (!webhook?.id || !webhook?.token)
        return this.webhookFallBack(channel, channelId, message, false);

      const webhookClient = new WebhookClient({
        id: webhook.id,
        token: webhook.token,
      });
      if (!webhookClient)
        return this.webhookFallBack(channel, channelId, message, false);

      const fallbackThread = await webhookClient.send(message).catch((err) => {
        return this.webhookFallBack(channel, channelId, message, false);
      });
      if (!thread) return;
      this.client.rest.post(
        `/channels/${channelId}/messages/${fallbackThread.id}/threads`,
        {
          headers: {
            name: 'Mixed - Daily Message',
            auto_archive_duration: '1440',
          },
        }
      );
    } else {
      const webhook = new WebhookClient({
        id: webhookData?.id,
        token: webhookData?.token,
      });
      if (!webhook) return this.webhookFallBack(channel, channelId, message);

      const webhookThread = await webhook.send(message).catch((err) => {
        return this.webhookFallBack(channel, channelId, message, err);
      });
      if (!thread) return;
      this.client.rest.post(
        `/channels/${channelId}/messages/${webhookThread.id}/threads`,
        {
          body: {
            name: 'Mixed - Daily Message',
            auto_archive_duration: '1440',
          },
        }
      );
    }
  }
}
