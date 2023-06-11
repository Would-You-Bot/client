import { AutocompleteInteraction, Events } from 'discord.js';

import CoreEvent from '@utils/builders/CoreEvent';

export default new CoreEvent({
  name: Events.InteractionCreate,
}).execute(
  async (client, interaction: AutocompleteInteraction): Promise<unknown> => {
    if (!client.synced) return;
    if (!interaction.isAutocomplete()) return;

    // Get the command
    const command = client.commands.get(interaction.commandName);

    // If the command could not be found
    if (!command) {
      client.logger.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    // If the command does not have an autocomplete function
    if (!command.autocomplete) {
      client.logger.error(
        `Command ${interaction.commandName} does not have an autocomplete function.`
      );
      return;
    }

    try {
      await command.autocomplete(client, interaction);
    } catch (error) {
      client.logger.error(error);
    }
  }
);
