import { CoreEvent } from '@typings/core';
import loadFiles from '@utils/client/loadFiles';
import { ExtendedClient } from 'src/client';

/**
 * Load the events.
 * @param client The extended client.
 */
const eventHandler = async (client: ExtendedClient) => {
  client.events.clear();

  const files = await loadFiles('interactions/events');

  for (const fileName of files) {
    client.logger.debug(`Importing event: ${fileName}`);

    const eventFile = (await import(
      `../../interactions/events/${fileName}`
    )) as { default: CoreEvent | undefined } | undefined;

    if (!eventFile?.default?.name) continue;

    const event = eventFile.default;

    if (event.disabled) {
      client.logger.warn(`Event: ${event.name} is disabled, skipping...`);
      continue;
    }

    client.events.set(event.name, event);
  }
};

export default eventHandler;
