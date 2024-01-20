import {
  PermissionFlagsBits,
  WebhookClient,
  Channel,
} from "discord.js";
import { captureException } from "@sentry/node";
import { Model } from "mongoose";
import { IWebhookCache, WebhookCache } from "./Models/webhookCache";
import WouldYou from "./wouldYou";
import Cryptr from "cryptr";
import { IQueueMessage } from "../global";

const cryptr = new Cryptr(process.env.ENCRYPTION_KEY as string);

export default class WebhookHandler {
  private webhooks: Map<string, { id: string; token: string }>;
  private webhookModel: Model<IWebhookCache>;
  private client: WouldYou;

  constructor(client: WouldYou) {
    this.webhooks = new Map();
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
  ): Promise<void> {
    console.log("hitting handler");
    if (message.webhook.id && message.webhook.token) {
      const webhookClient = new WebhookClient({
        id: message.webhook.id,
        token: cryptr.decrypt(message.webhook.token),
      });
      return await this.send(webhookClient, content);
    } else {
      console.log("Hitting fallback");
      const newWebhook = await this.webhookFallBack(channel, channel.id);
      return await this.send(newWebhook, content);
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
  private async send(webhook: WebhookClient, content: any): Promise<void> {
    console.log("send webhook");
    try {
      webhook
        .send(content)
        .then((message) => {
          console.log("after send message");
          return message;
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }
  private async webhookFallBack(
    channel: any = null,
    channelId: string,
  ): Promise<WebhookClient> {
    console.log("in fallback");
    if (!channel)
      channel = await this.client.channels.fetch(channelId).catch((err) => {
        throw new Error(err);
      });

    const webhook = await this.createWebhook(
      channel,
      "Would You",
      this.client.user?.avatarURL({extension: "png"}) as string,
      "Webhook token unavailable, creating new webhook",
    );
    if (!webhook) {
      throw new Error("No webhook created");
    }
    return webhook;
  }
  private async createWebhook(
    channel: any,
    name: string,
    avatar: string,
    reason: string,
  ): Promise<WebhookClient> {
    console.log("hitting create webhook");
    if (
      !channel
        .permissionsFor(this.client.user)
        ?.has([PermissionFlagsBits.ManageWebhooks])
    )
      throw new Error("No perms");
      console.log(Buffer.from(this.client.user?.avatarURL({extension: "png"}) as string).toString("base64url"))
    
    // const webhook = <{ id: string; token: string }>await this.client.rest
    //   .post(`/channels/${channel.id}/webhooks`, {
    //     body: {
    //       name: name ?? "Would You",
    //       avatar: avatar ?? this.client.user?.avatarURL({extension: "png"}) as string,
    //     },
    //     reason: reason ?? "Creating a webhook for the daily message system",
    //   })
    //   .catch((err: Error) => {
    //     return captureException(err);
    //   });
    const webhook = await channel
         .createWebhook({
           name: name ?? "Would You",
           avatar: avatar ?? this.client.user?.displayAvatarURL(),
           reason: reason ?? "Creating a webhook for the daily message system",
         })
         .catch((err: Error) => {
           return captureException(err);
         });
    console.log(webhook);
    if (!webhook) {
      throw new Error("No webhook created");
    }
    return new WebhookClient({ id: webhook.id, token: webhook.token });
  }

  //   updateLastUsed(token: string) {
  //     this.webhookModel
  //       .findOneAndUpdate(
  //         { webhookToken: cryptr.encrypt(token) },
  //         { lastUsageTimestamp: Date.now() },
  //       )
  //       .then(() => {});
  //   }
  //   /**
  //    * Create a webhook in a channel & save it to the database and cache
  //    * @param {object | null} channel the channel to create the webhook in
  //    * @param {string} channelId the channel id
  //    * @param {string} guildId the guild id
  //    * @param {string} name the name of the webhook
  //    * @param {string} avatar the avatar of the webhook (url)
  //    * @param {string} reason the reason for creating the webhook
  //    * @return {Promise<object>}
  //    * @private
  //    */
  //   createWebhook = async (
  //     channel: any = null,
  //     channelId: string,
  //     guildId: string,
  //     name: string,
  //     avatar: string,
  //     reason: string,
  //   ) => {
  //     if (!channel)
  //       channel = await this.c.channels.fetch(channelId).catch((err) => {
  //         captureException(err);
  //       });

  //     if (!channel) return null;

  //     if (
  //       !channel
  //         ?.permissionsFor(this.c?.user?.id)
  //         .has([PermissionFlagsBits.ManageWebhooks])
  //     )
  //       return null;

  //     const webhook = await channel
  //       .createWebhook({
  //         name: name ?? "Would You",
  //         avatar: avatar ?? this.c.user?.displayAvatarURL(),
  //         reason: reason ?? "Would You Webhook",
  //       })
  //       .catch((err: any) => {
  //         return captureException(err);
  //       });

  //     if (webhook?.id) {
  //       this.webhooks.set(`${channelId}`, {
  //         id: webhook.id,
  //         token: webhook.token,
  //       });

  //       const oldData = await this.webhookModel.findOne({
  //         channelId: channelId,
  //       });

  //       webhook.token = cryptr.encrypt(webhook.token);

  //       if (oldData) {
  //         await oldData.updateOne({
  //           channelId: channelId,
  //           webhookId: webhook.id,
  //           webhookToken: webhook.token,
  //         });
  //       } else {
  //         await this.webhookModel.create({
  //           channelId: channelId,
  //           webhookId: webhook.id,
  //           webhookToken: webhook.token,
  //         });
  //       }

  //       return {
  //         id: webhook.id,
  //         token: webhook.token,
  //       };
  //     } else return null;
  //   };
}
