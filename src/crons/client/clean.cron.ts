import { AttachmentBuilder, ChannelType, EmbedBuilder } from 'discord.js';

import config from '@config';
import { GuildProfileDocument, GuildProfileModel } from '@models/GuildProfile.model';
import { CoreCron, IExtendedClient } from '@typings/core';
import { GuildData, exportGuildData } from '@utils/client';

const guildsData: GuildData[] = [];
let guildProfilesDeleted = 0;
let webhooksDeleted = 0;
let customPacksDeleted = 0;

/**
 * Reset the data values.
 */
const resetData = (): void => {
  guildsData.length = 0;
  guildProfilesDeleted = 0;
  webhooksDeleted = 0;
  customPacksDeleted = 0;
};

/**
 * Delete all guild data.
 * @param client The extended client.
 * @param guildProfileDoc The guild profile document.
 * @returns A Promise.
 */
const deleteGuildData = async (client: IExtendedClient, guildProfileDoc: GuildProfileDocument): Promise<void> => {
  // Fetch the guild and guild profile
  const guildProfile = await client.guildProfiles.fetch(guildProfileDoc.guildId).catch((error) => {
    client.logger.error(error);
    return undefined;
  });

  if (!guildProfile) return;

  // Delete the guild profile
  guildProfile.delete();

  guildProfilesDeleted += 1;

  // Fetch all webhooks in the guild
  const guildWebhooks = await client.webhooks.fetchAll(guildProfileDoc.guildId).catch((error) => {
    client.logger.error(error);
    return undefined;
  });

  // If the guild has webhooks
  if (guildWebhooks) {
    // Delete all webhooks for the guild from the database and cache
    for (const webhook of guildWebhooks) await webhook.delete();
    webhooksDeleted = guildWebhooks.length;
  }

  // Fetch all question packs in the guild
  const deletedCustomPacks = await client.packs.custom.deleteAll(guildProfileDoc.guildId);

  if (deletedCustomPacks) {
    customPacksDeleted = deletedCustomPacks;
  }

  // Push the exported guild data to the guilds data array
  const guildData = await exportGuildData(guildProfileDoc.guildId);
  guildsData.push(guildData);

  client.logger.debug(`[CLEAN CRON] Deleted all guild data for ${guildProfileDoc.guildId}`);
};

export default <CoreCron>{
  id: 'cleanCron',
  name: 'Clean Cron',
  expression: '0 * * * *',
  timezone: 'America/New_York',
  /**
   * The function to execute.
   * @param client The extended client.
   * @returns Nothing.
   */
  execute: async (client: IExtendedClient) => {
    // Get all guild profiles
    const allGuildProfiles = await GuildProfileModel.find(
      {},
      {
        botLeft: 1,
      }
    );

    const oneMonth = 1000 * 60 * 60 * 24 * 30;

    for (const guildProfileDoc of allGuildProfiles) {
      const shardId = client.shard?.broadcastEval((client) => client.guilds.cache.get(guildProfileDoc.guildId));

      // If the guild is still in the cache, continue to the next guild profile
      if (shardId) continue;

      // If the guild profile does not have the botLeft property, meaning that it may not have been applied during the guildDelete event
      if (!guildProfileDoc.botLeft) {
        // Apply the botLeft property to the guild profile
        guildProfileDoc.botLeft = Date.now();
        await guildProfileDoc.save();
        // Continue to the next guild profile
        continue;
      }

      // Continue to the next guild profile if the bot has not been in the guild for more than 30 days
      if (Date.now() - guildProfileDoc.botLeft < oneMonth) continue;

      await deleteGuildData(client, guildProfileDoc);
    }

    // Get the dev guild
    const guild = client.guilds.cache.get(config.env.DEV_GUILD);
    if (!guild) return;

    // Get the guilds channel
    const channel = guild.channels.cache.get(config.env.GUILD_CHANNEL);
    if (!channel || channel.type !== ChannelType.GuildText) return;

    const embed = new EmbedBuilder()
      .setTitle(`${guildProfilesDeleted} Guild's Data Deleted`)
      .setColor(config.colors.danger)
      .setDescription(
        `
      **Guild Profiles Deleted**: ${guildProfilesDeleted}
      **Webhooks Deleted**: ${webhooksDeleted}
      **Question Packs Deleted**: ${customPacksDeleted}
      `
      );

    // Create the file attatchment with guilds data
    const attachment = new AttachmentBuilder(Buffer.from(JSON.stringify(guildsData, null, 2)), {
      name: `guilds.json`,
    });

    channel.send({ embeds: [embed], files: [attachment] });

    // Reset the data values
    resetData();
  },
};
