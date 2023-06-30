import { ExportedCoreCommand } from '@typings/core';
import loadFiles from '@utils/client/loadFiles';
import { ExtendedClient } from 'src/client';

/**
 * Load the commands.
 * @param client The extended client.
 */
const commandHandler = async (client: ExtendedClient): Promise<void> => {
  client.commands.clear();

  const files = await loadFiles('interactions/commands');

  for (const fileName of files) {
    client.logger.debug(`Importing command: ${fileName}`);

    const commandFile = (await import(
      `../../interactions/commands/${fileName}`
    )) as { default: ExportedCoreCommand | undefined } | undefined;

    if (!commandFile?.default?.data.name) continue;

    const command = commandFile.default;

    if (command.disabled) {
      client.logger.warn(
        `Button: ${command.data.name} is disabled, skipping...`
      );
      continue;
    }

    client.commands.set(command.data.name, command);

    client.logger.debug(`Command: ${command.data.name} imported.`);
  }
};

export default commandHandler;
