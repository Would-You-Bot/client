import { functions, tests } from 'builder-validation';
import { CronJob } from 'cron';
import { EmbedBuilder, Guild, TextChannel } from 'discord.js';

import config from '@config';
import { IExtendedClient } from '@typings/core';
import CoreCustomCron from '@utils/builders/CoreCustomCron';
import { validateAndFormatTimezone } from '@utils/functions';
import {
  BaseQuestion,
  CustomQuestion,
  GuildPackType,
  GuildProfile,
} from '@would-you/types';

/**
 * Send the daily question.
 * @param client The extended client.
 * @param guild The guild.
 * @param guildProfile The guild profile.
 * @returns Nothing.
 */
const sendDailyQuestion = async (
  client: IExtendedClient,
  guild: Guild,
  guildProfile: GuildProfile
): Promise<unknown> => {
  client.logger.debug(`Sending daily question to (${guildProfile.guildId})`);

  if (!guildProfile.daily.enabled) return;
  if (!guildProfile.daily.channel) return;

  // Fetch the daily question channel
  const channel = (await guild.channels.fetch(
    guildProfile.daily.channel
  )) as TextChannel | null;
  if (!channel) {
    client.logger.warn(
      `Daily Message: Channel ${guildProfile.daily.channel} not found in guild ${guild.name}`
    );
    return;
  }

  // Get a random question
  const randomQuestionData = client.packs.random(guildProfile.packType);

  let randomQuestion: string;
  if (guildProfile.packType === GuildPackType.Base)
    randomQuestion = (randomQuestionData as BaseQuestion).translations[
      guildProfile.language
    ];
  else if (guildProfile.packType === GuildPackType.Custom)
    randomQuestion = (randomQuestionData as CustomQuestion).text;
  else if ((randomQuestionData as CustomQuestion).text) {
    randomQuestion = (randomQuestionData as BaseQuestion).translations[
      guildProfile.language
    ];
  } else {
    randomQuestion = (randomQuestionData as CustomQuestion).text;
  }

  // Create the daily question embed
  const embed = new EmbedBuilder()
    .setTitle('Daily Question')
    .setDescription(randomQuestion)
    .setColor(config.colors.primary)
    .setFooter({
      text: `Daily Question | ${client.user?.username ?? 'Would You'}`,
      iconURL: client.user?.displayAvatarURL(),
    })
    .setTimestamp();

  // Send the question to the channel
  const sendMessage = await channel.send({ embeds: [embed] });

  // Create a thread if enabled
  if (guildProfile.daily.thread)
    await channel.threads.create({
      name: `Daily Question ${new Date().toLocaleDateString()}`,
      autoArchiveDuration: 1440,
      startMessage: sendMessage,
    });
};

export default new CoreCustomCron({
  id: 'dailyQuestion',
  name: 'Daily Question',
}).execute(async (client): Promise<void> => {
  for (const guild of Array.from(client.guilds.cache.values())) {
    // Fetch the guild profile
    const guildProfile = await client.guildProfiles.fetch(guild.id);

    // If nessesary values are not set, return
    if (!guildProfile.daily.enabled) return;
    if (!guildProfile.daily.channel) return;

    const expression = functions.timeToCronExpression(guildProfile.daily.time);

    if (!expression) {
      client.logger.error(
        `Invalid time for daily question ${guildProfile.guildId}`
      );
      return;
    }

    // Validate the cron expression
    if (!tests.testCronExpression(expression)) {
      client.logger.error(
        `Invalid cron expression for ${guildProfile.guildId}`
      );
      return;
    }

    // Validate the timezone
    const timezone = validateAndFormatTimezone(guildProfile.timezone);

    // If the timezone is invalid, log an error and return
    if (!timezone) {
      client.logger.error(`Invalid timezone for(${guildProfile.guildId})`);
      return;
    }

    // Create the cron job
    const job = new CronJob(
      expression,
      () => {
        sendDailyQuestion(client, guild, guildProfile);
      },
      null,
      false,
      guildProfile.timezone
    );

    // Start the cron job
    job.start();
  }
});