import { Events } from 'discord.js';

import CoreEvent from '@utils/builders/CoreEvent';
import loadFiles from '@utils/client/loadFiles';
import { ExtendedClient } from 'src/client';

/**
 * Load the events.
 * @param client The extended client.
 */
export default async (client: ExtendedClient): Promise<void> => {
  client.events.clear();

  const files = await loadFiles('events');

  for (const fileName of files) {
    client.logger.debug(`Importing event: ${fileName}`);

    const eventFile = (await import(`../../events/${fileName}.js`)) as
      | { default: CoreEvent | undefined }
      | undefined;

    if (!eventFile?.default) {
      client.logger.error(`Event: ${fileName} did not load properly`);
      continue;
    }

    const event = eventFile.default;

    if (event.disabled) {
      client.logger.warn(`Event: ${event.name} is disabled, skipping...`);
      continue;
    }

    client.events.set(event.name, event.export());

    try {
      if (event.once)
        client.once(
          event.name as Events.Raw | Events.VoiceServerUpdate,
          async () => {
            await client.ensureDatabaseSynced();
            await event.executeFunction(client);
          }
        );
      else
        client.on(
          event.name as Events.Raw | Events.VoiceServerUpdate,
          async (...args: unknown[]) => {
            await client.ensureDatabaseSynced();
            await event.executeFunction(client, ...args);
          }
        );
    } catch (error) {
      client.logger.error(`Event: ${event.name} failed to initialize`);
    }
  }
};
