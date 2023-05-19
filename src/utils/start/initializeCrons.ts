import { loadFiles } from '@utils/client';
import { ExtendedClient } from 'src/client';

/**
 * Initialize all the crons.
 * @param client The extended client.
 */
const initializeCrons = async (client: ExtendedClient): Promise<void> => {
  const cronFiles = await loadFiles('crons');
  for (const cronFile of cronFiles) {
    const cron = (await import(`../../crons/${cronFile}`)) as {
      default: (client: ExtendedClient) => Promise<void>;
    };
    cron.default(client);
  }
};

export default initializeCrons;
