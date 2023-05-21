import { WebhookDocument, WebhookModel, WebhookSchema } from '@models/Webhook.model';
import { logger } from '@utils/client';
import { decrypt, encrypt } from '@utils/functions';
import { WebhookClient, WebhookEditOptions, WebhookMessageCreateOptions } from 'discord.js';

/**
 * Webhook class.
 */
export class Webhook {
  public id: string;
  public token: string;
  public guildId: string;
  public channelId: string;

  /**
   * Webhook class constructor.
   * @param doc The webhook document.
   */
  public constructor(doc: WebhookDocument) {
    this.assign(doc);
  }

  /**
   * Assign the webhook document to the class.
   * @param doc The webhook document.
   */
  private assign(doc: WebhookDocument): void {
    this.id = doc.data.id;
    const encryptedToken = decrypt(doc.data.token);
    if (encryptedToken) this.token = encryptedToken;
    this.guildId = doc.guildId;
    this.channelId = doc.channelId;
  }

  /**
   * Fetch a webhook.
   * @returns The webhook or undefined.
   */
  public async fetch(): Promise<Webhook | undefined> {
    try {
      // Fetch the webhook from the database
      const webhook = await WebhookModel.findOne({
        guildId: this.id,
      });

      // If the webhook does not exist return undefined
      if (!webhook) return;

      // Assign the webhook document to the class
      this.assign(webhook);
    } catch (error) {
      logger.error(error);
    }
  }

  /**
   * Delete a webhook.
   * @returns If the webhook was deleted or not.
   */
  public async delete(): Promise<boolean> {
    try {
      const deletedWebhook = await WebhookModel.findOneAndDelete({
        guildId: this.guildId,
        channelId: this.channelId,
      });

      if (!deletedWebhook) return false;

      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }

  /**
   * Send a webhook message.
   * @param options The webhook message options.
   * @returns The webhook client.
   */
  public async send(options: WebhookMessageCreateOptions): Promise<WebhookClient | undefined> {
    try {
      const webhook = await this.fetch();

      if (!webhook) return;

      const webhookClient = new WebhookClient({
        id: this.id,
        token: this.token,
      });

      webhookClient.send(options);

      return webhookClient;
    } catch (error) {
      logger.error(error);
    }
  }

  /**
   * Edit a webhook message.
   * @param options The webhook message options.
   * @returns The webhook client.
   */
  public async edit(options: WebhookEditOptions): Promise<WebhookClient | undefined> {
    try {
      const webhook = await this.fetch();

      if (!webhook) return;

      const webhookClient = new WebhookClient({
        id: this.id,
        token: this.token,
      });

      webhookClient.edit(options);

      return webhookClient;
    } catch (error) {
      logger.error(error);
    }
  }
}

/**
 * Webhooks class.
 */
export default class Webhooks {
  public cache = new Map<string, Webhook>();
  private guildIds: string[];

  /**
   * Webhooks class constructor.
   * @param guildIds The guild ids for this cluster.
   */
  public constructor(guildIds: string[]) {
    this.guildIds = guildIds;
  }

  /**
   * Fetch method type without channelId.
   */
  public async fetch(): Promise<Webhook[] | undefined>;

  /**
   * Fetch method type with channelId.
   * @param channelId The channel id.
   */
  public async fetch(channelId?: string): Promise<Webhook | undefined>;

  /**
   * Fetch a webhook if the channel id is provided or all webhooks if a channel id is not provided.
   * @param channelId The channel id.
   * @returns The webhook, all webhooks, or undefined.
   */
  public async fetch(channelId?: string): Promise<Webhook | Webhook[] | undefined> {
    if (channelId) {
      // If the webhook is in the cache return it
      if (this.cache.has(channelId)) return this.cache.get(channelId);

      try {
        // Fetch the webhook from the database
        const webhookDoc = await WebhookModel.findOne({
          channelId,
        });

        // If the webhook does not exist return undefined
        if (!webhookDoc) return;

        // Create a new webhook class
        const webhook = new Webhook(webhookDoc);

        // Set the webhook to the cache
        this.cache.set(channelId, webhook);

        return webhook;
      } catch (error) {
        logger.error(error);
      }
    } else {
      try {
        // Fetch all webhooks from the database
        const webhookDocs = await WebhookModel.find({
          guildId: { $in: this.guildIds },
        });

        // Loop through all all webhook documents and set a new webhook class for each
        const webhooks = webhookDocs.map((webhookDoc) => {
          const webhook = new Webhook(webhookDoc);
          this.cache.set(webhook.id, webhook);
          return webhook;
        });

        return webhooks;
      } catch (error) {
        logger.error(error);
      }
    }
  }

  /**
   * Fetch all webhooks for a guild.
   * @param guildId The guild id.
   * @returns All webhooks or undefined.
   */
  public async fetchAll(guildId: string): Promise<Webhook[] | undefined> {
    try {
      // Fetch all webhooks from the database
      const webhookDocs = await WebhookModel.find({
        guildId,
      });

      // Loop through all all webhook documents and set a new webhook class for each
      const webhooks = webhookDocs.map((webhookDoc) => {
        const webhook = new Webhook(webhookDoc);
        this.cache.set(webhook.id, webhook);
        return webhook;
      });

      return webhooks;
    } catch (error) {
      logger.error(error);
    }
  }

  /**
   * Create a webhook.
   * @param webhookData The webhook data to create a webhook with.
   * @returns The webhook or undefined.
   */
  public async create(webhookData: WebhookSchema): Promise<Webhook | undefined> {
    try {
      // Create a new webhook document
      const webhookDoc = await WebhookModel.findOneAndUpdate(
        {
          guildId: webhookData.guildId,
          channelId: webhookData.channelId,
        },
        {
          $set: {
            data: {
              id: webhookData.data.id,
              token: encrypt(webhookData.data.token),
            },
          },
        },
        {
          upsert: true,
          new: true,
        }
      );

      // Create a new guild profile instance
      const webhook = new Webhook(webhookDoc);

      // Add the guild profile to the cache
      this.cache.set(webhookDoc.channelId, webhook);

      return webhook;
    } catch (error) {
      logger.error(error);
    }
  }

  /**
   * Sync the webhooks to local cache.
   */
  public async sync(): Promise<void> {
    try {
      await this.fetch();
    } catch (error) {
      logger.error(error);
    }
  }
}
