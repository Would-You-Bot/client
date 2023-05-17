import { ExtendedClient } from 'src/client';

/**
 * Sync the database to local cache.
 * @param client The extended client.
 */
const databaseSync = async (client: ExtendedClient) => {
  await Promise.all([client.guildProfiles.sync(), client.webhooks.sync()]);
};

export default databaseSync;
