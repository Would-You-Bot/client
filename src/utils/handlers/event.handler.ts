import { Events } from 'discord.js';

import { CoreEventOptions } from '@typings/core';
import loadFiles from '@utils/client/loadFiles';
import { ExtendedClient } from 'src/client';

/**
 * Load the events.
 * @param client The extended client.
 */
const eventHandler = async (client: ExtendedClient): Promise<void> => {
  client.events.clear();

  const files = await loadFiles('interactions/events');

  for (const fileName of files) {
    client.logger.debug(`Importing event: ${fileName}`);

    const eventFile = (await import(
      `../../interactions/events/${fileName}`
    )) as { default: CoreEventOptions | undefined } | undefined;

    if (!eventFile?.default?.name) continue;

    const event = eventFile.default;

    if (event.disabled) {
      client.logger.warn(`Event: ${event.name} is disabled, skipping...`);
      continue;
    }

    /**
     * Execute the event.
     * @param client The extended client.
     * @param args The event arguments.
     * @returns A promise.
     */
    const execute = async (
      client: ExtendedClient,
      ...args: unknown[]
    ): Promise<void> => {
      await event.execute(client, ...args);
    };

    client.events.set(event.name, event);

    try {
      if (event.once)
        client.once(
          event.name as Events.Raw | Events.VoiceServerUpdate,
          execute
        );
      else
        client.on(
          event.name as Events.Raw | Events.VoiceServerUpdate,
          async (...args) => {
            await client.isSynced();
            execute(client, ...(args as unknown[]));
          }
        );
    } catch (error) {
      client.error({ title: 'Event Handler', error: String(error) });
    }
  }
};

export default eventHandler;
