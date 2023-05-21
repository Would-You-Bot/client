import { CronJob } from 'cron';
import { EmbedBuilder, Guild, TextChannel } from 'discord.js';

import config from '@config';
import { CoreCustomCron } from '@typings/core';
import { GuildProfile, GuildQuestionType } from '@typings/guild';
import { BaseQuestion, CustomQuestion } from '@typings/pack';
import { timeToCronExpression, validateAndFormatTimezone, validateCronExpression } from '@utils/functions';
import { ExtendedClient } from 'src/client';

/**
 * Send the daily question.
 * @param client The extended client.
 * @param guild The guild.
 * @param guildProfile The guild profile.
 * @returns Nothing.
 */
const sendDailyQuestion = async (
  client: ExtendedClient,
  guild: Guild,
  guildProfile: GuildProfile
): Promise<unknown> => {
  client.logger.debug(`Sending daily question to (${guildProfile.guildId})`);

  if (!guildProfile.daily.enabled) return;
  if (!guildProfile.daily.channel) return;

  // Fetch the daily question channel
  const channel = (await guild.channels.fetch(guildProfile.daily.channel)) as TextChannel | null;
  if (!channel) {
    client.logger.warn(`Daily Message: Channel ${guildProfile.daily.channel} not found in guild ${guild.name}`);
    return;
  }

  // Get a random question
  const randomQuestionData = await client.packs.random(guildProfile.questionType);

  if (!randomQuestionData) {
    client.logger.error(`No questions found for ${guildProfile.guildId}`);
    return;
  }

  let randomQuestion: string;
  if (guildProfile.questionType === GuildQuestionType.Base)
    randomQuestion = (randomQuestionData as BaseQuestion).translations[guildProfile.language];
  else if (guildProfile.questionType === GuildQuestionType.Custom)
    randomQuestion = (randomQuestionData as CustomQuestion).text;
  else if ((randomQuestionData as CustomQuestion).text) {
    randomQuestion = (randomQuestionData as BaseQuestion).translations[guildProfile.language];
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

const cron: CoreCustomCron<ExtendedClient> = {
  id: 'dailyQuestion',
  name: 'Daily Question',
  /**
   * The function to execute.
   * @param client The extended client.
   * @returns Nothing.
   */
  async execute(client: ExtendedClient): Promise<void> {
    for (const guild of Array.from(client.guilds.cache.values())) {
      // Fetch the guild profile
      const guildProfile = await client.guildProfiles.fetch(guild.id);
      if (!guildProfile) return;

      // If nessesary values are not set, return
      if (!guildProfile.daily.enabled) return;
      if (!guildProfile.daily.channel) return;

      const expression = timeToCronExpression(guildProfile.daily.time);

      if (!expression) {
        client.logger.error(`Invalid time for daily question ${guildProfile.guildId}`);
        return;
      }

      // Validate the cron expression
      if (!validateCronExpression(expression)) {
        client.logger.error(`Invalid cron expression for ${guildProfile.guildId}`);
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
  },
};

export default cron;
