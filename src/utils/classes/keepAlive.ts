import colors from 'colors';
import { EmbedBuilder, WebhookClient } from 'discord.js';
import { inspect } from 'util';

import config from '@config';
import { ExtendedClient } from 'src/client';

const warnWebhook = new WebhookClient({
  url: config.env.WARN_WEBHOOK,
});
const errorWebhook = new WebhookClient({
  url: process.env.ERROR_WEBHOOK,
});

export default class KeepAlive {
  client: ExtendedClient;

  constructor(client: ExtendedClient) {
    this.client = client;
  }

  /**
   * Log a message to the console
   * @param type The type of the message
   * @param msg The message
   * @param _optionalData Optional data
   */
  private consoleError(type: string, msg: string, _optionalData: string = '') {
    this.client.logger.error(
      `${colors.white(type)} ${colors.gray('>')} ${colors.red(msg)}`,
      _optionalData
    );
  }

  /**
   * Start the keep alive system (listener to the process)
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
        .setColor(config.isProduction() ? '#6e0000' : '#e407f5')
        .addFields([
          {
            name: 'Rate-limit Info',
            value: `Path: \`${path}\`\nLimit: \`${limit}\`\nTimeout: \`${timeout}\``,
          },
        ])
        .setFooter({
          text: config.isProduction() ? 'Main Bot' : 'Dev Bot',
        })
        .setTimestamp();

      warnWebhook
        .send({
          embeds: [embed],
        })
        .catch((err) => {});
    });

    this.client.on('debug', (e) => {
      if (!e.includes('ratelimit')) return;

      this.consoleError('Debug', 'Watch-out Possible Rate-limit...', e);
      return;

      // ! Disabled for now - will add a centralized error handler
      const embed = new EmbedBuilder()
        .setTitle('Watch-out Possible Rate-limit...')
        .setColor(config.isProduction() ? '#F00505' : '#e407f5')
        .addFields([
          {
            name: 'Info',
            value: `\`\`\`${inspect(e, { depth: 0 })}\`\`\``,
          },
        ])
        .setFooter({
          text: config.isProduction() ? 'Main Bot' : 'Dev Bot',
        })
        .setTimestamp();

      warnWebhook
        .send({
          embeds: [embed],
        })
        .catch((err) => {});
    });

    this.client.on('error', (e) => {
      this.consoleError('Error', 'Bot got a error...', `${e}`);
      return;

      // ! Disabled for now - will add a centralized error handler
      const embed = new EmbedBuilder()
        .setTitle('Bot got a error...')
        .setColor(config.isProduction() ? '#05b1f0' : '#e407f5')
        .addFields([
          {
            name: 'Error',
            value: `\`\`\`${inspect(e, { depth: 0 })}\`\`\``,
          },
        ])
        .setFooter({
          text: config.isProduction() ? 'Main Bot' : 'Dev Bot',
        })
        .setTimestamp();

      errorWebhook
        .send({
          username: config.isProduction() ? 'Main Bot' : 'Dev Bot',
          embeds: [embed],
        })
        .catch((err) => {});
    });

    this.client.on('warn', async (info) => {
      this.consoleError('Error', 'Bot got a warn...', info);
      return;

      // ! Disabled for now - will add a centralized error handler
      const embed = new EmbedBuilder()
        .setTitle('Bot got a warn...')
        .setColor(config.isProduction() ? '#05b1f0' : '#e407f5')
        .addFields([
          {
            name: 'Info',
            value: `\`\`\`${inspect(info, { depth: 0 })}\`\`\``,
          },
        ])
        .setFooter({
          text: config.isProduction() ? 'Main Bot' : 'Dev Bot',
        })
        .setTimestamp();

      warnWebhook
        .send({
          username: config.isProduction() ? 'Main Bot' : 'Dev Bot',
          embeds: [embed],
        })
        .catch((err) => {});
    });

    process.on('unhandledRejection', async (reason, p) => {
      this.consoleError('Fatal Error', 'Unhandled Rejection/Catch');
      console.log(reason, p);

      return;

      // ! Disabled for now - will add a centralized error handler
      const embed = new EmbedBuilder()
        .setTitle('New Unhandled Rejection/Catch')
        .setDescription(`\`\`\`${reason}\`\`\``)
        .setColor(config.isProduction() ? '#F00505' : '#e407f5')
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
          text: config.isProduction() ? 'Main Bot' : 'Dev Bot',
        })
        .setTimestamp();

      errorWebhook
        .send({
          username: config.isProduction() ? 'Main Bot' : 'Dev Bot',
          embeds: [embed],
        })
        .catch((err) => {});
    });

    process.on('uncaughtException', async (err, origin) => {
      this.consoleError('Fatal Error', 'Uncaught Exception/Catch');
      console.log(err, origin);

      return;

      // ! Disabled for now - will add a centralized error handler
      const embed = new EmbedBuilder()
        .setTitle('New uncaughtException')
        .setDescription(`\`\`\`${err}\`\`\``)
        .setColor(config.isProduction() ? '#F00505' : '#e407f5')
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
          text: config.isProduction() ? 'Main Bot' : 'Dev Bot',
        })
        .setTimestamp();

      errorWebhook
        .send({
          username: config.isProduction() ? 'Main Bot' : 'Dev Bot',
          embeds: [embed],
        })
        .catch((err) => {});
    });
    process.on('uncaughtExceptionMonitor', async (err, origin) => {
      this.consoleError('Fatal Error', 'Uncaught Exception/Catch (MONITOR)');
      console.log(err, origin);

      return;

      // ! Disabled for now - will add a centralized error handler
      // ? This value does not exists anywhere in the codebase, it was previously referenced, but not defined as `global.CustomBot`
      const customBot = false;
      const embed = new EmbedBuilder()
        .setTitle(
          'New uncaughtExceptionMonitor' + `${customBot ? ' (Custom Bot)' : ''}`
        )
        .setDescription(`\`\`\`${err}\`\`\``)
        .setColor(config.isProduction() ? '#F00505' : '#e407f5')
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
          text: config.isProduction() ? 'Main Bot' : 'Dev Bot',
        })
        .setTimestamp();

      errorWebhook
        .send({
          username: config.isProduction() ? 'Main Bot' : 'Dev Bot',
          embeds: [embed],
        })
        .catch((err) => {});
    });
  }
}
