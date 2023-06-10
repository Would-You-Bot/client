/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '@config';

import { stripIndents } from '@slekup/utils';
import { IExtendedClient } from '@typings/core';
import {
  AttachmentBuilder,
  BaseInteraction,
  EmbedBuilder,
  TextChannel,
} from 'discord.js';
import webhookManager from './webhookManager';

/**
 * Initialize error handling for the client that deals with unhandled rejections and uncaught exceptions.
 * @param client The client.
 */
export const initializeProcessErrorHandling = (
  client: IExtendedClient
): void => {
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    client.logger.error(`${String(reason)} ${JSON.stringify(promise)}`);
  });

  process.on('uncaughtException', (error: any, origin: string) => {
    client.logger.error(`${String(error)} ${origin}`);
  });

  process.on('uncaughtExceptionMonitor', (error: any, origin: string) => {
    client.logger.error(`${String(error)} ${origin}`);
  });
};

interface ClientErrorParams {
  error: Error | string;
  title?: string;
  description?: string;
  footer?: string;
  interaction?: BaseInteraction;
}

/**
 * The client error handler.
 * @param client The client.
 * @param params The client error handler parameters.
 * @param params.error The error.
 * @param params.title The error title.
 * @param params.description The error description.
 * @param params.footer The error footer.
 * @param params.interaction The interaction.
 * @returns The client error handler.
 */
export const clientError = async (
  client: IExtendedClient,
  { error, title, description, footer, interaction }: ClientErrorParams
): Promise<void> => {
  try {
    client.logger.error(error);

    // Create the embed the user will see
    const informEmbed = new EmbedBuilder()
      .setColor(config.colors.danger)
      .setDescription(
        'An error occured. The developers have been notified of the issue, please try again later.'
      );

    // Send the embed to the user
    if (interaction?.isRepliable())
      interaction
        .reply({ embeds: [informEmbed], ephemeral: true })
        .catch(client.logger.error);

    // Get the dev guild
    const guild = client.guilds.cache.get(config.env.DEV_GUILD);
    if (!guild) {
      client.logger.error('Failed to fetch dev guild.');
      return;
    }

    // Get the alerts channel
    const channel = (await client.channels
      .fetch(config.env.ALERTS_CHANNEL)
      .catch(client.logger.error)) as TextChannel | undefined;
    if (!channel) {
      client.logger.error('Failed to fetch error webhook channel.');
      return;
    }

    // Create the file attatchment with the error logs
    const attachment = new AttachmentBuilder(Buffer.from(String(error)), {
      name: 'error.txt',
    });

    // Create the error embed to be sent to the alerts channel
    const errorEmbed = new EmbedBuilder()
      .setTitle(title ?? 'An Error Occured')
      .setColor(config.colors.danger)
      .setDescription(
        stripIndents(`\
        Time: <t:${(Date.now() / 1000).toFixed(0)}:R>
        ${description?.substring(0, 1500) ?? 'An error occurred.'}
        `)
      )
      .setTimestamp();
    if (footer) errorEmbed.setFooter({ text: footer });

    // Fetch the webhook for the channel
    const webhook = await webhookManager.get(client, guild.id, channel.id);

    // If the failed to fetch webhook, send the error embed with the client
    if (!webhook) {
      channel.send({
        content: 'Failed to use webhook, sending with bot...',
        embeds: [errorEmbed],
      });
      client.logger.error('Failed to fetch error webhook.');
      return;
    }

    // Send the error embed to the alerts channel
    webhook.send({
      username: config.envName,
      avatarURL: client.user?.displayAvatarURL() ?? undefined,
      content: `<@&${config.env.DEV_ROLE}>`,
      embeds: [errorEmbed],
      files: [attachment],
    });

    // Remove the webhook from the cache
    webhook.destroy();
  } catch (funcError) {
    client.logger.error('Failed to send client error message to channel.');
    client.logger.error(funcError);
  }
};
