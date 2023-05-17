import colors from 'colors';
import { EmbedBuilder, WebhookClient } from 'discord.js';
import { inspect } from 'util';

import config from '@config';
import { ExtendedClient } from 'src/client';

const warnWebhook = new WebhookClient({
  url: config.env.WARN_WEBHOOK,
});
const errorWebhook = new WebhookClient({
  url: config.env.ERROR_WEBHOOK,
});

/**
 *
 */
export default class KeepAlive {
  client: ExtendedClient;

  /**
   * @param client
   */
  constructor(client: ExtendedClient) {
    this.client = client;
  }

  /**
   * Log a message to the console.
   * @param type The type of the message.
   * @param msg The message.
   * @param _optionalData Optional data.
   */
  private consoleError(type: string, msg: string, _optionalData = '') {
    this.client.logger.error(
      `${colors.white(type)} ${colors.gray('>')} ${colors.red(msg)}`,
      _optionalData
    );
  }

  /**
   * Start the keep alive system (listener to the process).
   */
  start() {
    this.client.rest.on('rateLimited', (log) => {
      const { route: path, limit, timeToReset: timeout } = log;
      this.consoleError(
        'RateLimited',
        'We got rate-limited at',
        `Path: ${path} Limit: ${limit} Timeout: ${timeout}`
      );
      return;

      // ! Disabled for now - will add a centralized error handler
      const embed = new EmbedBuilder()
        .setTitle('Rate limited')
        .setColor(config.colors.danger)
        .addFields([
          {
            name: 'Rate-limit Info',
            value: `Path: \`${path}\`\nLimit: \`${limit}\`\nTimeout: \`${timeout}\``,
          },
        ])
        .setFooter({
          text: config.envName,
        })
        .setTimestamp();

      warnWebhook
        .send({
          embeds: [embed],
        })
        .catch(this.client.logger.error);
    });

    this.client.on('debug', (e) => {
      if (!e.includes('ratelimit')) return;

      this.consoleError('Debug', 'Watch-out Possible Rate-limit...', e);
      return;

      // ! Disabled for now - will add a centralized error handler
      const embed = new EmbedBuilder()
        .setTitle('Watch-out Possible Rate-limit...')
        .setColor(config.colors.danger)
        .addFields([
          {
            name: 'Info',
            value: `\`\`\`${inspect(e, { depth: 0 })}\`\`\``,
          },
        ])
        .setFooter({
          text: config.envName,
        })
        .setTimestamp();

      warnWebhook
        .send({
          embeds: [embed],
        })
        .catch(this.client.logger.error);
    });

    this.client.on('error', (e) => {
      return;

      this.consoleError('Error', 'Bot got a error...', `${e}`);

      // ! Disabled for now - will add a centralized error handler
      const embed = new EmbedBuilder()
        .setTitle('Bot got a error...')
        .setColor(config.colors.danger)
        .addFields([
          {
            name: 'Error',
            value: `\`\`\`${inspect(e, { depth: 0 })}\`\`\``,
          },
        ])
        .setFooter({
          text: config.envName,
        })
        .setTimestamp();

      errorWebhook
        .send({
          username: config.envName,
          embeds: [embed],
        })
        .catch(this.client.logger.error);
    });

    this.client.on('warn', async (info) => {
      return;

      this.consoleError('Error', 'Bot got a warn...', info);

      // ! Disabled for now - will add a centralized error handler
      const embed = new EmbedBuilder()
        .setTitle('Bot got a warn...')
        .setColor(config.colors.danger)
        .addFields([
          {
            name: 'Info',
            value: `\`\`\`${inspect(info, { depth: 0 })}\`\`\``,
          },
        ])
        .setFooter({
          text: config.envName,
        })
        .setTimestamp();

      warnWebhook
        .send({
          username: config.envName,
          embeds: [embed],
        })
        .catch(this.client.logger.error);
    });

    process.on('unhandledRejection', async (reason, p) => {
      return;

      this.consoleError('Fatal Error', 'Unhandled Rejection/Catch');
      this.client.logger.error(`${reason} ${p}`);

      // ! Disabled for now - will add a centralized error handler
      const embed = new EmbedBuilder()
        .setTitle('New Unhandled Rejection/Catch')
        .setDescription(`\`\`\`${reason}\`\`\``)
        .setColor(config.colors.danger)
        .addFields([
          {
            name: 'Reason',
            value: `\`\`\`${inspect(reason, { depth: 0 })}\`\`\``,
          },
          {
            name: 'Promise',
            value: `\`\`\`${inspect(p, { depth: 0 })}\`\`\``,
          },
        ])
        .setFooter({
          text: config.envName,
        })
        .setTimestamp();

      errorWebhook
        .send({
          username: config.envName,
          embeds: [embed],
        })
        .catch(this.client.logger.error);
    });

    process.on('uncaughtException', async (err, origin) => {
      return;

      this.consoleError('Fatal Error', 'Uncaught Exception/Catch');
      this.client.logger.error(`${err} ${origin}`);

      // ! Disabled for now - will add a centralized error handler
      const embed = new EmbedBuilder()
        .setTitle('New uncaughtException')
        .setDescription(`\`\`\`${err}\`\`\``)
        .setColor(config.colors.danger)
        .addFields([
          {
            name: 'Error',
            value: `\`\`\`${inspect(err, { depth: 0 })}\`\`\``,
          },
          {
            name: 'Origin',
            value: `\`\`\`${inspect(origin, { depth: 0 })}\`\`\``,
          },
        ])
        .setFooter({
          text: config.envName,
        })
        .setTimestamp();

      errorWebhook
        .send({
          username: config.envName,
          embeds: [embed],
        })
        .catch(this.client.logger.error);
    });

    process.on('uncaughtExceptionMonitor', async (err, origin) => {
      return;

      this.consoleError('Fatal Error', 'Uncaught Exception/Catch (MONITOR)');
      this.client.logger.error(`${err} ${origin}`);

      // ! Disabled for now - will add a centralized error handler
      // ? This value does not exists anywhere in the codebase, it was previously referenced, but not defined as `global.CustomBot`
      const customBot = false;
      const embed = new EmbedBuilder()
        .setTitle(
          `New uncaughtExceptionMonitor ${customBot ? ' (Custom Bot)' : ''}`
        )
        .setDescription(`\`\`\`${err}\`\`\``)
        .setColor(config.colors.danger)
        .addFields([
          {
            name: 'Error',
            value: `\`\`\`${inspect(err, { depth: 0 })}\`\`\``,
          },
          {
            name: 'Origin',
            value: `\`\`\`${inspect(origin, { depth: 0 })}\`\`\``,
          },
        ])
        .setFooter({
          text: config.envName,
        })
        .setTimestamp();

      errorWebhook
        .send({
          username: config.envName,
          embeds: [embed],
        })
        .catch(this.client.logger.error);
    });
  }
}
