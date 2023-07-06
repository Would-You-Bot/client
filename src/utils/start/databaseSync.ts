import { IExtendedClient } from '@typings/core';

/**
 * Sync the database to local cache.
 * @param client The extended client.
 */
export default async (client: IExtendedClient): Promise<void> => {
  await Promise.all([
    await client.guildProfiles.sync(),
    await client.webhooks.sync(),
  ]);

  client.setSynced(true);
};
