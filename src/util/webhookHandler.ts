import Cryptr from "cryptr";
import {
  APIMessage,
  NewsChannel,
  PermissionFlagsBits,
  StageChannel,
  TextChannel,
  VoiceChannel,
  WebhookClient,
  WebhookMessageCreateOptions,
} from "discord.js";
import { Document, Model } from "mongoose";
import { IQueueMessage, Result } from "../global";
import { IWebhookCache, WebhookCache } from "./Models/webhookCache";
import WouldYou from "./wouldYou";

const cryptr = new Cryptr(process.env.ENCRYPTION_KEY as string);

export type WebHookCompatibleChannel =
  | NewsChannel
  | StageChannel
  | TextChannel
  | VoiceChannel;

export default class WebhookHandler {
  private webhookModel: Model<IWebhookCache>;
  private client: WouldYou;

  constructor(client: WouldYou) {
    this.webhookModel = WebhookCache;

    if (!client) throw new Error("No client provided");

    this.client = client;
  }
  async handleWebhook(
    channel: WebHookCompatibleChannel,
    content: WebhookMessageCreateOptions,
    message: IQueueMessage,
    overwriteProfile: boolean,
  ): Promise<Result<any>> {
    if (message.webhook.id && message.webhook.token) {
      const webhookClient = new WebhookClient({
        id: message.webhook.id,
        token: cryptr.decrypt(message.webhook.token),
      });
      try {
        const result = await this.send(
          webhookClient,
          content,
          overwriteProfile,
          message,
        );
        if (result.success) {
          if (!message.thread && !message.autoPin) return result;
          if (message.thread) {
            const thread = await this.createThread(message, result.result);
            return thread;
          }
          if (message.autoPin) {
            const autoPin = await this.autoPinMessage(message, result.result);
            return autoPin;
          }
        } else {
          return result;
        }
      } catch (error) {
        const newWebhook = await this.webhookFallBack(channel, message);
        if (newWebhook.success) {
          const result = await this.send(
            newWebhook.result,
            content,
            overwriteProfile,
            message,
          );
          if (result.success) {
            if (!message.thread && !message.autoPin) return result;
            if (message.thread) {
              const thread = await this.createThread(message, result.result);
              return thread;
            }
            if (message.autoPin) {
              const autoPin = await this.autoPinMessage(message, result.result);
              return autoPin;
            }
          } else {
            return result;
          }
        } else {
          return newWebhook;
        }
      }
    } else {
      const newWebhook = await this.webhookFallBack(channel, message);
      if (newWebhook.success) {
        const result = await this.send(
          newWebhook.result,
          content,
          overwriteProfile,
          message,
        );
        if (result.success) {
          if (!message.thread && !message.autoPin) return result;
          if (message.thread) {
            const thread = await this.createThread(message, result.result);
            return thread;
          }
          if (message.autoPin) {
            const autoPin = await this.autoPinMessage(message, result.result);
            return autoPin;
          }
        } else {
          return result;
        }
      } else {
        return newWebhook;
      }
    }
    return {
      success: false,
      error: new Error("Unhandled case in handleWebhook"),
    };
  }
  private async send(
    webhook: WebhookClient,
    content: WebhookMessageCreateOptions,
    /**
     * If true, it will overwrite the webhook to the bot's name and avatar.
     */
    overwriteProfile: boolean,
    message: IQueueMessage,
  ): Promise<Result<APIMessage>> {
    if (overwriteProfile) {
      // Edit these if bot name/avatar ever changes

      await webhook.edit({
        name: message.webhook.name,
        avatar: message.webhook.avatar,
        reason: "Custom WebHook name and avatar are a premium feature!",
      });
    }

    const result = await webhook.send(content);
    if (result) return { success: true, result: result };
    return {
      success: false,
      error: new Error(`Failed to send webhook`),
    };
  }
  private async webhookFallBack(
    channel: WebHookCompatibleChannel,
    message: IQueueMessage,
  ): Promise<Result<WebhookClient>> {
    const webhook = await this.createWebhook(
      channel,
      "Webhook token unavailable, creating new webhook",
      message.webhook.name,
      message.webhook.avatar,
    );
    if (webhook.success) {
      const result = await this.updateCache(
        channel.id,
        message.guildId,
        webhook.result,
      );
      if (result.success) {
        return webhook;
      } else {
        return { success: false, error: result.error };
      }
    } else {
      return webhook;
    }
  }
  private async createWebhook(
    channel: WebHookCompatibleChannel,
    reason: string,
    fallbackName?: string,
    fallbackAvatarURL?: string,
  ): Promise<Result<WebhookClient>> {
    if (!channel.guild.members.me)
      return {
        success: false,
        error: new Error("I don't exist in the guild!"),
      };

    if (
      !channel
        .permissionsFor(channel.guild.members.me)
        ?.has([PermissionFlagsBits.ManageWebhooks])
    )
      return {
        success: false,
        error: new Error("No permissions to create a webhook"),
      };
    try {
      // Edit these if bot name/avatar ever changes

      const webhook = await channel.createWebhook({
        name: fallbackName || "Would You",
        avatar:
          fallbackAvatarURL ||
          "https://cdn.discordapp.com/avatars/981649513427111957/23da96bbf1eef64855a352e0e29cdc10.webp?size=96",
        reason: reason ?? "Creating a webhook for the daily message system",
      });

      if (webhook.token)
        return {
          success: true,
          result: new WebhookClient({
            id: webhook.id,
            token: webhook.token,
          }),
        };
      else throw new Error("Webhook token is null");
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }
  private async updateCache(
    channelId: string,
    guildId: string,
    webhook: WebhookClient,
  ): Promise<Result<Document>> {
    try {
      const doc = await this.webhookModel.findOneAndUpdate(
        { channelId: channelId },
        {
          webhookToken: cryptr.encrypt(webhook.token),
          webhookId: webhook.id,
          guildId: guildId,
        },
      );
      if (doc) {
        return { success: true, result: doc };
      } else {
        const createdEntry = await this.createEntryInCache(
          channelId,
          guildId,
          webhook,
        );
        return createdEntry;
      }
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }
  private async createEntryInCache(
    channelId: string,
    guildId: string,
    webhook: WebhookClient,
  ): Promise<Result<Document>> {
    try {
      const doc = await this.webhookModel.create({
        channelId: channelId,
        webhookId: webhook.id,
        webhookToken: cryptr.encrypt(webhook.token),
        guildId: guildId,
        lastUsageTimestamp: Date.now(),
      });
      if (doc) {
        return { success: true, result: doc };
      } else {
        return {
          success: false,
          error: new Error("No new document could be created"),
        };
      }
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }
  private async createThread(
    message: IQueueMessage,
    apiReturnValue: APIMessage,
  ): Promise<Result<string>> {
    const date = new Date();
    try {
      await this.client.rest.post(
        `/channels/${message?.channelId}/messages/${apiReturnValue.id}/threads`,
        {
          body: {
            name: `${[
              date.getFullYear(),
              String(date.getMonth() + 1).padStart(2, "0"),
              String(date.getDate()).padStart(2, "0"),
            ].join("/")} - Daily Message`,
            auto_archive_duration: "1440",
          },
        },
      );
      return { success: true, result: "Thread created" };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  private async autoPinMessage(
    message: IQueueMessage,
    apiReturnValue: APIMessage,
  ): Promise<Result<string>> {
    const pinChannel: any = await this.client.rest.get(
      `/channels/${message.channelId}/pins`,
    );

    try {
      await this.client.rest.delete(
        `/channels/${pinChannel[0].channel_id}/pins/${pinChannel[0].id}`,
        {
          reason: "Automatic unpinning of daily message",
        },
      );

      this.client.rest.put(
        `/channels/${message.channelId}/pins/${apiReturnValue?.id}`,
        {
          reason: "Automatic pinning of daily message",
        },
      );

      return { success: true, result: "Pinned message" };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }
}
