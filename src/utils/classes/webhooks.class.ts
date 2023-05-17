import { WebhookClient, WebhookEditOptions, WebhookMessageCreateOptions } from 'discord.js';

import webhookModel, { WebhookDocument, WebhookSchema } from '@models/webhook.model';
import { logger } from '@utils/client';

/**
 * Webhook class.
 */
class Webhook {
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
  protected assign(doc: WebhookDocument) {
    this.id = doc.webhook.id;
    this.token = doc.webhook.token;
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
      const webhook = await webhookModel.findOne({
        guildId: this.guildId,
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
      const deletedWebhook = await webhookModel.findOneAndDelete({
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
  public async send(options: WebhookMessageCreateOptions) {
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
  public async edit(options: WebhookEditOptions) {
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
  protected guildIds: string[];

  /**
   * Webhooks class constructor.
   * @param guildIds The guild ids for this cluster.
   */
  public constructor(guildIds: string[]) {
    this.guildIds = guildIds;
  }

  /**
   * Fetch a webhook if the id is provided or all webhooks if an id is not provided.
   * @param id The webhook id if fetching a single webhook.
   * @returns The webhook, all webhooks, or undefined.
   */
  public async fetch(id?: string): Promise<Webhook | Webhook[] | undefined> {
    if (id) {
      // If the webhook is in the cache return it
      if (this.cache.has(id)) return this.cache.get(id);

      try {
        // Fetch the webhook from the database
        const webhookDoc = await webhookModel.findOne({
          guildId: this.guildIds,
        });

        // If the webhook does not exist return undefined
        if (!webhookDoc) return;

        // Create a new webhook class
        const webhook = new Webhook(webhookDoc);

        // Set the webhook to the cache
        this.cache.set(id, webhook);
      } catch (error) {
        logger.error(error);
      }
    } else {
      try {
        // Fetch all webhooks from the database
        const webhookDocs = await webhookModel.find({
          guildId: { $in: this.guildIds },
        });

        // Loop through all all webhook documents and create a new webhook class for each
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
   * Create a webhook.
   * @param webhookData The webhook data to create a webhook with.
   * @returns The webhook or undefined.
   */
  public async create(webhookData: WebhookSchema): Promise<Webhook | undefined> {
    try {
      // Create a new webhook document
      const webhookDoc = await webhookModel.create(webhookData);

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
