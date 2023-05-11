import colors from 'colors';
import { CronJob } from 'cron';
import { EmbedBuilder, TextChannel } from 'discord.js';
import momentTimezone from 'moment-timezone';

import { ExtendedClient } from 'src/client';

export default class DailyMessage {
  client: ExtendedClient;

  constructor(client: ExtendedClient) {
    this.client = client;
  }

  /**
   * Start the daily message Schedule
   */
  start() {
    new CronJob(
      '0 */30 * * * *',
      async () => {
        await this.runSchedule();
      },
      null,
      true,
      'Europe/Berlin'
    );
  }

  /**
   * Run the daily message Schedule
   * @returns void
   */
  async runSchedule() {
    let guilds = await this.client.database.getAll();
    // ?guilds = guilds.filter(g => this.client.guilds.cache.has(g.guildID) && g.dailyMsg);

    guilds = guilds.filter(
      (guild) =>
        momentTimezone.tz(guild.dailyTimezone).format('HH:mm') ===
        guild.dailyInterval
    );

    this.client.logger.info(
      `${colors.white('Daily Message')} ${colors.gray('>')} ${colors.green(
        'Running daily message check for ' + guilds.length + ' guilds'
      )}`
    );

    for (let i = 0; i < guilds.length; i++) {
      const db = guilds[i];
      if (!db?.dailyChannel) continue;
      if (!db.dailyMsg) continue;

      setTimeout(async () => {
        const channel = (await this.client.channels
          .fetch(db.dailyChannel)
          .catch((err) => console.log(err))) as TextChannel | null;

        if (!channel) return;

        const { General }: { General: string[] } = await import(
          `../data/rather-${db.language}.json`
        );
        const { WhatYouDo }: { WhatYouDo: string[] } = await import(
          `../data/wwyd-${db.language}.json`
        );

        // An array of random questions (regular is default)
        let randomMessages: string[] = [...General, ...WhatYouDo];

        if (db.customTypes === 'mixed') {
          // If there are any custom messages, push them to the array
          if (db.customMessages.filter((c) => c.type !== 'nsfw').length !== 0)
            randomMessages.push(
              ...db.customMessages
                .filter((c) => c.type !== 'nsfw')
                .map((c) => c.msg)
            );
        } else if (db.customTypes === 'custom') {
          // Check if there are any custom messages
          if (db.customMessages.filter((c) => c.type !== 'nsfw').length === 0)
            return this.client.webhookHandler
              .sendWebhook(
                channel,
                db.dailyChannel,
                {
                  content:
                    "There's currently no custom Would You messages to be displayed for daily messages! Either make new ones or turn off daily messages.",
                },
                db.dailyThread
              )
              .catch((err) => console.log(err));

          randomMessages = [
            ...db.customMessages
              .filter((c) => c.type !== 'nsfw')
              .map((c) => c.msg),
          ];
        }

        // Get a random index from the randomDaily array
        const dailyId = Math.floor(Math.random() * randomMessages.length);
        // Use the random index to get a random message from the randomDaily array
        const selectedRandomMessage = randomMessages[dailyId];

        const embed = new EmbedBuilder()
          .setColor('#0598F6')
          .setFooter({
            text: `Daily Message | Type: ${db.customTypes.replace(/^\w/, (c) =>
              c.toUpperCase()
            )} | ID: ${dailyId}`,
          })
          .setDescription(selectedRandomMessage);

        await this.client.webhookHandler
          .sendWebhook(
            channel,
            db.dailyChannel,
            {
              embeds: [embed],
              content: db.dailyRole ? `<@&${db.dailyRole}>` : '',
            },
            db.dailyThread
          )
          .catch((err) => {
            console.log(err);
          });
      }, i * 2500); // Timeout to cater to the discord ratelimit
    }
  }
}
