import {
  MessagePayload,
  PermissionFlagsBits,
  TextChannel,
  WebhookClient,
  WebhookMessageCreateOptions,
} from 'discord.js';

import webhookModel from '@models/webhookCache.model';
import { ExtendedClient } from 'src/client';

/**
 *
 */
export default class WebhookHandler {
  client: ExtendedClient;
  webhooks: Map<string, any>;
  webhookModel = webhookModel;

  /**
   * @param client
   */
  constructor(client: ExtendedClient) {
    this.client = client;
    this.webhooks = new Map();
    this.webhookModel = webhookModel;
  }

  /**
   * Get a webhook from the cache and if not in cache fetch it.
   * @param channelId The channel id.
   * @returns The webhook or null.
   */
  private async getWebhook(channelId: string) {
    if (this.webhooks.has(`${channelId}`)) return this.webhooks.get(channelId);

    const data = await this.webhookModel.findOne({
      channelId,
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
    }
  }

  /**
   * Create a webhook in a channel & save it to the database and cache.
   * @param channel The channel to create the webhook in.
   * @param channelId The channel id.
   * @param name The name of the webhook.
   * @param avatar The avatar of the webhook (url).
   * @param reason The reason for creating the webhook.
   * @returns The webhook or null.
   */
  private async createWebhook(
    channel: TextChannel | undefined | null,
    channelId: string,
    name: string,
    avatar: string | undefined,
    reason: string
  ) {
    if (!channel)
      channel = (await this.client.channels
        .fetch(channelId)
        .catch(this.client.logger.error)) as TextChannel | null;
    if (!channel || !this.client.user?.id) return;

    const clientMember = await channel.guild.members.fetch(this.client.user.id);

    if (
      !channel
        .permissionsFor(clientMember)
        .has([PermissionFlagsBits.ManageWebhooks])
    )
      return null;

    try {
      const webhook = await channel.createWebhook({
        name: name ?? 'Would You',
        avatar: avatar ?? this.client.user.displayAvatarURL(),
        reason: reason ?? 'Would You Webhook',
      });

      if (!webhook) return null;

      if (webhook.id) {
        this.webhooks.set(`${channelId}`, {
          id: webhook.id,
          token: webhook.token,
        });

        const oldData = await this.webhookModel.findOne({
          channelId,
        });

        if (oldData) {
          await oldData.updateOne({
            channelId,
            webhookId: webhook.id,
            webhookToken: webhook.token,
          });
        } else {
          await this.webhookModel.create({
            channelId,
            webhookId: webhook.id,
            webhookToken: webhook.token,
          });
        }

        return {
          id: webhook.id,
          token: webhook.token,
        };
      }
    } catch (error) {
      this.client.logger.error(error);
    }
  }

  /**
   * @param channel
   * @param channelId
   * @param message
   * @param error
   */
  async webhookFallBack(
    channel: TextChannel | undefined | null,
    channelId: string,
    message: MessagePayload | WebhookMessageCreateOptions,
    error: any | boolean = false
  ): Promise<any> {
    if (!channel)
      channel = (await this.client.channels
        .fetch(channelId)
        .catch(this.client.logger.error)) as TextChannel | null;

    if (!channel || !this.client.user?.id) return;

    const clientMember = await channel.guild.members.fetch(this.client.user.id);

    if (
      error &&
      (error?.code === 10015 ||
        (typeof error.message === 'string' &&
          error.message.includes('Unknown Webhook'))) &&
      channel
        .permissionsFor(clientMember)
        .has([PermissionFlagsBits.ManageWebhooks])
    ) {
      const webhooks = await channel.fetchWebhooks();

      if (webhooks && webhooks.size > 0) {
        let i = 0;
        webhooks.forEach((web) => {
          i += 1;
          setInterval(() => {
            if (web.owner?.id === this.client.user?.id) {
              web
                .delete('Deleting old webhook, to create a new one')
                .catch(this.client.logger.error);
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
      webhookClient
        .send(message)
        .catch(async () =>
          this.webhookFallBack(channel, channelId, message, false)
        );
    } else if (
      channel
        .permissionsFor(clientMember)
        .has([PermissionFlagsBits.EmbedLinks])
    ) {
      /* const guildSettings = */ await this.client.database.getGuild(
        channel.guild.id
      );

      // ! Not sure what this is
      /* message.embeds = message?.embeds ?? [];

        message.embeds.unshift(
          new EmbedBuilder()
            .setColor('config.colors.danger)
            .setDescription(
              '🛑 ' +
                this.c.translation.get(
                  guildSettings?.language ?? 'en_EN',
                  'webhookManager.noWebhook'
                )
            )
        ); */

      return channel.send(message).catch((err) => {
        this.client.logger.error(err);
        this.client.logger.error(message);
      });
    }
  }

  /**
   * Send a message to a channel with a webhook.
   * @param channel The channel to send the message to.
   * @param channelId The channel id.
   * @param message The message to send.
   * @param thread
   * @returns Void.
   */
  async sendWebhook(
    channel: TextChannel | undefined | null,
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
      const webhook = await this.createWebhook(
        channel,
        channelId,
        'Would You',
        this.client.user?.displayAvatarURL(),
        'Webhook token unavailable, creating new webhook'
      );

      if (!webhook?.id || !webhook.token)
        return this.webhookFallBack(channel, channelId, message, false);

      const webhookClient = new WebhookClient({
        id: webhook.id,
        token: webhook.token,
      });

      if (!webhookClient)
        return this.webhookFallBack(channel, channelId, message, false);

      const fallbackThread = await webhookClient
        .send(message)
        .catch(() => this.webhookFallBack(channel, channelId, message, false));

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

      const webhookThread = await webhook
        .send(message)
        .catch((error) =>
          this.webhookFallBack(channel, channelId, message, error)
        );

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
