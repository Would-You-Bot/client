import {
  PermissionFlagsBits,
  WebhookClient,
  Channel,
  APIMessage,
} from "discord.js";
import { captureException } from "@sentry/node";
import { Document, Model} from "mongoose";
import { IWebhookCache, WebhookCache } from "./Models/webhookCache";
import WouldYou from "./wouldYou";
import Cryptr from "cryptr";
import { IQueueMessage, Result } from "../global";

const cryptr = new Cryptr(process.env.ENCRYPTION_KEY as string);

export default class WebhookHandler {
  private webhookModel: Model<IWebhookCache>;
  private client: WouldYou;

  constructor(client: WouldYou) {
    this.webhookModel = WebhookCache;

    if (!client) throw new Error("No client provided");

    this.client = client;
  }
  async handleWebhook(
    channel: Channel,
    content: any,
    message: IQueueMessage,
    thread?: boolean,
    pin?: boolean,
  ): Promise<Result<any>> {
    if (message.webhook.id && message.webhook.token) {
      const webhookClient = new WebhookClient({
        id: message.webhook.id,
        token: cryptr.decrypt(message.webhook.token),
      });
      try {
        const result = await this.send(webhookClient, content);
        if(result.success) {
          if(message.thread) {
            const thread = await this.createThread(message, result.result);
            return thread;
          } else {
            return result
          }
        } else {
          return result;
        }
      } catch (error) {
        const newWebhook = await this.webhookFallBack(channel, message);
        if(newWebhook.success) {
          const result = await this.send(newWebhook.result, content);
          if(result.success) {
            if(message.thread) {
              const thread = await this.createThread(message, result.result);
              return thread;
            } else {
              return result
            }
          } else {
            return result;
          }
        } else {
          return newWebhook
        }
      }
    } else {
      const newWebhook = await this.webhookFallBack(channel, message);
      if(newWebhook.success) {
        const result = await this.send(newWebhook.result, content);
        if(result.success) {
          if(message.thread) {
            const thread = await this.createThread(message, result.result);
            return thread;
          } else {
            return result
          }
        } else {
          return result;
        }
      } else {
        return newWebhook
      }
    }
    //   let logThreads: any = await this.c.rest.get(
    //     `/channels/${channelId}/pins`,
    //   );

    //   if (!thread && !pin) return;
    //   if (thread) {
    //     this.c.rest.post(
    //       `/channels/${channelId}/messages/${fallbackThread?.id}`,
    //       {
    //         body: {
    //           name: "Mixed - Daily Message",
    //           auto_archive_duration: "1440",
    //         },
    //       },
    //     );
    //   }
    //   console.log(logThreads[0]);
    //   if (pin) {
    //     this.c.rest
    //       .delete(
    //         `/channels/${logThreads[0].channel_id}/pins/${logThreads[0].id}`,
    //         {
    //           reason: "Automatic unpinning of daily message",
    //         },
    //       )
    //       .catch((err) => {
    //         console.error("Error deleting message:", err);
    //       });

    //     this.c.rest
    //       .put(`/channels/${channelId}/pins/${fallbackThread?.id}`, {
    //         reason: "Automatic pinning of daily message",
    //       })
    //       .catch((err) => {
    //         console.error("Error pinning message:", err);
    //       });
    //   }
    // } else {
    //   const webhook = new WebhookClient({
    //     id: webhookData?.id,
    //     token: webhookData?.token,
    //   });

    //   if (!webhook) return this.webhookFallBack(channel, channelId, message);

    //   const webhookThread = await webhook.send(message).catch((err) => {
    //     captureException(err);
    //     return this.webhookFallBack(channel, channelId, message, err);
    //   });

    //   const logThreads: any = await this.c.rest.get(
    //     `/channels/${channelId}/pins`,
    //   );

    //   if (!thread && !pin) return;

    //   if (thread) {
    //     this.c.rest.post(
    //       `/channels/${channelId}/messages/${webhookThread?.id}`,
    //       {
    //         body: {
    //           name: "Mixed - Daily Message",
    //           auto_archive_duration: "1440",
    //         },
    //       },
    //     );
    //   }

    //   if (pin) {
    //     this.c.rest
    //       .delete(
    //         `/channels/${logThreads[0].channel_id}/pins/${logThreads[0].id}`,
    //         {
    //           reason: "Automatic unpinning of daily message",
    //         },
    //       )
    //       .catch((err) => {
    //         console.error("Error deleting message:", err);
    //       });

    //     this.c.rest
    //       .put(`/channels/${channelId}/pins/${webhookThread?.id}`, {
    //         reason: "Automatic pinning of daily message",
    //       })
    //       .catch((err) => {
    //         console.error("Error pinning message:", err);
    //       });
    //   }
    // }
  }
  private async send(webhook: WebhookClient, content: any): Promise<Result<APIMessage>> {
      const result = await webhook.send(content)
      if(result) return {success: true, result: result}
      return {success: false, error: new Error(`Failed to send webhook`)}

  }
  private async webhookFallBack(
    channel: any,
    message: IQueueMessage
  ): Promise<Result<WebhookClient>> {
    const webhook = await this.createWebhook(
      channel,
      "Would You",
      this.client.user?.avatarURL({extension: "png"}) as string,
      "Webhook token unavailable, creating new webhook",
    );
    if(webhook.success) {
      console.log(webhook.success)
      const result = await this.updateCache(channel.id, message.guildId ,webhook.result)
      if(result.success) {
        return webhook;
      } else {
        return {success: false, error: result.error}
      }
    } else {
      return webhook
    }
  }
  private async createWebhook(
    channel: any,
    name: string,
    avatar: string,
    reason: string,
  ): Promise<Result<WebhookClient>> {
    console.log("hitting create webhook");
    if (
      !channel
        .permissionsFor(this.client.user)
        ?.has([PermissionFlagsBits.ManageWebhooks])
    )
      return {success: false, error: new Error("No permissions to create a webhook")}
    try {
      const webhook = await channel
           .createWebhook({
             name: name ?? "Would You",
             avatar: avatar ?? this.client.user?.displayAvatarURL(),
             reason: reason ?? "Creating a webhook for the daily message system",
           })
           return {success: true, result: new WebhookClient({ id: webhook.id, token: webhook.token })};
    } catch (error) {
      return {success: false, error: error as Error}
    }
  }
  private async updateCache(channelId: string, guildId: string,webhook: WebhookClient): Promise<Result<Document>> {
    console.log("hitting update")
      try {
        const doc = await this.webhookModel.findOneAndUpdate({channelId: channelId}, {webhookToken: cryptr.encrypt(webhook.token), webhookId: webhook.id, guildId: guildId});
        if(doc) {
          return {success: true, result: doc}
        } else {
          const createdEntry = await this.createEntryInCache(channelId, guildId, webhook);
          return createdEntry;
        }
      } catch (error) {
        return {success: false, error: error as Error}
      }
  }
  private async createEntryInCache(channelId: string, guildId: string, webhook: WebhookClient): Promise<Result<Document>> {
    console.log("hitting create")
    try {
      const doc = await this.webhookModel.create({channelId: channelId, webhookId: webhook.id, webhookToken: cryptr.encrypt(webhook.token), lastUsageTimestamp: Date.now()})
      if(doc) {
        return {success: true, result: doc}
      } else {
        return {success: false, error: new Error("No new document could be created")}
      }
    } catch(error) {
      return {success: false, error: error as Error}
    }
  }
  private async createThread(message: IQueueMessage, apiReturnValue: APIMessage): Promise<Result<any>> {
    const date = new Date();
    console.log("hitting createThread")
      try {
        await this.client.rest.setToken(process.env.DISCORD_TOKEN as string);
        await this.client.rest.post(`/channels/${message.channelId}/messages/${apiReturnValue.id}/threads`, {
          body: {
            name: `${[
              date.getFullYear(),
              date.getMonth() + 1,
              date.getDate(),
            ].join("/")} - Daily Message`,
            auto_archive_duration: "1440"
          }
        })
        return {success: true, result: "Thread created"}
      } catch (error) {
        return {success:false,error: error as Error}
      }
  }
}
