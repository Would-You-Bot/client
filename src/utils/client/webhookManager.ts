import { Webhook } from '@utils/classes/Webhooks.class';
import colors from 'colors';
import { PermissionFlagsBits, TextChannel, WebhookClient } from 'discord.js';
import { ExtendedClient } from 'src/client';

const queue: string[] = [];

const updateQueue = {
  /**
   * Add a channel to the queue.
   * @param id The channel id.
   */
  add: (id: string) => {
    queue.push(id);
  },

  /**
   * Remove a channel from the queue.
   * @param id The channel id.
   */
  remove: (id: string) => {
    const index = queue.indexOf(id);
    queue.splice(index, 1);
  },

  /**
   * Get a webhook from the queue.
   * @param channelId The channel id.
   * @param client The extended client.
   * @returns The webhook.
   */
  get: async (channelId: string, client: ExtendedClient): Promise<Webhook> =>
    new Promise((resolve, reject) => {
      // Check every 10ms if the channelId has been removed from the queue
      const ms = 10; // milliseconds
      const timeout = 10; // seconds

      let counter = 0;
      const checksPerSecond = 1000 / ms;
      const totalChecks = checksPerSecond * timeout;

      const intervalId = setInterval(() => {
        // Since, being removed from the queue, likely mean a webhook has been created for the channel
        if (!queue.includes(channelId)) {
          clearInterval(intervalId);
          client.webhooks.fetch(channelId).then((channelWebhook) => {
            resolve(channelWebhook as Webhook);
          });
        }

        // If timeout time has been reached
        counter += 1;
        if (counter >= totalChecks) {
          clearInterval(intervalId);
          reject(new Error(`Webhook for the channel (${channelId}) in queue was not created within 10 seconds.`));
        }
      }, 10);
    }),
};

/**
 * Check if a webhook is valid.
 * @param client The extended client.
 * @param guildId The guild id.
 * @param channelId The channel id.
 * @param method The method.
 * @returns If the webhook is valid.
 */
const isValid = (client: ExtendedClient, guildId: string, channelId: string, method: string): boolean => {
  // If the guild does not exist
  const guild = client.guilds.cache.get(guildId);
  if (!guild) {
    client.logger.error(`Cannot ${method} webhook, invalid guildId provided`);
    return false;
  }

  // If the channel does not exist
  const channel = guild.channels.cache.get(channelId);
  if (!channel) {
    client.logger.error(`Cannot ${method} webhook, invalid channelId provided`);
    return false;
  }

  // If the bot does not have Manage Webhooks permission
  if (!guild.members.me?.permissions.has(PermissionFlagsBits.ManageWebhooks)) return false;

  return true;
};

/**
 * Create a webhook in a channel & save it to the database and cache.
 * @param client Thee extended client.
 * @param guildId The guild id.
 * @param channelId The channel id.
 * @returns The webhook or undefined.
 */
const create = async (client: ExtendedClient, guildId: string, channelId: string): Promise<Webhook | undefined> => {
  try {
    const timeStart = Date.now();

    // Check if channel is in queue
    if (queue.includes(channelId)) return await updateQueue.get(channelId, client);
    // Add channel to queue
    else updateQueue.add(channelId);

    // Check if webhook is valid
    if (!isValid(client, guildId, channelId, 'create')) {
      updateQueue.remove(channelId);
      return;
    }

    const guild = client.guilds.cache.get(guildId);
    if (!guild) return;
    const webhooksInChannel = await guild.channels.fetchWebhooks(channelId);

    if (webhooksInChannel.size >= 10) {
      client.logger.error('Cannot create webhook, there are already 10 webhooks in this channel');
    }

    // If the bot does not have Manage Webhooks permission
    if (!guild.members.me?.permissions.has(PermissionFlagsBits.ManageWebhooks)) {
      updateQueue.remove(channelId);
      return;
    }

    // Create a new webhook
    const createdWebhook = await guild.channels.createWebhook({
      channel: channelId,
      name: client.user?.username ?? 'Would You',
      avatar: client.user?.displayAvatarURL(),
    });

    // If the webhook could not be created
    if (!createdWebhook.token) {
      updateQueue.remove(channelId);
      client.logger.error(`Cannot create webhook document, no token was returned for ${channelId} in ${guildId}`);
      return;
    }

    // Update the webhook in the database
    const updatedWebhook = await client.webhooks.create({
      channelId,
      guildId,
      data: { id: createdWebhook.id, token: createdWebhook.token },
    });

    if (!updatedWebhook) {
      updateQueue.remove(channelId);
      client.logger.error(`Cannot create webhook document for ${channelId} in ${guildId}`);
      return;
    }

    // Remove channel from queue
    updateQueue.remove(channelId);

    const time = ((Date.now() - timeStart) / 1000).toFixed(2);
    client.logger.debug(`Created webhook for ${channelId} in ${guildId} in ${colors.white(time)}s`);

    // Return the webhook information from DB
    return updatedWebhook;
  } catch (error) {
    client.logger.error(error);
  }
};

/**
 * Get a webhook from the cache and if not in cache fetch it.
 * @param client The extended client.
 * @param guildId The guild id.
 * @param channelId The channel id.
 * @returns The webhook or undefined.
 */
const get = async (client: ExtendedClient, guildId: string, channelId: string): Promise<WebhookClient | undefined> => {
  if (!isValid(client, guildId, channelId, 'get')) return;

  // Get the stored webhook if it exists
  let channelWebhook: Webhook | undefined = (await client.webhooks.fetch(channelId)) as Webhook | undefined;

  // Get the guild and channel
  const guild = client.guilds.cache.get(guildId);
  if (!guild) return;
  const channel = guild.channels.cache.get(channelId) as TextChannel | null;
  if (!channel) return;

  // If there is no saved webhook for this channel, create a new one
  if (!channelWebhook) channelWebhook = await create(client, guildId, channelId);

  // If the webhook couldn't be created
  if (!channelWebhook) return;

  // Fetch the webhooks in the channel
  let webhooksInChannel;
  try {
    webhooksInChannel = await channel.fetchWebhooks();
  } catch (error) {
    return;
  }

  // Check if the webhook exists in the channel
  let webhookExists = webhooksInChannel.get(channelWebhook.id);

  // If the webhook is stored but does not exist, create a new one
  if (!webhookExists) {
    channelWebhook = await create(client, guildId, channelId);

    // If the webhook couldn't be created
    if (!channelWebhook) return;

    webhooksInChannel = await channel.fetchWebhooks();
    webhookExists = webhooksInChannel.get(channelWebhook.id);

    // If the webhook does not exist even after being creating, something is wrong with this code probably
    if (!webhookExists) {
      client.logger.error('Something went wrong with webhooks, as one stored does not exist.');
      return;
    }
  }

  // Initialize the ready to use webhook client
  const webhook = new WebhookClient({
    id: channelWebhook.id,
    token: channelWebhook.token,
  });

  return webhook;
};

export default { get };
