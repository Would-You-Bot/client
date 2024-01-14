import { PermissionFlagsBits, WebhookClient, EmbedBuilder } from "discord.js";
import { captureException } from "@sentry/node";
import { Model } from "mongoose";
import { IWebhookCache, WebhookCache } from "./Models/webhookCache";
import WouldYou from "./wouldYou";
import Cryptr from "cryptr";

const cryptr = new Cryptr(process.env.ENCRYPTION_KEY as string);

export default class WebhookHandler {
  private webhooks: Map<string, { id: string; token: string }>;
  private webhookModel: Model<IWebhookCache>;
  private c: WouldYou;

  constructor(client: WouldYou) {
    this.webhooks = new Map();
    this.webhookModel = WebhookCache;

    if (!client) throw new Error("No client provided");

    this.c = client;
  }

  updateLastUsed(token: string) {
    this.webhookModel
      .findOneAndUpdate(
        { webhookToken: cryptr.encrypt(token) },
        { lastUsageTimestamp: Date.now() },
      )
      .then(() => {});
  }

  /**
   * Get a webhook from the cache and if not in cache fetch it
   * @param {string} channelId the channel id
   * @return {Promise<object>}
   * @private
   */
  getWebhook = async (channelId: string) => {
    if (this.webhooks.has(`${channelId}`)) {
      const webhookData = this.webhooks.get(channelId);

      this.updateLastUsed(webhookData?.token as string);
      return webhookData;
    }

    const data = await this.webhookModel.findOne({
      channelId: channelId,
    });

    if (data) {
      const token = cryptr.decrypt(data.webhookToken);

      this.updateLastUsed(token as string);

      this.webhooks.set(`${channelId}`, {
        id: data.webhookId,
        token: token,
      });

      return {
        id: data.webhookId,
        token: token,
      };
    } else return null;
  };

  /**
   * Create a webhook in a channel & save it to the database and cache
   * @param {object | null} channel the channel to create the webhook in
   * @param {string} channelId the channel id
   * @param {string} guildId the guild id
   * @param {string} name the name of the webhook
   * @param {string} avatar the avatar of the webhook (url)
   * @param {string} reason the reason for creating the webhook
   * @return {Promise<object>}
   * @private
   */
  createWebhook = async (
    channel: any = null,
    channelId: string,
    guildId: string,
    name: string,
    avatar: string,
    reason: string,
  ) => {
    if (!channel)
      channel = await this.c.channels.fetch(channelId).catch((err) => {
        captureException(err);
      });

    if (!channel) return null;

    if (
      !channel
        ?.permissionsFor(this.c?.user?.id)
        .has([PermissionFlagsBits.ManageWebhooks])
    )
      return null;

    const webhook = await channel
      .createWebhook({
        name: name ?? "Would You",
        avatar: avatar ?? this.c.user?.displayAvatarURL(),
        reason: reason ?? "Would You Webhook",
      })
      .catch((err: any) => {
        return captureException(err);
      });

    if (webhook?.id) {
      this.webhooks.set(`${channelId}`, {
        id: webhook.id,
        token: webhook.token,
      });

      const oldData = await this.webhookModel.findOne({
        channelId: channelId,
      });

      webhook.token = cryptr.encrypt(webhook.token);

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
  };

  webhookFallBack = async (
    channel: any = null,
    channelId: string,
    message: any,
    err: any = false,
  ): Promise<void> => {
    if (!channel)
      channel = await this.c.channels.fetch(channelId).catch((err) => {
        captureException(err);
      });

    if (!channel) return;
    if (
      err &&
      (err?.code === 10015 ||
        (typeof err.message === "string" &&
          err.message.includes("Unknown Webhook"))) &&
      channel
        ?.permissionsFor(this.c?.user?.id)
        .has([PermissionFlagsBits.ManageWebhooks])
    ) {
      const webhooks = await channel.fetchWebhooks();

      if (webhooks && webhooks.size > 0) {
        let i = 0;
        for (const web of webhooks) {
          i++;
          setInterval(() => {
            if (web?.owner?.id === this.c?.user?.id) {
              web
                .delete("Deleting old webhook, to create a new one")
                .catch((err: any) => {
                  captureException(err);
                });
            }
          }, 1000 * i);
        }
      }

      const webhook = await this.createWebhook(
        channel,
        channelId,
        channel.guildId,
        "Would You",
        this.c.user?.displayAvatarURL() as string,
        "Webhook token unavailable, creating new webhook",
      );

      if (!webhook?.id || !webhook.token)
        return this.webhookFallBack(channel, channelId, message, false);

      const webhookClient = new WebhookClient({
        id: webhook.id,
        token: cryptr.decrypt(webhook.token),
      });

      if (!webhookClient)
        return this.webhookFallBack(channel, channelId, message, false);

      webhookClient.send(message).catch(async (err) => {
        return this.webhookFallBack(channel, channelId, message, false);
      });
    } else {
      if (
        channel
          ?.permissionsFor(this.c?.user?.id)
          .has([PermissionFlagsBits.EmbedLinks])
      ) {
        const guildSettings = await this.c.database.getGuild(channel.guild.id);

        message.embeds = message?.embeds ?? [];
        message.content = null;
        message.embeds = [
          new EmbedBuilder()
            .setColor("#FE0001")
            .setDescription(
              "🛑 " +
                this.c.translation.get(
                  guildSettings?.language ?? "en_EN",
                  "webhookManager.noWebhook",
                ),
            ),
        ];

        return channel.send(message).catch((err: Error) => {
          captureException(err);
        });
      }
    }
  };

  /**
   * Send a message to a channel with a webhook
   * @param {object} channel the channel to send the message to
   * @param {string} channelId the channel id
   * @param {object} message the message to send
   * @return {Promise<object>}
   */
  sendWebhook = async (
    channel: any = null,
    channelId: string,
    message: any,
    thread?: boolean,
    pin?: boolean,
  ) => {
    if (!channelId && channel?.id) channelId = channel.id;

    if (!channelId) return;

    const webhookData = await this.getWebhook(channelId);
    const date = new Date();

    if (webhookData?.id) webhookData.id = webhookData.id;
    if (webhookData?.token) webhookData.token = webhookData.token;

    if (!webhookData?.id || !webhookData?.token) {
      let webhook = await this.createWebhook(
        channel,
        channelId,
        channel.guildId,
        "Would You",
        this.c.user?.displayAvatarURL() as string,
        "Webhook token unavailable, creating new webhook",
      );

      if (webhook?.id) webhook.id = webhook.id;
      if (webhook?.token) webhook.token = webhook.token;

      if (!webhook?.id || !webhook?.token)
        return this.webhookFallBack(channel, channelId, message, false);

      const webhookClient = new WebhookClient({
        id: webhook.id,
        token: cryptr.decrypt(webhook.token),
      });
      if (!webhookClient)
        return this.webhookFallBack(channel, channelId, message, false);

      const fallbackThread = await webhookClient.send(message).catch((err) => {
        captureException(err);
        return this.webhookFallBack(channel, channelId, message, false);
      });

      let logThreads: any = await this.c.rest.get(
        `/channels/${channelId}/pins`,
      );

      if (!thread && !pin) return;
      if (thread) {
        this.c.rest.post(
          `/channels/${channelId}/messages/${fallbackThread?.id}`,
          {
            body: {
              name: "Mixed - Daily Message",
              auto_archive_duration: "1440",
            },
          },
        );
      }
      console.log(logThreads[0]);
      if (pin) {
        this.c.rest
          .delete(
            `/channels/${logThreads[0].channel_id}/pins/${logThreads[0].id}`,
            {
              reason: "Automatic unpinning of daily message",
            },
          )
          .catch((err) => {
            console.error("Error deleting message:", err);
          });

        this.c.rest
          .put(`/channels/${channelId}/pins/${fallbackThread?.id}`, {
            reason: "Automatic pinning of daily message",
          })
          .catch((err) => {
            console.error("Error pinning message:", err);
          });
      }
    } else {
      const webhook = new WebhookClient({
        id: webhookData?.id,
        token: webhookData?.token,
      });

      if (!webhook) return this.webhookFallBack(channel, channelId, message);

      const webhookThread = await webhook.send(message).catch((err) => {
        captureException(err);
        return this.webhookFallBack(channel, channelId, message, err);
      });

      const logThreads: any = await this.c.rest.get(
        `/channels/${channelId}/pins`,
      );

      if (!thread && !pin) return;

      if (thread) {
        this.c.rest.post(
          `/channels/${channelId}/messages/${webhookThread?.id}`,
          {
            body: {
              name: "Mixed - Daily Message",
              auto_archive_duration: "1440",
            },
          },
        );
      }

      if (pin) {
        this.c.rest
          .delete(
            `/channels/${logThreads[0].channel_id}/pins/${logThreads[0].id}`,
            {
              reason: "Automatic unpinning of daily message",
            },
          )
          .catch((err) => {
            console.error("Error deleting message:", err);
          });

        this.c.rest
          .put(`/channels/${channelId}/pins/${webhookThread?.id}`, {
            reason: "Automatic pinning of daily message",
          })
          .catch((err) => {
            console.error("Error pinning message:", err);
          });
      }
    }
  };
}
