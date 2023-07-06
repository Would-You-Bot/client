import { IExtendedClient } from '@typings/core';

/**
 * Sync the database to local cache.
 * @param client The extended client.
 */
export default async (client: IExtendedClient): Promise<void> => {
  const timeStart = Date.now();

  const guildIds = (await client.guilds.fetch()).map((guild) => guild.id);

  await Promise.all([
    await client.guildProfiles.sync(guildIds),
    await client.webhooks.sync(guildIds),
    await client.packs.sync(guildIds),
  ]);

  const timeEnd = Date.now();
  client.logger.info(
    `Synced Guilds: ${guildIds.join(', ')} (${timeEnd - timeStart}ms)`
  );

  client.setSynced(true);
};
