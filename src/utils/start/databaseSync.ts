import { IExtendedClient } from '@typings/core';

/**
 * Sync the database to local cache.
 * @param client The extended client.
 */
const databaseSync = async (client: IExtendedClient): Promise<void> => {
  await Promise.all([
    await client.guildProfiles.sync(),
    await client.webhooks.sync(),
  ]);
};

export default databaseSync;
