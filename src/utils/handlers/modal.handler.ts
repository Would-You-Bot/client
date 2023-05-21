import { CoreModal } from '@typings/core';
import loadFiles from '@utils/client/loadFiles';
import { ExtendedClient } from 'src/client';

/**
 * Load the modals.
 * @param client The extended client.
 */
const modalHandler = async (client: ExtendedClient): Promise<void> => {
  client.modals.clear();

  const files = await loadFiles('interactions/modals');

  for (const fileName of files) {
    client.logger.debug(`Importing modal: ${fileName}`);

    const modalFile = (await import(`../../interactions/modals/${fileName}`)) as
      | { default: CoreModal | undefined }
      | undefined;

    if (!modalFile?.default?.id) continue;

    const modal = modalFile.default;

    if (modal.disabled) {
      client.logger.warn(`Modal: ${modal.id} is disabled, skipping...`);
      continue;
    }

    if (!modal.id) {
      client.logger.error(`Modal: ${modal.id} is missing an ID`);
      continue;
    }

    client.modals.set(modal.id, modal);
  }
};

export default modalHandler;
