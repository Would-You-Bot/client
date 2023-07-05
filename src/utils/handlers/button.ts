import { ExportedCoreButton } from '@typings/core';
import loadFiles from '@utils/client/loadFiles';
import { ExtendedClient } from 'src/client';

/**
 * Load the buttons.
 * @param client The extended client.
 */
const buttonHandler = async (client: ExtendedClient): Promise<void> => {
  client.buttons.clear();

  const files = await loadFiles('interactions/buttons');

  for (const fileName of files) {
    client.logger.debug(`Importing button: ${fileName}`);

    const buttonFile = (await import(
      `../../interactions/buttons/${fileName}.js`
    )) as unknown;

    const button = (
      buttonFile as {
        default: ExportedCoreButton | undefined;
      }
    ).default;

    if (!button) {
      client.logger.error(`Button: ${fileName} did not load properly`);
      continue;
    }

    if (!button.id) {
      client.logger.error(`Button: ${fileName} is missing an ID`);
      continue;
    }

    if (button.disabled) {
      client.logger.warn(`Button: ${button.id} is disabled, skipping...`);
      continue;
    }

    client.buttons.set(button.id, button);
  }
};

export default buttonHandler;
