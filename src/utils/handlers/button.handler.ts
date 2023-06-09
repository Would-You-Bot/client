import { ICoreButton } from '@typings/core';
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

    const buttonFile = (await import(`../../interactions/buttons/${fileName}`)) as
      | { default: ICoreButton | undefined }
      | undefined;

    if (!buttonFile?.default?.id) continue;

    const button = buttonFile.default;

    if (button.disabled) {
      client.logger.warn(`Button: ${button.id} is disabled, skipping...`);
      continue;
    }

    if (!button.id) {
      client.logger.error(`Button: ${button.id} is missing an ID`);
      continue;
    }

    client.buttons.set(button.id, button);
  }
};

export default buttonHandler;
